"""
# 邀好友赢大礼 create by doubi 通用模板
# https://prodev.m.jd.com/mall/active/dVF7gQUVKyUcuSsVhuya5d2XD4F/index.html?code=<活动id>&invitePin=<邀请用户名>
# 邀请用户名为助力 pin 且必须存在于ck中

环境变量说明：
export yhyauthorCode="活动ID"  // 必填
export yhyactivityId="活动类型ID" // 不指定则默认为"dVF7gQUVKyUcuSsVhuya5d2XD4F"
export yhypin="需要助力的pin值"  // 不指定则默认为头部账号1

new Env('邀请好友开卡有礼');
# const $ = new Env('邀请好友开卡有礼');
cron: 7 7 7 7 7

"""

import json,requests,random,time,asyncio,re,os
from urllib.parse import quote_plus,unquote_plus
from functools import partial
print = partial(print, flush=True)

activatyname = '邀请好友开卡有礼'
activityId = os.getenv('yhyactivityId', "dVF7gQUVKyUcuSsVhuya5d2XD4F")  # 活动类型
authorCode = os.environ["yhyauthorCode"]  # 活动id
invitePin = activityUrl = ''

# 随机ua
def randomuserAgent():
    global uuid, addressid, iosVer, iosV, clientVersion, iPhone, area, ADID, lng, lat
    uuid = ''.join(random.sample(
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
         'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'z'], 40))
    addressid = ''.join(random.sample('1234567898647', 10))
    iosVer = ''.join(random.sample(
        ["15.1.1", "14.5.1", "14.4", "14.3", "14.2", "14.1", "14.0.1"], 1))
    iosV = iosVer.replace('.', '_')
    clientVersion = ''.join(random.sample(["10.3.0", "10.2.7", "10.2.4"], 1))
    iPhone = ''.join(random.sample(["8", "9", "10", "11", "12", "13"], 1))
    area = ''.join(random.sample('0123456789', 2)) + '_' + ''.join(random.sample('0123456789', 4)) + '_' + ''.join(
        random.sample('0123456789', 5)) + '_' + ''.join(random.sample('0123456789', 4))
    ADID = ''.join(random.sample('0987654321ABCDEF', 8)) + '-' + ''.join(
        random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(
        random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 12))
    lng = '119.31991256596' + str(random.randint(100, 999))
    lat = '26.1187118976' + str(random.randint(100, 999))
    UserAgent = ''
    if not UserAgent:
        return f'jdapp;iPhone;10.0.4;{iosVer};{uuid};network/wifi;ADID/{ADID};model/iPhone{iPhone},1;addressid/{addressid};appBuild/167707;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS {iosV} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/null;supportJDSHWK/1'
    else:
        return UserAgent


# 检测ck状态
async def check(ua, ck):
    try:
        url = 'https://me-api.jd.com/user_new/info/GetJDUserInfoUnion'
        header = {
            "Host": "me-api.jd.com",
            "Accept": "*/*",
            "Connection": "keep-alive",
            "Cookie": ck,
            "User-Agent": ua,
            "Accept-Language": "zh-cn",
            "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
            "Accept-Encoding": "gzip, deflate",
        }
        result = requests.get(url=url, headers=header, timeout=2).text
        codestate = json.loads(result)
        if codestate['retcode'] == '1001':
            msg = "当前ck已失效，请检查"
            return {'code': 1001, 'data': msg}
        elif codestate['retcode'] == '0' and 'userInfo' in codestate['data']:
            nickName = codestate['data']['userInfo']['baseInfo']['nickname']
            return {'code': 200, 'name': nickName, 'ck': ck}
    except Exception as e:
        return {'code': 0, 'data': e}


# 获取当前时间
def get_time():
    time_now = round(time.time()*1000)
    return time_now


# 登录plogin
async def plogin(ua, cookie):
    now = get_time()
    url = f'https://plogin.m.jd.com/cgi-bin/ml/islogin?time={now}&callback=__jsonp{now-2}&_={now+2}'
    header = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Connection': 'keep-alive',
        'Cookie': cookie,
        'Host': 'plogin.m.jd.com',
        'Referer': 'https://prodev.m.jd.com/',
        'User-Agent': ua
    }
    response = requests.get(url=url, headers=header, timeout=30).text
    return response


# 活动接口
async def jdjoy(ua, cookie):
    url = f'https://jdjoy.jd.com/member/bring/getActivityPage?code={authorCode}&invitePin={invitePin}&_t={get_time()}'
    header = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-Hans-US;q=1,en-US;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Cookie': cookie,
        "Host": 'jdjoy.jd.com',
        'Origin': 'https://prodev.m.jd.com',
        "Referer": 'https://prodev.m.jd.com/',
        'User-Agent': ua
    }
    response = requests.get(url=url, headers=header).text
    return json.loads(response)


