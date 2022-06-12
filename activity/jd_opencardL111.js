/*
4.7~4.14 暖春焕新季 
新增开卡脚本,一次性脚本

第一个账号助力作者 其他依次助力CK1
第一个CK失效会退出脚本

————————————————
入口：[ 4.7~4.14 暖春焕新季 ]

请求太频繁会被黑ip
过10分钟再执行

cron:35 1,16 7-14 4 *
============Quantumultx===============
[task_local]
#4.7~4.14 暖春焕新季
35 1,16 7-14 4 * jd_opencardL111.js, tag=4.7~4.14 暖春焕新季, enabled=true

*/

const $ = new Env('4.7~4.14 暖春焕新季');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
CryptoScripts()
$.CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS;
var timestamp = new Date().getTime()
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
    cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
allMessage = ""
message = ""
$.hotFlag = false
$.outFlag = false
$.activityEnd = false
let lz_jdpin_token_cookie =''
let activityCookie =''
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  $.activityId = "dzlhkkc3c34b18b0bc11ec8e240200"
  $.shareUuid = "f9074e6637314fe087cc58930cab9d73"
  console.log(`入口:\nhttps://lzdz1-isv.isvjcloud.com/dingzhi/customized/common/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`)
  let shareUuidArr = ["d3f5bf7bb9504b4db26422823b7ce5fc","f9074e6637314fe087cc58930cab9d73","f6a17512fc204faa834482f28ebe9039"]
  let s = Math.floor((Math.random()*3))
  let n = 0
  n = Math.floor((Math.random()*shareUuidArr.length))
  $.shareUuid = shareUuidArr[n] ? shareUuidArr[n] : $.shareUuid


  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      message = ""
      $.bean = 0
      $.hotFlag = false
      $.nickName = '';
      console.log(`\n\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      await getUA()
      await run();
      if(i == 0 && !$.actorUuid) break
      if($.outFlag || $.activityEnd) break
    }
  }
  if($.outFlag) {
    let msg = '此ip已被限制，请过10分钟后再执行脚本'
    $.msg($.name, ``, `${msg}`);
    if ($.isNode()) await notify.sendNotify(`${$.name}`, `${msg}`);
  }
  if(allMessage){
    $.msg($.name, ``, `${allMessage}`);
    // if ($.isNode()) await notify.sendNotify(`${$.name}`, `${allMessage}`);
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


async function run() {
  try {
    $.hasEnd = true
    $.endTime = 0
    lz_jdpin_token_cookie = ''
    $.Token = ''
    $.Pin = ''
    let flag = false
    await takePostRequest('isvObfuscator');
    if($.Token == ''){
      console.log('获取[token]失败！')
      return
    }
    await getCk()
    if (activityCookie == '') {
      console.log(`获取cookie失败`); return;
    }
    if($.activityEnd === true){
      console.log('活动结束')
      return
    }
    if($.outFlag){
      console.log('此ip已被限制，请过10分钟后再执行脚本\n')
      return
    }
    await takePostRequest('getSimpleActInfoVo');
    await takePostRequest('getMyPing');
    if(!$.Pin){
      console.log('获取[Pin]失败！')
      return
    }
    await takePostRequest('accessLogWithAD');
    await takePostRequest('getUserInfo');
    await takePostRequest('activityContent');
    if($.hotFlag) return
    if(!$.actorUuid){
      console.log('获取不到[actorUuid]退出执行，请重新执行')
      return
    }
    if($.hasEnd === true || Date.now() > $.endTime){
      $.activityEnd = true
      console.log('活动结束')
      return
    }
    await takePostRequest('drawContent');
    await $.wait(1000)
    $.openList = []
    $.allOpenCard = false
    await takePostRequest('info');
    await takePostRequest('checkOpenCard');
    // console.log($.actorUuid)
    // return
    if($.allOpenCard == false){
      console.log('开卡任务')
      for(o of $.openList){
        $.openCard = false
        if(o.status == 0){
          flag = true
          $.shopactivityId = ''
          $.joinVenderId = o.venderId
          await getshopactivityId()
          for (let i = 0; i < Array(5).length; i++) {
            if (i > 0) console.log(`第${i}次 重新开卡`)
            await joinShop()
            if ($.errorJoinShop.indexOf('活动太火爆，请稍后再试') == -1) {
              break
            }
          }
          if ($.errorJoinShop.indexOf('活动太火爆，请稍后再试') > -1) {
            console.log("开卡失败❌ ，重新执行脚本")
            allMessage += `【账号${$.index}】开卡失败❌ ，重新执行脚本\n`
          } else {
            $.joinStatus = true
          }
          await takePostRequest('activityContent');
          await takePostRequest('drawContent');
          await takePostRequest('checkOpenCard');
          await $.wait(parseInt(Math.random() * 2000 + 3000, 10))
        }
      }
    }else{
      console.log('已全部开卡')
    }
    
    $.log("关注: " + $.followShop)
    if(!$.followShop && !$.outFlag){
      flag = true
      await takePostRequest('followShop');
      await $.wait(parseInt(Math.random() * 2000 + 3000, 10))
    }

    $.yaoqing = false
    await takePostRequest('邀请');
    if($.yaoqing){
      await takePostRequest('助力');
    }
    $.log("加购: " + $.addCart)
    if(!$.addCart && !$.outFlag){
        await takePostRequest('addCart');
        await $.wait(parseInt(Math.random() * 2000 + 4000, 10))
    }
    if(flag){
      await takePostRequest('activityContent');
    }
    console.log(`${$.score}值`)
      $.runFalag = true
      let count = parseInt($.score/100)
      console.log(`抽奖次数为:${count}`)
      for(m=1;count--;m++){
        console.log(`第${m}次抽奖`)
        await takePostRequest('抽奖');
        if($.runFalag == false) break
        if(Number(count) <= 0) break
        if(m >= 10){
          console.log("抽奖太多次，多余的次数请再执行脚本")
          break
        }
        await $.wait(parseInt(Math.random() * 2000 + 2000, 10))
      }
    
    await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
    await takePostRequest('getDrawRecordHasCoupon');
    await takePostRequest('getShareRecord');
    if($.outFlag){
      console.log('此ip已被限制，请过10分钟后再执行脚本\n')
      return
    }
    console.log($.actorUuid)
    console.log(`当前助力:${$.shareUuid}`)
    if($.index == 1){
      $.shareUuid = $.actorUuid
      console.log(`后面的号都会助力:${$.shareUuid}`)
    }
    await $.wait(parseInt(Math.random() * 1000 + 5000, 10))
      if($.index % 3 == 0) console.log('休息一下，别被黑ip了\n可持续发展')
      if($.index % 3 == 0) await $.wait(parseInt(Math.random() * 5000 + 30000, 10))
  } catch (e) {
    console.log(e)
  }
}

async function takePostRequest(type) {
  if($.outFlag) return
  let domain = 'https://lzdz1-isv.isvjcloud.com';
  let body = ``;
  let method = 'POST'
  let admJson = ''
  switch (type) {
    case 'isvObfuscator':
      url = `https://api.m.jd.com/client.action?functionId=isvObfuscator`;
      body = `body=%7B%22url%22%3A%22https%3A//lzdz1-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&uuid=86e6b0a0e533fbc8c2df5396d4b76905d7927de5&client=apple&clientVersion=10.1.4&st=1649338575322&sv=102&sign=62896463f4e893cf25f7d74be3233b19`;
      break;
      case 'getSimpleActInfoVo':
        url = `${domain}/dz/common/getSimpleActInfoVo`;
        body = `activityId=${$.activityId}`;
        break;
      case 'getMyPing':
        url = `${domain}/customer/getMyPing`;
        body = `userId=${$.shopId || $.venderId || ''}&token=${$.Token}&fromType=APP`;
        break;
      case 'accessLogWithAD':
        url = `${domain}/common/accessLogWithAD`;
        let pageurl = `${domain}/dingzhi/customized/common/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`
        body = `venderId=${$.shopId || $.venderId || ''}&code=99&pin=${encodeURIComponent($.Pin)}&activityId=${$.activityId}&pageUrl=${encodeURIComponent(pageurl)}&subType=app&adSource=`
        break;
      case 'getUserInfo':
        url = `${domain}/wxActionCommon/getUserInfo`;
        body = `pin=${encodeURIComponent($.Pin)}`;
        break;
      case 'activityContent':
        url = `${domain}/dingzhi/linkgame/activity/content`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&pinImg=${encodeURIComponent($.attrTouXiang)}&nick=${encodeURIComponent($.nickname)}&cjyxPin=&cjhyPin=&shareUuid=${$.shareUuid}`
        break;
      case 'drawContent':
        url = `${domain}/dingzhi/taskact/common/drawContent`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}`
        break;
      case 'checkOpenCard':
        url = `${domain}/dingzhi/linkgame/checkOpenCard`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&shareUuid=${$.shareUuid}`
        break;
      case 'info':
        url = `${domain}/dingzhi/linkgame/task/opencard/info`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}`
        break;
      case 'startDraw':
        url = `${domain}/joint/order/draw`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}&drawType=1`
        break;
      case 'followShop':
        url = `${domain}/dingzhi/opencard/follow/shop`;
        // url = `${domain}/dingzhi/dz/openCard/saveTask`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}`
        break;
      case 'sign':
      case 'addCart':
      case 'browseGoods':
        url = `${domain}/dingzhi/opencard/${type}`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}`
        if(type == 'browseGoods') body += `&value=${$.visitSkuValue}`
        break;
      case '邀请':
      case '助力':
        if(type == '助力'){
          url = `${domain}/dingzhi/linkgame/assist`;
        }else{
          url = `${domain}/dingzhi/linkgame/assist/status`;
        }
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&shareUuid=${$.shareUuid}`
        break;
      case 'viewVideo':
      case 'visitSku':
      case 'toShop':
      case 'addSku':
        url = `${domain}/dingzhi/opencard/${type}`;
        let taskType = ''
        let taskValue = ''
        if(type == 'viewVideo'){
          taskType = 31
          taskValue = 31
        }else if(type == 'visitSku'){
          taskType = 5
          taskValue = $.visitSkuValue || 5
        }else if(type == 'toShop'){
          taskType = 14
          taskValue = $.toShopValue || 14
        }else if(type == 'addSku'){
          taskType = 2
          taskValue = $.addSkuValue || 2
        }
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}&taskType=${taskType}&taskValue=${taskValue}`
        break;
      case 'getDrawRecordHasCoupon':
        url = `${domain}/dingzhi/linkgame/draw/record`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}`
        break;
      case 'getShareRecord':
        url = `${domain}/dingzhi/linkgame/help/list`;
        body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}`
        break;
      case '抽奖':
        url = `${domain}/dingzhi/opencard/draw`;
        body = `activityId=${$.activityId}&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.Pin)}`
        break;
      default:
        console.log(`错误${type}`);
    }
    let myRequest = getPostRequest(url, body, method);
    // console.log(myRequest)
    return new Promise(async resolve => {
      $.post(myRequest, (err, resp, data) => {
        try {
          setActivityCookie(resp)
          if (err) {
            if(resp && typeof resp.statusCode != 'undefined'){
              if(resp.statusCode == 493){
                console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                $.outFlag = true
              }
            }
            console.log(`${$.toStr(err,err)}`)
            console.log(`${type} API请求失败，请检查网路重试`)
          } else {
            dealReturn(type, data);
          }
        } catch (e) {
          // console.log(data);
          console.log(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }
  
async function dealReturn(type, data) {
  let res = ''
  try {
    if(type != 'accessLogWithAD' || type != 'drawContent'){
      if(data){
        res = JSON.parse(data);
      }
    }
  } catch (e) {
    console.log(`${type} 执行任务异常`);
    console.log(data);
    $.runFalag = false;
  }
  try {
    switch (type) {
      case 'isvObfuscator':
        if(typeof res == 'object'){
          if(res.errcode == 0){
            if(typeof res.token != 'undefined') $.Token = res.token
          }else if(res.message){
            console.log(`isvObfuscator ${res.message || ''}`)
          }else{
            console.log(data)
          }
        }else{
          console.log(data)
        }
        break;
      case 'getSimpleActInfoVo':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            if(typeof res.data.shopId != 'undefined') $.shopId = res.data.shopId
            if(typeof res.data.venderId != 'undefined') $.venderId = res.data.venderId
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'getMyPing':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            if(res.data && typeof res.data.secretPin != 'undefined') $.Pin = res.data.secretPin
            if(res.data && typeof res.data.nickname != 'undefined') $.nickname = res.data.nickname
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'getUserInfo':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            if(res.data && typeof res.data.yunMidImageUrl != 'undefined') $.attrTouXiang = res.data.yunMidImageUrl || "https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png"
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'activityContent':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            $.endTime = res.data.endTime || (res.data.activityVo && res.data.activityVo.endTime) || res.data.activity.endTime || 0
            $.hasEnd = res.data.isEnd || false
            $.drawCount = res.data.actor.drawCount || 0
            $.point = res.data.actor.point || 0
            $.score = res.data.actor.score || 0
            $.actorUuid = res.data.actor.actorUuid || ''
            $.followShop = res.data.actor.followShopStatus || ''
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'info':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            // $.drawCount = res.data.drawCount || 0
            $.addCart = res.data.addCart || false
            // $.followShop = res.data.followShop || false
            // $.sign = res.data.isSignStatus || false
            // $.visitSku = res.data.visitSku || false
            // $.visitSkuList = res.data.visitSkuList || []
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'checkOpenCard':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            let cardList1 = res.data.cardList1 || []
            let cardList2 = res.data.cardList2 || []
            let cardList = res.data.cardList || []
            let openCardList = res.data.openCardList || []
            $.openList = [...cardList,...cardList1,...cardList2,...openCardList]
            $.allOpenCard = res.data.allOpenCard || res.data.isOpenCardStatus || false
            $.openCardScore1 = res.data.score1 || 0
            $.openCardScore2 = res.data.score2 || 0
            $.drawScore = res.data.drawScore || 0
            if(res.data.beans || res.data.addBeanNum) console.log(`开卡获得:${res.data.beans || res.data.addBeanNum}豆`)
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'startDraw':
      case 'followShop':
      case 'viewVideo':
      case 'visitSku':
      case 'toShop':
      case 'addSku':
      case 'sign':
      case 'addCart':
      case 'browseGoods':
      case '抽奖':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            if(typeof res.data == 'object'){
              let msg = ''
              let title = '抽奖'
              if(res.data.addBeanNum){
                msg = `${res.data.addBeanNum}京豆`
              }
              if(res.data.addPoint){
                msg += ` ${res.data.addPoint}游戏机会`
              }
              if(type == 'followShop'){
                title = '关注'
                if(res.data.beanNumMember && res.data.assistSendStatus){
                  msg += ` 额外获得:${res.data.beanNumMember}京豆`
                }
              }else if(type == 'addSku' || type == 'addCart'){
                title = '加购'
              }else if(type == 'viewVideo'){
                title = '热门文章'
              }else if(type == 'toShop'){
                title = '浏览店铺'
              }else if(type == 'visitSku' || type == 'browseGoods'){
                title = '浏览商品'
              }else if(type == 'sign'){
                title = '签到'
              }else{
                let drawData = res.data.drawOk || res.data
                msg = drawData.drawOk == true && drawData.name || ''
              }
              if(title == "抽奖" && msg && msg.indexOf('京豆') == -1){
                if ($.isNode()) await notify.sendNotify(`${$.name}`, `【京东账号${$.index}】${$.nickName || $.UserName}\n${title}成功,获得 ${msg}`);
              }
              if(!msg){
                msg = '空气💨'
              }
              console.log(`${title}获得:${msg || data}`)
            }else{
              console.log(`${type} ${data}`)
            }
          }else if(res.errorMessage){
            $.runFalag = false;
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'getDrawRecordHasCoupon':
        if(typeof res == 'object'){
          if(res.result && res.result === true){
            console.log(`我的奖品：`)
            let num = 0
            let value = 0
            for(let i in res.data.recordList){
              let item = res.data.recordList[i]
              if(item.infoName == '20京豆' && item.drawStatus == 0){
                num++
                value = item.infoName.replace('京豆','')
              }else{
                console.log(`${item.infoType != 10 && item.value && item.value +':' || ''}${item.infoName}`)
              }
            }
            if(num > 0) console.log(`邀请好友(${num}):${num*parseInt(value, 10) || 30}京豆`)
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case 'getShareRecord':
        if(typeof res == 'object'){
          if(res.result && res.result === true && res.data){
            $.ShareCount = res.data.shareList.length
            $.log(`=========== 你邀请了:${$.ShareCount}个\n由于接口数据只有30个 故邀请大于30个的需要自行判断\n`)
          }else if(res.errorMessage){
            console.log(`${type} ${res.errorMessage || ''}`)
          }else{
            console.log(`${type} ${data}`)
          }
        }else{
          console.log(`${type} ${data}`)
        }
        break;
      case '邀请':
      case '助力':
        // console.log(data)
        if(typeof res == 'object'){
          if(res.data.status == 200){
            if(type == '助力'){
              console.log('助力成功')
            }else{
              $.yaoqing = true
            }
          }else if(res.data.status == 105){
            console.log('已经助力过')
          }else if(res.data.status == 104){
            console.log('已经助力其他人')
          }else if(res.data.status == 101){
            // console.log('已经助力过')
          }else{
            console.log(data)
          }
        }else{
          console.log(`${type} ${data}`)
        }

      case 'accessLogWithAD':
      case 'drawContent':
        break;
      default:
        console.log(`${type}-> ${data}`);
    }
    if(typeof res == 'object'){
      if(res.errorMessage){
        if(res.errorMessage.indexOf('火爆') >-1 ){
          $.hotFlag = true
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}

function getPostRequest(url, body, method="POST") {
  let headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-cn",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    "Cookie": cookie,
    "User-Agent": $.UA,
    "X-Requested-With": "XMLHttpRequest"
  }
  if(url.indexOf('https://lzdz1-isv.isvjcloud.com') > -1){
    headers["Referer"] = `https://lzdz1-isv.isvjcloud.com/dingzhi/customized/common/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`
    headers["Cookie"] = `${lz_jdpin_token_cookie && lz_jdpin_token_cookie || ''}${$.Pin && "AUTH_C_USER=" + $.Pin + ";" || ""}${activityCookie}`
  }
  // console.log(headers)
  // console.log(headers.Cookie)
  return  {url: url, method: method, headers: headers, body: body, timeout:30000};
}

