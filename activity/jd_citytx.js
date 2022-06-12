/*
城城领现金提现
活动时间：2021-10-20到2021-10-30
更新时间：2021-10-21 23:30
脚本兼容: QuantumultX, Surge,Loon, JSBox, Node.js
变量说明
 JD_CITY_RED_PACKET 是否领取红包（boolean）
 JD_CITY_RED_PACKET_CODE 指定兑换code
=================================Quantumultx=========================
[task_local]
#城城领现金提现
0-50/3 0-3 * * *" https://raw.githubusercontent.com/jiulan/platypus/main/scripts/jd_citytx.js, tag=城城领现金提现, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

=================================Loon===================================
[Script]
cron "0-50/3 0-3 * * *"" script-path=https://raw.githubusercontent.com/jiulan/platypus/main/scripts/jd_citytx.js,tag=城城领现金提现

===================================Surge================================
城城领现金提现 = type=cron,cronexp="0-50/3 0-3 * * *"",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/jiulan/platypus/main/scripts/jd_citytx.js

====================================小火箭=============================
城城领现金提现 = type=cron,script-path=https://raw.githubusercontent.com/jiulan/platypus/main/scripts/jd_citytx.js, cronexpr="0-50/3 0-3 * * *"", timeout=3600, enable=true
 */

const $ = new Env('城城领现金提现');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let JD_API_HOST = "https://api.m.jd.com/client.action";
let mainInfos = [];
let lotteryNum = 0;
//是否提现红包，环境变量  JD_CITY_RED_PACKET
let redPacket = $.getdata('jdCityRedPacket') || !!0;
let hbCode = $.getdata('jdCityHbCode') || !!0;
let withdraw =false;
let money =10;
let jdWithdrawAmount;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', code = '', message;

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
    };
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }
    await requireConfig();
    if (redPacket) {
        console.log(`红包提现`)
    } else {
        console.log(`脚本不会自动红包提现，建议抢不到微信提现时 配置  JD_CITY_RED_PACKET 为true 改动红包提现`);
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            message = '';
            await TotalBean();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
            withdraw =false;
            console.log(`\n开始\n`);
            await city_getHomeData();
            console.log("开始抽现金");
            for (let index = 0; index < mainInfos.length; index++) {
                let item = mainInfos[index];
                await city_receiveCash(item.city, item.roundNum);
            }
            console.log("结束抽现金");
            console.log("开始提现");
            await city_mainWithdrawal()
            $.isdui = true;
            console.log("总金额"+money);
            console.log("单次提现金额"+jdWithdrawAmount);
            for (let j = parseFloat(jdWithdrawAmount); j <= parseFloat(money); j = j + parseFloat(jdWithdrawAmount)) {
                await $.wait(1000)
                console.log("开始提现" + j);
                await city_withdraw()
            }

            console.log("提现结束");
            await $.wait(1000)
        }
    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })


function requireConfig() {
    return new Promise(resolve => {
        console.log(`开始获取${$.name}配置文件\n`);
        //Node.js用户请在jdCookie.js处填写京东ck;
        if ($.isNode()) {
            if (process.env.JD_CITY_RED_PACKET) {
                redPacket = process.env.JD_CITY_RED_PACKET || redPacket;
            }
            if (process.env.JD_CITY_RED_PACKET_CODE) {
                hbCode = process.env.JD_CITY_RED_PACKET_CODE || hbCode;
            }
        }
        console.log(`共${cookiesArr.length}个京东账号\n`);
        resolve()
    })
}