# go开卡
async def ruhui(ua, cookie):
    url = f'https://jdjoy.jd.com/member/bring/joinMember?code={authorCode}&invitePin={invitePin}'
    header = {
        'Host': 'jdjoy.jd.com',
        'Content-Type': 'application/json',
        'Origin': 'https://prodev.m.jd.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cookie': cookie,
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'User-Agent': ua,
        'Referer': activityUrl,
        'Accept-Language': 'zh-cn',
        'request-from': 'native'
    }
    response = requests.get(url=url, headers=header).text
    return json.loads(response)


# 检查开卡状态
async def check_ruhui(body, cookie, venderId, ua):
    url = f'https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body={json.dumps(body)}&client=H5&clientVersion=9.2.0&uuid=88888'
    headers = {
        'Host': 'api.m.jd.com',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'Cookie': cookie,
        'User-Agent': ua,
        'Accept-Language': 'zh-cn',
        'Referer': f'https://shopmember.m.jd.com/shopcard/?venderId={venderId}&channel=801&returnUrl={json.dumps(activityUrl)}',
        'Accept-Encoding': 'gzip, deflate'
    }
    response = requests.get(url=url, headers=headers, timeout=30000).text
    return json.loads(response)


# 领取奖励
async def getInviteReward(cookie, ua, number):
    url = f'https://jdjoy.jd.com/member/bring/getInviteReward?code={authorCode}&stage={number}'
    header = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-Hans-US;q=1,en-US;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Cookie': cookie,
        "Host": 'jdjoy.jd.com',
        'Origin': 'https://prodev.m.jd.com',
        "Referer": 'https://prodev.m.jd.com/',
        'User-Agent': ua
    }
    response = requests.get(url=url, headers=header).text
    data = json.loads(response)
    if data['success'] == True:
        return "🎉 领取成功"
    else:
        return data['errorMessage']


# 开启活动
async def firstInvite(cookie, ua):
    url = f'https://jdjoy.jd.com/member/bring/firstInvite?code={authorCode}'
    header = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-Hans-US;q=1,en-US;q=0.9',
        'Connection': 'keep-alive',
        'Cookie': cookie,
        "Host": 'jdjoy.jd.com',
        'User-Agent': ua
    }
    response = requests.get(url=url, headers=header).text
    # print(response)
    return json.loads(response)


async def get_ck(data):
    cklist = []
    if data['code'] != 200:
        return {'code': 0, 'data': data}
    else:
        env_data = data['data']
        for ck in env_data:
            if 'remarks' in ck and ck['name'] == 'JD_COOKIE':
                cklist.append(ck['value'])
            else:
                pass
    return cklist


# 检查pin
def checkpin(cks: list, pin):
    for ck in cks:
        if pin in ck:
            return ck
        else:
            None

