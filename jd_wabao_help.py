#!/usr/bin/env python3
# -*- coding: utf-8 -*-
'''
cron: 30 0,15 * * *
new Env('发财挖宝内部互助');
活动入口：京东极速版>我的>发财挖宝
脚本功能为: 玩一玩，内部互助
由于每个号只有两次助力机会，所以只助力前两个助力码
环境变量：JD_COOKIE
export JD_COOKIE="第1个cookie&第2个cookie"
地址：https://raw.githubusercontent.com/wuye999/myScripts/main/jd/jd_wabao_help.py
'''
import os,json,random,time,re,string,functools,asyncio
import sys
sys.path.append('../../tmp')
try:
    import requests
except Exception as e:
    print(str(e) + "\n缺少requests模块, 请执行命令：pip3 install requests\n")
requests.packages.urllib3.disable_warnings()


run_send='no'          # yes或no, yes则启用通知推送服务
linkId="pTTvJeSTrpthgk9ASBVGsw"


# 获取pin
cookie_findall=re.compile(r'pt_pin=(.+?);')
def get_pin(cookie):
    try:
        return cookie_findall.findall(cookie)[0]
    except:
        print('ck格式不正确，请检查')

# 读取环境变量
def get_env(env):
    try:
        if env in os.environ:
            a=os.environ[env]
        elif '/ql' in os.path.abspath(os.path.dirname(__file__)):
            try:
                a=v4_env(env,'/ql/config/config.sh')
            except:
                a=eval(env)
        elif '/jd' in os.path.abspath(os.path.dirname(__file__)):
            try:
                a=v4_env(env,'/jd/config/config.sh')
            except:
                a=eval(env)
        else:
            a=eval(env)
    except:
        a=''
    return a

# v4
def v4_env(env,paths):
    b=re.compile(r'(?:export )?'+env+r' ?= ?[\"\'](.*?)[\"\']', re.I)
    with open(paths, 'r') as f:
        for line in f.readlines():
            try:
                c=b.match(line).group(1)
                break
            except:
                pass
    return c 


# 随机ua
def ua():
    sys.path.append(os.path.abspath('.'))
    try:
        from jdEnv import USER_AGENTS as a
    except:
        a='jdpingou;android;5.5.0;11;network/wifi;model/M2102K1C;appBuild/18299;partner/lcjx11;session/110;pap/JA2019_3111789;brand/Xiaomi;Mozilla/5.0 (Linux; Android 11; M2102K1C Build/RKQ1.201112.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.159 Mobile Safari/537.36'
    return a

# 13位时间戳
def gettimestamp():
    return str(int(time.time() * 1000))

## 获取cooie
class Judge_env(object):
    def main_run(self):
        if '/jd' in os.path.abspath(os.path.dirname(__file__)):
            cookie_list=self.v4_cookie()
        else:
            cookie_list=os.environ["JD_COOKIE"].split('&')       # 获取cookie_list的合集
        if len(cookie_list)<1:
            msg('请填写环境变量JD_COOKIE\n')    
        return cookie_list

    def v4_cookie(self):
        a=[]
        b=re.compile(r'Cookie'+'.*?=\"(.*?)\"', re.I)
        with open('/jd/config/config.sh', 'r') as f:
            for line in f.readlines():
                try:
                    regular=b.match(line).group(1)
                    a.append(regular)
                except:
                    pass
        return a
cookie_list=Judge_env().main_run()


## 获取通知服务
class Msg(object):
    def getsendNotify(self, a=1):
        try:
            url = 'https://mirror.ghproxy.com/https://raw.githubusercontent.com/wuye999/myScripts/main/sendNotify.py'
            response = requests.get(url,timeout=3)
            with open('sendNotify.py', "w+", encoding="utf-8") as f:
                f.write(response.text)
            return
        except:
            pass
        if a < 5:
            a += 1
            return self.getsendNotify(a)

    def main(self,f=1):
        global send,msg,initialize
        sys.path.append(os.path.abspath('.'))
        for n in range(3):
            try:
                from sendNotify import send,msg,initialize
                break
            except:
                self.getsendNotify()
        l=['BARK','SCKEY','TG_BOT_TOKEN','TG_USER_ID','TG_API_HOST','TG_PROXY_HOST','TG_PROXY_PORT','DD_BOT_TOKEN','DD_BOT_SECRET','Q_SKEY','QQ_MODE','QYWX_AM','PUSH_PLUS_TOKEN','PUSH_PLUS_USER']
        d={}
        for a in l:
            try:
                d[a]=eval(a)
            except:
                d[a]=''
        try:
            initialize(d)
        except:
            self.getsendNotify()
            if f < 5:
                f += 1
                return self.main(f)
            else:
                print('获取通知服务失败，请检查网络连接...')