function getCk() {
  return new Promise(resolve => {
    let get = {
      url:`https://lzdz1-isv.isvjcloud.com/dingzhi/customized/common/activity?activityId=${$.activityId}&shareUuid=${$.shareUuid}`,
      followRedirect:false,
      headers: {
        "User-Agent": $.UA,
      },
      timeout:30000
    }
    $.get(get, async(err, resp, data) => {
      try {
        if (err) {
          if(resp && typeof resp.statusCode != 'undefined'){
            if(resp.statusCode == 493){
              console.log('此ip已被限制，请过10分钟后再执行脚本\n')
              $.outFlag = true
            }
          }
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} cookie API请求失败，请检查网路重试`)
        } else {
          let end = data.match(/(活动已经结束)/) && data.match(/(活动已经结束)/)[1] || ''
          if(end){
            $.activityEnd = true
            console.log('活动已结束')
          }
          setActivityCookie(resp)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function setActivityCookie(resp){
  let LZ_TOKEN_KEY = ''
  let LZ_TOKEN_VALUE = ''
  let lz_jdpin_token = ''
  let setcookies = resp && resp['headers'] && (resp['headers']['set-cookie'] || resp['headers']['Set-Cookie'] || '') || ''
  let setcookie = ''
  if(setcookies){
    if(typeof setcookies != 'object'){
      setcookie = setcookies.split(',')
    }else setcookie = setcookies
    for (let ck of setcookie) {
      let name = ck.split(";")[0].trim()
      if(name.split("=")[1]){
        // console.log(name.replace(/ /g,''))
        if(name.indexOf('LZ_TOKEN_KEY=')>-1) LZ_TOKEN_KEY = name.replace(/ /g,'')+';'
        if(name.indexOf('LZ_TOKEN_VALUE=')>-1) LZ_TOKEN_VALUE = name.replace(/ /g,'')+';'
        if(name.indexOf('lz_jdpin_token=')>-1) lz_jdpin_token = ''+name.replace(/ /g,'')+';'
      }
    }
  }
  if(LZ_TOKEN_KEY && LZ_TOKEN_VALUE) activityCookie = `${LZ_TOKEN_KEY} ${LZ_TOKEN_VALUE}`
  if(lz_jdpin_token) lz_jdpin_token_cookie = lz_jdpin_token
}

async function getUA(){
  $.UA = `jdapp;iPhone;10.1.4;13.1.2;${randomString(40)};network/wifi;model/iPhone8,1;addressid/2308460611;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}
function randomString(e) {
  e = e || 32;
  let t = "abcdef0123456789", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}


function joinShop() {
  if(!$.joinVenderId) return
  return new Promise(async resolve => {
    $.errorJoinShop = ''
	await requestAlgo();
    let activityId = ``
    if($.shopactivityId) activityId = `,"activityId":${$.shopactivityId}`
    let body = `{"venderId":"${$.joinVenderId}","shopId":"${$.joinVenderId}","bindByVerifyCodeFlag":1,"registerExtend":{},"writeChildFlag":0${activityId},"channel":401}`
    let h5st = await h5stSign(body) || 'undefined'
    const options = {
      url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body=${body}&clientVersion=9.2.0&client=H5&uuid=88888&h5st=${h5st}`,
      headers: {
        'Content-Type': 'text/plain; Charset=UTF-8',
        'Origin': 'https://api.m.jd.com',
        'Host': 'api.m.jd.com',
        'accept': '*/*',
        'User-Agent': $.UA,
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': cookie
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        // console.log(data)
        let res = $.toObj(data,data);
        if(typeof res == 'object'){
          if(res.success === true){
            console.log(res.message)
            $.errorJoinShop = res.message
            if(res.result && res.result.giftInfo){
              for(let i of res.result.giftInfo.giftList){
                console.log(`入会获得:${i.discountString}${i.prizeName}${i.secondLineDesc}`)
              }
            }
          }else if(typeof res == 'object' && res.message){
            $.errorJoinShop = res.message
            console.log(`${res.message || ''}`)
          }else{
            console.log(data)
          }
        }else{
          console.log(data)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function getshopactivityId() {
  return new Promise(resolve => {
    const options = {
      url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=%7B%22venderId%22%3A%22${$.joinVenderId}%22%2C%22channel%22%3A401%7D&client=H5&clientVersion=9.2.0&uuid=88888`,
      headers: {
        'Content-Type': 'text/plain; Charset=UTF-8',
        'Origin': 'https://api.m.jd.com',
        'Host': 'api.m.jd.com',
        'accept': '*/*',
        'User-Agent': $.UA,
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': cookie
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        let res = $.toObj(data,data);
        if(typeof res == 'object'){
          if(res.success == true){
            // console.log($.toStr(res.result))
            console.log(`入会:${res.result.shopMemberCardInfo.venderCardName || ''}`)
            $.shopactivityId = res.result.interestsRuleList && res.result.interestsRuleList[0] && res.result.interestsRuleList[0].interestsInfo && res.result.interestsRuleList[0].interestsInfo.activityId || ''
          }
        }else{
          console.log(data)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
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
var _0xodz='jsjiami.com.v6',_0xodz_=['_0xodz'],_0x1e35=[_0xodz,'\x6a\x73\x6a\x69\x61\x6d\x69\x2e\x63\x6f\x6d\x2e\x76\x36','\u202e\x5f\x30\x78\x6f\x64\x65','\x45\x63\x4b\x41\x58\x45\x55\x6d\x77\x37\x4c\x43\x6d\x77\x3d\x3d','\x58\x73\x4f\x39\x77\x72\x2f\x43\x69\x31\x51\x3d','\x77\x72\x58\x43\x6e\x43\x6e\x44\x6d\x32\x44\x44\x74\x51\x3d\x3d','\x77\x6f\x74\x63\x4e\x33\x33\x44\x69\x51\x3d\x3d','\x77\x35\x42\x55\x4a\x73\x4b\x67\x57\x73\x4b\x49\x77\x71\x4d\x3d','\x42\x45\x58\x43\x70\x67\x59\x44','\x77\x6f\x78\x36\x57\x4d\x4f\x6c\x77\x72\x41\x3d','\x77\x34\x34\x4f\x52\x4d\x4b\x6b\x77\x37\x6b\x3d','\x56\x4d\x4b\x76\x52\x7a\x6a\x44\x74\x77\x3d\x3d','\x77\x34\x74\x4a\x51\x33\x68\x67\x42\x68\x33\x44\x76\x77\x72\x44\x74\x41\x4d\x38\x77\x35\x6b\x62\x49\x32\x58\x43\x70\x6b\x77\x4f\x4a\x44\x62\x44\x67\x63\x4b\x4d\x45\x73\x4b\x62\x42\x31\x2f\x43\x75\x38\x4b\x4f\x58\x4d\x4b\x4c\x77\x35\x52\x45\x44\x48\x56\x35\x77\x6f\x6b\x4c\x48\x7a\x2f\x43\x69\x33\x31\x50\x77\x72\x38\x3d','\x4e\x73\x4f\x6b\x56\x63\x4b\x44\x4c\x41\x3d\x3d','\x4a\x47\x76\x44\x72\x43\x30\x73\x77\x71\x68\x70\x65\x6e\x54\x44\x75\x38\x4f\x73\x77\x72\x4c\x44\x69\x6b\x37\x43\x6c\x68\x78\x51\x77\x34\x35\x2f\x77\x37\x2f\x44\x6a\x57\x56\x33','\x77\x71\x51\x4a\x4c\x63\x4b\x55\x57\x38\x4b\x6f\x51\x38\x4b\x63\x59\x7a\x4e\x56\x46\x63\x4f\x56\x46\x46\x64\x4b\x77\x35\x44\x43\x6c\x4d\x4f\x52\x77\x35\x66\x44\x6e\x4d\x4f\x75\x77\x71\x30\x3d','\x77\x37\x72\x43\x73\x4d\x4f\x6e\x4d\x6e\x67\x3d','\x77\x6f\x4d\x53\x4b\x48\x76\x44\x6e\x68\x7a\x43\x6c\x58\x76\x44\x6d\x68\x4c\x43\x68\x73\x4b\x58\x77\x6f\x78\x59\x50\x31\x6a\x44\x68\x45\x2f\x44\x67\x6d\x6a\x43\x6a\x4d\x4f\x5a\x77\x37\x51\x3d','\x77\x35\x6f\x63\x66\x48\x2f\x44\x6e\x42\x2f\x43\x74\x58\x44\x43\x6c\x67\x72\x43\x6e\x73\x4b\x44\x77\x6f\x77\x53\x4f\x55\x4c\x44\x69\x6b\x48\x43\x68\x6d\x7a\x44\x68\x38\x4b\x4f\x77\x72\x50\x43\x6c\x38\x4f\x76\x66\x63\x4b\x48\x65\x4d\x4b\x77\x4a\x67\x3d\x3d','\x77\x37\x51\x67\x77\x34\x34\x3d','\x43\x63\x4b\x4b\x51\x6b\x51\x36','\x45\x31\x72\x44\x6e\x63\x4b\x4e\x77\x6f\x63\x3d','\x77\x71\x72\x43\x6a\x52\x2f\x43\x6c\x51\x3d\x3d','\x77\x6f\x31\x5a\x77\x71\x6a\x43\x73\x7a\x45\x3d','\x77\x71\x73\x59\x4e\x38\x4b\x76\x54\x63\x4f\x72','\x77\x35\x42\x55\x49\x73\x4b\x35\x53\x63\x4b\x46\x77\x36\x59\x3d','\x77\x34\x5a\x7a\x65\x63\x4f\x64','\x77\x72\x54\x43\x6c\x4d\x4b\x74\x77\x72\x4a\x52','\x77\x6f\x39\x6d\x77\x72\x67\x71\x61\x43\x34\x3d','\x77\x70\x77\x67\x4c\x79\x7a\x44\x72\x38\x4f\x38','\x77\x36\x6b\x37\x77\x34\x74\x4c\x77\x35\x30\x72','\x77\x71\x30\x52\x4b\x63\x4b\x4d\x53\x63\x4f\x77\x43\x63\x4f\x48','\x77\x71\x73\x4c\x63\x38\x4b\x38\x51\x57\x48\x44\x6a\x68\x51\x51\x77\x71\x4a\x76\x77\x70\x4e\x46\x77\x70\x66\x43\x70\x4d\x4b\x33\x42\x63\x4f\x32\x77\x37\x68\x38\x55\x6e\x78\x58\x56\x47\x6f\x4f\x49\x30\x70\x33\x77\x72\x5a\x41\x4e\x38\x4b\x35\x77\x70\x63\x33\x49\x73\x4f\x62\x77\x70\x33\x44\x6f\x57\x4c\x43\x75\x6b\x31\x6f\x77\x6f\x74\x48\x77\x72\x6f\x63\x77\x36\x58\x44\x6d\x53\x38\x55\x58\x67\x3d\x3d','\x77\x72\x4c\x44\x71\x55\x6f\x3d','\x4c\x57\x72\x43\x75\x77\x73\x3d','\x77\x37\x66\x43\x6b\x77\x48\x44\x6b\x33\x72\x43\x74\x77\x33\x43\x6d\x41\x3d\x3d','\x54\x46\x50\x44\x67\x67\x76\x43\x72\x51\x3d\x3d','\x77\x70\x50\x43\x67\x38\x4b\x35\x77\x70\x4e\x64\x66\x78\x66\x43\x68\x6a\x4c\x43\x70\x67\x3d\x3d','\x77\x72\x33\x43\x75\x73\x4b\x76\x77\x71\x35\x34','\x43\x30\x72\x44\x74\x32\x58\x44\x6b\x67\x3d\x3d','\x4b\x46\x4a\x6b\x4b\x77\x63\x3d','\x77\x34\x4a\x6b\x63\x48\x33\x43\x76\x73\x4b\x37\x77\x34\x42\x63\x4b\x73\x4f\x70','\x4f\x63\x4b\x69\x61\x63\x4b\x79\x44\x41\x3d\x3d','\x77\x70\x70\x46\x77\x6f\x48\x43\x70\x6a\x4d\x3d','\x45\x63\x4f\x42\x65\x63\x4b\x69\x77\x70\x55\x54','\x77\x71\x41\x59\x4e\x38\x4b\x44\x58\x4d\x4f\x36','\x77\x72\x6a\x43\x69\x54\x66\x44\x6c\x58\x41\x3d','\x77\x70\x6a\x43\x6e\x4d\x4b\x54\x77\x71\x49\x65\x43\x51\x3d\x3d','\x77\x72\x72\x43\x6c\x53\x37\x44\x6d\x58\x72\x44\x71\x51\x3d\x3d','\x66\x38\x4f\x6e\x48\x63\x4f\x31\x53\x51\x3d\x3d','\x64\x57\x76\x44\x73\x68\x49\x3d','\x77\x71\x58\x44\x69\x51\x62\x43\x6b\x42\x59\x3d','\x61\x4d\x4b\x76\x50\x77\x3d\x3d','\x49\x30\x4d\x61\x4b\x32\x63\x3d','\x41\x38\x4f\x6e\x42\x4d\x4f\x75\x4f\x67\x3d\x3d','\x77\x71\x44\x44\x6a\x73\x4f\x2f\x77\x34\x35\x73\x77\x36\x72\x43\x6b\x73\x4f\x78','\x44\x63\x4f\x49\x77\x70\x58\x44\x76\x42\x49\x3d','\x77\x36\x41\x6e\x63\x4d\x4b\x34\x77\x36\x70\x39\x77\x6f\x4c\x44\x6f\x51\x3d\x3d','\x4f\x55\x2f\x44\x67\x63\x4b\x74\x44\x41\x3d\x3d','\x5a\x55\x30\x65\x77\x36\x2f\x44\x72\x78\x41\x54\x77\x71\x59\x41\x77\x72\x49\x3d','\x77\x35\x44\x43\x75\x38\x4b\x48\x77\x36\x4d\x51','\x77\x72\x54\x43\x6a\x52\x73\x3d','\x77\x6f\x4d\x49\x63\x73\x4f\x6c\x77\x6f\x41\x3d','\x62\x73\x4f\x59\x66\x51\x3d\x3d','\x45\x63\x4b\x4a\x57\x30\x34\x33','\x77\x71\x5a\x6b\x77\x71\x38\x4a\x61\x67\x3d\x3d','\x4f\x57\x62\x43\x72\x79\x55\x48\x77\x37\x30\x3d','\x44\x63\x4f\x49\x77\x71\x33\x44\x72\x51\x34\x3d','\x77\x71\x37\x43\x6a\x54\x2f\x43\x6c\x63\x4f\x78\x51\x6a\x33\x43\x6c\x67\x3d\x3d','\x77\x6f\x50\x44\x67\x63\x4b\x66\x77\x72\x63\x50\x46\x47\x49\x4a','\x5a\x43\x42\x45\x77\x70\x62\x44\x6b\x73\x4b\x32\x42\x4d\x4f\x6a\x55\x63\x4b\x45','\x77\x71\x76\x44\x70\x32\x48\x44\x6c\x63\x4b\x51\x65\x77\x63\x76','\x77\x6f\x59\x36\x45\x54\x72\x44\x75\x4d\x4f\x6e\x77\x70\x67\x4d','\x77\x35\x62\x44\x72\x4d\x4b\x66\x77\x36\x42\x77\x61\x58\x78\x78','\x49\x4d\x4f\x47\x61\x73\x4b\x6a\x48\x33\x49\x3d','\x77\x71\x4a\x37\x52\x38\x4f\x37\x77\x71\x41\x3d','\x4b\x6d\x2f\x44\x6e\x6b\x33\x44\x6f\x6d\x77\x3d','\x4f\x73\x4b\x6d\x52\x73\x4b\x2b\x46\x77\x3d\x3d','\x77\x72\x72\x43\x6c\x69\x6e\x44\x6e\x33\x58\x44\x71\x51\x3d\x3d','\x77\x71\x6b\x47\x66\x73\x4b\x37\x52\x58\x4d\x3d','\x77\x70\x33\x44\x67\x63\x4b\x6c\x77\x71\x30\x3d','\x77\x34\x38\x66\x77\x37\x4e\x70\x77\x35\x63\x3d','\x49\x73\x4f\x5a\x64\x4d\x4b\x70\x47\x67\x3d\x3d','\x77\x70\x52\x68\x77\x36\x6f\x3d','\x4b\x63\x4f\x48\x49\x4d\x4f\x73\x50\x6b\x4c\x43\x69\x73\x4f\x70\x77\x71\x37\x44\x6e\x6b\x76\x44\x71\x7a\x30\x3d','\x64\x67\x30\x75\x56\x31\x4d\x3d','\x65\x6e\x37\x44\x75\x44\x45\x35\x77\x71\x7a\x44\x67\x73\x4f\x4b\x57\x4d\x4b\x35\x56\x6a\x50\x43\x73\x63\x4f\x55\x77\x36\x51\x3d','\x77\x6f\x37\x44\x6c\x38\x4b\x31\x77\x72\x6f\x77\x4d\x47\x67\x4b\x4a\x38\x4b\x36\x77\x70\x48\x43\x74\x51\x76\x43\x6e\x58\x78\x55\x4a\x67\x3d\x3d','\x77\x37\x78\x61\x64\x4d\x4f\x76\x48\x41\x3d\x3d','\x77\x71\x54\x43\x76\x53\x73\x3d','\x43\x38\x4b\x70\x56\x45\x55\x52','\x49\x45\x6c\x47\x50\x52\x6b\x3d','\x4c\x63\x4f\x39\x77\x72\x54\x44\x6f\x6a\x45\x3d','\x77\x34\x4e\x4f\x77\x72\x67\x3d','\x4a\x4d\x4b\x61\x58\x4d\x4b\x35\x48\x77\x3d\x3d','\x77\x37\x5a\x31\x53\x4d\x4f\x39\x4a\x77\x3d\x3d','\x5a\x38\x4f\x53\x59\x44\x55\x3d','\x51\x73\x4b\x70\x55\x56\x44\x43\x6b\x77\x51\x3d','\x77\x36\x66\x43\x6c\x54\x48\x44\x6b\x31\x7a\x43\x70\x78\x50\x43\x6d\x67\x3d\x3d','\x77\x36\x4a\x56\x54\x73\x4f\x64\x50\x67\x3d\x3d','\x77\x71\x4d\x54\x53\x4d\x4b\x2b\x61\x41\x3d\x3d','\x45\x73\x4f\x48\x62\x73\x4b\x67\x77\x72\x67\x3d','\x46\x63\x4b\x50\x53\x41\x3d\x3d','\x77\x37\x4e\x49\x58\x4d\x4f\x7a\x49\x41\x3d\x3d','\x4d\x45\x6e\x43\x72\x42\x37\x43\x75\x67\x3d\x3d','\x4c\x48\x76\x44\x69\x73\x4b\x4a\x77\x71\x67\x3d','\x77\x72\x49\x63\x65\x4d\x4b\x31\x5a\x67\x3d\x3d','\x57\x55\x62\x44\x76\x41\x54\x43\x6b\x77\x3d\x3d','\x77\x35\x6e\x43\x6f\x63\x4f\x64\x44\x56\x6f\x3d','\x77\x37\x30\x71\x77\x35\x64\x70\x77\x35\x59\x31','\x4c\x38\x4f\x75\x5a\x63\x4f\x54\x77\x6f\x6f\x3d','\x77\x35\x4e\x77\x54\x63\x4f\x47\x50\x6d\x34\x2f\x4c\x67\x3d\x3d','\x77\x37\x6e\x43\x76\x4d\x4f\x46\x43\x47\x4c\x44\x69\x58\x4c\x44\x76\x41\x3d\x3d','\x77\x35\x44\x43\x69\x42\x76\x44\x6c\x31\x72\x43\x6f\x54\x66\x43\x72\x67\x3d\x3d','\x77\x6f\x72\x44\x6b\x63\x4b\x36\x77\x35\x34\x42\x77\x71\x72\x44\x70\x38\x4f\x68','\x4f\x73\x4f\x56\x77\x72\x2f\x44\x75\x42\x51\x41\x77\x34\x48\x43\x74\x51\x3d\x3d','\x44\x4d\x4b\x42\x61\x31\x51\x73\x77\x35\x54\x43\x6b\x79\x6b\x3d','\x77\x36\x44\x44\x6f\x6b\x68\x76\x4f\x4d\x4f\x47\x62\x4d\x4b\x34','\x46\x38\x4f\x50\x52\x4d\x4b\x79\x77\x6f\x67\x58\x65\x4d\x4f\x68','\x47\x38\x4b\x42\x56\x6b\x4d\x2f\x77\x34\x6b\x3d','\x77\x72\x34\x47\x51\x38\x4b\x73\x56\x6d\x37\x44\x68\x78\x73\x3d','\x55\x73\x4b\x30\x61\x43\x62\x44\x6f\x77\x3d\x3d','\x4f\x47\x67\x63\x4a\x56\x54\x44\x74\x63\x4f\x49\x47\x67\x3d\x3d','\x77\x34\x52\x77\x63\x4d\x4f\x52\x4c\x58\x4d\x3d','\x77\x71\x51\x47\x5a\x77\x3d\x3d','\x45\x48\x50\x43\x70\x6a\x6e\x43\x70\x41\x3d\x3d','\x62\x58\x72\x44\x76\x67\x67\x76\x77\x70\x33\x44\x68\x4d\x4f\x57','\x77\x37\x30\x71\x77\x34\x31\x6d\x77\x35\x49\x34\x54\x51\x3d\x3d','\x77\x70\x44\x44\x69\x38\x4b\x34\x77\x6f\x73\x53\x43\x48\x34\x64','\x77\x6f\x54\x44\x6d\x63\x4f\x79\x77\x37\x5a\x33\x77\x37\x44\x43\x71\x73\x4f\x52','\x77\x70\x39\x56\x4b\x6c\x50\x44\x68\x51\x48\x43\x69\x57\x44\x44\x6b\x55\x4d\x3d','\x77\x72\x37\x43\x6e\x44\x50\x44\x72\x33\x48\x44\x76\x6c\x67\x63\x77\x6f\x58\x44\x6f\x77\x3d\x3d','\x77\x37\x30\x71\x77\x34\x31\x6d\x77\x35\x49\x31','\x77\x71\x63\x78\x66\x4d\x4f\x5a\x77\x72\x6f\x3d','\x41\x73\x4f\x36\x51\x63\x4b\x6a\x45\x51\x3d\x3d','\x77\x37\x50\x44\x71\x47\x39\x57\x49\x38\x4f\x44\x62\x73\x4b\x32\x58\x47\x44\x43\x69\x56\x2f\x44\x74\x73\x4b\x53\x77\x71\x34\x3d','\x65\x48\x72\x44\x75\x69\x6b\x68\x77\x70\x44\x44\x6c\x51\x3d\x3d','\x65\x68\x41\x67\x4d\x73\x4b\x7a\x77\x35\x51\x3d','\x4a\x4d\x4f\x4d\x63\x4d\x4b\x47\x43\x32\x70\x59\x51\x58\x45\x61\x65\x77\x3d\x3d','\x46\x4d\x4b\x4c\x56\x6b\x63\x71\x77\x35\x55\x3d','\x77\x71\x6f\x53\x4b\x38\x4b\x68\x53\x63\x4f\x78\x42\x41\x3d\x3d','\x4c\x32\x67\x68\x4d\x6b\x66\x44\x71\x41\x3d\x3d','\x4f\x47\x49\x38\x4a\x51\x3d\x3d','\x4a\x33\x44\x44\x67\x38\x4b\x7a\x47\x51\x3d\x3d','\x64\x73\x4f\x49\x5a\x6a\x39\x5a\x52\x67\x3d\x3d','\x4f\x4d\x4f\x75\x59\x4d\x4f\x56\x77\x6f\x56\x69','\x77\x72\x58\x43\x6f\x63\x4b\x36\x77\x71\x78\x44','\x77\x6f\x4d\x36\x45\x52\x2f\x44\x6d\x77\x3d\x3d','\x57\x73\x4b\x54\x49\x73\x4f\x2b\x77\x34\x78\x4a\x49\x63\x4b\x30\x63\x73\x4b\x58\x41\x47\x50\x44\x6b\x73\x4f\x65\x63\x4d\x4b\x47','\x41\x55\x44\x44\x71\x63\x4b\x32\x77\x6f\x6b\x79\x77\x70\x52\x2f\x48\x73\x4f\x66\x77\x36\x6e\x44\x67\x43\x41\x51\x4c\x30\x34\x3d','\x46\x6e\x72\x44\x76\x4d\x4b\x61\x5a\x77\x76\x44\x73\x73\x4b\x53\x77\x70\x34\x4b\x77\x34\x33\x44\x69\x6a\x72\x43\x71\x43\x41\x41\x41\x67\x3d\x3d','\x77\x34\x72\x44\x74\x38\x4b\x34\x77\x36\x52\x78\x4f\x6a\x30\x35\x61\x45\x58\x44\x69\x38\x4f\x79\x4a\x73\x4b\x55\x64\x63\x4f\x6c\x77\x70\x33\x43\x75\x55\x48\x43\x69\x38\x4f\x65\x77\x35\x66\x43\x6f\x63\x4f\x6d','\x4d\x77\x6c\x43\x77\x72\x2f\x43\x72\x30\x78\x4b\x77\x37\x39\x78\x77\x36\x38\x3d','\x41\x4d\x4b\x4e\x55\x47\x55\x75','\x6a\x73\x6a\x69\x61\x6d\x69\x2e\x72\x41\x63\x6f\x79\x6d\x2e\x76\x6b\x36\x71\x6c\x77\x54\x43\x54\x59\x53\x72\x57\x64\x79\x3d\x3d','\x73\x68\x69\x66\x74','\x70\x75\x73\x68','\x6c\x65\x6e\x67\x74\x68','\x72\x65\x70\x6c\x61\x63\x65','\x63\x6f\x6e\x63\x61\x74','\x73\x6c\x69\x63\x65','\x66\x77\x6e\x49\x4c\x73','\x75\x6e\x64\x65\x66\x69\x6e\x65\x64','\x6f\x62\x6a\x65\x63\x74','\x66\x75\x6e\x63\x74\x69\x6f\x6e','\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d','\x61\x74\x6f\x62','\x63\x68\x61\x72\x41\x74','\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65','\x69\x6e\x64\x65\x78\x4f\x66','\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74','\x74\x6f\x53\x74\x72\x69\x6e\x67','\x4f\x47\x61\x46\x4f\x61','\x57\x51\x50\x45\x71\x4f','\x51\x6a\x67\x56\x4c\x6d','\x74\x59\x54\x5d','\x37\x31\x49\x28','\x56\x65\x70\x52','\x49\x7a\x56\x68','\x63\x42\x77\x59','\x6e\x24\x53\x2a','\x6c\x6e\x4d\x78','\x58\x46\x54\x43\x4d','\x72\x61\x6e\x64\x6f\x6d','\x48\x41\x57\x41\x53','\x39\x49\x39\x4a','\x59\x5e\x5a\x37','\x52\x52\x61\x63','\x79\x71\x6c\x54','\x57\x66\x46\x49','\x23\x46\x4f\x42','\x67\x24\x2a\x72','\x54\x5a\x78\x79','\x57\x74\x46\x70\x67','\x71\x75\x76\x6b\x54','\u202e\x31\x30','\x49\x38\x35\x6e','\u202b\x31\x31','\x29\x41\x4c\x6c','\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e\x2f\x6a\x73\x6f\x6e','\u202b\x31\x32','\x7a\x7a\x54\x25','\x51\x56\x47\x4e\x55','\u202b\x31\x33','\x63\x61\x63\x74\x75\x73\x2e\x6a\x64\x2e\x63\x6f\x6d','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x61\x63\x74\x75\x73\x2e\x6a\x64\x2e\x63\x6f\x6d','\x4d\x6f\x7a\x69\x6c\x6c\x61\x2f\x35\x2e\x30\x20\x28\x57\x69\x6e\x64\x6f\x77\x73\x20\x4e\x54\x20\x36\x2e\x31\x3b\x20\x57\x4f\x57\x36\x34\x29\x20\x41\x70\x70\x6c\x65\x57\x65\x62\x4b\x69\x74\x2f\x35\x33\x37\x2e\x33\x36\x20\x28\x4b\x48\x54\x4d\x4c\x2c\x20\x6c\x69\x6b\x65\x20\x47\x65\x63\x6b\x6f\x29\x20\x43\x68\x72\x6f\x6d\x65\x2f\x35\x33\x2e\x30\x2e\x32\x37\x38\x35\x2e\x31\x34\x33\x20\x53\x61\x66\x61\x72\x69\x2f\x35\x33\x37\x2e\x33\x36\x20\x4d\x69\x63\x72\x6f\x4d\x65\x73\x73\x65\x6e\x67\x65\x72\x2f\x37\x2e\x30\x2e\x39\x2e\x35\x30\x31\x20\x4e\x65\x74\x54\x79\x70\x65\x2f\x57\x49\x46\x49\x20\x4d\x69\x6e\x69\x50\x72\x6f\x67\x72\x61\x6d\x45\x6e\x76\x2f\x57\x69\x6e\x64\x6f\x77\x73\x20\x57\x69\x6e\x64\x6f\x77\x73\x57\x65\x63\x68\x61\x74','\x7b\x22\x76\x65\x72\x73\x69\x6f\x6e\x22\x3a\x22\x33\x2e\x30\x22\x2c\x22\x66\x70\x22\x3a','\x2c\x22\x61\x70\x70\x49\x64\x22\x3a\x22\x64\x64\x65\x32\x62\x22\x2c\x22\x74\x69\x6d\x65\x73\x74\x61\x6d\x70\x22\x3a','\x6e\x6f\x77','\x2c\x22\x70\x6c\x61\x74\x66\x6f\x72\x6d\x22\x3a\x22\x61\x70\x70\x6c\x65\x74\x22\x2c\x22\x65\x78\x70\x61\x6e\x64\x50\x61\x72\x61\x6d\x73\x22\x3a\x22\x22\x7d','\u202b\x31\x39','\u202e\x31\x61','\u202e\x31\x62','\x62\x31\x37\x50','\x70\x61\x72\x73\x65','\u202e\x31\x63','\x78\x42\x6b\x5e','\u202e\x31\x64','\x66\x50\x29\x40','\u202b\x31\x65','\u202b\x31\x66','\x4f\x2a\x57\x5b','\x66\x71\x61\x64\x5a','\x44\x62\x67\x55\x63','\u202e\x32\x30','\x6c\x6f\x67\x45\x72\x72','\u202e\x32\x31','\x29\x55\x46\x4b','\x46\x6b\x75\x71\x57','\u202b\x32\x32','\u202b\x32\x33','\x7a\x77\x71\x72','\u202b\x32\x34','\u202e\x32\x35','\x54\x4d\x57\x40','\u202e\x32\x36','\x73\x79\x77\x4e','\x42\x43\x4a\x64\x51','\u202b\x32\x37','\x6f\x79\x65\x6a\x52','\u202e\x32\x38','\x53\x79\x4c\x37','\u202e\x32\x39','\x65\x78\x4e\x6e','\u202b\x32\x61','\x72\x57\x76\x71\x63','\u202b\x32\x62','\x43\x51\x76\x4f\x56','\u202b\x32\x63','\x35\x6e\x4a\x42','\u202e\x32\x64','\x21\x52\x40\x48','\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x5f\x2d','\x53\x57\x59\x77\x64','\u202b\x32\x65','\u202b\x32\x66','\x77\x33\x54\x5d','\u202b\x33\x30','\u202e\x33\x31','\u202b\x33\x32','\x76\x61\x6c\x75\x65','\u202b\x33\x33','\u202b\x33\x34','\x37\x52\x7a\x24','\x62\x6f\x64\x79','\u202e\x33\x35','\x63\x6c\x69\x65\x6e\x74\x56\x65\x72\x73\x69\x6f\x6e','\u202e\x33\x36','\x70\x61\x72\x74\x79\x5f\x72\x74\x5f\x61\x73\x73\x69\x73\x74','\u202b\x33\x37','\x79\x79\x79\x79\x4d\x4d\x64\x64\x68\x68\x6d\x6d\x73\x73\x53\x53\x53','\u202b\x33\x38','\u202b\x33\x39','\x59\x36\x7a\x50','\u202b\x33\x61','\x21\x79\x64\x70','\x61\x63\x74\x69\x76\x69\x74\x69\x65\x73\x5f\x70\x6c\x61\x74\x66\x6f\x72\x6d','\u202e\x33\x62','\x54\x67\x28\x26','\u202b\x33\x63','\x77\x72\x53\x79','\x53\x48\x41\x32\x35\x36','\u202e\x33\x64','\x6c\x49\x67\x67','\u202e\x33\x65','\x64\x7a\x69\x59\x4c','\x61\x70\x70\x6c\x65\x74','\u202e\x33\x66','\x45\x72\x6c\x7a\x6f','\u202b\x34\x30','\x76\x76\x69\x70\x63\x6c\x75\x62\x5f\x64\x69\x73\x74\x72\x69\x62\x75\x74\x65\x42\x65\x61\x6e\x5f\x73\x74\x61\x72\x74\x41\x73\x73\x69\x73\x74','\u202b\x34\x32','\x6d\x61\x70','\u202e\x34\x33','\x68\x6f\x4f\x59','\u202e\x34\x34','\x72\x41\x4b\x67','\u202e\x34\x35','\u202e\x34\x36','\x4b\x65\x50\x44\x62','\u202b\x34\x37','\u202e\x34\x38','\x75\x58\x79\x52\x69','\u202e\x34\x39','\x43\x72\x79\x70\x74\x6f\x4a\x53','\u202e\x34\x61','\u202b\x34\x62','\x25\x50\x45\x47','\u202b\x34\x63','\u202b\x34\x64','\u202b\x34\x65','\u202b\x34\x66','\u202b\x35\x30','\u202b\x35\x31','\u202b\x35\x32','\u202b\x35\x33','\x6f\x56\x65\x71\x7a','\u202b\x35\x34','\u202b\x35\x35','\u202b\x35\x36','\u202e\x35\x37','\x6f\x32\x5f\x61\x63\x74','\x63\x6c\x69\x65\x6e\x74','\u202b\x35\x38','\u202b\x35\x39','\u202e\x35\x61','\u202e\x35\x62','\x33\x4c\x31\x5e','\x6a\x6f\x69\x6e','\u202b\x35\x63','\u202e\x35\x64','\x33\x2e\x31','\u202e\x35\x65','\x47\x5e\x4b\x67','\x79\x79\x79\x79\x2d\x4d\x4d\x2d\x64\x64','\u202e\x35\x66','\u202b\x36\x30','\x54\x5a\x72\x6a\x51','\u202e\x36\x31','\u202e\x36\x32','\x37\x4a\x64\x49','\u202b\x36\x33','\x46\x4d\x69\x46\x4f','\u202b\x36\x34','\u202e\x36\x35','\u202b\x36\x36','\x74\x6f\x53\x74\x72','\u202e\x36\x37','\u202e\x36\x38','\u202e\x36\x39','\x57\x4a\x75\x4f\x42','\u202e\x36\x61','\x66\x75\x6e\x63\x74\x69\x6f\x6e\x49\x64','\x70\x7a\x43\x56\x5a','\u202b\x36\x62','\u202e\x36\x63','\u202e\x36\x64','\x67\x39\x7a\x69','\u202e\x36\x65','\x68\x72\x52\x71\x47','\u202b\x36\x66','\u202e\x37\x30','\u202e\x37\x31','\x6a\x46\x41\x75','\u202b\x37\x32','\u202e\x37\x33','\u202b\x37\x34','\x43\x55\x78\x44\x45','\u202b\x37\x35','\u202e\x37\x36','\u202e\x37\x37','\x57\x63\x57\x45','\u202b\x37\x38','\x48\x6d\x61\x63\x53\x48\x41\x32\x35\x36','\u202e\x37\x39','\u202e\x37\x61','\u202b\x37\x62','\u202b\x37\x63','\u202e\x37\x64','\u202e\x37\x65','\u202e\x37\x66','\x74\x6f\x6b\x65\x6e','\x48\x79\x70\x62\x53','\u202e\x38\x30','\x6a\x77\x63\x54\x45','\u202b\x38\x31','\u202b\x38\x32','\u202b\x38\x33','\x67\x65\x74\x44\x61\x74\x65','\u202e\x38\x34','\u202b\x38\x35','\u202b\x38\x36','\u202e\x38\x37','\u202e\x38\x38','\u202e\x38\x39','\u202b\x38\x61','\u202e\x38\x62','\x67\x65\x74\x4d\x6f\x6e\x74\x68','\u202e\x38\x63','\x74\x65\x73\x74','\u202e\x38\x64','\u202e\x38\x65','\x71\x58\x6a\x64','\u202b\x38\x66','\x73\x75\x62\x73\x74\x72','\u202b\x39\x30','\x6b\x65\x79\x73','\u202e\x39\x31','\u202e\x39\x32','\u202b\x39\x33','\u202e\x39\x34','\u202b\x39\x35','\u202e\x39\x36','\x55\x6a\x50\x58\x73\x6a\x69\x4a\x58\x61\x6d\x69\x2e\x51\x47\x63\x68\x6f\x4e\x6d\x4f\x2e\x54\x76\x36\x58\x70\x6c\x62\x4b\x55\x3d\x3d'];function _0x5a05(_0x2d8f05,_0x4b81bb){_0x2d8f05=~~'0x'['concat'](_0x2d8f05['slice'](0x0));var _0x34a12b=_0x1e35[_0x2d8f05];return _0x34a12b;};(function(_0x36c6a6,_0x33748d){var _0x3e4c21=0x0;for(_0x33748d=_0x36c6a6['shift'](_0x3e4c21>>0x2);_0x33748d&&_0x33748d!==(_0x36c6a6['pop'](_0x3e4c21>>0x3)+'')['replace'](/[UPXJXQGhNOTXplbKU=]/g,'');_0x3e4c21++){_0x3e4c21=_0x3e4c21^0xde1ff;}}(_0x1e35,_0x5a05));var _0xode=_0x5a05('0'),_0xode_=[_0x5a05('1')],_0x3e5c=[_0xode,_0x5a05('2'),_0x5a05('3'),_0x5a05('4'),_0x5a05('5'),_0x5a05('6'),_0x5a05('7'),_0x5a05('8'),_0x5a05('9'),_0x5a05('a'),_0x5a05('b'),_0x5a05('c'),_0x5a05('d'),_0x5a05('e'),_0x5a05('f'),_0x5a05('10'),_0x5a05('11'),_0x5a05('12'),_0x5a05('13'),_0x5a05('14'),_0x5a05('15'),_0x5a05('16'),_0x5a05('17'),_0x5a05('18'),_0x5a05('19'),_0x5a05('1a'),_0x5a05('1b'),_0x5a05('1c'),_0x5a05('1d'),_0x5a05('1e'),_0x5a05('1f'),_0x5a05('20'),_0x5a05('21'),_0x5a05('22'),_0x5a05('23'),_0x5a05('24'),_0x5a05('25'),_0x5a05('26'),_0x5a05('27'),_0x5a05('28'),_0x5a05('29'),_0x5a05('2a'),_0x5a05('2b'),_0x5a05('2c'),_0x5a05('2d'),_0x5a05('2e'),_0x5a05('2f'),_0x5a05('30'),_0x5a05('31'),_0x5a05('32'),_0x5a05('33'),_0x5a05('34'),_0x5a05('35'),_0x5a05('36'),_0x5a05('37'),_0x5a05('38'),_0x5a05('39'),_0x5a05('3a'),_0x5a05('3b'),_0x5a05('3c'),_0x5a05('3d'),_0x5a05('3e'),_0x5a05('3f'),_0x5a05('40'),_0x5a05('41'),_0x5a05('42'),_0x5a05('43'),_0x5a05('44'),_0x5a05('45'),_0x5a05('46'),_0x5a05('47'),_0x5a05('48'),_0x5a05('49'),_0x5a05('4a'),_0x5a05('4b'),_0x5a05('4c'),_0x5a05('4d'),_0x5a05('4e'),_0x5a05('4f'),_0x5a05('50'),_0x5a05('51'),_0x5a05('52'),_0x5a05('53'),_0x5a05('54'),_0x5a05('55'),_0x5a05('56'),_0x5a05('57'),_0x5a05('58'),_0x5a05('59'),_0x5a05('5a'),_0x5a05('5b'),_0x5a05('5c'),_0x5a05('5d'),_0x5a05('5e'),_0x5a05('5f'),_0x5a05('60'),_0x5a05('61'),_0x5a05('62'),_0x5a05('63'),_0x5a05('64'),_0x5a05('65'),_0x5a05('66'),_0x5a05('67'),_0x5a05('68'),_0x5a05('69'),_0x5a05('6a'),_0x5a05('6b'),_0x5a05('6c'),_0x5a05('6d'),_0x5a05('6e'),_0x5a05('6f'),_0x5a05('70'),_0x5a05('71'),_0x5a05('72'),_0x5a05('73'),_0x5a05('74'),_0x5a05('75'),_0x5a05('76'),_0x5a05('77'),_0x5a05('78'),_0x5a05('79'),_0x5a05('7a'),_0x5a05('7b'),_0x5a05('7c'),_0x5a05('7d'),_0x5a05('7e'),_0x5a05('7f'),_0x5a05('80'),_0x5a05('81'),_0x5a05('82'),_0x5a05('83'),_0x5a05('84'),_0x5a05('85'),_0x5a05('86'),_0x5a05('87'),_0x5a05('88'),_0x5a05('89'),_0x5a05('8a'),_0x5a05('8b'),_0x5a05('8c'),_0x5a05('8d'),_0x5a05('8e'),_0x5a05('8f'),_0x5a05('90'),_0x5a05('91'),_0x5a05('92'),_0x5a05('93'),_0x5a05('94'),_0x5a05('95'),_0x5a05('96'),_0x5a05('97'),_0x5a05('98'),_0x5a05('99')];if(function(_0x3e99cd,_0xe328b1,_0x5212ff){function _0x1baa15(_0x1922b4,_0x2b772f,_0x18667c,_0x1e3dbf,_0x53002a,_0x2d4285){_0x2b772f=_0x2b772f>>0x8,_0x53002a='\x70\x6f';var _0x242713=_0x5a05('9a'),_0xf612e6=_0x5a05('9b'),_0x2d4285='\u202e';if(_0x2b772f<_0x1922b4){while(--_0x1922b4){_0x1e3dbf=_0x3e99cd[_0x242713]();if(_0x2b772f===_0x1922b4&&_0x2d4285==='\u202e'&&_0x2d4285[_0x5a05('9c')]===0x1){_0x2b772f=_0x1e3dbf,_0x18667c=_0x3e99cd[_0x53002a+'\x70']();}else if(_0x2b772f&&_0x18667c[_0x5a05('9d')](/[rAykqlwTCTYSrWdy=]/g,'')===_0x2b772f){_0x3e99cd[_0xf612e6](_0x1e3dbf);}}_0x3e99cd[_0xf612e6](_0x3e99cd[_0x242713]());}return 0xced86;};return _0x1baa15(++_0xe328b1,_0x5212ff)>>_0xe328b1^_0x5212ff;}(_0x3e5c,0x1bd,0x1bd00),_0x3e5c){_0xode_=_0x3e5c[_0x5a05('9c')]^0x1bd;};function _0x5722(_0x1f5bee,_0x1035dc){_0x1f5bee=~~'\x30\x78'[_0x5a05('9e')](_0x1f5bee[_0x5a05('9f')](0x1));var _0x3be298=_0x3e5c[_0x1f5bee];if(_0x5722[_0x5a05('a0')]===undefined){(function(){var _0x2ea47f=typeof window!==_0x5a05('a1')?window:typeof process===_0x5a05('a2')&&typeof require===_0x5a05('a3')&&typeof global===_0x5a05('a2')?global:this;var _0x1234e1=_0x5a05('a4');_0x2ea47f[_0x5a05('a5')]||(_0x2ea47f[_0x5a05('a5')]=function(_0x7b4e67){var _0x53cda2=String(_0x7b4e67)[_0x5a05('9d')](/=+$/,'');for(var _0x334dff=0x0,_0x7325e8,_0x58523e,_0x4b0855=0x0,_0x3f8522='';_0x58523e=_0x53cda2[_0x5a05('a6')](_0x4b0855++);~_0x58523e&&(_0x7325e8=_0x334dff%0x4?_0x7325e8*0x40+_0x58523e:_0x58523e,_0x334dff++%0x4)?_0x3f8522+=String[_0x5a05('a7')](0xff&_0x7325e8>>(-0x2*_0x334dff&0x6)):0x0){_0x58523e=_0x1234e1[_0x5a05('a8')](_0x58523e);}return _0x3f8522;});}());function _0x36e28b(_0x35c8ff,_0x1035dc){var _0x46ac4f=[],_0x5e85b9=0x0,_0x3993b5,_0x5a8881='',_0x493066='';_0x35c8ff=atob(_0x35c8ff);for(var _0x39c5b8=0x0,_0x403f54=_0x35c8ff[_0x5a05('9c')];_0x39c5b8<_0x403f54;_0x39c5b8++){_0x493066+='\x25'+('\x30\x30'+_0x35c8ff[_0x5a05('a9')](_0x39c5b8)[_0x5a05('aa')](0x10))[_0x5a05('9f')](-0x2);}_0x35c8ff=decodeURIComponent(_0x493066);for(var _0x40fc68=0x0;_0x40fc68<0x100;_0x40fc68++){_0x46ac4f[_0x40fc68]=_0x40fc68;}for(_0x40fc68=0x0;_0x40fc68<0x100;_0x40fc68++){_0x5e85b9=(_0x5e85b9+_0x46ac4f[_0x40fc68]+_0x1035dc[_0x5a05('a9')](_0x40fc68%_0x1035dc[_0x5a05('9c')]))%0x100;_0x3993b5=_0x46ac4f[_0x40fc68];_0x46ac4f[_0x40fc68]=_0x46ac4f[_0x5e85b9];_0x46ac4f[_0x5e85b9]=_0x3993b5;}_0x40fc68=0x0;_0x5e85b9=0x0;for(var _0x4e09b7=0x0;_0x4e09b7<_0x35c8ff[_0x5a05('9c')];_0x4e09b7++){_0x40fc68=(_0x40fc68+0x1)%0x100;_0x5e85b9=(_0x5e85b9+_0x46ac4f[_0x40fc68])%0x100;_0x3993b5=_0x46ac4f[_0x40fc68];_0x46ac4f[_0x40fc68]=_0x46ac4f[_0x5e85b9];_0x46ac4f[_0x5e85b9]=_0x3993b5;_0x5a8881+=String[_0x5a05('a7')](_0x35c8ff[_0x5a05('a9')](_0x4e09b7)^_0x46ac4f[(_0x46ac4f[_0x40fc68]+_0x46ac4f[_0x5e85b9])%0x100]);}return _0x5a8881;}_0x5722[_0x5a05('ab')]=_0x36e28b;_0x5722[_0x5a05('ac')]={};_0x5722[_0x5a05('a0')]=!![];}var _0x4c1127=_0x5722[_0x5a05('ac')][_0x1f5bee];if(_0x4c1127===undefined){if(_0x5722[_0x5a05('ad')]===undefined){_0x5722[_0x5a05('ad')]=!![];}_0x3be298=_0x5722[_0x5a05('ab')](_0x3be298,_0x1035dc);_0x5722[_0x5a05('ac')][_0x1f5bee]=_0x3be298;}else{_0x3be298=_0x4c1127;}return _0x3be298;};async function requestAlgo(){var _0x314145={'fqadZ':function(_0xb70a51,_0x4c6837){return _0xb70a51!==_0x4c6837;},'DbgUc':_0x5722('\u202e\x30',_0x5a05('ae')),'FkuqW':function(_0x3e787d){return _0x3e787d();},'sjDWg':_0x5722('\u202b\x31',_0x5a05('af')),'XFTCM':function(_0x491184,_0xe228a5){return _0x491184|_0xe228a5;},'HAWAS':function(_0x44f516,_0x511567){return _0x44f516(_0x511567);},'xchEp':function(_0x3d8ae3,_0x255313){return _0x3d8ae3==_0x255313;},'YSvzm':function(_0x51934b,_0x1a5cec){return _0x51934b<_0x1a5cec;},'ZFgha':function(_0xfb72b2,_0x5921b9){return _0xfb72b2+_0x5921b9;},'WtFpg':function(_0x3d1dbb,_0x5843ba){return _0x3d1dbb-_0x5843ba;},'quvkT':function(_0x1d87f9,_0x187735){return _0x1d87f9+_0x187735;},'ENWZQ':_0x5722('\u202e\x32',_0x5a05('b0')),'uMQCR':_0x5722('\u202e\x33',_0x5a05('b1')),'QVGNU':_0x5722('\u202e\x34',_0x5a05('b2')),'wcqNh':_0x5722('\u202b\x35',_0x5a05('b3'))};var _0x1579b9='',_0x4d46bc=_0x5722('\u202b\x36',_0x5a05('b4')),_0x427dcf=_0x4d46bc,_0x32f4be=_0x314145[_0x5a05('b5')](Math[_0x5a05('b6')]()*0xa,0x0);do{ss=_0x314145[_0x5a05('b7')](getRandomIDPro,{'size':0x1,'customDict':_0x4d46bc})+'';if(_0x314145[_0x5722('\u202b\x37',_0x5a05('b8'))](_0x1579b9[_0x5722('\u202b\x38',_0x5a05('b8'))](ss),-0x1))_0x1579b9+=ss;}while(_0x314145[_0x5722('\u202b\x39',_0x5a05('b9'))](_0x1579b9[_0x5722('\u202e\x61',_0x5a05('ba'))],0x3));for(let _0xb70620 of _0x1579b9[_0x5722('\u202e\x62',_0x5a05('bb'))]())_0x427dcf=_0x427dcf[_0x5722('\u202b\x63',_0x5a05('bc'))](_0xb70620,'');$['\x66\x70']=_0x314145[_0x5722('\u202e\x64',_0x5a05('bd'))](_0x314145[_0x5722('\u202e\x65',_0x5a05('be'))](getRandomIDPro({'size':_0x32f4be,'customDict':_0x427dcf}),''),_0x1579b9)+_0x314145[_0x5a05('b7')](getRandomIDPro,{'size':_0x314145[_0x5722('\u202e\x66',_0x5a05('bf'))](_0x314145[_0x5a05('c0')](0xe,_0x314145[_0x5a05('c1')](_0x32f4be,0x3)),0x1),'customDict':_0x427dcf})+_0x32f4be+'';$['\x66\x70']=_0x314145[_0x5722(_0x5a05('c2'),_0x5a05('c3'))];let _0x14fe7f={'url':_0x5722(_0x5a05('c4'),_0x5a05('c5')),'headers':{'Accept':_0x5a05('c6'),'Content-Type':_0x314145[_0x5722(_0x5a05('c7'),_0x5a05('c8'))],'Accept-Encoding':_0x314145[_0x5a05('c9')],'Accept-Language':_0x5722(_0x5a05('ca'),_0x5a05('bd')),'host':_0x5a05('cb'),'Referer':_0x5a05('cc'),'User-Agent':_0x5a05('cd')},'body':_0x5a05('ce')+getRandomIDPro()+_0x5a05('cf')+Date[_0x5a05('d0')]()+_0x5a05('d1')};return new Promise(async _0x17ecd3=>{if(_0x5722(_0x5a05('d2'),_0x5a05('b8'))===_0x314145[_0x5722(_0x5a05('d3'),_0x5a05('b1'))]){t=new Date(time);}else{$[_0x5722(_0x5a05('d4'),_0x5a05('d5'))](_0x14fe7f,(_0x447a2b,_0x223e08,_0x45e86e)=>{try{const {ret,msg,data:{result}={}}=JSON[_0x5a05('d6')](_0x45e86e);$[_0x5722(_0x5a05('d7'),_0x5a05('d8'))]=result['\x74\x6b'];$[_0x5722(_0x5a05('d9'),_0x5a05('da'))]=new Function(_0x5722(_0x5a05('db'),_0x5a05('bc'))+result[_0x5722(_0x5a05('dc'),_0x5a05('dd'))])();}catch(_0x5b9467){if(_0x314145[_0x5a05('de')](_0x314145[_0x5a05('df')],_0x314145[_0x5722(_0x5a05('e0'),_0x5a05('ae'))])){$[_0x5a05('e1')](_0x5b9467,_0x223e08);}else{$[_0x5722(_0x5a05('e2'),_0x5a05('e3'))](_0x5b9467,_0x223e08);}}finally{_0x314145[_0x5a05('e4')](_0x17ecd3);}});}});}function getRandomIDPro(){var _0x40e5fc={'BCJdQ':function(_0x398fac,_0x6c0221){return _0x398fac===_0x6c0221;},'oyejR':function(_0x1d69ce,_0x37072){return _0x1d69ce===_0x37072;},'SWYwd':_0x5722(_0x5a05('e5'),_0x5a05('af')),'rWvqc':function(_0x1e2206,_0x984c23){return _0x1e2206==_0x984c23;},'MLeIJ':_0x5722(_0x5a05('e6'),_0x5a05('e7')),'CQvOV':_0x5722(_0x5a05('e8'),_0x5a05('da')),'BJGKQ':_0x5722(_0x5a05('e9'),_0x5a05('ea')),'oqzRd':_0x5722(_0x5a05('eb'),_0x5a05('ec')),'wkDiu':function(_0xebb5c8,_0x47d5d7){return _0xebb5c8|_0x47d5d7;},'csBpl':function(_0x971a23,_0x375fc9){return _0x971a23*_0x375fc9;}};var _0x2e3421,_0x57727e,_0x32cb04=_0x40e5fc[_0x5a05('ed')](void 0x0,_0x4ed662=(_0x57727e=0x0<arguments[_0x5a05('9c')]&&void 0x0!==arguments[0x0]?arguments[0x0]:{})[_0x5722(_0x5a05('ee'),_0x5a05('bd'))])?0xa:_0x4ed662,_0x4ed662=_0x40e5fc[_0x5a05('ef')](void 0x0,_0x4ed662=_0x57727e[_0x5722(_0x5a05('f0'),_0x5a05('f1'))])?_0x40e5fc[_0x5722(_0x5a05('f2'),_0x5a05('f3'))]:_0x4ed662,_0x457d09='';if((_0x57727e=_0x57727e[_0x5722(_0x5a05('f4'),_0x5a05('ae'))])&&_0x40e5fc[_0x5a05('f5')](_0x40e5fc[_0x5722(_0x5a05('f6'),_0x5a05('ae'))],typeof _0x57727e))_0x2e3421=_0x57727e;else switch(_0x4ed662){case _0x40e5fc[_0x5a05('f7')]:_0x2e3421=_0x40e5fc[_0x5722(_0x5a05('f8'),_0x5a05('f9'))];break;case _0x40e5fc[_0x5722(_0x5a05('fa'),_0x5a05('fb'))]:_0x2e3421=_0x5a05('fc');break;case _0x40e5fc[_0x5a05('fd')]:default:_0x2e3421=_0x5722(_0x5a05('fe'),_0x5a05('af'));}for(;_0x32cb04--;)_0x457d09+=_0x2e3421[_0x40e5fc[_0x5722(_0x5a05('ff'),_0x5a05('100'))](_0x40e5fc[_0x5722(_0x5a05('101'),_0x5a05('d8'))](Math[_0x5722(_0x5a05('102'),_0x5a05('b0'))](),_0x2e3421[_0x5722(_0x5a05('103'),_0x5a05('da'))]),0x0)];return _0x457d09;}function h5stSign(_0x3f0a71){var _0x44bf2b={'BUaSH':function(_0x290eae,_0x25d9a4){return _0x290eae+_0x25d9a4;},'igcni':_0x5a05('104'),'oDUzA':_0x5722(_0x5a05('105'),_0x5a05('ba')),'IflDx':_0x5722(_0x5a05('106'),_0x5a05('107')),'ILMgj':_0x5a05('108'),'dziYL':_0x5722(_0x5a05('109'),_0x5a05('ba')),'HOTGG':_0x5a05('10a'),'Erlzo':_0x5722(_0x5a05('10b'),_0x5a05('100')),'UAmWZ':_0x5a05('10c'),'Empfp':_0x5722(_0x5a05('10d'),_0x5a05('f3')),'KePDb':_0x5a05('10e'),'uXyRi':_0x5722(_0x5a05('10f'),_0x5a05('f1')),'oVeqz':_0x5722(_0x5a05('110'),_0x5a05('111')),'UPJKd':function(_0x435a1b,_0x535131){return _0x435a1b(_0x535131);}};let _0x5e8b4c=[{'key':_0x44bf2b[_0x5722(_0x5a05('112'),_0x5a05('113'))],'value':_0x5a05('114')},{'key':_0x44bf2b[_0x5722(_0x5a05('115'),_0x5a05('116'))],'value':$[_0x5722(_0x5a05('117'),_0x5a05('118'))][_0x5a05('119')]($[_0x5722(_0x5a05('11a'),_0x5a05('11b'))](_0x3f0a71,_0x3f0a71))[_0x5722(_0x5a05('11c'),_0x5a05('bf'))]()},{'key':_0x44bf2b[_0x5a05('11d')],'value':_0x5a05('11e')},{'key':_0x44bf2b[_0x5722(_0x5a05('11f'),_0x5a05('b2'))],'value':_0x44bf2b[_0x5a05('120')]},{'key':_0x5722(_0x5a05('121'),_0x5a05('b4')),'value':_0x5a05('122')},{'key':'\x74','value':Date[_0x5722(_0x5a05('123'),_0x5a05('d5'))]()}];let _0x3dd197=_0x5e8b4c[_0x5a05('124')](function(_0x1a1873){return _0x44bf2b[_0x5722(_0x5a05('125'),_0x5a05('126'))](_0x1a1873[_0x5722(_0x5a05('127'),_0x5a05('128'))],'\x3a')+_0x1a1873[_0x44bf2b[_0x5722(_0x5a05('129'),_0x5a05('b8'))]];})[_0x44bf2b[_0x5722(_0x5a05('12a'),_0x5a05('e3'))]]('\x26');let _0x1ff436=Date[_0x5a05('d0')]();let _0x3773de='';let _0x6ad274=format(_0x44bf2b[_0x5a05('12b')],_0x1ff436);_0x3773de=$[_0x5722(_0x5a05('12c'),_0x5a05('bd'))]($[_0x5722(_0x5a05('12d'),_0x5a05('11b'))],$['\x66\x70'][_0x5a05('aa')](),_0x6ad274[_0x5a05('aa')](),_0x44bf2b[_0x5a05('12e')][_0x5722(_0x5a05('12f'),_0x5a05('d5'))](),$[_0x5a05('130')])[_0x5722(_0x5a05('131'),_0x5a05('107'))]();const _0x10f4ca=$[_0x5a05('130')][_0x5722(_0x5a05('132'),_0x5a05('133'))](_0x3dd197,_0x3773de[_0x5722(_0x5a05('134'),_0x5a05('ec'))]())[_0x5722(_0x5a05('135'),_0x5a05('af'))]();let _0x2491fe=[''[_0x5a05('9e')](_0x6ad274[_0x5a05('aa')]()),''[_0x5a05('9e')]($['\x66\x70'][_0x5722(_0x5a05('136'),_0x5a05('b3'))]()),''[_0x5722(_0x5a05('137'),_0x5a05('c8'))](_0x5722(_0x5a05('138'),_0x5a05('bf'))[_0x5722(_0x5a05('131'),_0x5a05('107'))]()),''[_0x5722(_0x5a05('139'),_0x5a05('f9'))]($[_0x5722(_0x5a05('13a'),_0x5a05('100'))]),''[_0x5722(_0x5a05('13b'),_0x5a05('ba'))](_0x10f4ca),_0x44bf2b[_0x5a05('13c')],''[_0x5722(_0x5a05('13d'),_0x5a05('ea'))](_0x1ff436)][_0x5722(_0x5a05('13e'),_0x5a05('107'))]('\x3b');return _0x44bf2b[_0x5722(_0x5a05('13f'),_0x5a05('e7'))](encodeURIComponent,_0x2491fe);}function format(_0x30b41f,_0x489bac){var _0x1535a3={'jSqbf':_0x5a05('104'),'FMiFO':_0x5722(_0x5a05('140'),_0x5a05('c8')),'QjVOk':_0x5a05('141'),'EJPor':_0x5a05('142'),'izXfL':_0x5722(_0x5a05('143'),_0x5a05('e3')),'WJuOB':_0x5722(_0x5a05('144'),_0x5a05('116')),'qgyfB':_0x5722(_0x5a05('145'),_0x5a05('fb')),'pzCVZ':_0x5722(_0x5a05('146'),_0x5a05('147')),'xuhmB':_0x5a05('148'),'FBgxZ':function(_0x308a26,_0x5d7018,_0x3356fd){return _0x308a26(_0x5d7018,_0x3356fd);},'TrKqJ':_0x5722(_0x5a05('149'),_0x5a05('107')),'CUxDE':_0x5722(_0x5a05('14a'),_0x5a05('ea')),'HypbS':_0x5a05('14b'),'jwcTE':function(_0x333379,_0x4800a8){return _0x333379(_0x4800a8);},'VpVYR':_0x5722(_0x5a05('14c'),_0x5a05('14d')),'gjXDz':_0x5a05('14e'),'TZrjQ':_0x5722(_0x5a05('14f'),_0x5a05('b8')),'tmHfr':function(_0x2ba606,_0x551b5e){return _0x2ba606+_0x551b5e;},'ASEco':function(_0x56003d,_0x393cb7){return _0x56003d/_0x393cb7;}};if(!_0x30b41f)_0x30b41f=_0x1535a3[_0x5722(_0x5a05('150'),_0x5a05('fb'))];var _0x208998;if(!_0x489bac){if(_0x1535a3[_0x5a05('151')]!==_0x1535a3[_0x5722(_0x5a05('152'),_0x5a05('11b'))]){var _0x3b1309={'TWBAl':function(_0x3cb1d2,_0x2b0b79){return _0x3cb1d2+_0x2b0b79;},'LKSSH':_0x5722(_0x5a05('153'),_0x5a05('154')),'hrRqG':_0x1535a3[_0x5722(_0x5a05('155'),_0x5a05('100'))]};let _0x41d9d1=[{'key':_0x1535a3[_0x5a05('156')],'value':_0x1535a3[_0x5722(_0x5a05('157'),_0x5a05('dd'))]},{'key':_0x5722(_0x5a05('158'),_0x5a05('128')),'value':$[_0x5a05('130')][_0x5722(_0x5a05('159'),_0x5a05('c3'))]($[_0x5a05('15a')](body,body))[_0x5722(_0x5a05('15b'),_0x5a05('f1'))]()},{'key':_0x1535a3[_0x5722(_0x5a05('15c'),_0x5a05('dd'))],'value':_0x1535a3[_0x5722(_0x5a05('15d'),_0x5a05('ea'))]},{'key':_0x1535a3[_0x5a05('15e')],'value':_0x1535a3[_0x5722(_0x5a05('15f'),_0x5a05('b0'))]},{'key':_0x5a05('160'),'value':_0x1535a3[_0x5a05('161')]},{'key':'\x74','value':Date[_0x5a05('d0')]()}];let _0x7b9e26=_0x41d9d1[_0x5722(_0x5a05('162'),_0x5a05('b8'))](function(_0xb7c078){return _0x3b1309[_0x5722(_0x5a05('163'),_0x5a05('dd'))](_0x3b1309[_0x5722(_0x5a05('164'),_0x5a05('165'))](_0xb7c078[_0x3b1309[_0x5722(_0x5a05('166'),_0x5a05('b1'))]],'\x3a'),_0xb7c078[_0x3b1309[_0x5a05('167')]]);})[_0x1535a3[_0x5722(_0x5a05('168'),_0x5a05('ea'))]]('\x26');let _0xfb4479=Date[_0x5a05('d0')]();let _0x48cfb7='';let _0x2b7852=_0x1535a3[_0x5722(_0x5a05('169'),_0x5a05('f3'))](format,_0x1535a3[_0x5722(_0x5a05('16a'),_0x5a05('16b'))],_0xfb4479);_0x48cfb7=$[_0x5722(_0x5a05('16c'),_0x5a05('e7'))]($[_0x5722(_0x5a05('16d'),_0x5a05('111'))],$['\x66\x70'][_0x5a05('aa')](),_0x2b7852[_0x5722(_0x5a05('16e'),_0x5a05('dd'))](),_0x1535a3[_0x5a05('16f')][_0x5722(_0x5a05('170'),_0x5a05('16b'))](),$[_0x5722(_0x5a05('171'),_0x5a05('f1'))])[_0x5722(_0x5a05('172'),_0x5a05('173'))]();const _0x4cfd78=$[_0x5722(_0x5a05('174'),_0x5a05('11b'))][_0x5a05('175')](_0x7b9e26,_0x48cfb7[_0x5722(_0x5a05('176'),_0x5a05('b8'))]())[_0x5722(_0x5a05('177'),_0x5a05('14d'))]();let _0x21b2db=[''[_0x5a05('9e')](_0x2b7852[_0x5722(_0x5a05('178'),_0x5a05('b0'))]()),''[_0x5722(_0x5a05('179'),_0x5a05('b8'))]($['\x66\x70'][_0x5722(_0x5a05('17a'),_0x5a05('ea'))]()),''[_0x5a05('9e')](_0x1535a3[_0x5722(_0x5a05('17b'),_0x5a05('c3'))][_0x5722(_0x5a05('17c'),_0x5a05('113'))]()),''[_0x5a05('9e')]($[_0x5a05('17d')]),''[_0x5a05('9e')](_0x4cfd78),_0x1535a3[_0x5a05('17e')],''[_0x5722(_0x5a05('17f'),_0x5a05('dd'))](_0xfb4479)][_0x5a05('148')]('\x3b');return _0x1535a3[_0x5a05('180')](encodeURIComponent,_0x21b2db);}else{_0x208998=Date[_0x5722(_0x5a05('181'),_0x5a05('ea'))]();}}else{_0x208998=new Date(_0x489bac);}var _0x17f7d6,_0x9daa49=new Date(_0x208998),_0x1d52cf=_0x30b41f,_0x16a94d={'M+':_0x1535a3[_0x5722(_0x5a05('182'),_0x5a05('165'))](_0x9daa49[_0x5722(_0x5a05('183'),_0x5a05('147'))](),0x1),'d+':_0x9daa49[_0x5a05('184')](),'D+':_0x9daa49[_0x5722(_0x5a05('185'),_0x5a05('e7'))](),'h+':_0x9daa49[_0x5722(_0x5a05('186'),_0x5a05('107'))](),'H+':_0x9daa49[_0x5722(_0x5a05('187'),_0x5a05('118'))](),'m+':_0x9daa49[_0x5722(_0x5a05('188'),_0x5a05('bb'))](),'s+':_0x9daa49[_0x5722(_0x5a05('189'),_0x5a05('ba'))](),'w+':_0x9daa49[_0x5722(_0x5a05('18a'),_0x5a05('e7'))](),'q+':Math[_0x5722(_0x5a05('18b'),_0x5a05('126'))](_0x1535a3[_0x5722(_0x5a05('18c'),_0x5a05('c8'))](_0x9daa49[_0x5a05('18d')]()+0x3,0x3)),'S+':_0x9daa49[_0x5722(_0x5a05('18e'),_0x5a05('14d'))]()};/(y+)/i[_0x5a05('18f')](_0x1d52cf)&&(_0x1d52cf=_0x1d52cf[_0x5722(_0x5a05('190'),_0x5a05('147'))](RegExp['\x24\x31'],''[_0x5722(_0x5a05('191'),_0x5a05('192'))](_0x9daa49[_0x5722(_0x5a05('193'),_0x5a05('c8'))]())[_0x5a05('194')](0x4-RegExp['\x24\x31'][_0x5722(_0x5a05('195'),_0x5a05('b8'))])));Object[_0x5a05('196')](_0x16a94d)[_0x5722(_0x5a05('197'),_0x5a05('da'))](_0x17f7d6=>{if(new RegExp('\x28'[_0x5722(_0x5a05('198'),_0x5a05('113'))](_0x17f7d6,'\x29'))[_0x5722(_0x5a05('199'),_0x5a05('113'))](_0x1d52cf)){var _0x208998,_0x30b41f='\x53\x2b'===_0x17f7d6?_0x1535a3[_0x5722(_0x5a05('19a'),_0x5a05('b2'))]:'\x30\x30';_0x1d52cf=_0x1d52cf[_0x5a05('9d')](RegExp['\x24\x31'],0x1==RegExp['\x24\x31'][_0x5a05('9c')]?_0x16a94d[_0x17f7d6]:''[_0x5a05('9e')](_0x30b41f)[_0x5a05('9e')](_0x16a94d[_0x17f7d6])[_0x5722(_0x5a05('19b'),_0x5a05('128'))](''[_0x5722(_0x5a05('19c'),_0x5a05('111'))](_0x16a94d[_0x17f7d6])[_0x5a05('9c')]));}});return _0x1d52cf;};_0xode=_0x5a05('0');;_0xodz='jsjiami.com.v6';


function CryptoScripts() {
    // prettier-ignore
    !function(t,e){"object"==typeof exports?module.exports=exports=e():"function"==typeof define&&define.amd?define([],e):t.CryptoJS=e()}(this,function(){var t,e,r,i,n,o,s,c,a,h,l,f,d,u,p,_,v,y,g,B,w,k,S,m,x,b,H,z,A,C,D,E,R,M,F,P,W,O,I,U,K,X,L,j,N,T,q,Z,V,G,J,$,Q,Y,tt,et,rt,it,nt,ot,st,ct,at,ht,lt,ft,dt,ut,pt,_t,vt,yt,gt,Bt,wt,kt,St,mt=mt||function(t){var e;if("undefined"!=typeof window&&window.crypto&&(e=window.crypto),!e&&"undefined"!=typeof window&&window.msCrypto&&(e=window.msCrypto),!e&&"undefined"!=typeof global&&global.crypto&&(e=global.crypto),!e&&"function"==typeof require)try{e=require("crypto")}catch(e){}function r(){if(e){if("function"==typeof e.getRandomValues)try{return e.getRandomValues(new Uint32Array(1))[0]}catch(t){}if("function"==typeof e.randomBytes)try{return e.randomBytes(4).readInt32LE()}catch(t){}}throw new Error("Native crypto module could not be used to get secure random number.")}var i=Object.create||function(t){var e;return n.prototype=t,e=new n,n.prototype=null,e};function n(){}var o={},s=o.lib={},c=s.Base={extend:function(t){var e=i(this);return t&&e.mixIn(t),e.hasOwnProperty("init")&&this.init!==e.init||(e.init=function(){e.$super.init.apply(this,arguments)}),(e.init.prototype=e).$super=this,e},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}},a=s.WordArray=c.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:4*t.length},toString:function(t){return(t||l).stringify(this)},concat:function(t){var e=this.words,r=t.words,i=this.sigBytes,n=t.sigBytes;if(this.clamp(),i%4)for(var o=0;o<n;o++){var s=r[o>>>2]>>>24-o%4*8&255;e[i+o>>>2]|=s<<24-(i+o)%4*8}else for(o=0;o<n;o+=4)e[i+o>>>2]=r[o>>>2];return this.sigBytes+=n,this},clamp:function(){var e=this.words,r=this.sigBytes;e[r>>>2]&=4294967295<<32-r%4*8,e.length=t.ceil(r/4)},clone:function(){var t=c.clone.call(this);return t.words=this.words.slice(0),t},random:function(t){for(var e=[],i=0;i<t;i+=4)e.push(r());return new a.init(e,t)}}),h=o.enc={},l=h.Hex={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;n<r;n++){var o=e[n>>>2]>>>24-n%4*8&255;i.push((o>>>4).toString(16)),i.push((15&o).toString(16))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i+=2)r[i>>>3]|=parseInt(t.substr(i,2),16)<<24-i%8*4;return new a.init(r,e/2)}},f=h.Latin1={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;n<r;n++){var o=e[n>>>2]>>>24-n%4*8&255;i.push(String.fromCharCode(o))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;i<e;i++)r[i>>>2]|=(255&t.charCodeAt(i))<<24-i%4*8;return new a.init(r,e)}},d=h.Utf8={stringify:function(t){try{return decodeURIComponent(escape(f.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return f.parse(unescape(encodeURIComponent(t)))}},u=s.BufferedBlockAlgorithm=c.extend({reset:function(){this._data=new a.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=d.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(e){var r,i=this._data,n=i.words,o=i.sigBytes,s=this.blockSize,c=o/(4*s),h=(c=e?t.ceil(c):t.max((0|c)-this._minBufferSize,0))*s,l=t.min(4*h,o);if(h){for(var f=0;f<h;f+=s)this._doProcessBlock(n,f);r=n.splice(0,h),i.sigBytes-=l}return new a.init(r,l)},clone:function(){var t=c.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),p=(s.Hasher=u.extend({cfg:c.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){u.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(t){return function(e,r){return new t.init(r).finalize(e)}},_createHmacHelper:function(t){return function(e,r){return new p.HMAC.init(t,r).finalize(e)}}}),o.algo={});return o}(Math);function xt(t,e,r){return t^e^r}function bt(t,e,r){return t&e|~t&r}function Ht(t,e,r){return(t|~e)^r}function zt(t,e,r){return t&r|e&~r}function At(t,e,r){return t^(e|~r)}function Ct(t,e){return t<<e|t>>>32-e}function Dt(t,e,r,i){var n,o=this._iv;o?(n=o.slice(0),this._iv=void 0):n=this._prevBlock,i.encryptBlock(n,0);for(var s=0;s<r;s++)t[e+s]^=n[s]}function Et(t){if(255==(t>>24&255)){var e=t>>16&255,r=t>>8&255,i=255&t;255===e?(e=0,255===r?(r=0,255===i?i=0:++i):++r):++e,t=0,t+=e<<16,t+=r<<8,t+=i}else t+=1<<24;return t}function Rt(){for(var t=this._X,e=this._C,r=0;r<8;r++)ft[r]=e[r];for(e[0]=e[0]+1295307597+this._b|0,e[1]=e[1]+3545052371+(e[0]>>>0<ft[0]>>>0?1:0)|0,e[2]=e[2]+886263092+(e[1]>>>0<ft[1]>>>0?1:0)|0,e[3]=e[3]+1295307597+(e[2]>>>0<ft[2]>>>0?1:0)|0,e[4]=e[4]+3545052371+(e[3]>>>0<ft[3]>>>0?1:0)|0,e[5]=e[5]+886263092+(e[4]>>>0<ft[4]>>>0?1:0)|0,e[6]=e[6]+1295307597+(e[5]>>>0<ft[5]>>>0?1:0)|0,e[7]=e[7]+3545052371+(e[6]>>>0<ft[6]>>>0?1:0)|0,this._b=e[7]>>>0<ft[7]>>>0?1:0,r=0;r<8;r++){var i=t[r]+e[r],n=65535&i,o=i>>>16,s=((n*n>>>17)+n*o>>>15)+o*o,c=((4294901760&i)*i|0)+((65535&i)*i|0);dt[r]=s^c}t[0]=dt[0]+(dt[7]<<16|dt[7]>>>16)+(dt[6]<<16|dt[6]>>>16)|0,t[1]=dt[1]+(dt[0]<<8|dt[0]>>>24)+dt[7]|0,t[2]=dt[2]+(dt[1]<<16|dt[1]>>>16)+(dt[0]<<16|dt[0]>>>16)|0,t[3]=dt[3]+(dt[2]<<8|dt[2]>>>24)+dt[1]|0,t[4]=dt[4]+(dt[3]<<16|dt[3]>>>16)+(dt[2]<<16|dt[2]>>>16)|0,t[5]=dt[5]+(dt[4]<<8|dt[4]>>>24)+dt[3]|0,t[6]=dt[6]+(dt[5]<<16|dt[5]>>>16)+(dt[4]<<16|dt[4]>>>16)|0,t[7]=dt[7]+(dt[6]<<8|dt[6]>>>24)+dt[5]|0}function Mt(){for(var t=this._X,e=this._C,r=0;r<8;r++)wt[r]=e[r];for(e[0]=e[0]+1295307597+this._b|0,e[1]=e[1]+3545052371+(e[0]>>>0<wt[0]>>>0?1:0)|0,e[2]=e[2]+886263092+(e[1]>>>0<wt[1]>>>0?1:0)|0,e[3]=e[3]+1295307597+(e[2]>>>0<wt[2]>>>0?1:0)|0,e[4]=e[4]+3545052371+(e[3]>>>0<wt[3]>>>0?1:0)|0,e[5]=e[5]+886263092+(e[4]>>>0<wt[4]>>>0?1:0)|0,e[6]=e[6]+1295307597+(e[5]>>>0<wt[5]>>>0?1:0)|0,e[7]=e[7]+3545052371+(e[6]>>>0<wt[6]>>>0?1:0)|0,this._b=e[7]>>>0<wt[7]>>>0?1:0,r=0;r<8;r++){var i=t[r]+e[r],n=65535&i,o=i>>>16,s=((n*n>>>17)+n*o>>>15)+o*o,c=((4294901760&i)*i|0)+((65535&i)*i|0);kt[r]=s^c}t[0]=kt[0]+(kt[7]<<16|kt[7]>>>16)+(kt[6]<<16|kt[6]>>>16)|0,t[1]=kt[1]+(kt[0]<<8|kt[0]>>>24)+kt[7]|0,t[2]=kt[2]+(kt[1]<<16|kt[1]>>>16)+(kt[0]<<16|kt[0]>>>16)|0,t[3]=kt[3]+(kt[2]<<8|kt[2]>>>24)+kt[1]|0,t[4]=kt[4]+(kt[3]<<16|kt[3]>>>16)+(kt[2]<<16|kt[2]>>>16)|0,t[5]=kt[5]+(kt[4]<<8|kt[4]>>>24)+kt[3]|0,t[6]=kt[6]+(kt[5]<<16|kt[5]>>>16)+(kt[4]<<16|kt[4]>>>16)|0,t[7]=kt[7]+(kt[6]<<8|kt[6]>>>24)+kt[5]|0}return t=mt.lib.WordArray,mt.enc.Base64={stringify:function(t){var e=t.words,r=t.sigBytes,i=this._map;t.clamp();for(var n=[],o=0;o<r;o+=3)for(var s=(e[o>>>2]>>>24-o%4*8&255)<<16|(e[o+1>>>2]>>>24-(o+1)%4*8&255)<<8|e[o+2>>>2]>>>24-(o+2)%4*8&255,c=0;c<4&&o+.75*c<r;c++)n.push(i.charAt(s>>>6*(3-c)&63));var a=i.charAt(64);if(a)for(;n.length%4;)n.push(a);return n.join("")},parse:function(e){var r=e.length,i=this._map,n=this._reverseMap;if(!n){n=this._reverseMap=[];for(var o=0;o<i.length;o++)n[i.charCodeAt(o)]=o}var s=i.charAt(64);if(s){var c=e.indexOf(s);-1!==c&&(r=c)}return function(e,r,i){for(var n=[],o=0,s=0;s<r;s++)if(s%4){var c=i[e.charCodeAt(s-1)]<<s%4*2|i[e.charCodeAt(s)]>>>6-s%4*2;n[o>>>2]|=c<<24-o%4*8,o++}return t.create(n,o)}(e,r,n)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="},function(t){var e=mt,r=e.lib,i=r.WordArray,n=r.Hasher,o=e.algo,s=[];!function(){for(var e=0;e<64;e++)s[e]=4294967296*t.abs(t.sin(e+1))|0}();var c=o.MD5=n.extend({_doReset:function(){this._hash=new i.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(t,e){for(var r=0;r<16;r++){var i=e+r,n=t[i];t[i]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8)}var o=this._hash.words,c=t[e+0],d=t[e+1],u=t[e+2],p=t[e+3],_=t[e+4],v=t[e+5],y=t[e+6],g=t[e+7],B=t[e+8],w=t[e+9],k=t[e+10],S=t[e+11],m=t[e+12],x=t[e+13],b=t[e+14],H=t[e+15],z=o[0],A=o[1],C=o[2],D=o[3];z=f(z=l(z=l(z=l(z=l(z=h(z=h(z=h(z=h(z=a(z=a(z=a(z=a(z,A,C,D,c,7,s[0]),A=a(A,C=a(C,D=a(D,z,A,C,d,12,s[1]),z,A,u,17,s[2]),D,z,p,22,s[3]),C,D,_,7,s[4]),A=a(A,C=a(C,D=a(D,z,A,C,v,12,s[5]),z,A,y,17,s[6]),D,z,g,22,s[7]),C,D,B,7,s[8]),A=a(A,C=a(C,D=a(D,z,A,C,w,12,s[9]),z,A,k,17,s[10]),D,z,S,22,s[11]),C,D,m,7,s[12]),A=a(A,C=a(C,D=a(D,z,A,C,x,12,s[13]),z,A,b,17,s[14]),D,z,H,22,s[15]),C,D,d,5,s[16]),A=h(A,C=h(C,D=h(D,z,A,C,y,9,s[17]),z,A,S,14,s[18]),D,z,c,20,s[19]),C,D,v,5,s[20]),A=h(A,C=h(C,D=h(D,z,A,C,k,9,s[21]),z,A,H,14,s[22]),D,z,_,20,s[23]),C,D,w,5,s[24]),A=h(A,C=h(C,D=h(D,z,A,C,b,9,s[25]),z,A,p,14,s[26]),D,z,B,20,s[27]),C,D,x,5,s[28]),A=h(A,C=h(C,D=h(D,z,A,C,u,9,s[29]),z,A,g,14,s[30]),D,z,m,20,s[31]),C,D,v,4,s[32]),A=l(A,C=l(C,D=l(D,z,A,C,B,11,s[33]),z,A,S,16,s[34]),D,z,b,23,s[35]),C,D,d,4,s[36]),A=l(A,C=l(C,D=l(D,z,A,C,_,11,s[37]),z,A,g,16,s[38]),D,z,k,23,s[39]),C,D,x,4,s[40]),A=l(A,C=l(C,D=l(D,z,A,C,c,11,s[41]),z,A,p,16,s[42]),D,z,y,23,s[43]),C,D,w,4,s[44]),A=l(A,C=l(C,D=l(D,z,A,C,m,11,s[45]),z,A,H,16,s[46]),D,z,u,23,s[47]),C,D,c,6,s[48]),A=f(A=f(A=f(A=f(A,C=f(C,D=f(D,z,A,C,g,10,s[49]),z,A,b,15,s[50]),D,z,v,21,s[51]),C=f(C,D=f(D,z=f(z,A,C,D,m,6,s[52]),A,C,p,10,s[53]),z,A,k,15,s[54]),D,z,d,21,s[55]),C=f(C,D=f(D,z=f(z,A,C,D,B,6,s[56]),A,C,H,10,s[57]),z,A,y,15,s[58]),D,z,x,21,s[59]),C=f(C,D=f(D,z=f(z,A,C,D,_,6,s[60]),A,C,S,10,s[61]),z,A,u,15,s[62]),D,z,w,21,s[63]),o[0]=o[0]+z|0,o[1]=o[1]+A|0,o[2]=o[2]+C|0,o[3]=o[3]+D|0},_doFinalize:function(){var e=this._data,r=e.words,i=8*this._nDataBytes,n=8*e.sigBytes;r[n>>>5]|=128<<24-n%32;var o=t.floor(i/4294967296),s=i;r[15+(64+n>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),r[14+(64+n>>>9<<4)]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),e.sigBytes=4*(r.length+1),this._process();for(var c=this._hash,a=c.words,h=0;h<4;h++){var l=a[h];a[h]=16711935&(l<<8|l>>>24)|4278255360&(l<<24|l>>>8)}return c},clone:function(){var t=n.clone.call(this);return t._hash=this._hash.clone(),t}});function a(t,e,r,i,n,o,s){var c=t+(e&r|~e&i)+n+s;return(c<<o|c>>>32-o)+e}function h(t,e,r,i,n,o,s){var c=t+(e&i|r&~i)+n+s;return(c<<o|c>>>32-o)+e}function l(t,e,r,i,n,o,s){var c=t+(e^r^i)+n+s;return(c<<o|c>>>32-o)+e}function f(t,e,r,i,n,o,s){var c=t+(r^(e|~i))+n+s;return(c<<o|c>>>32-o)+e}e.MD5=n._createHelper(c),e.HmacMD5=n._createHmacHelper(c)}(Math),r=(e=mt).lib,i=r.WordArray,n=r.Hasher,o=e.algo,s=[],c=o.SHA1=n.extend({_doReset:function(){this._hash=new i.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],n=r[1],o=r[2],c=r[3],a=r[4],h=0;h<80;h++){if(h<16)s[h]=0|t[e+h];else{var l=s[h-3]^s[h-8]^s[h-14]^s[h-16];s[h]=l<<1|l>>>31}var f=(i<<5|i>>>27)+a+s[h];f+=h<20?1518500249+(n&o|~n&c):h<40?1859775393+(n^o^c):h<60?(n&o|n&c|o&c)-1894007588:(n^o^c)-899497514,a=c,c=o,o=n<<30|n>>>2,n=i,i=f}r[0]=r[0]+i|0,r[1]=r[1]+n|0,r[2]=r[2]+o|0,r[3]=r[3]+c|0,r[4]=r[4]+a|0},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;return e[i>>>5]|=128<<24-i%32,e[14+(64+i>>>9<<4)]=Math.floor(r/4294967296),e[15+(64+i>>>9<<4)]=r,t.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=n.clone.call(this);return t._hash=this._hash.clone(),t}}),e.SHA1=n._createHelper(c),e.HmacSHA1=n._createHmacHelper(c),function(t){var e=mt,r=e.lib,i=r.WordArray,n=r.Hasher,o=e.algo,s=[],c=[];!function(){function e(e){for(var r=t.sqrt(e),i=2;i<=r;i++)if(!(e%i))return;return 1}function r(t){return 4294967296*(t-(0|t))|0}for(var i=2,n=0;n<64;)e(i)&&(n<8&&(s[n]=r(t.pow(i,.5))),c[n]=r(t.pow(i,1/3)),n++),i++}();var a=[],h=o.SHA256=n.extend({_doReset:function(){this._hash=new i.init(s.slice(0))},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],n=r[1],o=r[2],s=r[3],h=r[4],l=r[5],f=r[6],d=r[7],u=0;u<64;u++){if(u<16)a[u]=0|t[e+u];else{var p=a[u-15],_=(p<<25|p>>>7)^(p<<14|p>>>18)^p>>>3,v=a[u-2],y=(v<<15|v>>>17)^(v<<13|v>>>19)^v>>>10;a[u]=_+a[u-7]+y+a[u-16]}var g=i&n^i&o^n&o,B=(i<<30|i>>>2)^(i<<19|i>>>13)^(i<<10|i>>>22),w=d+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&l^~h&f)+c[u]+a[u];d=f,f=l,l=h,h=s+w|0,s=o,o=n,n=i,i=w+(B+g)|0}r[0]=r[0]+i|0,r[1]=r[1]+n|0,r[2]=r[2]+o|0,r[3]=r[3]+s|0,r[4]=r[4]+h|0,r[5]=r[5]+l|0,r[6]=r[6]+f|0,r[7]=r[7]+d|0},_doFinalize:function(){var e=this._data,r=e.words,i=8*this._nDataBytes,n=8*e.sigBytes;return r[n>>>5]|=128<<24-n%32,r[14+(64+n>>>9<<4)]=t.floor(i/4294967296),r[15+(64+n>>>9<<4)]=i,e.sigBytes=4*r.length,this._process(),this._hash},clone:function(){var t=n.clone.call(this);return t._hash=this._hash.clone(),t}});e.SHA256=n._createHelper(h),e.HmacSHA256=n._createHmacHelper(h)}(Math),function(){var t=mt.lib.WordArray,e=mt.enc;function r(t){return t<<8&4278255360|t>>>8&16711935}e.Utf16=e.Utf16BE={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;n<r;n+=2){var o=e[n>>>2]>>>16-n%4*8&65535;i.push(String.fromCharCode(o))}return i.join("")},parse:function(e){for(var r=e.length,i=[],n=0;n<r;n++)i[n>>>1]|=e.charCodeAt(n)<<16-n%2*16;return t.create(i,2*r)}},e.Utf16LE={stringify:function(t){for(var e=t.words,i=t.sigBytes,n=[],o=0;o<i;o+=2){var s=r(e[o>>>2]>>>16-o%4*8&65535);n.push(String.fromCharCode(s))}return n.join("")},parse:function(e){for(var i=e.length,n=[],o=0;o<i;o++)n[o>>>1]|=r(e.charCodeAt(o)<<16-o%2*16);return t.create(n,2*i)}}}(),function(){if("function"==typeof ArrayBuffer){var t=mt.lib.WordArray,e=t.init;(t.init=function(t){if(t instanceof ArrayBuffer&&(t=new Uint8Array(t)),(t instanceof Int8Array||"undefined"!=typeof Uint8ClampedArray&&t instanceof Uint8ClampedArray||t instanceof Int16Array||t instanceof Uint16Array||t instanceof Int32Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array)&&(t=new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),t instanceof Uint8Array){for(var r=t.byteLength,i=[],n=0;n<r;n++)i[n>>>2]|=t[n]<<24-n%4*8;e.call(this,i,r)}else e.apply(this,arguments)}).prototype=t}}(),Math,h=(a=mt).lib,l=h.WordArray,f=h.Hasher,d=a.algo,u=l.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]),p=l.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]),_=l.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]),v=l.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]),y=l.create([0,1518500249,1859775393,2400959708,2840853838]),g=l.create([1352829926,1548603684,1836072691,2053994217,0]),B=d.RIPEMD160=f.extend({_doReset:function(){this._hash=l.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var r=0;r<16;r++){var i=e+r,n=t[i];t[i]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8)}var o,s,c,a,h,l,f,d,B,w,k,S=this._hash.words,m=y.words,x=g.words,b=u.words,H=p.words,z=_.words,A=v.words;for(l=o=S[0],f=s=S[1],d=c=S[2],B=a=S[3],w=h=S[4],r=0;r<80;r+=1)k=o+t[e+b[r]]|0,k+=r<16?xt(s,c,a)+m[0]:r<32?bt(s,c,a)+m[1]:r<48?Ht(s,c,a)+m[2]:r<64?zt(s,c,a)+m[3]:At(s,c,a)+m[4],k=(k=Ct(k|=0,z[r]))+h|0,o=h,h=a,a=Ct(c,10),c=s,s=k,k=l+t[e+H[r]]|0,k+=r<16?At(f,d,B)+x[0]:r<32?zt(f,d,B)+x[1]:r<48?Ht(f,d,B)+x[2]:r<64?bt(f,d,B)+x[3]:xt(f,d,B)+x[4],k=(k=Ct(k|=0,A[r]))+w|0,l=w,w=B,B=Ct(d,10),d=f,f=k;k=S[1]+c+B|0,S[1]=S[2]+a+w|0,S[2]=S[3]+h+l|0,S[3]=S[4]+o+f|0,S[4]=S[0]+s+d|0,S[0]=k},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;e[i>>>5]|=128<<24-i%32,e[14+(64+i>>>9<<4)]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8),t.sigBytes=4*(e.length+1),this._process();for(var n=this._hash,o=n.words,s=0;s<5;s++){var c=o[s];o[s]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8)}return n},clone:function(){var t=f.clone.call(this);return t._hash=this._hash.clone(),t}}),a.RIPEMD160=f._createHelper(B),a.HmacRIPEMD160=f._createHmacHelper(B),w=mt.lib.Base,k=mt.enc.Utf8,mt.algo.HMAC=w.extend({init:function(t,e){t=this._hasher=new t.init,"string"==typeof e&&(e=k.parse(e));var r=t.blockSize,i=4*r;e.sigBytes>i&&(e=t.finalize(e)),e.clamp();for(var n=this._oKey=e.clone(),o=this._iKey=e.clone(),s=n.words,c=o.words,a=0;a<r;a++)s[a]^=1549556828,c[a]^=909522486;n.sigBytes=o.sigBytes=i,this.reset()},reset:function(){var t=this._hasher;t.reset(),t.update(this._iKey)},update:function(t){return this._hasher.update(t),this},finalize:function(t){var e=this._hasher,r=e.finalize(t);return e.reset(),e.finalize(this._oKey.clone().concat(r))}}),x=(m=(S=mt).lib).Base,b=m.WordArray,z=(H=S.algo).SHA1,A=H.HMAC,C=H.PBKDF2=x.extend({cfg:x.extend({keySize:4,hasher:z,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r=this.cfg,i=A.create(r.hasher,t),n=b.create(),o=b.create([1]),s=n.words,c=o.words,a=r.keySize,h=r.iterations;s.length<a;){var l=i.update(e).finalize(o);i.reset();for(var f=l.words,d=f.length,u=l,p=1;p<h;p++){u=i.finalize(u),i.reset();for(var _=u.words,v=0;v<d;v++)f[v]^=_[v]}n.concat(l),c[0]++}return n.sigBytes=4*a,n}}),S.PBKDF2=function(t,e,r){return C.create(r).compute(t,e)},R=(E=(D=mt).lib).Base,M=E.WordArray,P=(F=D.algo).MD5,W=F.EvpKDF=R.extend({cfg:R.extend({keySize:4,hasher:P,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r,i=this.cfg,n=i.hasher.create(),o=M.create(),s=o.words,c=i.keySize,a=i.iterations;s.length<c;){r&&n.update(r),r=n.update(t).finalize(e),n.reset();for(var h=1;h<a;h++)r=n.finalize(r),n.reset();o.concat(r)}return o.sigBytes=4*c,o}}),D.EvpKDF=function(t,e,r){return W.create(r).compute(t,e)},I=(O=mt).lib.WordArray,U=O.algo,K=U.SHA256,X=U.SHA224=K.extend({_doReset:function(){this._hash=new I.init([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])},_doFinalize:function(){var t=K._doFinalize.call(this);return t.sigBytes-=4,t}}),O.SHA224=K._createHelper(X),O.HmacSHA224=K._createHmacHelper(X),L=mt.lib,j=L.Base,N=L.WordArray,(T=mt.x64={}).Word=j.extend({init:function(t,e){this.high=t,this.low=e}}),T.WordArray=j.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:8*t.length},toX32:function(){for(var t=this.words,e=t.length,r=[],i=0;i<e;i++){var n=t[i];r.push(n.high),r.push(n.low)}return N.create(r,this.sigBytes)},clone:function(){for(var t=j.clone.call(this),e=t.words=this.words.slice(0),r=e.length,i=0;i<r;i++)e[i]=e[i].clone();return t}}),function(t){var e=mt,r=e.lib,i=r.WordArray,n=r.Hasher,o=e.x64.Word,s=e.algo,c=[],a=[],h=[];!function(){for(var t=1,e=0,r=0;r<24;r++){c[t+5*e]=(r+1)*(r+2)/2%64;var i=(2*t+3*e)%5;t=e%5,e=i}for(t=0;t<5;t++)for(e=0;e<5;e++)a[t+5*e]=e+(2*t+3*e)%5*5;for(var n=1,s=0;s<24;s++){for(var l=0,f=0,d=0;d<7;d++){if(1&n){var u=(1<<d)-1;u<32?f^=1<<u:l^=1<<u-32}128&n?n=n<<1^113:n<<=1}h[s]=o.create(l,f)}}();var l=[];!function(){for(var t=0;t<25;t++)l[t]=o.create()}();var f=s.SHA3=n.extend({cfg:n.cfg.extend({outputLength:512}),_doReset:function(){for(var t=this._state=[],e=0;e<25;e++)t[e]=new o.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(t,e){for(var r=this._state,i=this.blockSize/2,n=0;n<i;n++){var o=t[e+2*n],s=t[e+2*n+1];o=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),s=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),(A=r[n]).high^=s,A.low^=o}for(var f=0;f<24;f++){for(var d=0;d<5;d++){for(var u=0,p=0,_=0;_<5;_++)u^=(A=r[d+5*_]).high,p^=A.low;var v=l[d];v.high=u,v.low=p}for(d=0;d<5;d++){var y=l[(d+4)%5],g=l[(d+1)%5],B=g.high,w=g.low;for(u=y.high^(B<<1|w>>>31),p=y.low^(w<<1|B>>>31),_=0;_<5;_++)(A=r[d+5*_]).high^=u,A.low^=p}for(var k=1;k<25;k++){var S=(A=r[k]).high,m=A.low,x=c[k];p=x<32?(u=S<<x|m>>>32-x,m<<x|S>>>32-x):(u=m<<x-32|S>>>64-x,S<<x-32|m>>>64-x);var b=l[a[k]];b.high=u,b.low=p}var H=l[0],z=r[0];for(H.high=z.high,H.low=z.low,d=0;d<5;d++)for(_=0;_<5;_++){var A=r[k=d+5*_],C=l[k],D=l[(d+1)%5+5*_],E=l[(d+2)%5+5*_];A.high=C.high^~D.high&E.high,A.low=C.low^~D.low&E.low}A=r[0];var R=h[f];A.high^=R.high,A.low^=R.low}},_doFinalize:function(){var e=this._data,r=e.words,n=(this._nDataBytes,8*e.sigBytes),o=32*this.blockSize;r[n>>>5]|=1<<24-n%32,r[(t.ceil((1+n)/o)*o>>>5)-1]|=128,e.sigBytes=4*r.length,this._process();for(var s=this._state,c=this.cfg.outputLength/8,a=c/8,h=[],l=0;l<a;l++){var f=s[l],d=f.high,u=f.low;d=16711935&(d<<8|d>>>24)|4278255360&(d<<24|d>>>8),u=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8),h.push(u),h.push(d)}return new i.init(h,c)},clone:function(){for(var t=n.clone.call(this),e=t._state=this._state.slice(0),r=0;r<25;r++)e[r]=e[r].clone();return t}});e.SHA3=n._createHelper(f),e.HmacSHA3=n._createHmacHelper(f)}(Math),function(){var t=mt,e=t.lib.Hasher,r=t.x64,i=r.Word,n=r.WordArray,o=t.algo;function s(){return i.create.apply(i,arguments)}var c=[s(1116352408,3609767458),s(1899447441,602891725),s(3049323471,3964484399),s(3921009573,2173295548),s(961987163,4081628472),s(1508970993,3053834265),s(2453635748,2937671579),s(2870763221,3664609560),s(3624381080,2734883394),s(310598401,1164996542),s(607225278,1323610764),s(1426881987,3590304994),s(1925078388,4068182383),s(2162078206,991336113),s(2614888103,633803317),s(3248222580,3479774868),s(3835390401,2666613458),s(4022224774,944711139),s(264347078,2341262773),s(604807628,2007800933),s(770255983,1495990901),s(1249150122,1856431235),s(1555081692,3175218132),s(1996064986,2198950837),s(2554220882,3999719339),s(2821834349,766784016),s(2952996808,2566594879),s(3210313671,3203337956),s(3336571891,1034457026),s(3584528711,2466948901),s(113926993,3758326383),s(338241895,168717936),s(666307205,1188179964),s(773529912,1546045734),s(1294757372,1522805485),s(1396182291,2643833823),s(1695183700,2343527390),s(1986661051,1014477480),s(2177026350,1206759142),s(2456956037,344077627),s(2730485921,1290863460),s(2820302411,3158454273),s(3259730800,3505952657),s(3345764771,106217008),s(3516065817,3606008344),s(3600352804,1432725776),s(4094571909,1467031594),s(275423344,851169720),s(430227734,3100823752),s(506948616,1363258195),s(659060556,3750685593),s(883997877,3785050280),s(958139571,3318307427),s(1322822218,3812723403),s(1537002063,2003034995),s(1747873779,3602036899),s(1955562222,1575990012),s(2024104815,1125592928),s(2227730452,2716904306),s(2361852424,442776044),s(2428436474,593698344),s(2756734187,3733110249),s(3204031479,2999351573),s(3329325298,3815920427),s(3391569614,3928383900),s(3515267271,566280711),s(3940187606,3454069534),s(4118630271,4000239992),s(116418474,1914138554),s(174292421,2731055270),s(289380356,3203993006),s(460393269,320620315),s(685471733,587496836),s(852142971,1086792851),s(1017036298,365543100),s(1126000580,2618297676),s(1288033470,3409855158),s(1501505948,4234509866),s(1607167915,987167468),s(1816402316,1246189591)],a=[];!function(){for(var t=0;t<80;t++)a[t]=s()}();var h=o.SHA512=e.extend({_doReset:function(){this._hash=new n.init([new i.init(1779033703,4089235720),new i.init(3144134277,2227873595),new i.init(1013904242,4271175723),new i.init(2773480762,1595750129),new i.init(1359893119,2917565137),new i.init(2600822924,725511199),new i.init(528734635,4215389547),new i.init(1541459225,327033209)])},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],n=r[1],o=r[2],s=r[3],h=r[4],l=r[5],f=r[6],d=r[7],u=i.high,p=i.low,_=n.high,v=n.low,y=o.high,g=o.low,B=s.high,w=s.low,k=h.high,S=h.low,m=l.high,x=l.low,b=f.high,H=f.low,z=d.high,A=d.low,C=u,D=p,E=_,R=v,M=y,F=g,P=B,W=w,O=k,I=S,U=m,K=x,X=b,L=H,j=z,N=A,T=0;T<80;T++){var q,Z,V=a[T];if(T<16)Z=V.high=0|t[e+2*T],q=V.low=0|t[e+2*T+1];else{var G=a[T-15],J=G.high,$=G.low,Q=(J>>>1|$<<31)^(J>>>8|$<<24)^J>>>7,Y=($>>>1|J<<31)^($>>>8|J<<24)^($>>>7|J<<25),tt=a[T-2],et=tt.high,rt=tt.low,it=(et>>>19|rt<<13)^(et<<3|rt>>>29)^et>>>6,nt=(rt>>>19|et<<13)^(rt<<3|et>>>29)^(rt>>>6|et<<26),ot=a[T-7],st=ot.high,ct=ot.low,at=a[T-16],ht=at.high,lt=at.low;Z=(Z=(Z=Q+st+((q=Y+ct)>>>0<Y>>>0?1:0))+it+((q+=nt)>>>0<nt>>>0?1:0))+ht+((q+=lt)>>>0<lt>>>0?1:0),V.high=Z,V.low=q}var ft,dt=O&U^~O&X,ut=I&K^~I&L,pt=C&E^C&M^E&M,_t=D&R^D&F^R&F,vt=(C>>>28|D<<4)^(C<<30|D>>>2)^(C<<25|D>>>7),yt=(D>>>28|C<<4)^(D<<30|C>>>2)^(D<<25|C>>>7),gt=(O>>>14|I<<18)^(O>>>18|I<<14)^(O<<23|I>>>9),Bt=(I>>>14|O<<18)^(I>>>18|O<<14)^(I<<23|O>>>9),wt=c[T],kt=wt.high,St=wt.low,mt=j+gt+((ft=N+Bt)>>>0<N>>>0?1:0),xt=yt+_t;j=X,N=L,X=U,L=K,U=O,K=I,O=P+(mt=(mt=(mt=mt+dt+((ft+=ut)>>>0<ut>>>0?1:0))+kt+((ft+=St)>>>0<St>>>0?1:0))+Z+((ft+=q)>>>0<q>>>0?1:0))+((I=W+ft|0)>>>0<W>>>0?1:0)|0,P=M,W=F,M=E,F=R,E=C,R=D,C=mt+(vt+pt+(xt>>>0<yt>>>0?1:0))+((D=ft+xt|0)>>>0<ft>>>0?1:0)|0}p=i.low=p+D,i.high=u+C+(p>>>0<D>>>0?1:0),v=n.low=v+R,n.high=_+E+(v>>>0<R>>>0?1:0),g=o.low=g+F,o.high=y+M+(g>>>0<F>>>0?1:0),w=s.low=w+W,s.high=B+P+(w>>>0<W>>>0?1:0),S=h.low=S+I,h.high=k+O+(S>>>0<I>>>0?1:0),x=l.low=x+K,l.high=m+U+(x>>>0<K>>>0?1:0),H=f.low=H+L,f.high=b+X+(H>>>0<L>>>0?1:0),A=d.low=A+N,d.high=z+j+(A>>>0<N>>>0?1:0)},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,i=8*t.sigBytes;return e[i>>>5]|=128<<24-i%32,e[30+(128+i>>>10<<5)]=Math.floor(r/4294967296),e[31+(128+i>>>10<<5)]=r,t.sigBytes=4*e.length,this._process(),this._hash.toX32()},clone:function(){var t=e.clone.call(this);return t._hash=this._hash.clone(),t},blockSize:32});t.SHA512=e._createHelper(h),t.HmacSHA512=e._createHmacHelper(h)}(),Z=(q=mt).x64,V=Z.Word,G=Z.WordArray,J=q.algo,$=J.SHA512,Q=J.SHA384=$.extend({_doReset:function(){this._hash=new G.init([new V.init(3418070365,3238371032),new V.init(1654270250,914150663),new V.init(2438529370,812702999),new V.init(355462360,4144912697),new V.init(1731405415,4290775857),new V.init(2394180231,1750603025),new V.init(3675008525,1694076839),new V.init(1203062813,3204075428)])},_doFinalize:function(){var t=$._doFinalize.call(this);return t.sigBytes-=16,t}}),q.SHA384=$._createHelper(Q),q.HmacSHA384=$._createHmacHelper(Q),mt.lib.Cipher||function(){var t=mt,e=t.lib,r=e.Base,i=e.WordArray,n=e.BufferedBlockAlgorithm,o=t.enc,s=(o.Utf8,o.Base64),c=t.algo.EvpKDF,a=e.Cipher=n.extend({cfg:r.extend(),createEncryptor:function(t,e){return this.create(this._ENC_XFORM_MODE,t,e)},createDecryptor:function(t,e){return this.create(this._DEC_XFORM_MODE,t,e)},init:function(t,e,r){this.cfg=this.cfg.extend(r),this._xformMode=t,this._key=e,this.reset()},reset:function(){n.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){return t&&this._append(t),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(t){return{encrypt:function(e,r,i){return h(r).encrypt(t,e,r,i)},decrypt:function(e,r,i){return h(r).decrypt(t,e,r,i)}}}});function h(t){return"string"==typeof t?w:g}e.StreamCipher=a.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var l,f=t.mode={},d=e.BlockCipherMode=r.extend({createEncryptor:function(t,e){return this.Encryptor.create(t,e)},createDecryptor:function(t,e){return this.Decryptor.create(t,e)},init:function(t,e){this._cipher=t,this._iv=e}}),u=f.CBC=((l=d.extend()).Encryptor=l.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize;p.call(this,t,e,i),r.encryptBlock(t,e),this._prevBlock=t.slice(e,e+i)}}),l.Decryptor=l.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=t.slice(e,e+i);r.decryptBlock(t,e),p.call(this,t,e,i),this._prevBlock=n}}),l);function p(t,e,r){var i,n=this._iv;n?(i=n,this._iv=void 0):i=this._prevBlock;for(var o=0;o<r;o++)t[e+o]^=i[o]}var _=(t.pad={}).Pkcs7={pad:function(t,e){for(var r=4*e,n=r-t.sigBytes%r,o=n<<24|n<<16|n<<8|n,s=[],c=0;c<n;c+=4)s.push(o);var a=i.create(s,n);t.concat(a)},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},v=(e.BlockCipher=a.extend({cfg:a.cfg.extend({mode:u,padding:_}),reset:function(){var t;a.reset.call(this);var e=this.cfg,r=e.iv,i=e.mode;this._xformMode==this._ENC_XFORM_MODE?t=i.createEncryptor:(t=i.createDecryptor,this._minBufferSize=1),this._mode&&this._mode.__creator==t?this._mode.init(this,r&&r.words):(this._mode=t.call(i,this,r&&r.words),this._mode.__creator=t)},_doProcessBlock:function(t,e){this._mode.processBlock(t,e)},_doFinalize:function(){var t,e=this.cfg.padding;return this._xformMode==this._ENC_XFORM_MODE?(e.pad(this._data,this.blockSize),t=this._process(!0)):(t=this._process(!0),e.unpad(t)),t},blockSize:4}),e.CipherParams=r.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}})),y=(t.format={}).OpenSSL={stringify:function(t){var e=t.ciphertext,r=t.salt;return(r?i.create([1398893684,1701076831]).concat(r).concat(e):e).toString(s)},parse:function(t){var e,r=s.parse(t),n=r.words;return 1398893684==n[0]&&1701076831==n[1]&&(e=i.create(n.slice(2,4)),n.splice(0,4),r.sigBytes-=16),v.create({ciphertext:r,salt:e})}},g=e.SerializableCipher=r.extend({cfg:r.extend({format:y}),encrypt:function(t,e,r,i){i=this.cfg.extend(i);var n=t.createEncryptor(r,i),o=n.finalize(e),s=n.cfg;return v.create({ciphertext:o,key:r,iv:s.iv,algorithm:t,mode:s.mode,padding:s.padding,blockSize:t.blockSize,formatter:i.format})},decrypt:function(t,e,r,i){return i=this.cfg.extend(i),e=this._parse(e,i.format),t.createDecryptor(r,i).finalize(e.ciphertext)},_parse:function(t,e){return"string"==typeof t?e.parse(t,this):t}}),B=(t.kdf={}).OpenSSL={execute:function(t,e,r,n){n=n||i.random(8);var o=c.create({keySize:e+r}).compute(t,n),s=i.create(o.words.slice(e),4*r);return o.sigBytes=4*e,v.create({key:o,iv:s,salt:n})}},w=e.PasswordBasedCipher=g.extend({cfg:g.cfg.extend({kdf:B}),encrypt:function(t,e,r,i){var n=(i=this.cfg.extend(i)).kdf.execute(r,t.keySize,t.ivSize);i.iv=n.iv;var o=g.encrypt.call(this,t,e,n.key,i);return o.mixIn(n),o},decrypt:function(t,e,r,i){i=this.cfg.extend(i),e=this._parse(e,i.format);var n=i.kdf.execute(r,t.keySize,t.ivSize,e.salt);return i.iv=n.iv,g.decrypt.call(this,t,e,n.key,i)}})}(),mt.mode.CFB=((Y=mt.lib.BlockCipherMode.extend()).Encryptor=Y.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize;Dt.call(this,t,e,i,r),this._prevBlock=t.slice(e,e+i)}}),Y.Decryptor=Y.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=t.slice(e,e+i);Dt.call(this,t,e,i,r),this._prevBlock=n}}),Y),mt.mode.ECB=((tt=mt.lib.BlockCipherMode.extend()).Encryptor=tt.extend({processBlock:function(t,e){this._cipher.encryptBlock(t,e)}}),tt.Decryptor=tt.extend({processBlock:function(t,e){this._cipher.decryptBlock(t,e)}}),tt),mt.pad.AnsiX923={pad:function(t,e){var r=t.sigBytes,i=4*e,n=i-r%i,o=r+n-1;t.clamp(),t.words[o>>>2]|=n<<24-o%4*8,t.sigBytes+=n},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},mt.pad.Iso10126={pad:function(t,e){var r=4*e,i=r-t.sigBytes%r;t.concat(mt.lib.WordArray.random(i-1)).concat(mt.lib.WordArray.create([i<<24],1))},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},mt.pad.Iso97971={pad:function(t,e){t.concat(mt.lib.WordArray.create([2147483648],1)),mt.pad.ZeroPadding.pad(t,e)},unpad:function(t){mt.pad.ZeroPadding.unpad(t),t.sigBytes--}},mt.mode.OFB=(rt=(et=mt.lib.BlockCipherMode.extend()).Encryptor=et.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=this._iv,o=this._keystream;n&&(o=this._keystream=n.slice(0),this._iv=void 0),r.encryptBlock(o,0);for(var s=0;s<i;s++)t[e+s]^=o[s]}}),et.Decryptor=rt,et),mt.pad.NoPadding={pad:function(){},unpad:function(){}},it=mt.lib.CipherParams,nt=mt.enc.Hex,mt.format.Hex={stringify:function(t){return t.ciphertext.toString(nt)},parse:function(t){var e=nt.parse(t);return it.create({ciphertext:e})}},function(){var t=mt,e=t.lib.BlockCipher,r=t.algo,i=[],n=[],o=[],s=[],c=[],a=[],h=[],l=[],f=[],d=[];!function(){for(var t=[],e=0;e<256;e++)t[e]=e<128?e<<1:e<<1^283;var r=0,u=0;for(e=0;e<256;e++){var p=u^u<<1^u<<2^u<<3^u<<4;p=p>>>8^255&p^99,i[r]=p;var _=t[n[p]=r],v=t[_],y=t[v],g=257*t[p]^16843008*p;o[r]=g<<24|g>>>8,s[r]=g<<16|g>>>16,c[r]=g<<8|g>>>24,a[r]=g,g=16843009*y^65537*v^257*_^16843008*r,h[p]=g<<24|g>>>8,l[p]=g<<16|g>>>16,f[p]=g<<8|g>>>24,d[p]=g,r?(r=_^t[t[t[y^_]]],u^=t[t[u]]):r=u=1}}();var u=[0,1,2,4,8,16,32,64,128,27,54],p=r.AES=e.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var t=this._keyPriorReset=this._key,e=t.words,r=t.sigBytes/4,n=4*(1+(this._nRounds=6+r)),o=this._keySchedule=[],s=0;s<n;s++)s<r?o[s]=e[s]:(p=o[s-1],s%r?6<r&&s%r==4&&(p=i[p>>>24]<<24|i[p>>>16&255]<<16|i[p>>>8&255]<<8|i[255&p]):(p=i[(p=p<<8|p>>>24)>>>24]<<24|i[p>>>16&255]<<16|i[p>>>8&255]<<8|i[255&p],p^=u[s/r|0]<<24),o[s]=o[s-r]^p);for(var c=this._invKeySchedule=[],a=0;a<n;a++){if(s=n-a,a%4)var p=o[s];else p=o[s-4];c[a]=a<4||s<=4?p:h[i[p>>>24]]^l[i[p>>>16&255]]^f[i[p>>>8&255]]^d[i[255&p]]}}},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._keySchedule,o,s,c,a,i)},decryptBlock:function(t,e){var r=t[e+1];t[e+1]=t[e+3],t[e+3]=r,this._doCryptBlock(t,e,this._invKeySchedule,h,l,f,d,n),r=t[e+1],t[e+1]=t[e+3],t[e+3]=r},_doCryptBlock:function(t,e,r,i,n,o,s,c){for(var a=this._nRounds,h=t[e]^r[0],l=t[e+1]^r[1],f=t[e+2]^r[2],d=t[e+3]^r[3],u=4,p=1;p<a;p++){var _=i[h>>>24]^n[l>>>16&255]^o[f>>>8&255]^s[255&d]^r[u++],v=i[l>>>24]^n[f>>>16&255]^o[d>>>8&255]^s[255&h]^r[u++],y=i[f>>>24]^n[d>>>16&255]^o[h>>>8&255]^s[255&l]^r[u++],g=i[d>>>24]^n[h>>>16&255]^o[l>>>8&255]^s[255&f]^r[u++];h=_,l=v,f=y,d=g}_=(c[h>>>24]<<24|c[l>>>16&255]<<16|c[f>>>8&255]<<8|c[255&d])^r[u++],v=(c[l>>>24]<<24|c[f>>>16&255]<<16|c[d>>>8&255]<<8|c[255&h])^r[u++],y=(c[f>>>24]<<24|c[d>>>16&255]<<16|c[h>>>8&255]<<8|c[255&l])^r[u++],g=(c[d>>>24]<<24|c[h>>>16&255]<<16|c[l>>>8&255]<<8|c[255&f])^r[u++],t[e]=_,t[e+1]=v,t[e+2]=y,t[e+3]=g},keySize:8});t.AES=e._createHelper(p)}(),function(){var t=mt,e=t.lib,r=e.WordArray,i=e.BlockCipher,n=t.algo,o=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],s=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],c=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],a=[{0:8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{0:1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{0:260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{0:2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{0:128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{0:268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{0:1048576,16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{0:134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],h=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],l=n.DES=i.extend({_doReset:function(){for(var t=this._key.words,e=[],r=0;r<56;r++){var i=o[r]-1;e[r]=t[i>>>5]>>>31-i%32&1}for(var n=this._subKeys=[],a=0;a<16;a++){var h=n[a]=[],l=c[a];for(r=0;r<24;r++)h[r/6|0]|=e[(s[r]-1+l)%28]<<31-r%6,h[4+(r/6|0)]|=e[28+(s[r+24]-1+l)%28]<<31-r%6;for(h[0]=h[0]<<1|h[0]>>>31,r=1;r<7;r++)h[r]=h[r]>>>4*(r-1)+3;h[7]=h[7]<<5|h[7]>>>27}var f=this._invSubKeys=[];for(r=0;r<16;r++)f[r]=n[15-r]},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._subKeys)},decryptBlock:function(t,e){this._doCryptBlock(t,e,this._invSubKeys)},_doCryptBlock:function(t,e,r){this._lBlock=t[e],this._rBlock=t[e+1],f.call(this,4,252645135),f.call(this,16,65535),d.call(this,2,858993459),d.call(this,8,16711935),f.call(this,1,1431655765);for(var i=0;i<16;i++){for(var n=r[i],o=this._lBlock,s=this._rBlock,c=0,l=0;l<8;l++)c|=a[l][((s^n[l])&h[l])>>>0];this._lBlock=s,this._rBlock=o^c}var u=this._lBlock;this._lBlock=this._rBlock,this._rBlock=u,f.call(this,1,1431655765),d.call(this,8,16711935),d.call(this,2,858993459),f.call(this,16,65535),f.call(this,4,252645135),t[e]=this._lBlock,t[e+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});function f(t,e){var r=(this._lBlock>>>t^this._rBlock)&e;this._rBlock^=r,this._lBlock^=r<<t}function d(t,e){var r=(this._rBlock>>>t^this._lBlock)&e;this._lBlock^=r,this._rBlock^=r<<t}t.DES=i._createHelper(l);var u=n.TripleDES=i.extend({_doReset:function(){var t=this._key.words;if(2!==t.length&&4!==t.length&&t.length<6)throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");var e=t.slice(0,2),i=t.length<4?t.slice(0,2):t.slice(2,4),n=t.length<6?t.slice(0,2):t.slice(4,6);this._des1=l.createEncryptor(r.create(e)),this._des2=l.createEncryptor(r.create(i)),this._des3=l.createEncryptor(r.create(n))},encryptBlock:function(t,e){this._des1.encryptBlock(t,e),this._des2.decryptBlock(t,e),this._des3.encryptBlock(t,e)},decryptBlock:function(t,e){this._des3.decryptBlock(t,e),this._des2.encryptBlock(t,e),this._des1.decryptBlock(t,e)},keySize:6,ivSize:2,blockSize:2});t.TripleDES=i._createHelper(u)}(),function(){var t=mt,e=t.lib.StreamCipher,r=t.algo,i=r.RC4=e.extend({_doReset:function(){for(var t=this._key,e=t.words,r=t.sigBytes,i=this._S=[],n=0;n<256;n++)i[n]=n;n=0;for(var o=0;n<256;n++){var s=n%r,c=e[s>>>2]>>>24-s%4*8&255;o=(o+i[n]+c)%256;var a=i[n];i[n]=i[o],i[o]=a}this._i=this._j=0},_doProcessBlock:function(t,e){t[e]^=n.call(this)},keySize:8,ivSize:0});function n(){for(var t=this._S,e=this._i,r=this._j,i=0,n=0;n<4;n++){r=(r+t[e=(e+1)%256])%256;var o=t[e];t[e]=t[r],t[r]=o,i|=t[(t[e]+t[r])%256]<<24-8*n}return this._i=e,this._j=r,i}t.RC4=e._createHelper(i);var o=r.RC4Drop=i.extend({cfg:i.cfg.extend({drop:192}),_doReset:function(){i._doReset.call(this);for(var t=this.cfg.drop;0<t;t--)n.call(this)}});t.RC4Drop=e._createHelper(o)}(),mt.mode.CTRGladman=(st=(ot=mt.lib.BlockCipherMode.extend()).Encryptor=ot.extend({processBlock:function(t,e){var r,i=this._cipher,n=i.blockSize,o=this._iv,s=this._counter;o&&(s=this._counter=o.slice(0),this._iv=void 0),0===((r=s)[0]=Et(r[0]))&&(r[1]=Et(r[1]));var c=s.slice(0);i.encryptBlock(c,0);for(var a=0;a<n;a++)t[e+a]^=c[a]}}),ot.Decryptor=st,ot),at=(ct=mt).lib.StreamCipher,ht=ct.algo,lt=[],ft=[],dt=[],ut=ht.Rabbit=at.extend({_doReset:function(){for(var t=this._key.words,e=this.cfg.iv,r=0;r<4;r++)t[r]=16711935&(t[r]<<8|t[r]>>>24)|4278255360&(t[r]<<24|t[r]>>>8);var i=this._X=[t[0],t[3]<<16|t[2]>>>16,t[1],t[0]<<16|t[3]>>>16,t[2],t[1]<<16|t[0]>>>16,t[3],t[2]<<16|t[1]>>>16],n=this._C=[t[2]<<16|t[2]>>>16,4294901760&t[0]|65535&t[1],t[3]<<16|t[3]>>>16,4294901760&t[1]|65535&t[2],t[0]<<16|t[0]>>>16,4294901760&t[2]|65535&t[3],t[1]<<16|t[1]>>>16,4294901760&t[3]|65535&t[0]];for(r=this._b=0;r<4;r++)Rt.call(this);for(r=0;r<8;r++)n[r]^=i[r+4&7];if(e){var o=e.words,s=o[0],c=o[1],a=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),h=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),l=a>>>16|4294901760&h,f=h<<16|65535&a;for(n[0]^=a,n[1]^=l,n[2]^=h,n[3]^=f,n[4]^=a,n[5]^=l,n[6]^=h,n[7]^=f,r=0;r<4;r++)Rt.call(this)}},_doProcessBlock:function(t,e){var r=this._X;Rt.call(this),lt[0]=r[0]^r[5]>>>16^r[3]<<16,lt[1]=r[2]^r[7]>>>16^r[5]<<16,lt[2]=r[4]^r[1]>>>16^r[7]<<16,lt[3]=r[6]^r[3]>>>16^r[1]<<16;for(var i=0;i<4;i++)lt[i]=16711935&(lt[i]<<8|lt[i]>>>24)|4278255360&(lt[i]<<24|lt[i]>>>8),t[e+i]^=lt[i]},blockSize:4,ivSize:2}),ct.Rabbit=at._createHelper(ut),mt.mode.CTR=(_t=(pt=mt.lib.BlockCipherMode.extend()).Encryptor=pt.extend({processBlock:function(t,e){var r=this._cipher,i=r.blockSize,n=this._iv,o=this._counter;n&&(o=this._counter=n.slice(0),this._iv=void 0);var s=o.slice(0);r.encryptBlock(s,0),o[i-1]=o[i-1]+1|0;for(var c=0;c<i;c++)t[e+c]^=s[c]}}),pt.Decryptor=_t,pt),yt=(vt=mt).lib.StreamCipher,gt=vt.algo,Bt=[],wt=[],kt=[],St=gt.RabbitLegacy=yt.extend({_doReset:function(){for(var t=this._key.words,e=this.cfg.iv,r=this._X=[t[0],t[3]<<16|t[2]>>>16,t[1],t[0]<<16|t[3]>>>16,t[2],t[1]<<16|t[0]>>>16,t[3],t[2]<<16|t[1]>>>16],i=this._C=[t[2]<<16|t[2]>>>16,4294901760&t[0]|65535&t[1],t[3]<<16|t[3]>>>16,4294901760&t[1]|65535&t[2],t[0]<<16|t[0]>>>16,4294901760&t[2]|65535&t[3],t[1]<<16|t[1]>>>16,4294901760&t[3]|65535&t[0]],n=this._b=0;n<4;n++)Mt.call(this);for(n=0;n<8;n++)i[n]^=r[n+4&7];if(e){var o=e.words,s=o[0],c=o[1],a=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),h=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),l=a>>>16|4294901760&h,f=h<<16|65535&a;for(i[0]^=a,i[1]^=l,i[2]^=h,i[3]^=f,i[4]^=a,i[5]^=l,i[6]^=h,i[7]^=f,n=0;n<4;n++)Mt.call(this)}},_doProcessBlock:function(t,e){var r=this._X;Mt.call(this),Bt[0]=r[0]^r[5]>>>16^r[3]<<16,Bt[1]=r[2]^r[7]>>>16^r[5]<<16,Bt[2]=r[4]^r[1]>>>16^r[7]<<16,Bt[3]=r[6]^r[3]>>>16^r[1]<<16;for(var i=0;i<4;i++)Bt[i]=16711935&(Bt[i]<<8|Bt[i]>>>24)|4278255360&(Bt[i]<<24|Bt[i]>>>8),t[e+i]^=Bt[i]},blockSize:4,ivSize:2}),vt.RabbitLegacy=yt._createHelper(St),mt.pad.ZeroPadding={pad:function(t,e){var r=4*e;t.clamp(),t.sigBytes+=r-(t.sigBytes%r||r)},unpad:function(t){var e=t.words,r=t.sigBytes-1;for(r=t.sigBytes-1;0<=r;r--)if(e[r>>>2]>>>24-r%4*8&255){t.sigBytes=r+1;break}}},mt});
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

