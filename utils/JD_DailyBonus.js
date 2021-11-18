/*

京东多合一签到脚本

更新时间: 2021.09.09 20:20 v2.1.3
有效接口: 20+
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
电报频道: @NobyDa 
问题反馈: @NobyDa_bot 
如果转载: 请注明出处

如需获取京东金融签到Body, 可进入"京东金融"APP (iOS), 在"首页"点击"签到"并签到一次, 返回抓包app搜索关键字 h5/m/appSign 复制请求体填入json串数据内即可
*/

var Key = ''; //该参数已废弃; 仅用于下游脚本的兼容, 请使用json串数据 ↓

var DualKey = ''; //该参数已废弃; 仅用于下游脚本的兼容, 请使用json串数据  ↓

var OtherKey = ``; //无限账号Cookie json串数据, 请严格按照json格式填写, 具体格式请看以下样例:


var LogDetails = false; //是否开启响应日志, true则开启

var stop = '0'; //自定义延迟签到, 单位毫秒. 默认分批并发无延迟; 该参数接受随机或指定延迟(例: '2000'则表示延迟2秒; '2000-5000'则表示延迟最小2秒,最大5秒内的随机延迟), 如填入延迟则切换顺序签到(耗时较长), Surge用户请注意在SurgeUI界面调整脚本超时; 注: 该参数Node.js或JSbox环境下已配置数据持久化, 留空(var stop = '')即可清除.

var DeleteCookie = false; //是否清除所有Cookie, true则开启.

var boxdis = true; //是否开启自动禁用, false则关闭. 脚本运行崩溃时(如VPN断连), 下次运行时将自动禁用相关崩溃接口(仅部分接口启用), 崩溃时可能会误禁用正常接口. (该选项仅适用于QX,Surge,Loon)

var ReDis = false; //是否移除所有禁用列表, true则开启. 适用于触发自动禁用后, 需要再次启用接口的情况. (该选项仅适用于QX,Surge,Loon)

var out = 0; //接口超时退出, 用于可能发生的网络不稳定, 0则关闭. 如QX日志出现大量"JS Context timeout"后脚本中断时, 建议填写6000

var $nobyda = nobyda();

var merge = {};

var KEY = '';

const Faker = require('./JDSignValidator')
const zooFaker = require('./JDJRValidator_Pure')
let fp = '', eid = '', md5

$nobyda.get = zooFaker.injectToRequest2($nobyda.get.bind($nobyda), 'channelSign')
$nobyda.post = zooFaker.injectToRequest2($nobyda.post.bind($nobyda), 'channelSign')

async function all(cookie, jrBody) {
  KEY = cookie;
  merge = {};
  $nobyda.num++;
  switch (stop) {
    case 0:
      await Promise.all([
        JingDongBean(stop), //京东京豆
        JingDongStore(stop), //京东超市
        JingRongSteel(stop, jrBody), //金融钢镚
        JingDongTurn(stop), //京东转盘
        JDFlashSale(stop), //京东闪购
        JingDongCash(stop), //京东现金红包
        JDMagicCube(stop, 2), //京东小魔方
        JingDongSubsidy(stop), //京东金贴
        JingDongGetCash(stop), //京东领现金
        JingDongShake(stop), //京东摇一摇
        JDSecKilling(stop), //京东秒杀
        // JingRongDoll(stop, 'JRDoll', '京东金融-签壹', '4D25A6F482'),
        // JingRongDoll(stop, 'JRThreeDoll', '京东金融-签叁', '69F5EC743C'),
        // JingRongDoll(stop, 'JRFourDoll', '京东金融-签肆', '30C4F86264'),
        // JingRongDoll(stop, 'JRFiveDoll', '京东金融-签伍', '1D06AA3B0F')
      ]);
      await Promise.all([
        JDUserSignPre(stop, 'JDUndies', '京东商城-内衣', '4PgpL1xqPSW1sVXCJ3xopDbB1f69'), //京东内衣馆
        JDUserSignPre(stop, 'JDCard', '京东商城-卡包', '7e5fRnma6RBATV9wNrGXJwihzcD'), //京东卡包
        // JDUserSignPre(stop, 'JDCustomized', '京东商城-定制', '2BJK5RBdvc3hdddZDS1Svd5Esj3R'), //京东定制
        JDUserSignPre(stop, 'JDaccompany', '京东商城-陪伴', 'kPM3Xedz1PBiGQjY4ZYGmeVvrts'), //京东陪伴
        JDUserSignPre(stop, 'JDShoes', '京东商城-鞋靴', '4RXyb1W4Y986LJW8ToqMK14BdTD'), //京东鞋靴
        JDUserSignPre(stop, 'JDChild', '京东商城-童装', '3Af6mZNcf5m795T8dtDVfDwWVNhJ'), //京东童装馆
        JDUserSignPre(stop, 'JDBaby', '京东商城-母婴', '3BbAVGQPDd6vTyHYjmAutXrKAos6'), //京东母婴馆
        JDUserSignPre(stop, 'JD3C', '京东商城-数码', '4SWjnZSCTHPYjE5T7j35rxxuMTb6'), //京东数码电器馆
        JDUserSignPre(stop, 'JDWomen', '京东商城-女装', 'DpSh7ma8JV7QAxSE2gJNro8Q2h9'), //京东女装馆
        JDUserSignPre(stop, 'JDBook', '京东商城-图书', '3SC6rw5iBg66qrXPGmZMqFDwcyXi'), //京东图书
        // JDUserSignPre(stop, 'ReceiveJD', '京东商城-领豆', 'Ni5PUSK7fzZc4EKangHhqPuprn2'), //京东-领京豆
        JingRongDoll(stop, 'JTDouble', '京东金贴-双签', '1DF13833F7'), //京东金融 金贴双签
        // JingRongDoll(stop, 'XJDouble', '金融现金-双签', 'F68B2C3E71', '', '', '', 'xianjin') //京东金融 现金双签
      ]);
      await Promise.all([
        JDUserSignPre(stop, 'JDStory', '京东失眠-补贴', 'UcyW9Znv3xeyixW1gofhW2DAoz4'), //失眠补贴
        JDUserSignPre(stop, 'JDPhone', '京东手机-小时', '4Vh5ybVr98nfJgros5GwvXbmTUpg'), //手机小时达
        JDUserSignPre(stop, 'JDEsports', '京东商城-电竞', 'CHdHQhA5AYDXXQN9FLt3QUAPRsB'), //京东电竞
        JDUserSignPre(stop, 'JDClothing', '京东商城-服饰', '4RBT3H9jmgYg1k2kBnHF8NAHm7m8'), //京东服饰
        JDUserSignPre(stop, 'JDSuitcase', '京东商城-箱包', 'ZrH7gGAcEkY2gH8wXqyAPoQgk6t'), //京东箱包馆
        JDUserSignPre(stop, 'JDSchool', '京东商城-校园', '2QUxWHx5BSCNtnBDjtt5gZTq7zdZ'), //京东校园
        JDUserSignPre(stop, 'JDHealth', '京东商城-健康', 'w2oeK5yLdHqHvwef7SMMy4PL8LF'), //京东健康
        JDUserSignPre(stop, 'JDShand', '京东拍拍-二手', '3S28janPLYmtFxypu37AYAGgivfp'), //京东拍拍二手
        JDUserSignPre(stop, 'JDClean', '京东商城-清洁', '2Tjm6ay1ZbZ3v7UbriTj6kHy9dn6'), //京东清洁馆
        JDUserSignPre(stop, 'JDCare', '京东商城-个护', '2tZssTgnQsiUqhmg5ooLSHY9XSeN'), //京东个人护理馆
        JDUserSignPre(stop, 'JDJiaDian', '京东商城-家电', '3uvPyw1pwHARGgndatCXddLNUxHw'), // 京东小家电
        // JDUserSignPre(stop, 'JDJewels', '京东商城-珠宝', 'zHUHpTHNTaztSRfNBFNVZscyFZU'), //京东珠宝馆
        // JDUserSignPre(stop, 'JDMakeup', '京东商城-美妆', '2smCxzLNuam5L14zNJHYu43ovbAP'), //京东美妆馆
        JDUserSignPre(stop, 'JDVege', '京东商城-菜场', 'Wcu2LVCFMkBP3HraRvb7pgSpt64'), //京东菜场
        // JDUserSignPre(stop, 'JDLive', '京东智能-生活', 'KcfFqWvhb5hHtaQkS4SD1UU6RcQ') //京东智能生活
        JDUserSignPre(stop, 'JDPlus', '京东商城-PLUS', '3bhgbFe5HZcFCjEZf2jzp3umx4ZR'), //京东PLUS
        JDUserSignPre(stop, 'JDStore', '京东超市', 'QPwDgLSops2bcsYqQ57hENGrjgj') //京东超市
      ]);
      await JingRongDoll(stop, 'JDDouble', '金融京豆-双签', 'F68B2C3E71', '', '', '', 'jingdou'); //京东金融 京豆双签
      break;
    default:
      await JingDongBean(0); //京东京豆
      await JingDongStore(Wait(stop)); //京东超市
      await JingRongSteel(Wait(stop), jrBody); //金融钢镚
      await JingDongTurn(Wait(stop)); //京东转盘
      await JDFlashSale(Wait(stop)); //京东闪购
      await JingDongCash(Wait(stop)); //京东现金红包
      await JDMagicCube(Wait(stop), 2); //京东小魔方
      await JingDongGetCash(Wait(stop)); //京东领现金
      await JingDongSubsidy(Wait(stop)); //京东金贴
      await JingDongShake(Wait(stop)); //京东摇一摇
      await JDSecKilling(Wait(stop)); //京东秒杀
      // await JingRongDoll(Wait(stop), 'JRThreeDoll', '京东金融-签叁', '69F5EC743C');
      // await JingRongDoll(Wait(stop), 'JRFourDoll', '京东金融-签肆', '30C4F86264');
      // await JingRongDoll(Wait(stop), 'JRFiveDoll', '京东金融-签伍', '1D06AA3B0F');
      // await JingRongDoll(Wait(stop), 'JRDoll', '京东金融-签壹', '4D25A6F482');
      // await JingRongDoll(Wait(stop), 'XJDouble', '金融现金-双签', 'F68B2C3E71', '', '', '', 'xianjin'); //京东金融 现金双签
      await JingRongDoll(Wait(stop), 'JTDouble', '京东金贴-双签', '1DF13833F7'); //京东金融 金贴双签
      await JDUserSignPre(Wait(stop), 'JDStory', '京东失眠-补贴', 'UcyW9Znv3xeyixW1gofhW2DAoz4'); //失眠补贴
      await JDUserSignPre(Wait(stop), 'JDPhone', '京东手机-小时', '4Vh5ybVr98nfJgros5GwvXbmTUpg'); //手机小时达
      await JDUserSignPre(Wait(stop), 'JDCard', '京东商城-卡包', '7e5fRnma6RBATV9wNrGXJwihzcD'); //京东卡包
      await JDUserSignPre(Wait(stop), 'JDUndies', '京东商城-内衣', '4PgpL1xqPSW1sVXCJ3xopDbB1f69'); //京东内衣馆
      await JDUserSignPre(Wait(stop), 'JDEsports', '京东商城-电竞', 'CHdHQhA5AYDXXQN9FLt3QUAPRsB'); //京东电竞
      // await JDUserSignPre(Wait(stop), 'JDCustomized', '京东商城-定制', '2BJK5RBdvc3hdddZDS1Svd5Esj3R'); //京东定制
      await JDUserSignPre(Wait(stop), 'JDSuitcase', '京东商城-箱包', 'ZrH7gGAcEkY2gH8wXqyAPoQgk6t'); //京东箱包馆
      await JDUserSignPre(Wait(stop), 'JDClothing', '京东商城-服饰', '4RBT3H9jmgYg1k2kBnHF8NAHm7m8'); //京东服饰
      await JDUserSignPre(Wait(stop), 'JDSchool', '京东商城-校园', '2QUxWHx5BSCNtnBDjtt5gZTq7zdZ'); //京东校园 
      await JDUserSignPre(Wait(stop), 'JDHealth', '京东商城-健康', 'w2oeK5yLdHqHvwef7SMMy4PL8LF'); //京东健康
      await JDUserSignPre(Wait(stop), 'JDShoes', '京东商城-鞋靴', '4RXyb1W4Y986LJW8ToqMK14BdTD'); //京东鞋靴
      await JDUserSignPre(Wait(stop), 'JDChild', '京东商城-童装', '3Af6mZNcf5m795T8dtDVfDwWVNhJ'); //京东童装馆
      await JDUserSignPre(Wait(stop), 'JDBaby', '京东商城-母婴', '3BbAVGQPDd6vTyHYjmAutXrKAos6'); //京东母婴馆
      await JDUserSignPre(Wait(stop), 'JD3C', '京东商城-数码', '4SWjnZSCTHPYjE5T7j35rxxuMTb6'); //京东数码电器馆
      await JDUserSignPre(Wait(stop), 'JDWomen', '京东商城-女装', 'DpSh7ma8JV7QAxSE2gJNro8Q2h9'); //京东女装馆
      await JDUserSignPre(Wait(stop), 'JDBook', '京东商城-图书', '3SC6rw5iBg66qrXPGmZMqFDwcyXi'); //京东图书
      await JDUserSignPre(Wait(stop), 'JDShand', '京东拍拍-二手', '3S28janPLYmtFxypu37AYAGgivfp'); //京东拍拍二手
      // await JDUserSignPre(Wait(stop), 'JDMakeup', '京东商城-美妆', '2smCxzLNuam5L14zNJHYu43ovbAP'); //京东美妆馆
      await JDUserSignPre(Wait(stop), 'JDVege', '京东商城-菜场', 'Wcu2LVCFMkBP3HraRvb7pgSpt64'); //京东菜场
      await JDUserSignPre(Wait(stop), 'JDPlus', '京东商城-PLUS', '3bhgbFe5HZcFCjEZf2jzp3umx4ZR'); //京东PLUS
      await JDUserSignPre(Wait(stop), 'JDStore', '京东超市', 'QPwDgLSops2bcsYqQ57hENGrjgj'); //京东超市
      await JDUserSignPre(Wait(stop), 'JDaccompany', '京东商城-陪伴', 'kPM3Xedz1PBiGQjY4ZYGmeVvrts'); //京东陪伴
      // await JDUserSignPre(Wait(stop), 'JDLive', '京东智能-生活', 'KcfFqWvhb5hHtaQkS4SD1UU6RcQ'); //京东智能生活
      await JDUserSignPre(Wait(stop), 'JDClean', '京东商城-清洁', '2Tjm6ay1ZbZ3v7UbriTj6kHy9dn6'); //京东清洁馆
      await JDUserSignPre(Wait(stop), 'JDCare', '京东商城-个护', '2tZssTgnQsiUqhmg5ooLSHY9XSeN'); //京东个人护理馆
      await JDUserSignPre(Wait(stop), 'JDJiaDian', '京东商城-家电', '3uvPyw1pwHARGgndatCXddLNUxHw'); // 京东小家电馆
      // await JDUserSignPre(Wait(stop), 'ReceiveJD', '京东商城-领豆', 'Ni5PUSK7fzZc4EKangHhqPuprn2'); //京东-领京豆
      // await JDUserSignPre(Wait(stop), 'JDJewels', '京东商城-珠宝', 'zHUHpTHNTaztSRfNBFNVZscyFZU'); //京东珠宝馆
      await JingRongDoll(Wait(stop), 'JDDouble', '金融京豆-双签', 'F68B2C3E71', '', '', '', 'jingdou'); //京东金融 京豆双签
      break;
  }
  await Promise.all([
    TotalSteel(), //总钢镚查询
    TotalCash(), //总红包查询
    TotalBean(), //总京豆查询
    TotalSubsidy(), //总金贴查询
    TotalMoney() //总现金查询
  ]);
  await notify(); //通知模块
}

