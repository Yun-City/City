/*
活动入口：首页 -> 领券 -> 集卡赢大奖
cron 10 7,18 * * * jd_jika.js
 */
const $ = new Env('集魔力卡召唤大奖');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const activityKey = '53275a405ec3cba14b28662e05f6c53b';
$.inviteList = [];
let cookiesArr = [];
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    });
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [
        $.getdata("CookieJD"),
        $.getdata("CookieJD2"),
        ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
!(async () => {
	console.log('部分账号会提示“非法请求”')
	console.log('活动入口：首页 -> 领券 -> 集卡赢大奖')
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        $.index = i + 1;
        $.cookie = cookiesArr[i];
        $.isLogin = true;
        $.nickName = '';
        await TotalBean();
        $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
        if (!$.isLogin) {
            $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
            if ($.isNode()) {
                await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
            }
            continue
        }
        try{
            await main();
        }catch (e) {
            console.log(JSON.stringify(e));
        }
    }
    cookiesArr = getRandomArrayElements(cookiesArr,cookiesArr.length);
    for (let i = 0; i < cookiesArr.length ; i++) {
        $.canHelp = true;
        $.cookie = cookiesArr[i];
        $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        for (let j = 0; j < $.inviteList.length && $.canHelp; j++) {
            $.oneInvite = $.inviteList[j]
            if($.UserName === $.oneInvite.user || $.oneInvite.max ){
                continue;
            }
            console.log(`${$.UserName}去助力${$.oneInvite.user},助力码 ${$.oneInvite.groupId}`);
            await  takeGetRequest('necklacecard_assist');
            await $.wait(3000);
        }
    }
})().catch((e) => {$.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')}).finally(() => {$.done();})


async function main() {
    $.activityDetail = {};
    await  takeGetRequest('necklacecard_cardHomePage');
    if(JSON.stringify($.activityDetail) === '{}' ){
        console.log(`获取活动失败`);
        return ;
    }
    console.log(`获取活动成功，已有卡片【${$.activityDetail.collectedCardsNum}】张，总共需要卡片【${$.activityDetail.totalCardsNum}】张`);
    await $.wait(2000);
    $.taskInfo = {};
    $.runFlag = false;
    $.updateFlag = false;
    let time = 0;
    do{
        await takeGetRequest('necklacecard_taskList');
        await $.wait(2000);
        await doTask($.taskInfo.componentTaskInfo);
        time++;
    }while ($.runFlag && time <5)
    $.assistTaskInfo = $.taskInfo.assistTaskInfo;
    if($.assistTaskInfo.assistDetails.length === $.assistTaskInfo.maxAssistedTimes){
        console.log(`助力已满`);
    }else{
        await  takeGetRequest('necklacecard_openGroup');
        await $.wait(2000);
    }
    if($.updateFlag){
        await  takeGetRequest('necklacecard_cardHomePage');
        await $.wait(2000);
    }
    if($.activityDetail.drawCardStatus === 2){
        let drawCardChance = $.activityDetail.drawCardChance || 0;
        console.log(`可以抽奖${drawCardChance}次`);
        for (let i = 0; i < drawCardChance; i++) {
            console.log(`进行第${i+1}次抽奖`);
            await  takeGetRequest('necklacecard_openCard');
            await $.wait(3000);
        }
        await  takeGetRequest('necklacecard_cardHomePage');
        await $.wait(2000);
    }else{
        console.log(`没有抽奖次数`);
    }
    if($.activityDetail.collectedCardsNum === $.activityDetail.totalCardsNum){
        let thisMessage = `第【${$.index}】个账号，卡片已满，进APP查看`;
        await notify.sendNotify('天天集卡券',thisMessage);
    }else{
        console.log(`已有卡片【${$.activityDetail.collectedCardsNum}】张，总共需要卡片【${$.activityDetail.totalCardsNum}】张`);
    }
}

async function doTask(taskList){
    for (let i = 0; i < taskList.length; i++) {
        $.oneTaskInfo = taskList[i];
        if($.oneTaskInfo.taskStatus === 3){
            console.log(`任务：${$.oneTaskInfo.taskTitle || $.oneTaskInfo.name}，已完成`);
            continue;
        }
        if(($.oneTaskInfo.taskStatus === 1  || $.oneTaskInfo.taskStatus === 2) && [1,2,3,4].indexOf($.oneTaskInfo.taskType) !== -1){
            console.log(`任务：${$.oneTaskInfo.taskTitle || $.oneTaskInfo.name}，去执行`);
            await  takeGetRequest('necklacecard_taskReport');
            await $.wait(3000);
            $.runFlag = true;
            $.updateFlag = true;
        }else{
            console.log(`任务：${$.oneTaskInfo.taskTitle || $.oneTaskInfo.name}，不执行`);
        }
    }
}

async function takeGetRequest(type) {
    let url = ``;
    let body = ``;
    let myRequest = ``;
    switch (type) {
        case 'necklacecard_cardHomePage':
        case 'necklacecard_taskList':
        case 'necklacecard_openCard':
        case 'necklacecard_openGroup':
            body = `body={"activityKey":"${activityKey}"}`;
            break;
        case 'necklacecard_taskReport':
            body = `body={"activityKey":"${activityKey}","encryptTaskId":"${$.oneTaskInfo.encryptTaskId}","itemId":"${$.oneTaskInfo.itemId}"}`;
            break;
        case 'necklacecard_assist':
            body = `body={"activityKey":"${activityKey}","groupId":"${$.oneInvite.groupId}","uuid":"${randomWord(false,40,40)}"}`;
            break;
        default:
            console.log(`错误${type}`);
    }
    url = `https://api.m.jd.com/api?functionId=${type}&appid=coupon-necklace&client=wh5&t=${Date.now()}`;
    myRequest = getPostRequest(url,body);
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                dealReturn(type, data);
            } catch (e) {
                console.log(data);
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function dealReturn(type, data) {
    try {
        data = JSON.parse(data);
    }catch (e) {
        console.log(`返回信息异常：${data}\n`);
        return;
    }
    switch (type) {
        case 'necklacecard_cardHomePage':
            if (data.rtn_code === 0) {$.activityDetail = data.data.result;} else {console.log(JSON.stringify(data));}
            break;
        case 'necklacecard_taskList':
            if (data.rtn_code === 0) {$.taskInfo = data.data.result;} else {console.log(JSON.stringify(data));}
            break;
        case 'necklacecard_taskReport':
            if (data.rtn_code === 0) {console.log(`执行成功`);} else {console.log(JSON.stringify(data));}
            break;
        case 'necklacecard_openCard':
            if (data.rtn_code === 0) {
                console.log(`获得卡片：${data.data.result.cardName || ''}`);
            }
            console.log(JSON.stringify(data));
            break;
        case 'necklacecard_openGroup':
            if (data.rtn_code === 0) {
                let groupId = data.data.result.groupId;
                console.log(`助力ID：${groupId}`);
                $.inviteList.push({
                    'groupId':groupId,
                    'user':$.UserName,
                    'max':false
                });
            } else {
                console.log(JSON.stringify(data));
            }
            break;
        case 'necklacecard_assist':
            if (data.rtn_code === 0) {
                let thisData = data.data;
                if(thisData.biz_code === 0){
                    console.log(`助力成功`);
                }else if(thisData.biz_code === 6){
                    console.log(`助力次数已用完`);
                    $.canHelp = false;
                }else if(thisData.biz_code === 7){
                    console.log(`助力已满`);
                    $.oneInvite.max = true;
                }else if(thisData.biz_code === 2222){
                    console.log(`黑号`);
                    $.canHelp = false;
                }else {
                    console.log(JSON.stringify(data));
                }
            } else {
                console.log(JSON.stringify(data));
            }
            break;
        default:
            console.log(JSON.stringify(data));
    }
}

function getPostRequest(url,body) {
    const method = `POST`;
    const headers = {
        'Accept' : `application/json, text/plain, */*`,
        'Origin' : `https://h5.m.jd.com`,
        'Accept-Encoding' : `gzip, deflate, br`,
        Cookie: $.cookie,
        'Content-Type' : `application/x-www-form-urlencoded`,
        'Host' : `api.m.jd.com`,
        'Connection' : `keep-alive`,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Referer' : `https://h5.m.jd.com/babelDiy/Zeus/3Ck6vd8Tz4sJFme5keU9KifFM3aW/index.html`,
        'Accept-Language' : `zh-cn`
    };
    return  {url: url, method: method, headers: headers, body: body};
}
function randomWord(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}
/**
 * 随机从一数组里面取
 * @param arr
 * @param count
 * @returns {Buffer}
 */
function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}
function TotalBean() {
    return new Promise(async resolve => {
        const options = {
            url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
            headers: {
                Host: "me-api.jd.com",
                Accept: "*/*",
                Connection: "keep-alive",
                Cookie: $.cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
                "Accept-Language": "zh-cn",
                "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
                "Accept-Encoding": "gzip, deflate, br"
            }
        }
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['retcode'] === "1001") {
                            $.isLogin = false; //cookie过期
                            return;
                        }
                        if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
                            $.nickName = data.data.userInfo.baseInfo.nickname;
                        }
                    } else {
                        $.log('京东服务器返回空数据');
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
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
