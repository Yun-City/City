/*
大牌联合开卡
2021年11月1日 - 2021年11月11日

cron 15 2,21 * * * https://raw.githubusercontent.com/KingRan/JDJB/main/jd_opencard11.js
*/
const $ = new Env("2021-11.1-11-11 大牌联合");
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
const cp = $.isNode() ? require('child_process') : '';
let cookiesArr = [], cookie = '', message = '';
const Base64 = require("js-base64")
let ownCode = null;
if ($.isNode()) {
  console.log('先运行一次查看是否有豆，有豆再运行！！！')
  console.log('安装依赖：pnpm install js-base64')
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
    let cookiesData = $.getdata('CookiesJD') || "[]";
    cookiesData = JSON.parse(cookiesData);
    cookiesArr = cookiesData.map(item => item.cookie);
    cookiesArr.reverse();
    cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
    cookiesArr.reverse();
    cookiesArr = cookiesArr.filter(item => !!item);
}
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    authorCodeList = await getAuthorCodeList('https://gitee.com/KingRan521/JD-Scripts/raw/master/shareCodes/opencard11.json')
    if(authorCodeList === '404: Not Found'){
        authorCodeList = [
            'k1Nobb+P0er+C2sysxnx/P2KELO9izRVpwCyqu0eqVZ5aW7RHzlMobrzJ/e9r/uf',
        ]
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i]
            originCookie = cookiesArr[i]
            newCookie = ''
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            await checkCookie();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                if ($.isNode()) {
                    // await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
            $.bean = 0;
            $.ADID = getUUID('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 1);
            $.UUID = getUUID('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
            $.appkey = "51B59BB805903DA4CE513D29EC448375"
            $.userId = "10299171"
            $.actId = "2c5156ff82714_11013"
            $.authorCode = ownCode ? ownCode : authorCodeList[random(0, authorCodeList.length)]
            console.log('去助力 -> '+$.authorCode);
            await openCardNew();
            if ($.bean > 0) {
                message += `\n【京东账号${$.index}】${$.nickName || $.UserName} \n       └ 获得 ${$.bean} 京豆。`
            }
        }
    }
    if (message !== '') {
        if ($.isNode()) {
            await notify.sendNotify($.name, message, '', `\n`);
        } else {
            $.msg($.name, '有点儿收获', message);
        }
    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })


async function openCardNew() {
    $.token = null;
    $.buyerNick = null;
    $.activityInfo = null;
    await getToken();
    if ($.token) {
        await task('activity_load', {
            "actId": $.actId,
            "inviteNick": $.authorCode,
            "jdToken": $.token,
            "source": "01",
        })
        if ($.buyerNick) {
            console.log('1.助力码 -> '+$.buyerNick)
            if ($.index === 1) {
                ownCode = $.buyerNick
                console.log("后面的将给这个助力码助力 -> "+ownCode)
            }
            console.log('2.绑定助力 ->')
            await task('complete/mission', {
                "actId": $.actId,
                "missionType": "relationBind",
                "inviterNick": $.authorCode,
            })
            await task('shopList', {
                "actId": $.actId,
            })
            console.log('3.关注店铺 ->')
            await task('complete/mission', {
                "actId": $.actId,
                "missionType": "uniteCollectShop",
            })
            console.log('4.抽奖 ->')
            await task('draw/post', {
                "actId": $.actId,
                "usedGameNum": "2",
                "dataType": "draw",
            })
            console.log('5.加入会员 ->')
            if ($.shopList) {
                console.log('会员卡数量 -> '+$.shopList.length)
                for (const vo of $.shopList) {
                    $.log(`${vo.userId}`)
                    if (!vo.open) {
                        $.log("开通会员")
                            await getShopOpenCardInfo(vo.userId)
                            await bindWithVender(vo.userId)
                            await task('complete/mission', {
                                "actId": $.actId,
                                "shopId": vo.userId,
                                "missionType": "openCard",
                            })
                        await $.wait(3000)
                    } else {
                        $.log("已经是会员了")
                    }
                    await $.wait(500)
                }
            }
            console.log('6.加入购物车 ->')
            await task('complete/mission', {
                "actId": $.actId,
                "missionType": "uniteAddCart",
            })
        } else {
            $.log("没有成功获取到用户信息")
        }
    } else {
        $.log("没有成功获取到用户鉴权信息")
    }
}

function task(function_id, preParams) {
    body = {
        "jsonRpc": "2.0",
        "params": {
            "commonParameter": {
                "appkey": $.appkey,
                "m": "POST",
                "timestamp": new Date(),
                "userId": $.userId
            },
            "admJson": {
                "method": `/openCardNew/${function_id}`,
                "userId": $.userId,
                "buyerNick": $.buyerNick ? $.buyerNick : ""
            }
        }
    }
    Object.assign(body.params.admJson, preParams)
    return new Promise(resolve => {
        $.post(taskUrl(function_id, body), async (err, resp, data) => {
            try {
                if (err) {
                    $.log(err)
                } else {

                    if (data) {
                        data = JSON.parse(data);
                        if (data.success) {
                            if (data.data.status === 200) {
                                switch (function_id) {
                                    case 'activity_load':
                                        $.buyerNick = data.data.data.buyerNick;
                                        console.log("[ "+data.data.data.cusActivity.actName+" ]");
                                        break;
                                    case 'shopList':
                                        $.shopList = data.data.data.cusShops;
                                        break;
                                    case 'complete/mission':
                                        console.log(data.data.data.remark);
                                        break;
                                    case 'draw/post':
                                        console.log(data.data.data.awardSetting.awardName);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }

                    } else {
                        $.log("京东没有返回数据")
                    }
                }
            } catch (error) {
                $.log(error)
            } finally {
                resolve();
            }
        })
    })
}
function getShopOpenCardInfo(venderId) {
    let opt = {
        url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=${encodeURIComponent(JSON.stringify({ venderId: venderId, channel: 401 }))}&client=H5&clientVersion=9.2.0&uuid=88888`,
        headers: {
            Host: 'api.m.jd.com',
            Accept: '*/*',
            Connection: 'keep-alive',
            Cookie: cookie,
            'User-Agent': `jdapp;iPhone;9.5.4;13.6;${$.UUID};network/wifi;ADID/${$.ADID};model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
            'Accept-Language': 'zh-cn',
            Referer: `https://shopmember.m.jd.com/shopcard/?venderId=${venderId}}&channel=401&returnUrl=${encodeURIComponent('https://jinggengjcq-isv.isvjcloud.com/fronth5')}`,
            'Accept-Encoding': 'gzip, deflate, br'
        }
    }
    return new Promise(resolve => {
        $.get(opt, (err, resp, data) => {
            try {
                if (err) {
                    console.log(err)
                } else {
                    res = JSON.parse(data)
                    if (res.success) {
                        if (res.result.interestsRuleList) {
                            $.openCardActivityId = res.result.interestsRuleList[0].interestsInfo.activityId;
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            } finally {
                resolve();
            }
        })

    })
}
function bindWithVender(venderId) {
    let opt = {
        url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body=${encodeURIComponent(JSON.stringify({ "venderId": venderId, "bindByVerifyCodeFlag": 1, "registerExtend": {}, "writeChildFlag": 0, "channel": 401 }))}&client=H5&clientVersion=9.2.0&uuid=88888`,
        headers: {
            Host: 'api.m.jd.com',
            Accept: '*/*',
            Connection: 'keep-alive',
            Cookie: cookie,
            'User-Agent': `jdapp;iPhone;9.5.4;13.6;${$.UUID};network/wifi;ADID/${$.ADID};model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
            'Accept-Language': 'zh-cn',
            Referer: `https://shopmember.m.jd.com/shopcard/?venderId=${venderId}}&channel=401&returnUrl=${encodeURIComponent('https://jinggengjcq-isv.isvjcloud.com/fronth5')}`,
            'Accept-Encoding': 'gzip, deflate, br'
        }
    }
    return new Promise(resolve => {
        $.get(opt, (err, resp, data) => {
            try {
                if (err) {
                    console.log(err)
                } else {
                    res = JSON.parse(data)
                    if (res.success) {
                        console.log("开卡成功")
                    }
                }
            } catch (error) {
                console.log(error)
            } finally {
                resolve();
            }
        })

    })
}
function taskUrl(function_id, body) {
    return {
        url: `https://jinggengjcq-isv.isvjcloud.com/dm/front/openCardNew/${function_id}?&mix_nick=${$.buyerNick ? $.buyerNick : ""}`,
        headers: {
            Host: 'jinggengjcq-isv.isvjcloud.com',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept-Language': 'zh-cn',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json; charset=utf-8',
            Origin: 'https://jinggengjcq-isv.isvjcloud.com',
            'User-Agent': `jdapp;iPhone;9.5.4;13.6;${$.UUID};network/wifi;ADID/${$.ADID};model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
            Connection: 'keep-alive',
            Referer: 'https://jinggengjcq-isv.isvjcloud.com/fronth5/',
            Cookie: cookie
        },
        body: JSON.stringify(body)

    }
}

function getMyPing() {
    let opt = {
        url: `https://lzdz1-isv.isvjcloud.com/customer/getMyPing`,
        headers: {
            Host: 'lzdz1-isv.isvjcloud.com',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept-Language': 'zh-cn',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/x-www-form-urlencoded',
            Origin: 'https://lzdz1-isv.isvjcloud.com',
            'User-Agent': `jdapp;iPhone;9.5.4;13.6;${$.UUID};network/wifi;ADID/${$.ADID};model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
            Connection: 'keep-alive',
            Referer: $.activityUrl,
            Cookie: cookie,
        },
        body: `userId=${$.activityShopId}&token=${$.token}&fromType=APP&riskType=1`
    }
    return new Promise(resolve => {
        $.post(opt, (err, resp, data) => {
            try {
                if (err) {
                    $.log(err)
                } else {
                    if (resp['headers']['set-cookie']) {
                        cookie = `${originCookie}`
                        if ($.isNode()) {
                            for (let sk of resp['headers']['set-cookie']) {
                                cookie = `${cookie}${sk.split(";")[0]};`
                            }
                        } else {
                            for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                                cookie = `${cookie}${ck.split(";")[0]};`
                            }
                        }
                    }
                    if (resp['headers']['Set-Cookie']) {
                        cookie = `${originCookie}`
                        if ($.isNode()) {
                            for (let sk of resp['headers']['set-cookie']) {
                                cookie = `${cookie}${sk.split(";")[0]};`
                            }
                        } else {
                            for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                                cookie = `${cookie}${ck.split(";")[0]};`
                            }
                        }
                    }
                    if (data) {
                        data = JSON.parse(data)
                        if (data.result) {
                            $.log(`你好：${data.data.nickname}`)
                            $.pin = data.data.nickname;
                            $.secretPin = data.data.secretPin;
                            cookie = `${cookie};AUTH_C_USER=${data.data.secretPin}`
                        } else {
                            $.log(data.errorMessage)
                        }
                    }
                }
            } catch (error) {
                $.log(error)
            } finally {
                resolve();
            }

        })
    })
}
function getFirstLZCK() {
    return new Promise(resolve => {
        $.get({ url: $.activityUrl }, (err, resp, data) => {
            try {
                if (err) {
                    console.log(err)
                } else {
                    if (resp['headers']['set-cookie']) {
                        cookie = `${originCookie}`
                        if ($.isNode()) {
                            for (let sk of resp['headers']['set-cookie']) {
                                cookie = `${cookie}${sk.split(";")[0]};`
                            }
                        } else {
                            for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                                cookie = `${cookie}${ck.split(";")[0]};`
                            }
                        }
                    }
                    if (resp['headers']['Set-Cookie']) {
                        cookie = `${originCookie}`
                        if ($.isNode()) {
                            for (let sk of resp['headers']['set-cookie']) {
                                cookie = `${cookie}${sk.split(";")[0]};`
                            }
                        } else {
                            for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                                cookie = `${cookie}${ck.split(";")[0]};`
                            }
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            } finally {
                resolve();
            }
        })
    })
}
function getAuthorCodeList(url) {
    return new Promise(resolve => {
        const options = {
            url: `${url}?${new Date()}`, "timeout": 10000, headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
            }
        };
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    $.log(err)
                } else {
                if (data) data = JSON.parse(data)
                }
            } catch (e) {
                $.logErr(e, resp)
                data = null;
            } finally {
                resolve(data);
            }
        })
    })
}
function getToken() {
    let opt = {
        url: `https://api.m.jd.com/client.action?functionId=isvObfuscator`,
        headers: {
            Host: 'api.m.jd.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: '*/*',
            Connection: 'keep-alive',
            Cookie: cookie,
            'User-Agent': 'JD4iPhone/167650 (iPhone; iOS 13.7; Scale/3.00)',
            'Accept-Language': 'zh-Hans-CN;q=1',
            'Accept-Encoding': 'gzip, deflate, br',
        },
        body: `body=%7B%22url%22%3A%20%22https%3A//lzkj-isv.isvjcloud.com%22%2C%20%22id%22%3A%20%22%22%7D&uuid=hjudwgohxzVu96krv&client=apple&clientVersion=9.4.0&st=1620476162000&sv=111&sign=f9d1b7e3b943b6a136d54fe4f892af05`
    }
    return new Promise(resolve => {
        $.post(opt, (err, resp, data) => {
            try {
                if (err) {
                    $.log(err)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.code === "0") {
                            $.token = data.token
                        }
                    } else {
                        $.log("京东返回了空数据")
                    }
                }
            } catch (error) {
                $.log(error)
            } finally {
                resolve();
            }
        })
    })
}
function random(min, max) {

    return Math.floor(Math.random() * (max - min)) + min;

}
function getUUID(format = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', UpperCase = 0) {
    return format.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        if (UpperCase) {
            uuid = v.toString(36).toUpperCase();
        } else {
            uuid = v.toString(36)
        }
        return uuid;
    });
}
function checkCookie() {
    const options = {
        url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
        headers: {
            "Host": "me-api.jd.com",
            "Accept": "*/*",
            "Connection": "keep-alive",
            "Cookie": cookie,
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
            "Accept-Language": "zh-cn",
            "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
            "Accept-Encoding": "gzip, deflate, br",
        }
    };
    return new Promise(resolve => {
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.retcode === "1001") {
                            $.isLogin = false; //cookie过期
                            return;
                        }
                        if (data.retcode === "0" && data.data.hasOwnProperty("userInfo")) {
                            $.nickName = data.data.userInfo.baseInfo.nickname;
                        }
                    } else {
                        $.log('京东返回了空数据');
                    }
                }
            } catch (e) {
                $.logErr(e)
            } finally {
                resolve();
            }
        })
    })
}
// prettier-ignore
!function (n) { "use strict"; function t(n, t) { var r = (65535 & n) + (65535 & t); return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r } function r(n, t) { return n << t | n >>> 32 - t } function e(n, e, o, u, c, f) { return t(r(t(t(e, n), t(u, f)), c), o) } function o(n, t, r, o, u, c, f) { return e(t & r | ~t & o, n, t, u, c, f) } function u(n, t, r, o, u, c, f) { return e(t & o | r & ~o, n, t, u, c, f) } function c(n, t, r, o, u, c, f) { return e(t ^ r ^ o, n, t, u, c, f) } function f(n, t, r, o, u, c, f) { return e(r ^ (t | ~o), n, t, u, c, f) } function i(n, r) { n[r >> 5] |= 128 << r % 32, n[14 + (r + 64 >>> 9 << 4)] = r; var e, i, a, d, h, l = 1732584193, g = -271733879, v = -1732584194, m = 271733878; for (e = 0; e < n.length; e += 16)i = l, a = g, d = v, h = m, g = f(g = f(g = f(g = f(g = c(g = c(g = c(g = c(g = u(g = u(g = u(g = u(g = o(g = o(g = o(g = o(g, v = o(v, m = o(m, l = o(l, g, v, m, n[e], 7, -680876936), g, v, n[e + 1], 12, -389564586), l, g, n[e + 2], 17, 606105819), m, l, n[e + 3], 22, -1044525330), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 4], 7, -176418897), g, v, n[e + 5], 12, 1200080426), l, g, n[e + 6], 17, -1473231341), m, l, n[e + 7], 22, -45705983), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 8], 7, 1770035416), g, v, n[e + 9], 12, -1958414417), l, g, n[e + 10], 17, -42063), m, l, n[e + 11], 22, -1990404162), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 12], 7, 1804603682), g, v, n[e + 13], 12, -40341101), l, g, n[e + 14], 17, -1502002290), m, l, n[e + 15], 22, 1236535329), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 1], 5, -165796510), g, v, n[e + 6], 9, -1069501632), l, g, n[e + 11], 14, 643717713), m, l, n[e], 20, -373897302), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 5], 5, -701558691), g, v, n[e + 10], 9, 38016083), l, g, n[e + 15], 14, -660478335), m, l, n[e + 4], 20, -405537848), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 9], 5, 568446438), g, v, n[e + 14], 9, -1019803690), l, g, n[e + 3], 14, -187363961), m, l, n[e + 8], 20, 1163531501), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 13], 5, -1444681467), g, v, n[e + 2], 9, -51403784), l, g, n[e + 7], 14, 1735328473), m, l, n[e + 12], 20, -1926607734), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 5], 4, -378558), g, v, n[e + 8], 11, -2022574463), l, g, n[e + 11], 16, 1839030562), m, l, n[e + 14], 23, -35309556), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 1], 4, -1530992060), g, v, n[e + 4], 11, 1272893353), l, g, n[e + 7], 16, -155497632), m, l, n[e + 10], 23, -1094730640), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 13], 4, 681279174), g, v, n[e], 11, -358537222), l, g, n[e + 3], 16, -722521979), m, l, n[e + 6], 23, 76029189), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 9], 4, -640364487), g, v, n[e + 12], 11, -421815835), l, g, n[e + 15], 16, 530742520), m, l, n[e + 2], 23, -995338651), v = f(v, m = f(m, l = f(l, g, v, m, n[e], 6, -198630844), g, v, n[e + 7], 10, 1126891415), l, g, n[e + 14], 15, -1416354905), m, l, n[e + 5], 21, -57434055), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 12], 6, 1700485571), g, v, n[e + 3], 10, -1894986606), l, g, n[e + 10], 15, -1051523), m, l, n[e + 1], 21, -2054922799), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 8], 6, 1873313359), g, v, n[e + 15], 10, -30611744), l, g, n[e + 6], 15, -1560198380), m, l, n[e + 13], 21, 1309151649), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 4], 6, -145523070), g, v, n[e + 11], 10, -1120210379), l, g, n[e + 2], 15, 718787259), m, l, n[e + 9], 21, -343485551), l = t(l, i), g = t(g, a), v = t(v, d), m = t(m, h); return [l, g, v, m] } function a(n) { var t, r = "", e = 32 * n.length; for (t = 0; t < e; t += 8)r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255); return r } function d(n) { var t, r = []; for (r[(n.length >> 2) - 1] = void 0, t = 0; t < r.length; t += 1)r[t] = 0; var e = 8 * n.length; for (t = 0; t < e; t += 8)r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32; return r } function h(n) { return a(i(d(n), 8 * n.length)) } function l(n, t) { var r, e, o = d(n), u = [], c = []; for (u[15] = c[15] = void 0, o.length > 16 && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1)u[r] = 909522486 ^ o[r], c[r] = 1549556828 ^ o[r]; return e = i(u.concat(d(t)), 512 + 8 * t.length), a(i(c.concat(e), 640)) } function g(n) { var t, r, e = ""; for (r = 0; r < n.length; r += 1)t = n.charCodeAt(r), e += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t); return e } function v(n) { return unescape(encodeURIComponent(n)) } function m(n) { return h(v(n)) } function p(n) { return g(m(n)) } function s(n, t) { return l(v(n), v(t)) } function C(n, t) { return g(s(n, t)) } function A(n, t, r) { return t ? r ? s(t, n) : C(t, n) : r ? m(n) : p(n) } $.md5 = A }(this);
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