Msg().main()   # 初始化通知服务    


def taskGetUrl(functionId, body, cookie):
    url=f'https://api.m.jd.com/?functionId={functionId}&body={json.dumps(body)}&t={gettimestamp()}&appid=activities_platform&client=H5&clientVersion=1.0.0'
    headers={
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'origin': 'https://bnzf.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json, text/plain, */*',
        "User-Agent": ua(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
    }
    for n in range(3):
        try:
            res=requests.get(url,headers=headers).json()
            return res
        except:
            if n==2:
                msg('API请求失败，请检查网路重试❗\n')   


# 剩余血量
def xueliang(cookie):
    body={"linkId":linkId}
    res=taskGetUrl("happyDigHome", body, cookie)
    if not res:
        return
    if res['code']==0:
        if res['success']:
            curRound=res['data']['curRound']                        # 未知
            blood=res['data']['blood']                              # 剩余血量
            return blood      


# 助力码
def inviteCode(cookie):
    global inviteCode_1_list,inviteCode_2_list
    body={"linkId":linkId}
    res=taskGetUrl("happyDigHome", body, cookie)
    if not res:
        return
    try:
        if res['success']:
            msg(f"账号{get_pin(cookie)}助力码为{res['data']['inviteCode']}")
            inviteCode_1_list.append(res['data']['inviteCode'])
            msg(f"账号{get_pin(cookie)}助力码为{res['data']['markedPin']}")
            inviteCode_2_list.append(res['data']['markedPin'])
        else:
            msg('快去买买买吧')
    except:
        msg(f"错误\n{res}\n")

# 助力
def happyDigHelp(cookie,fcwbinviter,fcwbinviteCode):
    msg(f"账号 {get_pin(cookie)} 去助力{fcwbinviteCode}")
    xueliang(cookie)
    body={"linkId":linkId,"inviter":fcwbinviter,"inviteCode":fcwbinviteCode}
    url=f'https://api.m.jd.com/?functionId=happyDigHelp&body={json.dumps(body)}&t={gettimestamp()}&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=20211123184338304;7340749128476656;8dd95;tk02w85c11bfb18n6NZmESRQhd0NHQ+qb2ly+KK2XlQJDFe++pQ3pEiHZvMaCngfvv1mOtdbPwsP+/xsfto1x5iFqNED;64be02f922fd8377e0e37c729bb956b7ea054e26cfcf20ac856791273031ebec;3.0;1637664218304'
    headers={
        'Host': 'api.m.jd.com',
        'accept': 'application/json, text/plain, */*',
        'origin': 'https://bnzf.jd.com',
        'user-agent': ua(),
        'sec-fetch-mode': 'cors',
        'x-requested-with': 'com.jd.jdlite',
        'sec-fetch-site': 'same-site',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cookie': cookie,
    }
    for n in range(3):
        try:
            res=requests.get(url,headers=headers).json()
            break
        except:
            if n==2:
                msg('API请求失败，请检查网路重试❗\n') 
                return
    if res['success']:
        msg('助力成功')
    else:
        msg(res['errMsg'])
    

def main():
    msg('🔔发财挖宝内部互助，开始！\n')
    msg(f'====================共{len(cookie_list)}京东个账号Cookie=========\n')

    msg('获取助力码\n')
    global inviteCode_1_list,inviteCode_2_list
    inviteCode_1_list=list()
    inviteCode_2_list=list()
    for cookie in cookie_list[:2]:
        inviteCode(cookie) 

    msg('\n互助\n')
    inviteCode_2_list=inviteCode_2_list[:2]
    for e,fcwbinviter in enumerate(inviteCode_2_list):
        fcwbinviteCode=inviteCode_1_list[e]
        for cookie in cookie_list:
            happyDigHelp(cookie,fcwbinviter,fcwbinviteCode)

    if run_send=='yes':
        send('### 发财挖宝内部互助 ###')   # 通知服务


if __name__ == '__main__':
    main()