function notify() {
  return new Promise(resolve => {
    try {
      var bean = 0;
      var steel = 0;
      var cash = 0;
      var money = 0;
      var subsidy = 0;
      var success = 0;
      var fail = 0;
      var err = 0;
      var notify = '';
      for (var i in merge) {
        bean += merge[i].bean ? Number(merge[i].bean) : 0
        steel += merge[i].steel ? Number(merge[i].steel) : 0
        cash += merge[i].Cash ? Number(merge[i].Cash) : 0
        money += merge[i].Money ? Number(merge[i].Money) : 0
        subsidy += merge[i].subsidy ? Number(merge[i].subsidy) : 0
        success += merge[i].success ? Number(merge[i].success) : 0
        fail += merge[i].fail ? Number(merge[i].fail) : 0
        err += merge[i].error ? Number(merge[i].error) : 0
        notify += merge[i].notify ? "\n" + merge[i].notify : ""
      }
      var Cash = merge.TotalCash && merge.TotalCash.TCash ? `${merge.TotalCash.TCash}红包` : ""
      var Steel = merge.TotalSteel && merge.TotalSteel.TSteel ? `${merge.TotalSteel.TSteel}钢镚` : ``
      var beans = merge.TotalBean && merge.TotalBean.Qbear ? `${merge.TotalBean.Qbear}京豆${Steel?`, `:``}` : ""
      var Money = merge.TotalMoney && merge.TotalMoney.TMoney ? `${merge.TotalMoney.TMoney}现金${Cash?`, `:``}` : ""
      var Subsidy = merge.TotalSubsidy && merge.TotalSubsidy.TSubsidy ? `${merge.TotalSubsidy.TSubsidy}金贴${Money||Cash?", ":""}` : ""
      var Tbean = bean ? `${bean.toFixed(0)}京豆${steel?", ":""}` : ""
      var TSteel = steel ? `${steel.toFixed(2)}钢镚` : ""
      var TCash = cash ? `${cash.toFixed(2)}红包${subsidy||money?", ":""}` : ""
      var TSubsidy = subsidy ? `${subsidy.toFixed(2)}金贴${money?", ":""}` : ""
      var TMoney = money ? `${money.toFixed(2)}现金` : ""
      var Ts = success ? `成功${success}个${fail||err?`, `:``}` : ``
      var Tf = fail ? `失败${fail}个${err?`, `:``}` : ``
      var Te = err ? `错误${err}个` : ``
      var one = `【签到概览】:  ${Ts+Tf+Te}${Ts||Tf||Te?`\n`:`获取失败\n`}`
      var two = Tbean || TSteel ? `【签到奖励】:  ${Tbean+TSteel}\n` : ``
      var three = TCash || TSubsidy || TMoney ? `【其他奖励】:  ${TCash+TSubsidy+TMoney}\n` : ``
      var four = `【账号总计】:  ${beans+Steel}${beans||Steel?`\n`:`获取失败\n`}`
      var five = `【其他总计】:  ${Subsidy+Money+Cash}${Subsidy||Money||Cash?`\n`:`获取失败\n`}`
      var DName = merge.TotalBean && merge.TotalBean.nickname ? merge.TotalBean.nickname : "获取失败"
      var cnNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
      const Name = DualKey || OtherKey.length > 1 ? `【签到号${cnNum[$nobyda.num]||$nobyda.num}】:  ${DName}\n` : ``
      const disables = $nobyda.read("JD_DailyBonusDisables")
      const amount = disables ? disables.split(",").length : 0
      const disa = !notify || amount ? `【温馨提示】:  检测到${$nobyda.disable?`上次执行意外崩溃, `:``}已禁用${notify?`${amount}个`:`所有`}接口, 如需开启请前往BoxJs或查看脚本内第118行注释.\n` : ``
      $nobyda.notify("", "", Name + one + two + three + four + five + disa + notify, {
        'media-url': $nobyda.headUrl || 'https://cdn.jsdeliv123r.net/gh/NobyDa/mini@master/Color/jd.png'
      });
      $nobyda.headUrl = null;
      if ($nobyda.isJSBox) {
        $nobyda.st = (typeof($nobyda.st) == 'undefined' ? '' : $nobyda.st) + Name + one + two + three + four + five + "\n"
      }
    } catch (eor) {
      $nobyda.notify("通知模块 " + eor.name + "!!", JSON.stringify(eor), eor.message)
    } finally {
      resolve()
    }
  });
}

(async function ReadCookie() {
  const EnvInfo = $nobyda.isJSBox ? "JD_Cookie" : "CookieJD";
  const EnvInfo2 = $nobyda.isJSBox ? "JD_Cookie2" : "CookieJD2";
  const EnvInfo3 = $nobyda.isJSBox ? "JD_Cookies" : "CookiesJD";
  const move = CookieMove($nobyda.read(EnvInfo) || Key, $nobyda.read(EnvInfo2) || DualKey, EnvInfo, EnvInfo2, EnvInfo3);
  const cookieSet = $nobyda.read(EnvInfo3);
  if (DeleteCookie) {
    const write = $nobyda.write("", EnvInfo3);
    throw new Error(`Cookie清除${write?`成功`:`失败`}, 请手动关闭脚本内"DeleteCookie"选项`);
  } else if ($nobyda.isRequest) {
    GetCookie()
  } else if (Key || DualKey || (OtherKey || cookieSet || '[]') != '[]') {
    if (($nobyda.isJSBox || $nobyda.isNode) && stop !== '0') $nobyda.write(stop, "JD_DailyBonusDelay");
    out = parseInt($nobyda.read("JD_DailyBonusTimeOut")) || out;
    stop = Wait($nobyda.read("JD_DailyBonusDelay"), true) || Wait(stop, true);
    boxdis = $nobyda.read("JD_Crash_disable") === "false" || $nobyda.isNode || $nobyda.isJSBox ? false : boxdis;
    LogDetails = $nobyda.read("JD_DailyBonusLog") === "true" || LogDetails;
    ReDis = ReDis ? $nobyda.write("", "JD_DailyBonusDisables") : "";
    $nobyda.num = 0;
    if (Key) await all(Key);
    if (DualKey && DualKey !== Key) await all(DualKey);
    if ((OtherKey || cookieSet || '[]') != '[]') {
      try {
        OtherKey = checkFormat([...JSON.parse(OtherKey || '[]'), ...JSON.parse(cookieSet || '[]')]);
        const updateSet = OtherKey.length ? $nobyda.write(JSON.stringify(OtherKey, null, 2), EnvInfo3) : '';
        for (let i = 0; i < OtherKey.length; i++) {
          const ck = OtherKey[i].cookie;
          const jr = OtherKey[i].jrBody;
          if (ck != Key && ck != DualKey) {
            await all(ck, jr)
          }
        }
      } catch (e) {
        throw new Error(`账号Cookie读取失败, 请检查Json格式. \n${e.message}`)
      }
    }
    $nobyda.time();
  } else {
    throw new Error('脚本终止, 未获取Cookie !!')
  }
})().catch(e => {
  $nobyda.notify("京东签到", "", e.message || JSON.stringify(e))
}).finally(() => {
  if ($nobyda.isJSBox) $intents.finish($nobyda.st);
  $nobyda.done();
})