function TotalBean() {
    return new Promise(async resolve => {
        const options = {
            "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
            "headers": {
                "Accept": "application/json,text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data["retcode"] === 13) {
                            $.isLogin = false; //cookie过期
                            return;
                        }
                        if (data["retcode"] === 0) {
                            $.nickName = (data["base"] && data["base"].nickname) || $.UserName;
                        } else {
                            $.nickName = $.UserName;
                        }
                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}


function city_getHomeData() {
    return new Promise(resolve => {
        let function_id = "city_getHomeData";
        let option = {
            url: JD_API_HOST,
            headers: {
                "cookie": cookie,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'functionId=' + function_id + '&body=&client=wh5&clientVersion=1.0.0&uuid=network/wifi'
        }
        $.post(option, (err, resp, data) => {
            try {
                data = JSON.parse(data);
                if (data?.data?.success) {
                    let res = data.data.result;
                    console.log("邀请码：" + res.userActBaseInfo.inviteId);
                    console.log("邀请链接：	https://bunearth.m.jd.com/babelDiy/Zeus/x4pWW6pvDwW7DjxMmBbnzoub8J/index.html?inviteId=" + res.userActBaseInfo.inviteId);

                    console.log("当前金额：" + res.userActBaseInfo.poolMoney);
                    money = res.userActBaseInfo.poolMoney;
                    mainInfos = res.mainInfos;
                    lotteryNum = res.lotteryNum;
                    console.log("可以拆现金次数：" + mainInfos.length);
                    console.log("可以抽奖次数：" + lotteryNum);
                } else {
                    console.log("初始化失败");
                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve();
            }
        });
    })
}

function city_receiveCash(city, roundNum) {
    return new Promise(resolve => {
        let function_id = "city_receiveCash";
        let body = {
            cashType: 1,
            roundNum: roundNum
        }
        let option = {
            url: JD_API_HOST,
            headers: {
                "cookie": cookie,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'functionId=' + function_id + '&body=' + JSON.stringify(body) +
                '&client=wh5&clientVersion=1.0.0&uuid=network/wifi'
        }
        $.post(option, (err, resp, data) => {
            try {
                data = JSON.parse(data);
                if (data?.data?.success) {
                    let res = data.data.result;
                    console.log(city + "拆到现金:" + res.currentTimeCash + "元，当前余额:" + res.totalCash);
                } else {
                    console.log("拆现金失败");
                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve();
            }
        });
    })
}

function city_mainWithdrawal() {
    return new Promise(resolve => {
        let function_id = "city_mainWithdrawal";
        let body = {}
        let option = {
            url: JD_API_HOST,
            headers: {
                "cookie": cookie,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'functionId=' + function_id + '&body=' + JSON.stringify(body) +
                '&client=wh5&clientVersion=1.0.0&uuid=network/wifi'
        }
        $.post(option, (err, resp, data) => {
            try {
                data = JSON.parse(data);
                if (data?.data?.success) {
                    let res = data.data.result;
                    if (res) {
                        console.log("code" + res.securityCode);
                        code = res.securityCode;
                        jdWithdrawAmount = res.jdWithdrawAmount;
                        if (res.withdrawStatus != 1){
                            withdraw = true
                        }
                    } else {
                        $.isdui = false;
                    }
                } else {
                    console.log("获取code结果:" + data.data.msg);
                    $.isdui = false;
                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve();
            }
        });
    })
}

function city_withdraw() {
    if (process.env.JD_CITY_RED_PACKET_CODE) {
        hbCode = process.env.JD_CITY_RED_PACKET_CODE || hbCode;
        code = hbCode;
    }
    console.log("获取city_withdraw结果:" + code);
    return new Promise(resolve => {


        let function_id = "city_withdraw";
        let body = {"channel": 1, "code": code}
        //是否领无门槛红包
        if (redPacket) {
            if (!withdraw) {
                console.log("提现已达上限");
                return;
            }
            body = {"channel": 2, "code": ""}
        }
        let option = {
            url: JD_API_HOST,
            headers: {
                "cookie": cookie,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'functionId=' + function_id + '&body=' + JSON.stringify(body) +
                '&client=wh5&clientVersion=1.0.0&uuid=network/wifi'
        }
        $.post(option, (err, resp, data) => {
            try {
                data = JSON.parse(data);
                if (data?.data?.success) {
                    let res = data.data.result;
                    if (res) {
                        console.log("余额" + res.poolMoney);
                    } else {
                        $.isdui = false;
                    }
                } else {
                    console.log("兑换结果:" + data?.data?.bizMsg);
                    $.isdui = false;
                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve();
            }
        });
    })
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
