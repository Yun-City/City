/*
东东水果:脚本更新地址 jd_fruit_help.js
更新时间：2021-5-18
活动入口：京东APP我的-更多工具-东东农场
东东农场内部互助活动链接：https://h5.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
互助码shareCode请先手动运行脚本查看打印可看到
一天只能帮助3个人。多出的助力码无效
==========================Quantumultx=========================
[task_local]
#jd免费水果
20 4,16 * * * jd_fruit_help.js, tag=东东农场内部互助, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdnc.png, enabled=true
=========================Loon=============================
[Script]
cron "20 4,16 * * *" script-path=jd_fruit_help.js,tag=东东农场内部互助

=========================Surge============================
东东农场内部互助 = type=cron,cronexp="20 4,16 * * *",wake-system=1,timeout=3600,script-path=jd_fruit_help.js

=========================小火箭===========================
东东农场内部互助 = type=cron,script-path=jd_fruit_help.js, cronexpr="20 4,16 * * *", timeout=3600, enable=true

export DO_TEN_WATER_AGAIN="" 默认再次浇水

*/
const $ = new Env('东东农场助力码');
let cookiesArr = [],
    cookie = '',
    notify, allMessage = '';

let newShareCodes = [];
const JD_API_HOST = 'https://api.m.jd.com/client.action';
let NowHour = new Date().getHours();
let llhelp = true;
let version = 18;
const fs = require('fs');
let boolneedUpdate = false;
let strShare = './Fruit_ShareCache.json';
let Fileexists = fs.existsSync(strShare);
let TempShareCache = [];
if (Fileexists) {
    console.log("检测到东东农场缓存文件Fruit_ShareCache.json，载入...");
    TempShareCache = fs.readFileSync(strShare, 'utf-8');
    if (TempShareCache) {
        TempShareCache = TempShareCache.toString();
        TempShareCache = JSON.parse(TempShareCache);
    }
}
let lnrun = 0;
let llgetshare = false;
let NoNeedCodes = [];
!(async () => {
    await requireConfig();
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    if (llhelp) {
        console.log('\n【开始收集您的互助码，用于账号内部互助，请稍等...】\n');
        for (let i = 0; i < cookiesArr.length; i++) {
            if (cookiesArr[i]) {
                cookie = cookiesArr[i];
                $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
                $.index = i + 1;
                $.isLogin = true;
                $.nickName = '';
                //await TotalBean();
                //if (!$.isLogin) {
                //    $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                //
                //    if ($.isNode()) {
                //        await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                //    }
                //    continue
                //}
                message = '';
                subTitle = '';
                option = {};
                $.retry = 0;
                llgetshare = false;
                await GetCollect();
                if (llgetshare) {
                    await $.wait(5000);
                    lnrun++;
                }
                if (lnrun == 10) {
                    console.log(`\n【访问接口次数达到10次，休息一分钟.....】\n`);
                    await $.wait(60 * 1000);
                    lnrun = 0;
                }
            }
        }
        if (boolneedUpdate) {
            var str = JSON.stringify(TempShareCache, null, 2);
            fs.writeFile(strShare, str, function (err) {
                if (err) {
                    console.log(err);
                    console.log("\n【缓存文件Fruit_ShareCache.json更新失败!】\n");
                } else {
                    console.log("\n【缓存文件Fruit_ShareCache.json更新成功!】\n");
                }
            })
        }
    }

})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