function JingDongBean(s) {
  merge.JDBean = {};
  return new Promise(resolve => {
    if (disable("JDBean")) return resolve()
    setTimeout(() => {
      const JDBUrl = {
        url: 'https://api.m.jd.com/client.action',
        headers: {
          Cookie: KEY
        },
        body: 'functionId=signBeanIndex&appid=ld'
      };
      $nobyda.post(JDBUrl, function(error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data)
            const Details = LogDetails ? "response:\n" + data : '';
            if (cc.code == 3) {
              console.log("\n" + "京东商城-京豆Cookie失效 " + Details)
              merge.JDBean.notify = "京东商城-京豆: 失败, 原因: Cookie失效!!"
              merge.JDBean.fail = 1
            } else if (data.match(/跳转至拼图/)) {
              merge.JDBean.notify = "京东商城-京豆: 失败, 需要拼图验证 "
              merge.JDBean.fail = 1
            } else if (data.match(/\"status\":\"?1\"?/)) {
              console.log("\n" + "京东商城-京豆签到成功 " + Details)
              if (data.match(/dailyAward/)) {
                merge.JDBean.notify = "京东商城-京豆: 成功, 明细: " + cc.data.dailyAward.beanAward.beanCount + "京豆 "
                merge.JDBean.bean = cc.data.dailyAward.beanAward.beanCount
              } else if (data.match(/continuityAward/)) {
                merge.JDBean.notify = "京东商城-京豆: 成功, 明细: " + cc.data.continuityAward.beanAward.beanCount + "京豆 "
                merge.JDBean.bean = cc.data.continuityAward.beanAward.beanCount
              } else if (data.match(/新人签到/)) {
                const quantity = data.match(/beanCount\":\"(\d+)\".+今天/)
                merge.JDBean.bean = quantity ? quantity[1] : 0
                merge.JDBean.notify = "京东商城-京豆: 成功, 明细: " + (quantity ? quantity[1] : "无") + "京豆 "
              } else {
                merge.JDBean.notify = "京东商城-京豆: 成功, 明细: 无京豆 "
              }
              merge.JDBean.success = 1
            } else {
              merge.JDBean.fail = 1
              console.log("\n" + "京东商城-京豆签到失败 " + Details)
              if (data.match(/(已签到|新人签到)/)) {
                merge.JDBean.notify = "京东商城-京豆: 失败, 原因: 已签过 "
              } else if (data.match(/人数较多|S101/)) {
                merge.JDBean.notify = "京东商城-京豆: 失败, 签到人数较多 "
              } else {
                merge.JDBean.notify = "京东商城-京豆: 失败, 原因: 未知 "
              }
            }
          }
        } catch (eor) {
          $nobyda.AnError("京东商城-京豆", "JDBean", eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

// function JingDongTurn(s) {
//   merge.JDTurn = {}, merge.JDTurn.notify = "", merge.JDTurn.success = 0, merge.JDTurn.bean = 0;
//   return new Promise((resolve, reject) => {
//     if (disable("JDTurn")) return reject()
//     const JDTUrl = {
//       url: 'https://api.m.jd.com/client.action?functionId=wheelSurfIndex&body=%7B%22actId%22%3A%22jgpqtzjhvaoym%22%2C%22appSource%22%3A%22jdhome%22%7D&appid=ld',
//       headers: {
//         Cookie: KEY,
//       }
//     };
//     $nobyda.get(JDTUrl, async function(error, response, data) {
//       try {
//         if (error) {
//           throw new Error(error)
//         } else {
//           const cc = JSON.parse(data)
//           const Details = LogDetails ? "response:\n" + data : '';
//           if (cc.data && cc.data.lotteryCode) {
//             console.log("\n" + "京东商城-转盘查询成功 " + Details)
//             return resolve(cc.data.lotteryCode)
//           } else {
//             merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: 查询错误 "
//             merge.JDTurn.fail = 1
//             console.log("\n" + "京东商城-转盘查询失败 " + Details)
//           }
//         }
//       } catch (eor) {
//         $nobyda.AnError("京东转盘-查询", "JDTurn", eor, response, data)
//       } finally {
//         reject()
//       }
//     })
//     if (out) setTimeout(reject, out + s)
//   }).then(data => {
//     return JingDongTurnSign(s, data);
//   }, () => {});
// }

function JingDongTurn(s) {
  if (!merge.JDTurn) merge.JDTurn = {}, merge.JDTurn.notify = "", merge.JDTurn.success = 0, merge.JDTurn.bean = 0;
  return new Promise(resolve => {
    if (disable("JDTurn")) return resolve();
    setTimeout(() => {
      const JDTUrl = {
        url: `https://api.m.jd.com/client.action?functionId=babelGetLottery`,
        headers: {
          Cookie: KEY
        },
        body: 'body=%7B%22enAwardK%22%3A%2295d235f2a09578c6613a1a029b26d12d%22%2C%22riskParam%22%3A%7B%7D%7D&client=wh5'
      };
      $nobyda.post(JDTUrl, async function(error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data)
            const Details = LogDetails ? "response:\n" + data : '';
            const also = merge.JDTurn.notify ? true : false
            if (cc.code == 3) {
              console.log("\n" + "京东转盘Cookie失效 " + Details)
              merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: Cookie失效!!"
              merge.JDTurn.fail = 1
            } else if (data.match(/(\"T216\"|活动结束)/)) {
              merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: 活动结束 "
              merge.JDTurn.fail = 1
            } else if (data.match(/\d+京豆/)) {
              console.log("\n" + "京东商城-转盘签到成功 " + Details)
              merge.JDTurn.bean += (cc.prizeName && cc.prizeName.split(/(\d+)/)[1]) || 0
              merge.JDTurn.notify += `${also?`\n`:``}京东商城-转盘: ${also?`多次`:`成功`}, 明细: ${merge.JDTurn.bean||`无`}京豆 `
              merge.JDTurn.success += 1
              if (cc.chances > 0) {
                await JingDongTurnSign(2000)
              }
            } else if (data.match(/未中奖|擦肩而过/)) {
              merge.JDTurn.notify += `${also?`\n`:``}京东商城-转盘: ${also?`多次`:`成功`}, 状态: 未中奖 `
              merge.JDTurn.success += 1
              if (cc.chances > 0) {
                await JingDongTurnSign(2000)
              }
            } else {
              console.log("\n" + "京东商城-转盘签到失败 " + Details)
              merge.JDTurn.fail = 1
              if (data.match(/(机会已用完|次数为0)/)) {
                merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: 已转过 "
              } else if (data.match(/(T210|密码)/)) {
                merge.JDTurn.notify = "京东商城-转盘: 失败, 原因: 无支付密码 "
              } else {
                merge.JDTurn.notify += `${also?`\n`:``}京东商城-转盘: 失败, 原因: 未知 ${also?` (多次)`:``}`
              }
            }
          }
        } catch (eor) {
          $nobyda.AnError("京东商城-转盘", "JDTurn", eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingRongSteel(s, body) {
  merge.JRSteel = {};
  return new Promise(resolve => {
    if (disable("JRSteel")) return resolve();
    if (!body) {
      merge.JRSteel.fail = 1;
      merge.JRSteel.notify = "京东金融-钢镚: 失败, 未获取签到Body ";
      return resolve();
    }
    setTimeout(() => {
      const JRSUrl = {
        url: 'https://ms.jr.jd.com/gw/generic/hy/h5/m/appSign',
        headers: {
          Cookie: KEY
        },
        body: body || ''
      };
      $nobyda.post(JRSUrl, function(error, response, data) {
        try {
          if (error) throw new Error(error)
          const cc = JSON.parse(data)
          const Details = LogDetails ? "response:\n" + data : '';
          if (cc.resultCode == 0 && cc.resultData && cc.resultData.resBusiCode == 0) {
            console.log("\n" + "京东金融-钢镚签到成功 " + Details)
            merge.JRSteel.notify = `京东金融-钢镚: 成功, 获得钢镚奖励 `
            merge.JRSteel.success = 1
          } else {
            console.log("\n" + "京东金融-钢镚签到失败 " + Details)
            merge.JRSteel.fail = 1
            if (cc.resultCode == 0 && cc.resultData && cc.resultData.resBusiCode == 15) {
              merge.JRSteel.notify = "京东金融-钢镚: 失败, 原因: 已签过 "
            } else if (data.match(/未实名/)) {
              merge.JRSteel.notify = "京东金融-钢镚: 失败, 账号未实名 "
            } else if (cc.resultCode == 3) {
              merge.JRSteel.notify = "京东金融-钢镚: 失败, 原因: Cookie失效!!"
            } else {
              const ng = (cc.resultData && cc.resultData.resBusiMsg) || cc.resultMsg
              merge.JRSteel.notify = `京东金融-钢镚: 失败, ${`原因: ${ng||`未知`}`} `
            }
          }
        } catch (eor) {
          $nobyda.AnError("京东金融-钢镚", "JRSteel", eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongShake(s) {
  if (!merge.JDShake) merge.JDShake = {}, merge.JDShake.success = 0, merge.JDShake.bean = 0, merge.JDShake.notify = '';
  return new Promise(resolve => {
    if (disable("JDShake")) return resolve()
    setTimeout(() => {
      const JDSh = {
        url: 'https://api.m.jd.com/client.action?appid=vip_h5&functionId=vvipclub_shaking',
        headers: {
          Cookie: KEY,
        }
      };
      $nobyda.get(JDSh, async function(error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            const also = merge.JDShake.notify ? true : false
            if (data.match(/prize/)) {
              console.log("\n" + "京东商城-摇一摇签到成功 " + Details)
              merge.JDShake.success += 1
              if (cc.data.prizeBean) {
                merge.JDShake.bean += cc.data.prizeBean.count || 0
                merge.JDShake.notify += `${also?`\n`:``}京东商城-摇摇: ${also?`多次`:`成功`}, 明细: ${merge.JDShake.bean || `无`}京豆 `
              } else if (cc.data.prizeCoupon) {
                merge.JDShake.notify += `${also?`\n`:``}京东商城-摇摇: ${also?`多次, `:``}获得满${cc.data.prizeCoupon.quota}减${cc.data.prizeCoupon.discount}优惠券→ ${cc.data.prizeCoupon.limitStr}`
              } else {
                merge.JDShake.notify += `${also?`\n`:``}京东商城-摇摇: 成功, 明细: 未知 ${also?` (多次)`:``}`
              }
              if (cc.data.luckyBox.freeTimes != 0) {
                await JingDongShake(s)
              }
            } else {
              console.log("\n" + "京东商城-摇一摇签到失败 " + Details)
              if (data.match(/true/)) {
                merge.JDShake.notify += `${also?`\n`:``}京东商城-摇摇: 成功, 明细: 无奖励 ${also?` (多次)`:``}`
                merge.JDShake.success += 1
                if (cc.data.luckyBox.freeTimes != 0) {
                  await JingDongShake(s)
                }
              } else {
                merge.JDShake.fail = 1
                if (data.match(/(无免费|8000005|9000005)/)) {
                  merge.JDShake.notify = "京东商城-摇摇: 失败, 原因: 已摇过 "
                } else if (data.match(/(未登录|101)/)) {
                  merge.JDShake.notify = "京东商城-摇摇: 失败, 原因: Cookie失效!!"
                } else {
                  merge.JDShake.notify += `${also?`\n`:``}京东商城-摇摇: 失败, 原因: 未知 ${also?` (多次)`:``}`
                }
              }
            }
          }
        } catch (eor) {
          $nobyda.AnError("京东商城-摇摇", "JDShake", eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDUserSignPre(s, key, title, ac) {
  merge[key] = {};
  if ($nobyda.isJSBox) {
    return JDUserSignPre2(s, key, title, ac);
  } else {
    return JDUserSignPre1(s, key, title, ac);
  }
}

function JDUserSignPre1(s, key, title, acData, ask) {
  return new Promise((resolve, reject) => {
    if (disable(key, title, 1)) return reject()
    const JDUrl = {
      url: 'https://api.m.jd.com/?client=wh5&functionId=qryH5BabelFloors',
      headers: {
        Cookie: KEY
      },
      opts: {
        'filter': 'try{var od=JSON.parse(body);var params=(od.floatLayerList||[]).filter(o=>o.params&&o.params.match(/enActK/)).map(o=>o.params).pop()||(od.floorList||[]).filter(o=>o.template=="signIn"&&o.signInfos&&o.signInfos.params&&o.signInfos.params.match(/enActK/)).map(o=>o.signInfos&&o.signInfos.params).pop();var tId=(od.floorList||[]).filter(o=>o.boardParams&&o.boardParams.turnTableId).map(o=>o.boardParams.turnTableId).pop();var page=od.paginationFlrs;return JSON.stringify({qxAct:params||null,qxTid:tId||null,qxPage:page||null})}catch(e){return `=> 过滤器发生错误: ${e.message}`}'
      },
      body: `body=${encodeURIComponent(`{"activityId":"${acData}"${ask?`,"paginationParam":"2","paginationFlrs":"${ask}"`:``}}`)}`
    };
    $nobyda.post(JDUrl, async function(error, response, data) {
      try {
        if (error) {
          throw new Error(error)
        } else {
          const od = JSON.parse(data || '{}');
          const turnTableId = od.qxTid || (od.floorList || []).filter(o => o.boardParams && o.boardParams.turnTableId).map(o => o.boardParams.turnTableId).pop();
          const page = od.qxPage || od.paginationFlrs;
          if (data.match(/enActK/)) { // 含有签到活动数据
            let params = od.qxAct || (od.floatLayerList || []).filter(o => o.params && o.params.match(/enActK/)).map(o => o.params).pop()
            if (!params) { // 第一处找到签到所需数据
              // floatLayerList未找到签到所需数据，从floorList中查找
              let signInfo = (od.floorList || []).filter(o => o.template == 'signIn' && o.signInfos && o.signInfos.params && o.signInfos.params.match(/enActK/))
                .map(o => o.signInfos).pop();
              if (signInfo) {
                if (signInfo.signStat == '1') {
                  console.log(`\n${title}重复签到`)
                  merge[key].notify = `${title}: 失败, 原因: 已签过 `
                  merge[key].fail = 1
                } else {
                  params = signInfo.params;
                }
              } else {
                merge[key].notify = `${title}: 失败, 活动查找异常 `
                merge[key].fail = 1
              }
            }
            if (params) {
              return resolve({
                params: params
              }); // 执行签到处理
            }
          } else if (turnTableId) { // 无签到数据, 但含有关注店铺签到
            const boxds = $nobyda.read("JD_Follow_disable") === "false" ? false : true
            if (boxds) {
              console.log(`\n${title}关注店铺`)
              return resolve(parseInt(turnTableId))
            } else {
              merge[key].notify = `${title}: 失败, 需要关注店铺 `
              merge[key].fail = 1
            }
          } else if (page && !ask) { // 无签到数据, 尝试带参查询
            const boxds = $nobyda.read("JD_Retry_disable") === "false" ? false : true
            if (boxds) {
              console.log(`\n${title}二次查询`)
              return resolve(page)
            } else {
              merge[key].notify = `${title}: 失败, 请尝试开启增强 `
              merge[key].fail = 1
            }
          } else {
            merge[key].notify = `${title}: 失败, ${!data ? `需要手动执行` : `不含活动数据`} `
            merge[key].fail = 1
          }
        }
        reject()
      } catch (eor) {
        $nobyda.AnError(title, key, eor, response, data)
        reject()
      }
    })
    if (out) setTimeout(reject, out + s)
  }).then(data => {
    disable(key, title, 2)
    if (typeof(data) == "object") return JDUserSign1(s, key, title, encodeURIComponent(JSON.stringify(data)));
    if (typeof(data) == "number") return JDUserSign2(s, key, title, data, acData);
    if (typeof(data) == "string") return JDUserSignPre1(s, key, title, acData, data);
  }, () => disable(key, title, 2))
}

function JDUserSignPre2(s, key, title, acData) {
  return new Promise((resolve, reject) => {
    if (disable(key, title, 1)) return reject()
    const JDUrl = {
      url: `https://pro.m.jd.com/mall/active/${acData}/index.html`,
      headers: {
        Cookie: KEY,
      }
    };
    $nobyda.get(JDUrl, async function(error, response, data) {
      try {
        if (error) {
          throw new Error(error)
        } else {
          const act = data.match(/\"params\":\"\{\\\"enActK.+?\\\"\}\"/)
          const turnTable = data.match(/\"turnTableId\":\"(\d+)\"/)
          const page = data.match(/\"paginationFlrs\":\"(\[\[.+?\]\])\"/)
          if (act) { // 含有签到活动数据
            return resolve(act)
          } else if (turnTable) { // 无签到数据, 但含有关注店铺签到
            const boxds = $nobyda.read("JD_Follow_disable") === "false" ? false : true
            if (boxds) {
              console.log(`\n${title}关注店铺`)
              return resolve(parseInt(turnTable[1]))
            } else {
              merge[key].notify = `${title}: 失败, 需要关注店铺 `
              merge[key].fail = 1
            }
          } else if (page) { // 无签到数据, 尝试带参查询
            const boxds = $nobyda.read("JD_Retry_disable") === "false" ? false : true
            if (boxds) {
              console.log(`\n${title}二次查询`)
              return resolve(page[1])
            } else {
              merge[key].notify = `${title}: 失败, 请尝试开启增强 `
              merge[key].fail = 1
            }
          } else {
            merge[key].notify = `${title}: 失败, ${!data ? `需要手动执行` : `不含活动数据`} `
            merge[key].fail = 1
          }
        }
        reject()
      } catch (eor) {
        $nobyda.AnError(title, key, eor, response, data)
        reject()
      }
    })
    if (out) setTimeout(reject, out + s)
  }).then(data => {
    disable(key, title, 2)
    if (typeof(data) == "object") return JDUserSign1(s, key, title, encodeURIComponent(`{${data}}`));
    if (typeof(data) == "number") return JDUserSign2(s, key, title, data, acData)
    if (typeof(data) == "string") return JDUserSignPre1(s, key, title, acData, data)
  }, () => disable(key, title, 2))
}

function JDUserSign1(s, key, title, body) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=userSign',
        headers: {
          Cookie: KEY
        },
        body: `body=${body}&client=wh5`
      };
      $nobyda.post(JDUrl, function(error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const Details = LogDetails ? `response:\n${data}` : '';
            if (data.match(/签到成功/)) {
              console.log(`\n${title}签到成功(1)${Details}`)
              if (data.match(/\"text\":\"\d+京豆\"/)) {
                merge[key].bean = data.match(/\"text\":\"(\d+)京豆\"/)[1]
              }
              merge[key].notify = `${title}: 成功, 明细: ${merge[key].bean || '无'}京豆 `
              merge[key].success = 1
            } else {
              console.log(`\n${title}签到失败(1)${Details}`)
              if (data.match(/(已签到|已领取)/)) {
                merge[key].notify = `${title}: 失败, 原因: 已签过 `
              } else if (data.match(/(不存在|已结束|未开始)/)) {
                merge[key].notify = `${title}: 失败, 原因: 活动已结束 `
              } else if (data.match(/\"code\":\"?3\"?/)) {
                merge[key].notify = `${title}: 失败, 原因: Cookie失效!!`
              } else {
                const ng = data.match(/\"(errorMessage|subCodeMsg)\":\"(.+?)\"/)
                merge[key].notify = `${title}: 失败, ${ng?ng[2]:`原因: 未知`} `
              }
              merge[key].fail = 1
            }
          }
        } catch (eor) {
          $nobyda.AnError(title, key, eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

async function JDUserSign2(s, key, title, tid, acData) {
  await new Promise(resolve => {
    let lkt = new Date().getTime()
    let lks = md5('' + 'q8DNJdpcfRQ69gIx' + lkt).toString()
    $nobyda.get({
      url: `https://jdjoy.jd.com/api/turncard/channel/detail?turnTableId=${tid}&invokeKey=q8DNJdpcfRQ69gIx`,
      headers: {
        Cookie: KEY,
        'lkt': lkt,
        'lks': lks
      }
    }, async function(error, response, data) {
      try {
        if(data) {
          data = JSON.parse(data);
          if (data.success && data.data) {
            data = data.data
            if (!data.hasSign) {
              let ss = await Faker.getBody(`https://prodev.m.jd.com/mall/active/${acData}/index.html`)
              fp = ss.fp
              await getEid(ss, title)
            }
          }
        }
      } catch(eor) {
        $nobyda.AnError(title, key, eor, response, data)
      } finally {
        resolve()
      }
    })
    if (out) setTimeout(resolve, out + s)
  });
  return new Promise(resolve => {
    setTimeout(() => {
      let lkt = new Date().getTime()
      let lks = md5('' + 'q8DNJdpcfRQ69gIx' + lkt).toString()
      const JDUrl = {
        url: 'https://jdjoy.jd.com/api/turncard/channel/sign?invokeKey=q8DNJdpcfRQ69gIx',
        headers: {
          Cookie: KEY,
          'lkt': lkt,
          'lks': lks
        },
        body: `turnTableId=${tid}&fp=${fp}&eid=${eid}`
      };
      $nobyda.post(JDUrl, function(error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const Details = LogDetails ? `response:\n${data}` : '';
            if (data.match(/\"success\":true/)) {
              console.log(`\n${title}签到成功(2)${Details}`)
              if (data.match(/\"jdBeanQuantity\":\d+/)) {
                merge[key].bean = data.match(/\"jdBeanQuantity\":(\d+)/)[1]
              }
              merge[key].notify = `${title}: 成功, 明细: ${merge[key].bean || '无'}京豆 `
              merge[key].success = 1
            } else {
              const captcha = /请进行验证/.test(data);
              if (data.match(/(已经签到|已经领取)/)) {
                merge[key].notify = `${title}: 失败, 原因: 已签过 `
              } else if (data.match(/(不存在|已结束|未开始)/)) {
                merge[key].notify = `${title}: 失败, 原因: 活动已结束 `
              } else if (data.match(/(没有登录|B0001)/)) {
                merge[key].notify = `${title}: 失败, 原因: Cookie失效!!`
              } else if (!captcha) {
                const ng = data.match(/\"(errorMessage|subCodeMsg)\":\"(.+?)\"/)
                merge[key].notify = `${title}: 失败, ${ng?ng[2]:`原因: 未知`} `
              }
              if (!captcha) merge[key].fail = 1;
              console.log(`\n${title}签到失败(2)${captcha?`\n需要拼图验证, 跳过通知记录 `:``}${Details}`)
            }
          }
        } catch (eor) {
          $nobyda.AnError(title, key, eor, response, data)
        } finally {
          resolve()
        }
      })
    }, 200 + s)
    if (out) setTimeout(resolve, out + s + 200)
  });
}

function JDFlashSale(s) {
  merge.JDFSale = {};
  return new Promise(resolve => {
    if (disable("JDFSale")) return resolve()
    setTimeout(() => {
      const JDPETUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=partitionJdSgin',
        headers: {
          Cookie: KEY
        },
        body: "body=%7B%22version%22%3A%22v2%22%7D&client=apple&clientVersion=9.0.8&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=6768e2cf625427615dd89649dd367d41&st=1597248593305&sv=121"
      };
      $nobyda.post(JDPETUrl, async function(error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (cc.result && cc.result.code == 0) {
              console.log("\n" + "京东商城-闪购签到成功 " + Details)
              merge.JDFSale.bean = cc.result.jdBeanNum || 0
              merge.JDFSale.notify = "京东商城-闪购: 成功, 明细: " + (merge.JDFSale.bean || "无") + "京豆 "
              merge.JDFSale.success = 1
            } else {
              console.log("\n" + "京东商城-闪购签到失败 " + Details)
              if (data.match(/(已签到|已领取|\"2005\")/)) {
                merge.JDFSale.notify = "京东商城-闪购: 失败, 原因: 已签过 "
              } else if (data.match(/不存在|已结束|\"2008\"|\"3001\"/)) {
                await FlashSaleDivide(s); //瓜分京豆
                return
              } else if (data.match(/(\"code\":\"3\"|\"1003\")/)) {
                merge.JDFSale.notify = "京东商城-闪购: 失败, 原因: Cookie失效!!"
              } else {
                const msg = data.match(/\"msg\":\"([\u4e00-\u9fa5].+?)\"/)
                merge.JDFSale.notify = `京东商城-闪购: 失败, ${msg ? msg[1] : `原因: 未知`} `
              }
              merge.JDFSale.fail = 1
            }
          }
        } catch (eor) {
          $nobyda.AnError("京东商城-闪购", "JDFSale", eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function FlashSaleDivide(s) {
  return new Promise(resolve => {
    setTimeout(() => {
      const Url = {
        url: 'https://api.m.jd.com/client.action?functionId=partitionJdShare',
        headers: {
          Cookie: KEY
        },
        body: "body=%7B%22version%22%3A%22v2%22%7D&client=apple&clientVersion=9.0.8&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=49baa3b3899b02bbf06cdf41fe191986&st=1597682588351&sv=111"
      };
      $nobyda.post(Url, function(error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (cc.result.code == 0) {
              merge.JDFSale.success = 1
              merge.JDFSale.bean = cc.result.jdBeanNum || 0
              merge.JDFSale.notify = "京东闪购-瓜分: 成功, 明细: " + (merge.JDFSale.bean || "无") + "京豆 "
              console.log("\n" + "京东闪购-瓜分签到成功 " + Details)
            } else {
              merge.JDFSale.fail = 1
              console.log("\n" + "京东闪购-瓜分签到失败 " + Details)
              if (data.match(/已参与|已领取|\"2006\"/)) {
                merge.JDFSale.notify = "京东闪购-瓜分: 失败, 原因: 已瓜分 "
              } else if (data.match(/不存在|已结束|未开始|\"2008\"|\"2012\"/)) {
                merge.JDFSale.notify = "京东闪购-瓜分: 失败, 原因: 活动已结束 "
              } else if (data.match(/\"code\":\"1003\"|未获取/)) {
                merge.JDFSale.notify = "京东闪购-瓜分: 失败, 原因: Cookie失效!!"
              } else {
                const msg = data.match(/\"msg\":\"([\u4e00-\u9fa5].+?)\"/)
                merge.JDFSale.notify = `京东闪购-瓜分: 失败, ${msg ? msg[1] : `原因: 未知`} `
              }
            }
          }
        } catch (eor) {
          $nobyda.AnError("京东闪购-瓜分", "JDFSale", eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongCash(s) {
  merge.JDCash = {};
  return new Promise(resolve => {
    if (disable("JDCash")) return resolve()
    setTimeout(() => {
      const JDCAUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=ccSignInNew',
        headers: {
          Cookie: KEY
        },
        body: "body=%7B%22pageClickKey%22%3A%22CouponCenter%22%2C%22eid%22%3A%22O5X6JYMZTXIEX4VBCBWEM5PTIZV6HXH7M3AI75EABM5GBZYVQKRGQJ5A2PPO5PSELSRMI72SYF4KTCB4NIU6AZQ3O6C3J7ZVEP3RVDFEBKVN2RER2GTQ%22%2C%22shshshfpb%22%3A%22v1%5C%2FzMYRjEWKgYe%2BUiNwEvaVlrHBQGVwqLx4CsS9PH1s0s0Vs9AWk%2B7vr9KSHh3BQd5NTukznDTZnd75xHzonHnw%3D%3D%22%2C%22childActivityUrl%22%3A%22openapp.jdmobile%253a%252f%252fvirtual%253fparams%253d%257b%255c%2522category%255c%2522%253a%255c%2522jump%255c%2522%252c%255c%2522des%255c%2522%253a%255c%2522couponCenter%255c%2522%257d%22%2C%22monitorSource%22%3A%22cc_sign_ios_index_config%22%7D&client=apple&clientVersion=8.5.0&d_brand=apple&d_model=iPhone8%2C2&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&scope=11&screen=1242%2A2208&sign=1cce8f76d53fc6093b45a466e93044da&st=1581084035269&sv=102"
      };
      $nobyda.post(JDCAUrl, function(error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (cc.busiCode == "0") {
              console.log("\n" + "京东现金-红包签到成功 " + Details)
              merge.JDCash.success = 1
              merge.JDCash.Cash = cc.result.signResult.signData.amount || 0
              merge.JDCash.notify = `京东现金-红包: 成功, 明细: ${merge.JDCash.Cash || `无`}红包 `
            } else {
              console.log("\n" + "京东现金-红包签到失败 " + Details)
              merge.JDCash.fail = 1
              if (data.match(/(\"busiCode\":\"1002\"|完成签到)/)) {
                merge.JDCash.notify = "京东现金-红包: 失败, 原因: 已签过 "
              } else if (data.match(/(不存在|已结束)/)) {
                merge.JDCash.notify = "京东现金-红包: 失败, 原因: 活动已结束 "
              } else if (data.match(/(\"busiCode\":\"3\"|未登录)/)) {
                merge.JDCash.notify = "京东现金-红包: 失败, 原因: Cookie失效!!"
              } else {
                const msg = data.split(/\"msg\":\"([\u4e00-\u9fa5].+?)\"/)[1];
                merge.JDCash.notify = `京东现金-红包: 失败, ${msg||`原因: 未知`} `
              }
            }
          }
        } catch (eor) {
          $nobyda.AnError("京东现金-红包", "JDCash", eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDMagicCube(s, sign) {
  merge.JDCube = {};
  return new Promise((resolve, reject) => {
    if (disable("JDCube")) return reject()
    const JDUrl = {
      url: `https://api.m.jd.com/client.action?functionId=getNewsInteractionInfo&appid=smfe${sign?`&body=${encodeURIComponent(`{"sign":${sign}}`)}`:``}`,
      headers: {
        Cookie: KEY,
      }
    };
    $nobyda.get(JDUrl, async (error, response, data) => {
      try {
        if (error) throw new Error(error)
        const Details = LogDetails ? "response:\n" + data : '';
        console.log(`\n京东魔方-尝试查询活动(${sign}) ${Details}`)
        if (data.match(/\"interactionId\":\d+/)) {
          resolve({
            id: data.match(/\"interactionId\":(\d+)/)[1],
            sign: sign || null
          })
        } else if (data.match(/配置异常/) && sign) {
          await JDMagicCube(s, sign == 2 ? 1 : null)
          reject()
        } else {
          resolve(null)
        }
      } catch (eor) {
        $nobyda.AnError("京东魔方-查询", "JDCube", eor, response, data)
        reject()
      }
    })
    if (out) setTimeout(reject, out + s)
  }).then(data => {
    return JDMagicCubeSign(s, data)
  }, () => {});
}

function JDMagicCubeSign(s, id) {
  return new Promise(resolve => {
    setTimeout(() => {
      const JDMCUrl = {
        url: `https://api.m.jd.com/client.action?functionId=getNewsInteractionLotteryInfo&appid=smfe${id?`&body=${encodeURIComponent(`{${id.sign?`"sign":${id.sign},`:``}"interactionId":${id.id}}`)}`:``}`,
        headers: {
          Cookie: KEY,
        }
      };
      $nobyda.get(JDMCUrl, function(error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (data.match(/(\"name\":)/)) {
              console.log("\n" + "京东商城-魔方签到成功 " + Details)
              merge.JDCube.success = 1
              if (data.match(/(\"name\":\"京豆\")/)) {
                merge.JDCube.bean = cc.result.lotteryInfo.quantity || 0
                merge.JDCube.notify = `京东商城-魔方: 成功, 明细: ${merge.JDCube.bean || `无`}京豆 `
              } else {
                merge.JDCube.notify = `京东商城-魔方: 成功, 明细: ${cc.result.lotteryInfo.name || `未知`} `
              }
            } else {
              console.log("\n" + "京东商城-魔方签到失败 " + Details)
              merge.JDCube.fail = 1
              if (data.match(/(一闪而过|已签到|已领取)/)) {
                merge.JDCube.notify = "京东商城-魔方: 失败, 原因: 无机会 "
              } else if (data.match(/(不存在|已结束)/)) {
                merge.JDCube.notify = "京东商城-魔方: 失败, 原因: 活动已结束 "
              } else if (data.match(/(\"code\":3)/)) {
                merge.JDCube.notify = "京东商城-魔方: 失败, 原因: Cookie失效!!"
              } else {
                merge.JDCube.notify = "京东商城-魔方: 失败, 原因: 未知 "
              }
            }
          }
        } catch (eor) {
          $nobyda.AnError("京东商城-魔方", "JDCube", eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongSubsidy(s) {
  merge.subsidy = {};
  return new Promise(resolve => {
    if (disable("subsidy")) return resolve()
    setTimeout(() => {
      const subsidyUrl = {
        url: 'https://ms.jr.jd.com/gw/generic/uc/h5/m/signIn7',
        headers: {
          Referer: "https://active.jd.com/forever/cashback/index",
          Cookie: KEY
        }
      };
      $nobyda.get(subsidyUrl, function(error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const Details = LogDetails ? "response:\n" + data : '';
            const cc = JSON.parse(data)
            if (cc.resultCode == 0 && cc.resultData.data && cc.resultData.data.thisAmount) {
              console.log("\n" + "京东商城-金贴签到成功 " + Details)
              merge.subsidy.subsidy = cc.resultData.data.thisAmountStr
              merge.subsidy.notify = `京东商城-金贴: 成功, 明细: ${merge.subsidy.subsidy||`无`}金贴 `
              merge.subsidy.success = 1
            } else {
              console.log("\n" + "京东商城-金贴签到失败 " + Details)
              merge.subsidy.fail = 1
              if (data.match(/已存在|"thisAmount":0/)) {
                merge.subsidy.notify = "京东商城-金贴: 失败, 原因: 无金贴 "
              } else if (data.match(/请先登录/)) {
                merge.subsidy.notify = "京东商城-金贴: 失败, 原因: Cookie失效!!"
              } else {
                const msg = data.split(/\"msg\":\"([\u4e00-\u9fa5].+?)\"/)[1];
                merge.subsidy.notify = `京东商城-金贴: 失败, ${msg||`原因: 未知`} `
              }
            }
          }
        } catch (eor) {
          $nobyda.AnError("京东商城-金贴", "subsidy", eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingRongDoll(s, key, title, code, type, num, award, belong) {
  merge[key] = {};
  return new Promise(resolve => {
    if (disable(key)) return resolve()
    setTimeout(() => {
      const DollUrl = {
        url: "https://nu.jr.jd.com/gw/generic/jrm/h5/m/process",
        headers: {
          Cookie: KEY
        },
        body: `reqData=${encodeURIComponent(`{"actCode":"${code}","type":${type?type:`3`}${code=='F68B2C3E71'?`,"frontParam":{"belong":"${belong}"}`:code==`1DF13833F7`?`,"frontParam":{"channel":"JR","belong":4}`:``}}`)}`
      };
      $nobyda.post(DollUrl, async function(error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            var cc = JSON.parse(data)
            const Details = LogDetails ? "response:\n" + data : '';
            if (cc.resultCode == 0) {
              if (cc.resultData.data.businessData != null) {
                console.log(`\n${title}查询成功 ${Details}`)
                if (cc.resultData.data.businessData.pickStatus == 2) {
                  if (data.match(/\"rewardPrice\":\"\d.*?\"/)) {
                    const JRDoll_bean = data.match(/\"rewardPrice\":\"(\d.*?)\"/)[1]
                    const JRDoll_type = data.match(/\"rewardName\":\"金贴奖励\"/) ? true : false
                    await JingRongDoll(s, key, title, code, '4', JRDoll_bean, JRDoll_type)
                  } else {
                    merge[key].success = 1
                    merge[key].notify = `${title}: 成功, 明细: 无奖励 `
                  }
                } else if (code == 'F68B2C3E71' || code == '1DF13833F7') {
                  if (!data.match(/"businessCode":"30\dss?q"/)) {
                    merge[key].success = 1
                    const ct = data.match(/\"count\":\"?(\d.*?)\"?,/)
                    if (code == 'F68B2C3E71' && belong == 'xianjin') {
                      merge[key].Money = ct ? ct[1] > 9 ? `0.${ct[1]}` : `0.0${ct[1]}` : 0
                      merge[key].notify = `${title}: 成功, 明细: ${merge[key].Money||`无`}现金 `
                    } else if (code == 'F68B2C3E71' && belong == 'jingdou') {
                      merge[key].bean = ct ? ct[1] : 0;
                      merge[key].notify = `${title}: 成功, 明细: ${merge[key].bean||`无`}京豆 `
                    } else if (code == '1DF13833F7') {
                      merge[key].subsidy = ct ? ct[1] : 0;
                      merge[key].notify = `${title}: 成功, 明细: ${merge[key].subsidy||`无`}金贴 `
                    }
                  } else {
                    const es = cc.resultData.data.businessMsg
                    const ep = cc.resultData.data.businessData.businessMsg
                    const tp = data.match(/已领取|300ss?q/) ? `已签过` : `${ep||es||cc.resultMsg||`未知`}`
                    merge[key].notify = `${title}: 失败, 原因: ${tp} `
                    merge[key].fail = 1
                  }
                } else {
                  merge[key].notify = `${title}: 失败, 原因: 已签过 `;
                  merge[key].fail = 1
                }
              } else if (cc.resultData.data.businessCode == 200) {
                console.log(`\n${title}签到成功 ${Details}`)
                if (!award) {
                  merge[key].bean = num ? num.match(/\d+/)[0] : 0
                } else {
                  merge[key].subsidy = num || 0
                }
                merge[key].success = 1
                merge[key].notify = `${title}: 成功, 明细: ${(award?num:merge[key].bean)||`无`}${award?`金贴 `:`京豆 `}`
              } else {
                console.log(`\n${title}领取异常 ${Details}`)
                if (num) console.log(`\n${title} 请尝试手动领取, 预计可得${num}${award?`金贴`:`京豆`}: \nhttps://uf1.jr.jd.com/up/redEnvelopes/index.html?actCode=${code}\n`);
                merge[key].fail = 1;
                merge[key].notify = `${title}: 失败, 原因: 领取异常 `;
              }
            } else {
              console.log(`\n${title}签到失败 ${Details}`)
              const redata = typeof(cc.resultData) == 'string' ? cc.resultData : ''
              merge[key].notify = `${title}: 失败, ${cc.resultCode==3?`原因: Cookie失效!!`:`${redata||'原因: 未知 '}`}`
              merge[key].fail = 1;
            }
          }
        } catch (eor) {
          $nobyda.AnError(title, key, eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongGetCash(s) {
  merge.JDGetCash = {};
  return new Promise(resolve => {
    if (disable("JDGetCash")) return resolve()
    setTimeout(() => {
      const GetCashUrl = {
        url: 'https://api.m.jd.com/client.action?functionId=cash_sign&body=%7B%22remind%22%3A0%2C%22inviteCode%22%3A%22%22%2C%22type%22%3A0%2C%22breakReward%22%3A0%7D&client=apple&clientVersion=9.0.8&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=7e2f8bcec13978a691567257af4fdce9&st=1596954745073&sv=111',
        headers: {
          Cookie: KEY,
        }
      };
      $nobyda.get(GetCashUrl, function(error, response, data) {
        try {
          if (error) {
            throw new Error(error)
          } else {
            const cc = JSON.parse(data);
            const Details = LogDetails ? "response:\n" + data : '';
            if (cc.data.success && cc.data.result) {
              console.log("\n" + "京东商城-现金签到成功 " + Details)
              merge.JDGetCash.success = 1
              merge.JDGetCash.Money = cc.data.result.signCash || 0
              merge.JDGetCash.notify = `京东商城-现金: 成功, 明细: ${cc.data.result.signCash||`无`}现金 `
            } else {
              console.log("\n" + "京东商城-现金签到失败 " + Details)
              merge.JDGetCash.fail = 1
              if (data.match(/\"bizCode\":201|已经签过/)) {
                merge.JDGetCash.notify = "京东商城-现金: 失败, 原因: 已签过 "
              } else if (data.match(/\"code\":300|退出登录/)) {
                merge.JDGetCash.notify = "京东商城-现金: 失败, 原因: Cookie失效!!"
              } else {
                merge.JDGetCash.notify = "京东商城-现金: 失败, 原因: 未知 "
              }
            }
          }
        } catch (eor) {
          $nobyda.AnError("京东商城-现金", "JDGetCash", eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JingDongStore(s) {
  merge.JDGStore = {};
  return new Promise(resolve => {
    if (disable("JDGStore")) return resolve()
    setTimeout(() => {
      $nobyda.get({
        url: 'https://api.m.jd.com/api?appid=jdsupermarket&functionId=smtg_sign&clientVersion=8.0.0&client=m&body=%7B%7D',
        headers: {
          Cookie: KEY,
          Origin: `https://jdsupermarket.jd.com`
        }
      }, (error, response, data) => {
        try {
          if (error) throw new Error(error);
          const cc = JSON.parse(data);
          const Details = LogDetails ? "response:\n" + data : '';
          if (cc.data && cc.data.success === true && cc.data.bizCode === 0) {
            console.log(`\n京东商城-超市签到成功 ${Details}`)
            merge.JDGStore.success = 1
            merge.JDGStore.bean = cc.data.result.jdBeanCount || 0
            merge.JDGStore.notify = `京东商城-超市: 成功, 明细: ${merge.JDGStore.bean||`无`}京豆 `
          } else {
            if (!cc.data) cc.data = {}
            console.log(`\n京东商城-超市签到失败 ${Details}`)
            const tp = cc.data.bizCode == 811 ? `已签过` : cc.data.bizCode == 300 ? `Cookie失效` : `${cc.data.bizMsg||`未知`}`
            merge.JDGStore.notify = `京东商城-超市: 失败, 原因: ${tp}${cc.data.bizCode==300?`!!`:` `}`
            merge.JDGStore.fail = 1
          }
        } catch (eor) {
          $nobyda.AnError("京东商城-超市", "JDGStore", eor, response, data)
        } finally {
          resolve()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  });
}

function JDSecKilling(s) { //领券中心
  merge.JDSecKill = {};
  return new Promise((resolve, reject) => {
    if (disable("JDSecKill")) return reject();
    setTimeout(() => {
      $nobyda.post({
        url: 'https://api.m.jd.com/client.action',
        headers: {
          Cookie: KEY,
          Origin: 'https://h5.m.jd.com'
        },
        body: 'functionId=homePageV2&appid=SecKill2020'
      }, (error, response, data) => {
        try {
          if (error) throw new Error(error);
          const Details = LogDetails ? "response:\n" + data : '';
          const cc = JSON.parse(data);
          if (cc.code == 203 || cc.code == 3 || cc.code == 101) {
            merge.JDSecKill.notify = `京东秒杀-红包: 失败, 原因: Cookie失效!!`;
          } else if (cc.result && cc.result.projectId && cc.result.taskId) {
            console.log(`\n京东秒杀-红包查询成功 ${Details}`)
            return resolve({
              projectId: cc.result.projectId,
              taskId: cc.result.taskId
            })
          } else {
            merge.JDSecKill.notify = `京东秒杀-红包: 失败, 暂无有效活动 `;
          }
          merge.JDSecKill.fail = 1;
          console.log(`\n京东秒杀-红包查询失败 ${Details}`)
          reject()
        } catch (eor) {
          $nobyda.AnError("京东秒杀-查询", "JDSecKill", eor, response, data)
          reject()
        }
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  }).then(async (id) => {
    await new Promise(resolve => {
      $nobyda.post({
        url: 'https://api.m.jd.com/client.action',
        headers: {
          Cookie: KEY,
          Origin: 'https://h5.m.jd.com'
        },
        body: `functionId=doInteractiveAssignment&body=%7B%22encryptProjectId%22%3A%22${id.projectId}%22%2C%22encryptAssignmentId%22%3A%22${id.taskId}%22%2C%22completionFlag%22%3Atrue%7D&client=wh5&appid=SecKill2020`
      }, (error, response, data) => {
        try {
          if (error) throw new Error(error);
          const Details = LogDetails ? "response:\n" + data : '';
          const cc = JSON.parse(data);
          if (cc.code == 0 && cc.subCode == 0) {
            console.log(`\n京东秒杀-红包签到成功 ${Details}`);
            const qt = data.match(/"discount":(\d.*?),/);
            merge.JDSecKill.success = 1;
            merge.JDSecKill.Cash = qt ? qt[1] : 0;
            merge.JDSecKill.notify = `京东秒杀-红包: 成功, 明细: ${merge.JDSecKill.Cash||`无`}红包 `;
          } else {
            console.log(`\n京东秒杀-红包签到失败 ${Details}`);
            merge.JDSecKill.fail = 1;
            merge.JDSecKill.notify = `京东秒杀-红包: 失败, ${cc.subCode==103?`原因: 已领取`:cc.msg?cc.msg:`原因: 未知`} `;
          }
        } catch (eor) {
          $nobyda.AnError("京东秒杀-领取", "JDSecKill", eor, response, data);
        } finally {
          resolve();
        }
      })
    })
  }, () => {});
}

function TotalSteel() {
  merge.TotalSteel = {};
  return new Promise(resolve => {
    if (disable("TSteel")) return resolve()
    $nobyda.get({
      url: 'https://coin.jd.com/m/gb/getBaseInfo.html',
      headers: {
        Cookie: KEY
      }
    }, (error, response, data) => {
      try {
        if (error) throw new Error(error);
        const Details = LogDetails ? "response:\n" + data : '';
        if (data.match(/(\"gbBalance\":\d+)/)) {
          console.log("\n" + "京东-总钢镚查询成功 " + Details)
          const cc = JSON.parse(data)
          merge.TotalSteel.TSteel = cc.gbBalance
        } else {
          console.log("\n" + "京东-总钢镚查询失败 " + Details)
        }
      } catch (eor) {
        $nobyda.AnError("账户钢镚-查询", "TotalSteel", eor, response, data)
      } finally {
        resolve()
      }
    })
    if (out) setTimeout(resolve, out)
  });
}

function getEid(ss, title) {
  return new Promise(resolve => {
    const options = {
      url: `https://gia.jd.com/fcf.html?a=${ss.a}`,
      body: `d=${ss.d}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    }
    $nobyda.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${title} 登录: API查询请求失败 !!!!`)
          throw new Error(err);
        } else {
          if (data.indexOf("*_*") > 0) {
            data = data.split("*_*", 2);
            data = JSON.parse(data[1]);
            eid = data.eid
          } else {
            console.log(`京豆api返回数据为空，请检查自身原因`)
          }
        }
      } catch (eor) {
        $nobyda.AnError(eor, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

function TotalBean() {
  merge.TotalBean = {};
  return new Promise(resolve => {
    if (disable("Qbear")) return resolve()
    $nobyda.get({
      url: 'https://me-api.jd.com/user_new/info/GetJDUserInfoUnion',
      headers: {
        Cookie: KEY
      }
    }, (error, response, data) => {
      try {
        if (error) throw new Error(error);
        const Details = LogDetails ? "response:\n" + data : '';
        const cc = JSON.parse(data)
        if (cc.msg == 'success' && cc.retcode == 0) {
          merge.TotalBean.nickname = cc.data.userInfo.baseInfo.nickname || ""
          merge.TotalBean.Qbear = cc.data.assetInfo.beanNum || 0
          $nobyda.headUrl = cc.data.userInfo.baseInfo.headImageUrl || ""
          console.log(`\n京东-总京豆查询成功 ${Details}`)
        } else {
          const name = decodeURIComponent(KEY.split(/pt_pin=(.+?);/)[1] || '');
          merge.TotalBean.nickname = cc.retcode == 1001 ? `${name} (CK失效!!)` : "";
          console.log(`\n京东-总京豆查询失败 ${Details}`)
        }
      } catch (eor) {
        $nobyda.AnError("账户京豆-查询", "TotalBean", eor, response, data)
      } finally {
        resolve()
      }
    })
    if (out) setTimeout(resolve, out)
  });
}

function TotalCash() {
  merge.TotalCash = {};
  return new Promise(resolve => {
    if (disable("TCash")) return resolve()
    $nobyda.post({
      url: 'https://api.m.jd.com/client.action?functionId=myhongbao_balance',
      headers: {
        Cookie: KEY
      },
      body: "body=%7B%22fp%22%3A%22-1%22%2C%22appToken%22%3A%22apphongbao_token%22%2C%22childActivityUrl%22%3A%22-1%22%2C%22country%22%3A%22cn%22%2C%22openId%22%3A%22-1%22%2C%22childActivityId%22%3A%22-1%22%2C%22applicantErp%22%3A%22-1%22%2C%22platformId%22%3A%22appHongBao%22%2C%22isRvc%22%3A%22-1%22%2C%22orgType%22%3A%222%22%2C%22activityType%22%3A%221%22%2C%22shshshfpb%22%3A%22-1%22%2C%22platformToken%22%3A%22apphongbao_token%22%2C%22organization%22%3A%22JD%22%2C%22pageClickKey%22%3A%22-1%22%2C%22platform%22%3A%221%22%2C%22eid%22%3A%22-1%22%2C%22appId%22%3A%22appHongBao%22%2C%22childActiveName%22%3A%22-1%22%2C%22shshshfp%22%3A%22-1%22%2C%22jda%22%3A%22-1%22%2C%22extend%22%3A%22-1%22%2C%22shshshfpa%22%3A%22-1%22%2C%22activityArea%22%3A%22-1%22%2C%22childActivityTime%22%3A%22-1%22%7D&client=apple&clientVersion=8.5.0&d_brand=apple&networklibtype=JDNetworkBaseAF&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=fdc04c3ab0ee9148f947d24fb087b55d&st=1581245397648&sv=120"
    }, (error, response, data) => {
      try {
        if (error) throw new Error(error);
        const Details = LogDetails ? "response:\n" + data : '';
        if (data.match(/(\"totalBalance\":\d+)/)) {
          console.log("\n" + "京东-总红包查询成功 " + Details)
          const cc = JSON.parse(data)
          merge.TotalCash.TCash = cc.totalBalance
        } else {
          console.log("\n" + "京东-总红包查询失败 " + Details)
        }
      } catch (eor) {
        $nobyda.AnError("账户红包-查询", "TotalCash", eor, response, data)
      } finally {
        resolve()
      }
    })
    if (out) setTimeout(resolve, out)
  });
}

function TotalSubsidy() {
  merge.TotalSubsidy = {};
  return new Promise(resolve => {
    if (disable("TotalSubsidy")) return resolve()
    $nobyda.get({
      url: 'https://ms.jr.jd.com/gw/generic/uc/h5/m/mySubsidyBalance',
      headers: {
        Cookie: KEY,
        Referer: 'https://active.jd.com/forever/cashback/index?channellv=wojingqb'
      }
    }, (error, response, data) => {
      try {
        if (error) throw new Error(error);
        const cc = JSON.parse(data)
        const Details = LogDetails ? "response:\n" + data : '';
        if (cc.resultCode == 0 && cc.resultData && cc.resultData.data) {
          console.log("\n京东-总金贴查询成功 " + Details)
          merge.TotalSubsidy.TSubsidy = cc.resultData.data.balance || 0
        } else {
          console.log("\n京东-总金贴查询失败 " + Details)
        }
      } catch (eor) {
        $nobyda.AnError("账户金贴-查询", "TotalSubsidy", eor, response, data)
      } finally {
        resolve()
      }
    })
    if (out) setTimeout(resolve, out)
  });
}

function TotalMoney() {
  merge.TotalMoney = {};
  return new Promise(resolve => {
    if (disable("TotalMoney")) return resolve()
    $nobyda.get({
      url: 'https://api.m.jd.com/client.action?functionId=cash_exchangePage&body=%7B%7D&build=167398&client=apple&clientVersion=9.1.9&openudid=1fce88cd05c42fe2b054e846f11bdf33f016d676&sign=762a8e894dea8cbfd91cce4dd5714bc5&st=1602179446935&sv=102',
      headers: {
        Cookie: KEY
      }
    }, (error, response, data) => {
      try {
        if (error) throw new Error(error);
        const cc = JSON.parse(data)
        const Details = LogDetails ? "response:\n" + data : '';
        if (cc.code == 0 && cc.data && cc.data.bizCode == 0 && cc.data.result) {
          console.log("\n京东-总现金查询成功 " + Details)
          merge.TotalMoney.TMoney = cc.data.result.totalMoney || 0
        } else {
          console.log("\n京东-总现金查询失败 " + Details)
        }
      } catch (eor) {
        $nobyda.AnError("账户现金-查询", "TotalMoney", eor, response, data)
      } finally {
        resolve()
      }
    })
    if (out) setTimeout(resolve, out)
  });
}

function disable(Val, name, way) {
  const read = $nobyda.read("JD_DailyBonusDisables")
  const annal = $nobyda.read("JD_Crash_" + Val)
  if (annal && way == 1 && boxdis) {
    var Crash = $nobyda.write("", "JD_Crash_" + Val)
    if (read) {
      if (read.indexOf(Val) == -1) {
        var Crash = $nobyda.write(`${read},${Val}`, "JD_DailyBonusDisables")
        console.log(`\n${name}-触发自动禁用 !!`)
        merge[Val].notify = `${name}: 崩溃, 触发自动禁用 !!`
        merge[Val].error = 1
        $nobyda.disable = 1
      }
    } else {
      var Crash = $nobyda.write(Val, "JD_DailyBonusDisables")
      console.log(`\n${name}-触发自动禁用 !!`)
      merge[Val].notify = `${name}: 崩溃, 触发自动禁用 !!`
      merge[Val].error = 1
      $nobyda.disable = 1
    }
    return true
  } else if (way == 1 && boxdis) {
    var Crash = $nobyda.write(name, "JD_Crash_" + Val)
  } else if (way == 2 && annal) {
    var Crash = $nobyda.write("", "JD_Crash_" + Val)
  }
  if (read && read.indexOf(Val) != -1) {
    return true
  } else {
    return false
  }
}

function Wait(readDelay, ini) {
  if (!readDelay || readDelay === '0') return 0
  if (typeof(readDelay) == 'string') {
    var readDelay = readDelay.replace(/"|＂|'|＇/g, ''); //prevent novice
    if (readDelay.indexOf('-') == -1) return parseInt(readDelay) || 0;
    const raw = readDelay.split("-").map(Number);
    const plan = parseInt(Math.random() * (raw[1] - raw[0] + 1) + raw[0], 10);
    if (ini) console.log(`\n初始化随机延迟: 最小${raw[0]/1000}秒, 最大${raw[1]/1000}秒`);
    // else console.log(`\n预计等待: ${(plan / 1000).toFixed(2)}秒`);
    return ini ? readDelay : plan
  } else if (typeof(readDelay) == 'number') {
    return readDelay > 0 ? readDelay : 0
  } else return 0
}

function CookieMove(oldCk1, oldCk2, oldKey1, oldKey2, newKey) {
  let update;
  const move = (ck, del) => {
    console.log(`京东${del}开始迁移!`);
    update = CookieUpdate(null, ck).total;
    update = $nobyda.write(JSON.stringify(update, null, 2), newKey);
    update = $nobyda.write("", del);
  }
  if (oldCk1) {
    const write = move(oldCk1, oldKey1);
  }
  if (oldCk2) {
    const write = move(oldCk2, oldKey2);
  }
}

function checkFormat(value) { //check format and delete duplicates
  let n, k, c = {};
  return value.reduce((t, i) => {
    k = ((i.cookie || '').match(/(pt_key|pt_pin)=.+?;/g) || []).sort();
    if (k.length == 2) {
      if ((n = k[1]) && !c[n]) {
        i.userName = i.userName ? i.userName : decodeURIComponent(n.split(/pt_pin=(.+?);/)[1]);
        i.cookie = k.join('')
        if (i.jrBody && !i.jrBody.includes('reqData=')) {
          console.log(`异常钢镚Body已过滤: ${i.jrBody}`)
          delete i.jrBody;
        }
        c[n] = t.push(i);
      }
    } else {
      console.log(`异常京东Cookie已过滤: ${i.cookie}`)
    }
    return t;
  }, [])
}

function CookieUpdate(oldValue, newValue, path = 'cookie') {
  let item, type, name = (oldValue || newValue || '').split(/pt_pin=(.+?);/)[1];
  let total = $nobyda.read('CookiesJD');
  try {
    total = checkFormat(JSON.parse(total || '[]'));
  } catch (e) {
    $nobyda.notify("京东签到", "", "Cookie JSON格式不正确, 即将清空\n可前往日志查看该数据内容!");
    console.log(`京东签到Cookie JSON格式异常: ${e.message||e}\n旧数据内容: ${total}`);
    total = [];
  }
  for (let i = 0; i < total.length; i++) {
    if (total[i].cookie && new RegExp(`pt_pin=${name};`).test(total[i].cookie)) {
      item = i;
      break;
    }
  }
  if (newValue && item !== undefined) {
    type = total[item][path] === newValue ? -1 : 2;
    total[item][path] = newValue;
    item = item + 1;
  } else if (newValue && path === 'cookie') {
    total.push({
      cookie: newValue
    });
    type = 1;
    item = total.length;
  }
  return {
    total: checkFormat(total),
    type, //-1: same, 1: add, 2:update
    item,
    name: decodeURIComponent(name)
  };
}

function GetCookie() {
  const req = $request;
  if (req.method != 'OPTIONS' && req.headers) {
    const CV = (req.headers['Cookie'] || req.headers['cookie'] || '');
    const ckItems = CV.match(/(pt_key|pt_pin)=.+?;/g);
    if (/^https:\/\/(me-|)api(\.m|)\.jd\.com\/(client\.|user_new)/.test(req.url)) {
      if (ckItems && ckItems.length == 2) {
        const value = CookieUpdate(null, ckItems.join(''))
        if (value.type !== -1) {
          const write = $nobyda.write(JSON.stringify(value.total, null, 2), "CookiesJD")
          $nobyda.notify(`用户名: ${value.name}`, ``, `${value.type==2?`更新`:`写入`}京东 [账号${value.item}] Cookie${write?`成功 `:`失败 !!`}`)
        } else {
          console.log(`\n用户名: ${value.name}\n与历史京东 [账号${value.item}] Cookie相同, 跳过写入 `)
        }
      } else {
        throw new Error("写入Cookie失败, 关键值缺失\n可能原因: 非网页获取 !!");
      }
    } else if (/^https:\/\/ms\.jr\.jd\.com\/gw\/generic\/hy\/h5\/m\/appSign\?/.test(req.url) && req.body) {
      const value = CookieUpdate(CV, req.body, 'jrBody');
      if (value.type) {
        const write = $nobyda.write(JSON.stringify(value.total, null, 2), "CookiesJD")
        $nobyda.notify(`用户名: ${value.name}`, ``, `获取京东 [账号${value.item}] 钢镚Body${write?`成功 `:`失败 !!`}`)
      } else {
        throw new Error("写入钢镚Body失败\n未获取该账号Cookie或关键值缺失!!");
      }
    } else if (req.url === 'http://www.apple.com/') {
      throw new Error("类型错误, 手动运行请选择上下文环境为Cron ");
    }
  } else if (!req.headers) {
    throw new Error("写入Cookie失败, 请检查匹配URL或配置内脚本类型 ");
  }
}

// Modified from yichahucha
function nobyda() {
  const start = Date.now()
  const isRequest = typeof $request != "undefined"
  const isSurge = typeof $httpClient != "undefined"
  const isQuanX = typeof $task != "undefined"
  const isLoon = typeof $loon != "undefined"
  const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
  const isNode = typeof require == "function" && !isJSBox;
  const NodeSet = 'CookieSet.json'
  const node = (() => {
    if (isNode) {
      const request = require('request');
      const fs = require("fs");
      const path = require("path");
      return ({
        request,
        fs,
        path
      })
    } else {
      return (null)
    }
  })()
  const notify = (title, subtitle, message, rawopts) => {
    const Opts = (rawopts) => { //Modified from https://github.com/chavyleung/scripts/blob/master/Env.js
      if (!rawopts) return rawopts
      if (typeof rawopts === 'string') {
        if (isLoon) return rawopts
        else if (isQuanX) return {
          'open-url': rawopts
        }
        else if (isSurge) return {
          url: rawopts
        }
        else return undefined
      } else if (typeof rawopts === 'object') {
        if (isLoon) {
          let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
          let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
          return {
            openUrl,
            mediaUrl
          }
        } else if (isQuanX) {
          let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
          let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
          return {
            'open-url': openUrl,
            'media-url': mediaUrl
          }
        } else if (isSurge) {
          let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
          return {
            url: openUrl
          }
        }
      } else {
        return undefined
      }
    }
    console.log(`${title}\n${subtitle}\n${message}`)
    if (isQuanX) $notify(title, subtitle, message, Opts(rawopts))
    if (isSurge) $notification.post(title, subtitle, message, Opts(rawopts))
    if (isJSBox) $push.schedule({
      title: title,
      body: subtitle ? subtitle + "\n" + message : message
    })
  }
  const write = (value, key) => {
    if (isQuanX) return $prefs.setValueForKey(value, key)
    if (isSurge) return $persistentStore.write(value, key)
    if (isNode) {
      try {
        if (!node.fs.existsSync(node.path.resolve(__dirname, NodeSet)))
          node.fs.writeFileSync(node.path.resolve(__dirname, NodeSet), JSON.stringify({}));
        const dataValue = JSON.parse(node.fs.readFileSync(node.path.resolve(__dirname, NodeSet)));
        if (value) dataValue[key] = value;
        if (!value) delete dataValue[key];
        return node.fs.writeFileSync(node.path.resolve(__dirname, NodeSet), JSON.stringify(dataValue));
      } catch (er) {
        return AnError('Node.js持久化写入', null, er);
      }
    }
    if (isJSBox) {
      if (!value) return $file.delete(`shared://${key}.txt`);
      return $file.write({
        data: $data({
          string: value
        }),
        path: `shared://${key}.txt`
      })
    }
  }
  const read = (key) => {
    if (isQuanX) return $prefs.valueForKey(key)
    if (isSurge) return $persistentStore.read(key)
    if (isNode) {
      try {
        if (!node.fs.existsSync(node.path.resolve(__dirname, NodeSet))) return null;
        const dataValue = JSON.parse(node.fs.readFileSync(node.path.resolve(__dirname, NodeSet)))
        return dataValue[key]
      } catch (er) {
        return AnError('Node.js持久化读取', null, er)
      }
    }
    if (isJSBox) {
      if (!$file.exists(`shared://${key}.txt`)) return null;
      return $file.read(`shared://${key}.txt`).string
    }
  }
  const adapterStatus = (response) => {
    if (response) {
      if (response.status) {
        response["statusCode"] = response.status
      } else if (response.statusCode) {
        response["status"] = response.statusCode
      }
    }
    return response
  }
  const get = (options, callback) => {
    options.headers['User-Agent'] = 'JD4iPhone/167169 (iPhone; iOS 13.4.1; Scale/3.00)'
    if (isQuanX) {
      if (typeof options == "string") options = {
        url: options
      }
      options["method"] = "GET"
      //options["opts"] = {
      //  "hints": false
      //}
      $task.fetch(options).then(response => {
        callback(null, adapterStatus(response), response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) {
      options.headers['X-Surge-Skip-Scripting'] = false
      $httpClient.get(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    if (isNode) {
      node.request(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    if (isJSBox) {
      if (typeof options == "string") options = {
        url: options
      }
      options["header"] = options["headers"]
      options["handler"] = function(resp) {
        let error = resp.error;
        if (error) error = JSON.stringify(resp.error)
        let body = resp.data;
        if (typeof body == "object") body = JSON.stringify(resp.data);
        callback(error, adapterStatus(resp.response), body)
      };
      $http.get(options);
    }
  }
  const post = (options, callback) => {
    options.headers['User-Agent'] = 'JD4iPhone/167169 (iPhone; iOS 13.4.1; Scale/3.00)'
    if (options.body) options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (isQuanX) {
      if (typeof options == "string") options = {
        url: options
      }
      options["method"] = "POST"
      //options["opts"] = {
      //  "hints": false
      //}
      $task.fetch(options).then(response => {
        callback(null, adapterStatus(response), response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) {
      options.headers['X-Surge-Skip-Scripting'] = false
      $httpClient.post(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    if (isNode) {
      node.request.post(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    if (isJSBox) {
      if (typeof options == "string") options = {
        url: options
      }
      options["header"] = options["headers"]
      options["handler"] = function(resp) {
        let error = resp.error;
        if (error) error = JSON.stringify(resp.error)
        let body = resp.data;
        if (typeof body == "object") body = JSON.stringify(resp.data)
        callback(error, adapterStatus(resp.response), body)
      }
      $http.post(options);
    }
  }
  const AnError = (name, keyname, er, resp, body) => {
    if (typeof(merge) != "undefined" && keyname) {
      if (!merge[keyname].notify) {
        merge[keyname].notify = `${name}: 异常, 已输出日志 !!`
      } else {
        merge[keyname].notify += `\n${name}: 异常, 已输出日志 !! (2)`
      }
      merge[keyname].error = 1
    }
    return console.log(`\n!!${name}发生错误\n!!名称: ${er.name}\n!!描述: ${er.message}${JSON.stringify(er).match(/\"line\"/)?`\n!!行列: ${JSON.stringify(er)}`:``}${resp&&resp.status?`\n!!状态: ${resp.status}`:``}${body?`\n!!响应: ${resp&&resp.status!=503?body:`Omit.`}`:``}`)
  }
  const time = () => {
    const end = ((Date.now() - start) / 1000).toFixed(2)
    return console.log('\n签到用时: ' + end + ' 秒')
  }
  const done = (value = {}) => {
    if (isQuanX) return $done(value)
    if (isSurge) isRequest ? $done(value) : $done()
  }
  return {
    AnError,
    isRequest,
    isJSBox,
    isSurge,
    isQuanX,
    isLoon,
    isNode,
    notify,
    write,
    read,
    get,
    post,
    time,
    done
  }
};
// md5
!function(n){function t(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,o,u,c,f){return t(r(t(t(e,n),t(u,f)),c),o)}function o(n,t,r,o,u,c,f){return e(t&r|~t&o,n,t,u,c,f)}function u(n,t,r,o,u,c,f){return e(t&o|r&~o,n,t,u,c,f)}function c(n,t,r,o,u,c,f){return e(t^r^o,n,t,u,c,f)}function f(n,t,r,o,u,c,f){return e(r^(t|~o),n,t,u,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[14+(r+64>>>9<<4)]=r;var e,i,a,d,h,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(e=0;e<n.length;e+=16){i=l,a=g,d=v,h=m,g=f(g=f(g=f(g=f(g=c(g=c(g=c(g=c(g=u(g=u(g=u(g=u(g=o(g=o(g=o(g=o(g,v=o(v,m=o(m,l=o(l,g,v,m,n[e],7,-680876936),g,v,n[e+1],12,-389564586),l,g,n[e+2],17,606105819),m,l,n[e+3],22,-1044525330),v=o(v,m=o(m,l=o(l,g,v,m,n[e+4],7,-176418897),g,v,n[e+5],12,1200080426),l,g,n[e+6],17,-1473231341),m,l,n[e+7],22,-45705983),v=o(v,m=o(m,l=o(l,g,v,m,n[e+8],7,1770035416),g,v,n[e+9],12,-1958414417),l,g,n[e+10],17,-42063),m,l,n[e+11],22,-1990404162),v=o(v,m=o(m,l=o(l,g,v,m,n[e+12],7,1804603682),g,v,n[e+13],12,-40341101),l,g,n[e+14],17,-1502002290),m,l,n[e+15],22,1236535329),v=u(v,m=u(m,l=u(l,g,v,m,n[e+1],5,-165796510),g,v,n[e+6],9,-1069501632),l,g,n[e+11],14,643717713),m,l,n[e],20,-373897302),v=u(v,m=u(m,l=u(l,g,v,m,n[e+5],5,-701558691),g,v,n[e+10],9,38016083),l,g,n[e+15],14,-660478335),m,l,n[e+4],20,-405537848),v=u(v,m=u(m,l=u(l,g,v,m,n[e+9],5,568446438),g,v,n[e+14],9,-1019803690),l,g,n[e+3],14,-187363961),m,l,n[e+8],20,1163531501),v=u(v,m=u(m,l=u(l,g,v,m,n[e+13],5,-1444681467),g,v,n[e+2],9,-51403784),l,g,n[e+7],14,1735328473),m,l,n[e+12],20,-1926607734),v=c(v,m=c(m,l=c(l,g,v,m,n[e+5],4,-378558),g,v,n[e+8],11,-2022574463),l,g,n[e+11],16,1839030562),m,l,n[e+14],23,-35309556),v=c(v,m=c(m,l=c(l,g,v,m,n[e+1],4,-1530992060),g,v,n[e+4],11,1272893353),l,g,n[e+7],16,-155497632),m,l,n[e+10],23,-1094730640),v=c(v,m=c(m,l=c(l,g,v,m,n[e+13],4,681279174),g,v,n[e],11,-358537222),l,g,n[e+3],16,-722521979),m,l,n[e+6],23,76029189),v=c(v,m=c(m,l=c(l,g,v,m,n[e+9],4,-640364487),g,v,n[e+12],11,-421815835),l,g,n[e+15],16,530742520),m,l,n[e+2],23,-995338651),v=f(v,m=f(m,l=f(l,g,v,m,n[e],6,-198630844),g,v,n[e+7],10,1126891415),l,g,n[e+14],15,-1416354905),m,l,n[e+5],21,-57434055),v=f(v,m=f(m,l=f(l,g,v,m,n[e+12],6,1700485571),g,v,n[e+3],10,-1894986606),l,g,n[e+10],15,-1051523),m,l,n[e+1],21,-2054922799),v=f(v,m=f(m,l=f(l,g,v,m,n[e+8],6,1873313359),g,v,n[e+15],10,-30611744),l,g,n[e+6],15,-1560198380),m,l,n[e+13],21,1309151649),v=f(v,m=f(m,l=f(l,g,v,m,n[e+4],6,-145523070),g,v,n[e+11],10,-1120210379),l,g,n[e+2],15,718787259),m,l,n[e+9],21,-343485551),l=t(l,i),g=t(g,a),v=t(v,d),m=t(m,h)}return[l,g,v,m]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8){r+=String.fromCharCode(n[t>>5]>>>t%32&255)}return r}function d(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1){r[t]=0}var e=8*n.length;for(t=0;t<e;t+=8){r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32}return r}function h(n){return a(i(d(n),8*n.length))}function l(n,t){var r,e,o=d(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=i(o,8*n.length)),r=0;r<16;r+=1){u[r]=909522486^o[r],c[r]=1549556828^o[r]}return e=i(u.concat(d(t)),512+8*t.length),a(i(c.concat(e),640))}function g(n){var t,r,e="";for(r=0;r<n.length;r+=1){t=n.charCodeAt(r),e+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t)}return e}function v(n){return unescape(encodeURIComponent(n))}function m(n){return h(v(n))}function p(n){return g(m(n))}function s(n,t){return l(v(n),v(t))}function C(n,t){return g(s(n,t))}function A(n,t,r){return t?r?s(t,n):C(t,n):r?m(n):p(n)}md5=A}(this);
