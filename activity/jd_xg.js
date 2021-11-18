/*
小鸽有礼
抽奖可获得京豆和快递优惠券
活动时间：2021年1月15日至2021年2月19日
更新地址：jd_xg.js
活动入口：https://snsdesign.jd.com/babelDiy/Zeus/4N5phvUAqZsGWBNGVJWmufXoBzpt/index.html?channel=lingsns003&scope=0&sceneid=9001&btnTips=&hideApp=0
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#小鸽有礼
5 7 * * * jd_xg.js, tag=小鸽有礼, img-url=https://raw.githubusercontent.com/yogayyy/Scripts/master/Icon/sh123ylocks/jd_xg.jpg, enabled=true

================Loon==============
[Script]
cron "5 7 * * *" script-path=jd_xg.js,tag=小鸽有礼

===============Surge=================
小鸽有礼 = type=cron,cronexp="5 7 * * *",wake-system=1,timeout=200,script-path=jd_xg.js

============小火箭=========
小鸽有礼 = type=cron,script-path=jd_xg.js, cronexpr="5 7 * * *", timeout=200, enable=true
 */
const $ = new Env('小鸽有礼');
const notify = $.isNode() ? require('../sendNotify') : '';
const jdCookieNode = $.isNode() ? require('../jdCookie.js') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
  if(JSON.stringify(process.env).indexOf('GITHUB')>-1) process.exit(0)
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      $.beans = 0
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jdXg()
    }
  }
})()
  .catch((e) => {
    $.log('', `