# 主程序
async def main():
    global invitePin, activityUrl
    try:
        cks = os.environ["JD_COOKIE"].split("&")
    except:
        with open('cklist1.txt', 'r') as f:
            cks = f.read().split('\n')
    success = 0   # 计算成功数
    inveteck = checkpin(cks, invitePin)  # 根据设定的pin返回对应ck
    needinviteNum = []  # 需要助力次数
    needdel = []
    need = []
    r = re.compile(r'pt_pin=(.+?);')
    invitePinCk1 = r.findall(cks[0])
    invitePin = os.getenv('yhypin', invitePinCk1)  # pin 填写cookie后面的pin
    activityUrl = f'https://prodev.m.jd.com/mall/active/{activityId}/index.html?code={authorCode}&invitePin={invitePin}'
    if inveteck:
        print(f'\n🔔{activatyname}\n', flush=True)
        print(f'==================== 共{len(cks)}个京东账号Cookie ====================\n')
        print(f'=============== 脚本执行 - 北京时间(UTC+8) ' + time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())) + ' ===============\n')   
        # print(f'您好！{invitePin}，正在获取您的活动信息',)
        ua = randomuserAgent()  # 获取ua
        result = await check(ua, inveteck)  # 检测ck
        if result['code'] == 200:
            await plogin(ua, inveteck)  # 获取登录状态
            await asyncio.sleep(2)
            result = await jdjoy(ua, inveteck)  # 获取活动信息
            await firstInvite(inveteck, ua)  # 开启活动
            if result['success']:
                brandName = result['data']['brandName']  # 店铺名字
                venderId = result['data']['venderId']  # 店铺入会id
                rewardslist = []  # 奖品
                successCount = result['data']['successCount']  # 当前成功数
                success += successCount
                result_data = result['data']['rewards']  # 奖品数据
                print(f'账号 {invitePin} ，开启{brandName}邀请好友开卡有礼活动\n')
                Judge_Beans_Mark = True
                for i in result_data:
                    stage = i['stage']
                    inviteNum = i['inviteNum']  # 单次需要拉新人数
                    need.append(inviteNum)
                    rewardName = i['rewardName']  # 奖品名
                    rewardNum = i['rewardStock']  # 奖品剩余数量
                    if rewardNum != 0:
                        needinviteNum.append(inviteNum)
                        needdel.append(inviteNum)
                    if rewardNum == 0:
                        rewardslist.append(f'等级{stage}: {rewardName}，奖品已发完，需助力{inviteNum}人')
                    else:
                        rewardslist.append(f'等级{stage}: {rewardName}，还剩{rewardNum}件库存，需助力{inviteNum}人')

                if len(rewardslist) != 0:
                    print('活动奖品清单: \n' + str('\n'.join(rewardslist)) +
                          f'\n\n当前账号已邀请{successCount}人')

                    for nmubers in needdel:
                        if success >= nmubers:
                            print("您当前助力已经满足了，可以去领奖励了")
                            print(f'\n这就去领取奖励{need.index(nmubers)+1}')
                            result = await getInviteReward(inveteck, ua, need.index(nmubers)+1)
                            print(result)
                            needinviteNum.remove(nmubers)
                            await asyncio.sleep(10)
                    needdel = needinviteNum
                    if needinviteNum == []:
                        print('奖励已经全部获取啦，退出程序\n')
                        return
                num = 1
                for n, ck in enumerate(cks, 1):
                    ua = randomuserAgent()  # 获取ua
                    try:
                        pin = re.findall(r'(pt_pin=([^; ]+)(?=;))', str(ck))[0]
                        pin = (unquote_plus(pin[1]))
                    except IndexError:
                        pin = f'用户{n}'
                    for n, nmubers in enumerate(needinviteNum, 1):
                        for nmubers in needdel:
                            if success >= nmubers:
                                ## print(nmubers)
                                print(f'已完成第{need.index(nmubers)+1}阶段的邀请任务，开始领取奖品~')
                                result = await getInviteReward(inveteck, ua, need.index(nmubers)+1)
                                print(result)
                                needinviteNum.remove(nmubers)
                                await asyncio.sleep(10)
                        needdel = needinviteNum
                        if needinviteNum == []:
                            print('')
                            return
                    print(f'\n******开始【京东账号{num}】{pin} ******\n')
                    num+=1
                    await plogin(ua, ck)  # 获取登录状态
                    result = await check(ua, ck)  # 检测ck
                    if result['code'] == 200:
                        result = await jdjoy(ua, ck)  # 调用ck
                        if result['success']:
                            # print(f'账户[{pin}]已开启{brandName}邀请好友活动\n')
                            await asyncio.sleep(2)
                            # 检查入会状态
                            result = await check_ruhui({"venderId": str(venderId), "channel": "401"}, ck, venderId, ua)
                            try:
                                if result['result']['userInfo']['openCardStatus'] == 0:  # 0 未开卡
                                    await asyncio.sleep(1)
                                    result = await ruhui(ua, ck)
                                    if result['success']:
                                        success += 1
                                        print(f'助力成功! 当前已邀请{success}人')
                                    if '交易失败' in str(result):
                                        success += 1
                                        print(f'助力成功! 当前已邀请{success}人')
                                    else:
                                        print(result)
                                    await asyncio.sleep(2)
                                else:
                                    print('已经是会员了，无法助力~')
                                    continue

                            except TypeError as e:
                                print(e)
                                result = await ruhui(ua, ck)
                                if result['success']:
                                    success += 1
                                    print(f'助力成功! 当前已邀请{success}人')
                                if '交易失败' in result:
                                    success += 1
                                    print(f'助力成功! 当前已邀请{success}人')
                                else:
                                    print(result['errorMessage'])
                                await asyncio.sleep(2)

                        else:  # 没有获取到活动信息
                            print('未获取到活动参数信息\n')
                            break
                    else:
                        print(result['data'])
                        continue
            else:
                print('未能获取到活动信息\n')
                return

        else:
            print(result['data'] + '\n')
            return

        print(f'\n🔔{activatyname}, 结束!\n', flush=True)

    else:
        print(f'pin填写有误，请重试')
if __name__ == "__main__":
    asyncio.run(main())