async function GetCollect() {
    try {
        var llfound = false;
        var strShareCode = "";
        if (TempShareCache) {
            for (let j = 0; j < TempShareCache.length; j++) {
                if (TempShareCache[j].pt_pin == $.UserName) {
                    llfound = true;
                    strShareCode = TempShareCache[j].ShareCode;
                }
            }
        }
        if (!llfound) {
            console.log($.UserName + "该账号无缓存，尝试联网获取互助码.....");
            llgetshare = true;
            sid = randomString();
            $.farmInfo = await doApi("initForFarm", { babelChannel: "121", sid, version, channel: 1 }, 0);
            if ($.farmInfo.farmUserPro) {
                var tempAddCK = {};
                strShareCode = $.farmInfo.farmUserPro.shareCode;
                tempAddCK = {
                    "pt_pin": $.UserName,
                    "ShareCode": strShareCode
                };
                TempShareCache.push(tempAddCK);
                //标识，需要更新缓存文件
                boolneedUpdate = true;
            }
        }

        if (strShareCode) {
            //console.log(`\n`+strShareCode);
            console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${strShareCode}\n`);
            newShareCodes.push(strShareCode)
        } else {
            console.log(`\n数据异常`);
        }
    } catch (e) {
        $.logErr(e);
    }
}

// ========================API调用接口========================

function requireConfig() {
    return new Promise(resolve => {
        console.log('开始获取配置文件\n')
        notify = $.isNode() ? require('./sendNotify') : '';
        //Node.js用户请在jdCookie.js处填写京东ck;
        const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
        //IOS等用户直接用NobyDa的jd cookie
        if ($.isNode()) {
            Object.keys(jdCookieNode).forEach((item) => {
                if (jdCookieNode[item]) {
                    cookiesArr.push(jdCookieNode[item])
                }
            })
            if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
        } else {
            cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
        }
        console.log(`共${cookiesArr.length}个京东账号\n`)
        $.shareCodesArr = [];
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
                        if (data['retcode'] === 13) {
                            $.isLogin = false; //cookie过期
                            return
                        }
                        if (data['retcode'] === 0 && data.base && data.base.nickname) {
                            $.nickName = data.base.nickname;
                        }
                    } else {
                        console.log(`京东服务器返回空数据`)
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

function randomString() {
  let len = 32;
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = chars.length;
  let character = '';
  for (let i = 0; i < len; i++) {
    character += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return character;
}

function returnInfo(functionId) {
  let obj = {
    initForFarm: {
      appId: "8a2af",
    },
    initForFarmWX: {
      appId: "235ec",
      functionId: "initForFarm",
      appid: "signed_mp",
      client: "ios",
      clientVersion: "8.0.28",
    },
    taskInitForFarm: {
      appId: "fcb5a",
      client: "apple",
    },
    gotWaterGoalTaskForFarm: {
      appId: "c901b",
    },
    browseAdTaskForFarm: {
      appId: "53f09",
    },
    gotThreeMealForFarm: {
      appId: "57b30",
    },
    waterFriendForFarm: {
      appId: "673a0",
    },
    deleteFriendForFarm: {
      appId: "eaf91",
    },
    awardInviteFriendForFarm: {
      appId: "2b5ca",
    },
    clockInInitForFarm: {
      appId: "08dc3",
    },
    clockInForFarm: {
      appId: "32b94",
    },
    clockInFollowForFarm: {
      appId: "4a0b4",
    },
    farmAssistInit: {
      appId: "92354",
    },
    receiveStageEnergy: {
      appId: "15507",
    },
    myCardInfoForFarm: {
      appId: "157b6",
    },
    waterGoodForFarm: {
      appId: "0c010",
    },
    gotStageAwardForFarm: {
      appId: "81591",
    },
    firstWaterTaskForFarm: {
      appId: "0cf1e",
    },
    totalWaterTaskForFarm: {
      appId: "102f5",
    },
    waterFriendGotAwardForFarm: {
      appId: "d08ff",
    },
    getFullCollectionReward: {
      appId: "5c767",
    },
    userMyCardForFarm: {
      appId: "86ba5",
    },
  };
  if (!obj[functionId]) obj[functionId] = {};
  if (!obj[functionId].client) obj[functionId].client = "iOS";
  if (!obj[functionId].appid) obj[functionId].appid = "signed_wh5";
  if (!obj[functionId].clientVersion) obj[functionId].clientVersion = "11.2.5";
  if (!obj[functionId].functionId) obj[functionId].functionId = functionId;
  if (!obj[functionId].appId) obj[functionId].appid = "wh5";

  return obj[functionId];
}

function safeGet(data) {
    try {
        if (typeof JSON.parse(data) == "object") {
            return true;
        }
    } catch (e) {
        console.log(e);
        console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
        return false;
    }
}

function jsonParse(str) {
    if (typeof str == "string") {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
            return [];
        }
    }
}
// prettier-ignore
var _0xodm='jsjiami.com.v6',_0xodm_=['‮_0xodm'],_0x1c6a=[_0xodm,'wrphQcKkJcKcwqYmwpzDhQ==','w4h9wrRKw7w=','w5DCjCbCg8OhMA==','wo9Nw4bCmibDqw9DR8K9FcKVbQ==','HMK5w5YoZw==','LxLCixfCmw==','wq7CqMO0esKs','Q8KbFGM=','woh4woc=','w4Baw5fDlFE=','YcOTORYAwrA=','wovDgcOqw4fDnw==','ZMKeD1rDjw==','YyxTwr5+','w4ZEMyTChg==','w5ItRXFdw61+wrTDsnjDmsOF','w6TCi8KB','wp5/w43CjmFET8KPwoDDpl3CgU5mwr/DrsK+cg0=','wo8lLwlrwrbCqzDDmD7CsFXCn8KeA8KgHMK9wrjDshzCijU=','w5DCg8OeO8OO','w6bCrXLCjgo=','wrVRwrsLEA==','wqhfwrkOLw==','dDrChsOKaQ==','H0fDk8ONVg==','w5PClMOTKsOs','woAgHSh/','w6/CrXTCpjbClMO2T8OEe0TCs8KkBjwdbcKhYj3Dk8Oxwo3DulcNwqh2woQuw4HDicKmw6fCjg==','wqnCnzBr','wq99w59RwqQ=','KcKYT8OYMg==','w5dXMlHCtQ==','w6o7Xj1E','OThCw5DCmw==','awvCqlAJ','w6BoJ0rCnQ==','woNywpQ=','wr8wFxFv','w6rDp8ORF8Ks','w7dpw6bDrEA=','R1/DisOXwrs=','X8KbAA==','wr3DkMOZw6jDs8KfDQLDvw==','FsKWSQ==','b8OYw4fCgeisu+axgOWnq+i0iO+9teitjOajouael+e9sOi0vumEtuitug==','aMKsw5fCj1k=','w6bDvT3DicKz','wrsNwo9RFw==','wrB7SA==','wpQawotYMA==','XMKEw7fChWs=','w7XDnSg=','w5F3KQTCvsK1NcO4aQ==','YcO/cw==','w4RWwrDChOivmOawquWkhOi3gu++oeitmeajvOaciue9rOi2sumEg+ishg==','XcOUw5rDlsK6','M23DjsOqQg==','GMODw7vCi8KA','wotZW8KMJA==','UsKEF3vDqMKawpJNw53ChGAiGmrCm8Om','w6/Cs8ObP8Ob','VU1/P8OI','wo9uwpfClW4=','wqjCvjdGFg==','A1LDi8ORUCp4w4fDqMK3c07DmVHCocKLGcOHN8O0BcOtw6x9EQl+w6dGXlhjw4AHbg==','wr57S8K+','w6TDg8OWUMKYwq3Cm8KHw4zCh8KewoM=','wq/CqcOPW8Kb','EsKNWnHCghvCqHJsV8OpVBPDnHnCusOjOhAwwrPCryRsMsOgA8KZUsOdw7/DvT3CtsK9w71LwrfDksK6DcOtIcKHw6LCrX/CqgHCusOlDgfCpGrDu3TCh8Ouw47Do8OzwqXDgQ==','wqdEwpHCn3w=','fcOTw7s=','wpJjwr8zKA==','wo/Ck0/DhcK7','bsOFbT3CgA==','YznCr1gk','wrZFbw==','w6dFDA7Cig==','w59fEw==','wpPChGY=','wr1Cw6AP','wrPCqHPDtMKt','wr9Mw6o=','w5JiKR7CtQ==','w6ZuwoBAw6A=','wp3Dk8O/X8KyRW3Dsys2w5XDtMKMw7wtwpw=','DHPDiMOjZA==','wrtXw7kaAsOCw4zDvsO6IVjCuMKUwoVLw4jDsDPCoMONJsKuaCMtwp0basO2w64=','w4DClD3Cj8OhI8KjT8KN','jspXjxGizHarmlQfkDi.cMorxm.wv6=='];if(function(_0x286c0b,_0x2e81b8,_0x25f89d){function _0x3fb198(_0x4eb9e0,_0x5180ff,_0x62f835,_0x8406f5,_0x33dad7,_0x51abc9){_0x5180ff=_0x5180ff>>0x8,_0x33dad7='po';var _0x27283a='shift',_0x3a759c='push',_0x51abc9='‮';if(_0x5180ff<_0x4eb9e0){while(--_0x4eb9e0){_0x8406f5=_0x286c0b[_0x27283a]();if(_0x5180ff===_0x4eb9e0&&_0x51abc9==='‮'&&_0x51abc9['length']===0x1){_0x5180ff=_0x8406f5,_0x62f835=_0x286c0b[_0x33dad7+'p']();}else if(_0x5180ff&&_0x62f835['replace'](/[pXxGzHrlQfkDMrxw=]/g,'')===_0x5180ff){_0x286c0b[_0x3a759c](_0x8406f5);}}_0x286c0b[_0x3a759c](_0x286c0b[_0x27283a]());}return 0x10848f;};return _0x3fb198(++_0x2e81b8,_0x25f89d)>>_0x2e81b8^_0x25f89d;}(_0x1c6a,0x1b4,0x1b400),_0x1c6a){_0xodm_=_0x1c6a['length']^0x1b4;};function _0x52aa(_0x226bc3,_0x7c5885){_0x226bc3=~~'0x'['concat'](_0x226bc3['slice'](0x1));var _0x1d0d38=_0x1c6a[_0x226bc3];if(_0x52aa['GrpQwJ']===undefined){(function(){var _0x334957=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x37e075='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x334957['atob']||(_0x334957['atob']=function(_0x853872){var _0x79d02f=String(_0x853872)['replace'](/=+$/,'');for(var _0x439ecc=0x0,_0x22c8f6,_0x1a93d5,_0x442f11=0x0,_0x3dfe83='';_0x1a93d5=_0x79d02f['charAt'](_0x442f11++);~_0x1a93d5&&(_0x22c8f6=_0x439ecc%0x4?_0x22c8f6*0x40+_0x1a93d5:_0x1a93d5,_0x439ecc++%0x4)?_0x3dfe83+=String['fromCharCode'](0xff&_0x22c8f6>>(-0x2*_0x439ecc&0x6)):0x0){_0x1a93d5=_0x37e075['indexOf'](_0x1a93d5);}return _0x3dfe83;});}());function _0x7ee86a(_0x545ec5,_0x7c5885){var _0x5a5b58=[],_0x3ab615=0x0,_0x461a71,_0x182e0a='',_0x573bd9='';_0x545ec5=atob(_0x545ec5);for(var _0x1db51a=0x0,_0x6446e3=_0x545ec5['length'];_0x1db51a<_0x6446e3;_0x1db51a++){_0x573bd9+='%'+('00'+_0x545ec5['charCodeAt'](_0x1db51a)['toString'](0x10))['slice'](-0x2);}_0x545ec5=decodeURIComponent(_0x573bd9);for(var _0x3544f2=0x0;_0x3544f2<0x100;_0x3544f2++){_0x5a5b58[_0x3544f2]=_0x3544f2;}for(_0x3544f2=0x0;_0x3544f2<0x100;_0x3544f2++){_0x3ab615=(_0x3ab615+_0x5a5b58[_0x3544f2]+_0x7c5885['charCodeAt'](_0x3544f2%_0x7c5885['length']))%0x100;_0x461a71=_0x5a5b58[_0x3544f2];_0x5a5b58[_0x3544f2]=_0x5a5b58[_0x3ab615];_0x5a5b58[_0x3ab615]=_0x461a71;}_0x3544f2=0x0;_0x3ab615=0x0;for(var _0x49bb14=0x0;_0x49bb14<_0x545ec5['length'];_0x49bb14++){_0x3544f2=(_0x3544f2+0x1)%0x100;_0x3ab615=(_0x3ab615+_0x5a5b58[_0x3544f2])%0x100;_0x461a71=_0x5a5b58[_0x3544f2];_0x5a5b58[_0x3544f2]=_0x5a5b58[_0x3ab615];_0x5a5b58[_0x3ab615]=_0x461a71;_0x182e0a+=String['fromCharCode'](_0x545ec5['charCodeAt'](_0x49bb14)^_0x5a5b58[(_0x5a5b58[_0x3544f2]+_0x5a5b58[_0x3ab615])%0x100]);}return _0x182e0a;}_0x52aa['DTLxPe']=_0x7ee86a;_0x52aa['UwsvBG']={};_0x52aa['GrpQwJ']=!![];}var _0x339846=_0x52aa['UwsvBG'][_0x226bc3];if(_0x339846===undefined){if(_0x52aa['kLDaKU']===undefined){_0x52aa['kLDaKU']=!![];}_0x1d0d38=_0x52aa['DTLxPe'](_0x1d0d38,_0x7c5885);_0x52aa['UwsvBG'][_0x226bc3]=_0x1d0d38;}else{_0x1d0d38=_0x339846;}return _0x1d0d38;};function geth5st(_0x24867b,_0x47d45f,_0x2d2caf){var _0x2464c4={'EeAFB':function(_0x297348,_0x4875ad){return _0x297348(_0x4875ad);},'gUwBG':function(_0x587d2c,_0x506841){return _0x587d2c(_0x506841);},'KJFVp':'1111','YWyrv':_0x52aa('‮0','VCp4')};let _0x446dc2=_0x2464c4[_0x52aa('‫1','7eVu')](returnInfo,_0x24867b);const _0xdb1e11={'url':_0x52aa('‫2','TK&D'),'body':JSON[_0x52aa('‮3','iaA1')]({'fn':_0x446dc2[_0x52aa('‮4','MW[$')],'body':_0x47d45f,'appid':_0x446dc2[_0x52aa('‫5','*CO5')],'client':_0x446dc2[_0x52aa('‫6','iaA1')],'clientVersion':_0x446dc2[_0x52aa('‫7','3%UY')],'appId':_0x446dc2[_0x52aa('‫8','eMy@')]||_0x2464c4[_0x52aa('‮9','Su^r')],'version':'3.1','pin':$['pin'],'code':_0x2d2caf}),'headers':{'Content-Type':_0x2464c4[_0x52aa('‫a','#@mc')]}};return new Promise(_0x24867b=>{$[_0x52aa('‮b','cI8P')](_0xdb1e11,async(_0x47d45f,_0x2d2caf,_0x446dc2)=>{try{_0x47d45f?console[_0x52aa('‫c','$]Ks')](_0x47d45f):_0x446dc2=JSON[_0x52aa('‫d',')U$g')](_0x446dc2);}catch(_0x53fa1e){$[_0x52aa('‫e','[Rx2')](_0x53fa1e,_0x2d2caf);}finally{_0x2464c4[_0x52aa('‮f','zZHy')](_0x24867b,_0x446dc2||'');}});});}function doApi(_0x275b35,_0x3e544b,_0x31d2e4=0x1){var _0x13a9d1={'SXSlG':function(_0x257a61,_0x20ebdc){return _0x257a61(_0x20ebdc);},'WZlCL':function(_0x215895,_0x461320){return _0x215895(_0x461320);},'WMtKu':function(_0x5d5d62,_0x22973e){return _0x5d5d62||_0x22973e;},'atrXO':function(_0x41f35f,_0x3e940e){return _0x41f35f!==_0x3e940e;},'DtPSM':'RrhrR','YzRVr':_0x52aa('‫10','cI8P'),'tdJTf':_0x52aa('‫11','A)fv'),'SomCU':_0x52aa('‫12','!!w['),'tallu':function(_0x92e532,_0x41bc5e){return _0x92e532===_0x41bc5e;},'iRclu':'TMaRn','gqFQg':function(_0x53ad58,_0x2c6029,_0x43b417,_0x5c35bd){return _0x53ad58(_0x2c6029,_0x43b417,_0x5c35bd);},'JANkI':_0x52aa('‫13','VWXq'),'oXpRP':_0x52aa('‫14','zZHy'),'JFPDv':'https://carry.m.jd.com','dgFwo':'gzip,\x20deflate,\x20br','Yfrbt':_0x52aa('‮15','$]Ks'),'DAnpe':_0x52aa('‮16','794x'),'YvCKf':function(_0x55a274,_0x3ac2a2,_0x4c32e1){return _0x55a274(_0x3ac2a2,_0x4c32e1);}};return new Promise(async _0x3fbe74=>{var _0x2d4f7f={'XaLhw':function(_0x3f6f03,_0x3c3e89){return _0x13a9d1[_0x52aa('‫17','$cZh')](_0x3f6f03,_0x3c3e89);},'oTniY':function(_0x30a063,_0x468d00){return _0x13a9d1[_0x52aa('‮18','XbRy')](_0x30a063,_0x468d00);},'GRCKt':_0x13a9d1[_0x52aa('‮19','sLWK')],'dKAvD':_0x13a9d1[_0x52aa('‮1a','sLWK')],'YkXYU':function(_0x3e41f5){return _0x3e41f5();},'KxrsH':function(_0x37d675,_0x21d8f9){return _0x13a9d1['atrXO'](_0x37d675,_0x21d8f9);},'yIQFj':_0x13a9d1['tdJTf'],'mCxSg':_0x13a9d1[_0x52aa('‫1b','Xuv4')]};if(_0x13a9d1[_0x52aa('‫1c','7eVu')](_0x13a9d1['iRclu'],_0x52aa('‫1d','$cZh'))){let _0x38b450=await _0x13a9d1[_0x52aa('‮1e','794x')](geth5st,_0x275b35,_0x3e544b,_0x31d2e4);let _0x5d7f5b={'url':_0x52aa('‫1f','XbRy')+_0x38b450[_0x52aa('‫20','rXtV')],'headers':{'Host':_0x13a9d1[_0x52aa('‮21','KRX)')],'Accept':_0x13a9d1['oXpRP'],'Origin':_0x13a9d1[_0x52aa('‫22','gccf')],'Accept-Encoding':_0x13a9d1[_0x52aa('‫23','3*N$')],'User-Agent':_0x38b450['ua'],'Accept-Language':_0x13a9d1[_0x52aa('‫24','VWXq')],'Referer':_0x13a9d1[_0x52aa('‮25','Zbvd')],'Cookie':cookie}};_0x13a9d1[_0x52aa('‮26','UTgb')](setTimeout,()=>{var _0x454bec={'GbUoh':function(_0x271b29){return _0x271b29();},'XKqKa':function(_0x5102cd,_0x4d4855){return _0x13a9d1[_0x52aa('‮27','3*N$')](_0x5102cd,_0x4d4855);}};$[_0x52aa('‫28','$]Ks')](_0x5d7f5b,(_0x1de230,_0x842f6c,_0x52b1f9)=>{var _0x2cdcb6={'dovzo':function(_0x1d988d,_0x5cbce2){return _0x2d4f7f[_0x52aa('‮29','794x')](_0x1d988d,_0x5cbce2);}};try{if(_0x2d4f7f[_0x52aa('‮2a','ZRW)')](_0x2d4f7f[_0x52aa('‮2b',')U$g')],_0x2d4f7f[_0x52aa('‮2c','$r8I')])){if(_0x1de230){console[_0x52aa('‮2d','cI8P')](JSON[_0x52aa('‮2e','zZHy')](_0x1de230));console[_0x52aa('‮2f','ufFe')]($['name']+'\x20'+_0x275b35+_0x52aa('‮30','W0NL'));_0x2d4f7f[_0x52aa('‮31','o5vz')](_0x3fbe74);}else{if(safeGet(_0x52b1f9)){_0x52b1f9=JSON[_0x52aa('‫32','*u51')](_0x52b1f9);}}}else{if(_0x2cdcb6[_0x52aa('‫33','z!Xw')](safeGet,_0x52b1f9)){_0x52b1f9=JSON['parse'](_0x52b1f9);}}}catch(_0x5b1034){console[_0x52aa('‫34','MW[$')](_0x5b1034);_0x3fbe74();}finally{if(_0x2d4f7f[_0x52aa('‮35','z!Xw')](_0x2d4f7f['yIQFj'],_0x2d4f7f[_0x52aa('‫36','o5vz')])){_0x3fbe74(_0x52b1f9);}else{if(_0x1de230){console[_0x52aa('‫37','hHDP')](JSON[_0x52aa('‮38','!!w[')](_0x1de230));console[_0x52aa('‮39','9Ftp')]($['name']+'\x20'+_0x275b35+_0x52aa('‫3a','$]Ks'));_0x454bec[_0x52aa('‮3b','fysr')](_0x3fbe74);}else{if(_0x454bec[_0x52aa('‫3c','7eVu')](safeGet,_0x52b1f9)){_0x52b1f9=JSON['parse'](_0x52b1f9);}}}}});},0x1*0x3e8);}else{_0x13a9d1[_0x52aa('‮3d','W0NL')](n,_0x13a9d1[_0x52aa('‫3e','MW[$')](i,''));}});}function doWxApi(_0x346fca,_0x50c995,_0xb205fc=0x1){var _0x3d2c24={'hjiGY':function(_0xfc2dac,_0x3df56c){return _0xfc2dac===_0x3df56c;},'QOQky':function(_0x11281c,_0x21636c){return _0x11281c!==_0x21636c;},'mokez':'QDFCK','kywXA':function(_0x2ffe51){return _0x2ffe51();},'ouKzx':function(_0x214997,_0x23f955){return _0x214997(_0x23f955);},'cNcTF':function(_0x164fcf){return _0x164fcf();},'fIGou':function(_0x38b4dc){return _0x38b4dc();},'GiTKo':function(_0x333720,_0x22df71,_0x5c7bd6,_0x3d3888){return _0x333720(_0x22df71,_0x5c7bd6,_0x3d3888);},'iMoCk':function(_0x1fcfd0,_0x404d97){return _0x1fcfd0+_0x404d97;},'XVBSA':_0x52aa('‫3f','cI8P'),'UmNXl':'gzip,compress,br,deflate','CSqRS':function(_0x5724b7,_0x4a85ba,_0x5119e9){return _0x5724b7(_0x4a85ba,_0x5119e9);},'OcDcx':function(_0x5f0994,_0x5a95c1){return _0x5f0994*_0x5a95c1;}};return new Promise(async _0x293c17=>{var _0x4d41f3={'cFTku':function(_0x70a60a,_0x36d8dd){return _0x3d2c24[_0x52aa('‮40','$cZh')](_0x70a60a,_0x36d8dd);},'pxNxg':'CzqsG','cUyuA':function(_0x40a450,_0x315515){return _0x3d2c24['QOQky'](_0x40a450,_0x315515);},'DFTon':_0x3d2c24[_0x52aa('‮41','YHRQ')],'BCLHy':function(_0x1f7d7f){return _0x3d2c24[_0x52aa('‮42','$]Ks')](_0x1f7d7f);},'LCrIq':function(_0x45b1ef,_0x260392){return _0x3d2c24['ouKzx'](_0x45b1ef,_0x260392);},'MdvdF':function(_0x4159ea){return _0x3d2c24[_0x52aa('‫43','rXtV')](_0x4159ea);},'YzOxK':function(_0x1afba3){return _0x3d2c24['fIGou'](_0x1afba3);}};let _0x257e1a=await _0x3d2c24['GiTKo'](geth5st,_0x346fca,_0x50c995,_0xb205fc);let _0x69cc7b={'url':_0x3d2c24['iMoCk'](_0x52aa('‫44','7eVu'),_0x257e1a[_0x52aa('‮45','MW[$')]),'headers':{'Host':_0x52aa('‮46','ZRW)'),'Connection':'keep-alive','Content-Type':_0x3d2c24[_0x52aa('‮47','#@mc')],'Accept-Encoding':_0x3d2c24['UmNXl'],'User-Agent':_0x257e1a['ua'],'Referer':_0x52aa('‫48','ufFe'),'Cookie':cookie}};_0x3d2c24[_0x52aa('‫49','$]Ks')](setTimeout,()=>{var _0x3e01de={'EFWcZ':function(_0x34aca5){return _0x4d41f3['YzOxK'](_0x34aca5);}};$[_0x52aa('‫4a','fysr')](_0x69cc7b,(_0x33ac8d,_0x42c48b,_0x5d410c)=>{if(_0x4d41f3[_0x52aa('‫4b','sLWK')](_0x4d41f3[_0x52aa('‮4c','F]1X')],'CzqsG')){try{if(_0x33ac8d){if(_0x4d41f3[_0x52aa('‫4d','9Ftp')](_0x4d41f3['DFTon'],_0x52aa('‫4e','UTgb'))){console[_0x52aa('‫4f','$#ZJ')](e);_0x3e01de[_0x52aa('‫50','!!w[')](_0x293c17);}else{console[_0x52aa('‫51','3*N$')](JSON['stringify'](_0x33ac8d));console[_0x52aa('‫52','F]1X')]($[_0x52aa('‮53','TK&D')]+'\x20'+_0x346fca+_0x52aa('‫3a','$]Ks'));_0x4d41f3['BCLHy'](_0x293c17);}}else{if(_0x4d41f3[_0x52aa('‮54','F]1X')](safeGet,_0x5d410c)){_0x5d410c=JSON['parse'](_0x5d410c);}}}catch(_0x363b78){console[_0x52aa('‫55','TK&D')](_0x363b78);_0x4d41f3['MdvdF'](_0x293c17);}finally{_0x293c17(_0x5d410c);}}else{if(safeGet(_0x5d410c)){_0x5d410c=JSON[_0x52aa('‮56','!!w[')](_0x5d410c);}}});},_0x3d2c24[_0x52aa('‮57','*CO5')](0x1,0x3e8));});};_0xodm='jsjiami.com.v6';
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }