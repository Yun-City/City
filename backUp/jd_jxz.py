#!/usr/bin/python3
# -*- coding: utf8 -*-
"""
cron: 30 9 * * *
new Env('集勋章');
活动入口：东东农场->东东乐园(点大风车）->集勋章  500豆
"""

# 是否开启通知，Ture：发送通知，False：不发送
isNotice = True
# UA 可自定义你的, 默认随机生成UA。
UserAgent = ''

import asyncio
import json
import random
import os, re, sys

try:
    import requests
except Exception as e:
    print(e, "\n缺少requests 模块，请执行命令安装：python3 -m pip install requests")
    exit(3)

try:
    import aiohttp
except Exception as e:
    print(e, "\n缺少requests 模块，请执行命令安装：python3 -m pip install requests")
    exit(3)

##############

requests.packages.urllib3.disable_warnings()
# host_api = 'https://api.m.jd.com/client.action'
pwd = os.path.dirname(os.path.abspath(__file__)) + os.sep


def userAgent():
    """
    随机生成一个UA
    :return: jdapp;iPhone;9.4.8;14.3;xxxx;network/wifi;ADID/201EDE7F-5111-49E8-9F0D-CCF9677CD6FE;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone13,4;addressid/2455696156;supportBestPay/0;appBuild/167629;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1
    """
    if not UserAgent:
        uuid = ''.join(random.sample('123456789abcdef123456789abcdef123456789abcdef123456789abcdef', 40))
        addressid = ''.join(random.sample('1234567898647', 10))
        iosVer = ''.join(
            random.sample(["14.5.1", "14.4", "14.3", "14.2", "14.1", "14.0.1", "13.7", "13.1.2", "13.1.1"], 1))
        iosV = iosVer.replace('.', '_')
        iPhone = ''.join(random.sample(["8", "9", "10", "11", "12", "13"], 1))
        ADID = ''.join(random.sample('0987654321ABCDEF', 8)) + '-' + ''.join(
            random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(
            random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 12))
        return f'jdapp;iPhone;10.0.4;{iosVer};{uuid};network/wifi;ADID/{ADID};supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone{iPhone},1;addressid/{addressid};supportBestPay/0;appBuild/167629;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS {iosV} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1'
    else:
        return UserAgent


## 获取通知服务
class msg(object):
    def __init__(self, m=''):
        self.str_msg = m
        self.message()

    def message(self):
        global msg_info
        print(self.str_msg)
        try:
            msg_info = "{}\n{}".format(msg_info, self.str_msg)
        except:
            msg_info = "{}".format(self.str_msg)
        sys.stdout.flush()

    def getsendNotify(self, a=0):
        if a == 0:
            a += 1
        try:
            url = 'https://gitee.com/curtinlv/Public/raw/master/sendNotify.py'
            response = requests.get(url)
            if 'curtinlv' in response.text:
                with open('sendNotify.py', "w+", encoding="utf-8") as f:
                    f.write(response.text)
            else:
                if a < 5:
                    a += 1
                    return self.getsendNotify(a)
                else:
                    pass
        except:
            if a < 5:
                a += 1
                return self.getsendNotify(a)
            else:
                pass

    def main(self):
        global send
        cur_path = os.path.abspath(os.path.dirname(__file__))
        sys.path.append(cur_path)
        if os.path.exists(cur_path + "/sendNotify.py"):
            try:
                from sendNotify import send
            except:
                self.getsendNotify()
                try:
                    from sendNotify import send
                except:
                    print("加载通知服务失败~")
        else:
            self.getsendNotify()
            try:
                from sendNotify import send
            except:
                print("加载通知服务失败~")
        ###################


msg().main()


# @logger.catch
async def get_headers():
    """
    获取请求头
    :return:
    """
    headers = {
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://h5.m.jd.com',
        'User-Agent': userAgent(),
        'content-type': 'application/x-www-form-urlencoded',
        'Referer': 'https://gongyi.m.jd.com/m/welfare/donate/index.html',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'X-Requested-With': 'com.jingdong.app.mall',

    }
    return headers


async def post(session, url, body=None):
    try:
        if body is None:
            body = {}
        response = await session.post(url=url, data=body)
        await asyncio.sleep(1)
        text = await response.text()
        data = json.loads(text)
        return data
    except Exception as e:
        print('请求服务器错误, {}!'.format(e.args))
        return {
            'success': False
        }


async def get(session, url):
    try:
        response = await session.get(url=url)
        await asyncio.sleep(1)
        text = await response.text()
        data = json.loads(text)
        return data
    except Exception as e:
        print('请求服务器错误, {}!'.format(e.args))
        return {
            'success': False
        }


# POST 判断任务列表
async def collect_Init_task(session):
    """
    查询用户信息
    :return:
    """
    url = 'https://api.m.jd.com/client.action'
    body = {"channel": 1}
    params = f'functionId=collect_Init&body={json.dumps(body)}&client=wh5&clientVersion=1.0.0'
    data = await post(session, url, params)
    if data['code'] == '0' and data['success'] == True:
        if data['result']['activityStatus'] == 2:
            print(f"""完成任务得对应勋章""")
            taskInfo = data['result']['taskInfo']
            for task in taskInfo:
                if task['status'] == 4:
                    print(f"""勋章:{task['medalName']}, 完成情况{task['currentTaskCount']}/{task['maxTaskCount']},已点亮""")
                    continue
                if task['status'] == 1:
                    print(f"""勋章:{task['medalName']}, 完成情况{task['currentTaskCount']}/{task['maxTaskCount']},还没进度，要加油""")
                    continue
                if task['status'] == 2:
                    print(f"""勋章:{task['medalName']}, 完成情况{task['currentTaskCount']}/{task['maxTaskCount']},明天再来看""")
                    continue
                if task['status'] == 3:
                    print(f"""勋章:{task['medalName']}, 完成情况{task['currentTaskCount']}/{task['maxTaskCount']},去点亮""")
                    await asyncio.sleep(1)
                    await collect_taskAward(session, task)
        elif data['result']['activityStatus'] == 3:
            print(f"""勋章全部点亮了,去合成领奖""")
            await asyncio.sleep(1)
            await collect_getAwardInfo(session)
        elif data['result']['activityStatus'] == 4:
            msg(f"""勋章全部点亮了,合成领奖已完成！""")
        else:
            msg(f"""勋章状态异常{data}""")
    else:
        print(f"""获取勋章列表异常{data}""")
    return 999


# 查询合成项目
async def collect_getAwardInfo(session):
    """
    查询用户信息
    :return:
    """
    url = 'https://api.m.jd.com/client.action'
    body = {}
    params = f'functionId=collect_getAwardInfo&body={json.dumps(body)}&client=wh5&clientVersion=1.0.0'
    data = await post(session, url, params)
    if data['code'] == '0' and data['success'] == True:
        print(f"""合成领奖""")
        awardList = data['result']['awardList']
        for i in awardList:
            if i['awardValue'] == '500':
                await collect_exchangeAward(session, i['awardType'])
    else:
        print(f"""获取勋章列表异常{data}""")
    return 999


# 执行合成
async def collect_exchangeAward(session, awardType):
    """
    查询用户信息
    :return:
    """
    url = 'https://api.m.jd.com/client.action'
    body = {"type": awardType}
    params = f'functionId=collect_exchangeAward&body={json.dumps(body)}&client=wh5&clientVersion=1.0.0'
    data = await post(session, url, params)
    print(data)
    if data['code'] == '1' and data['success'] == False:
        print(f"""合成领奖获得：{data['message']}""")
    elif data['code'] == '0' and data['success'] == True:
        msg(f"""合成领奖获得：{data['result']['awardValue']}京豆""")
    else:
        print(f"""合成领奖获得异常：{data}""")
    return 999


# POST 获取任务列表
async def collect_Init(session):
    """
    查询用户信息
    :return:
    """
    await asyncio.sleep(0.5)
    try:
        url = 'https://api.m.jd.com/client.action'
        body = {"channel": 1}
        params = f'functionId=collect_Init&body={json.dumps(body)}&client=wh5&clientVersion=1.0.0'
        data = await post(session, url, params)
        return data
    except Exception as e:
        print(e.args)


# POST 点亮勋章
async def collect_taskAward(session, task):
    """
    查询用户信息
    :return:
    """
    taskType = task['taskType']
    medalName = task['medalName']
    url = 'https://api.m.jd.com/client.action'
    body = {"taskType": taskType}
    params = f'functionId=collect_taskAward&body={json.dumps(body)}&client=wh5&clientVersion=1.0.0'
    data = await post(session, url, params)
    if data['code'] == '1' and data['success'] == False:
        print(f"""点亮勋章{medalName}获得：{data['message']}""")
    elif data['code'] == '0' and data['success'] == True:
        msg(f"""点亮勋章{medalName}获得：水滴{data['result']['awardValue']}g""")
    else:
        print(f"""点亮勋章{medalName}异常：{data}""")
    return 999


# POST 领取新人奖励
async def collect_newUserAward(session):
    """
    查询用户信息
    :return:
    """
    url = 'https://api.m.jd.com/client.action'
    body = {}
    params = f'functionId=collect_newUserAward&body={json.dumps(body)}&client=wh5&clientVersion=1.0.0'
    data = await post(session, url, params)
    if data['code'] == '1' and data['success'] == False:
        print(f"""领取新人奖励：{data['msg']}""")
    elif data['code'] == '0' and data['success'] == True:
        msg(f"""领取新人奖励：{data['msg']}""")
    else:
        print(f"""领取新人奖励：{data}""")
    return 999


async def run():
    """
    程序入口
    :return:
    """
    scriptName = '集勋章'
    print(scriptName)
    headers = await get_headers()
    cks = os.environ["JD_COOKIE"].split("&")
    for ck in cks:
        ptpin = re.findall(r"pt_pin=(.*?);", ck)[0]
        print("--------开始京东账号" + ptpin + "--------")
        ck = ck.rstrip(';')
        ck = dict(item.split("=") for item in ck.split(";"))
        async with aiohttp.ClientSession(headers=headers, cookies=ck) as session:
            await collect_Init(session)
            await asyncio.sleep(1)
            await collect_newUserAward(session)
            await asyncio.sleep(1)
            await collect_Init_task(session)
        if isNotice:
            send(scriptName, msg_info)
        else:
            print("\n", scriptName, "\n", msg_info)


if __name__ == '__main__':
    # from config import JD_COOKIES
    #
    # app = JdDdWorld()
    # asyncio.run(run())
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
    # from utils.process import process_start
    # process_start(JdDdWorld, '东东世界', code_key=CODE_KEY)
