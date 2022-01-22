#!/usr/bin/env python3
# -*- coding: utf-8 -*-
'''
cron: 30 0,15 * * *
new Env('发财挖宝内部互助');
活动入口: 京东极速版>我的>发财挖宝
脚本功能为: 内部互助
由于每个号1次助力机会, 30次助力之后要99人才能加一血 
所以按ck顺序助力, 每个号最多吃30个助力
账号1助力作者
地址: https://raw.githubusercontent.com/wuye999/myScripts/main/jd/jd_wabao_help.py
'''
import os,json,random,time,re,string,functools,asyncio,hashlib,hmac
import sys
sys.path.append('../../tmp')
try:
    import requests
except Exception as e:
    print(str(e) + "\n缺少requests模块, 请执行命令: pip3 install requests\n")
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
    def getsendNotify(self):
        url_list = [
            'https://mirror.ghproxy.com/https://raw.githubusercontent.com/wuye999/myScripts/main/sendNotify.py',
            'https://cdn.jsdelivr.net/gh/wuye999/myScripts@main/sendNotify.py',
            'https://raw.fastgit.org/wuye999/myScripts/main/sendNotify.py',
            'https://raw.githubusercontent.com/wuye999/myScripts/main/sendNotify.py',
        ]
        for e,url in enumerate(url_list):
            try:
                response = requests.get(url,timeout=10)
                with open('sendNotify.py', "w+", encoding="utf-8") as f:
                    f.write(response.text)
                return
            except:
                if e >= (len(url_list)-1):
                    print('获取通知服务失败，请检查网络连接...')               
    def main(self,f=0):
        global send,msg,initialize
        sys.path.append(os.path.abspath('.'))
        for _ in range(2):
            try:
                from sendNotify import send,msg,initialize
                break
            except:
                self.getsendNotify()
        l=['BARK_PUSH', 'BARK_ARCHIVE', 'BARK_GROUP', 'BARK_SOUND', 'DD_BOT_SECRET', 'DD_BOT_TOKEN', 'FSKEY', 'GOBOT_URL', 'GOBOT_QQ', 'GOBOT_TOKEN', 'GOTIFY_URL', 'GOTIFY_TOKEN', 'GOTIFY_PRIORITY', 'IGOT_PUSH_KEY', 'PUSH_KEY', 'PUSH_PLUS_TOKEN', 'PUSH_PLUS_USER', 'QMSG_KEY', 'QMSG_TYPE', 'QYWX_AM', 'QYWX_KEY', 'TG_BOT_TOKEN', 'TG_USER_ID', 'TG_API_HOST', 'TG_PROXY_AUTH', 'TG_PROXY_HOST', 'TG_PROXY_PORT']
        d={}
        for a in l:
            try:
                d[a]=eval(a)
            except:
                d[a]=''
        try:
            initialize(d)
        except:
            if f < 2:
                f += 1
                self.getsendNotify()
                return self.main(f)
Msg().main()   # 初始化通知服务     


def taskGetUrl(url, cookie):
    url=url
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
    try:
        res=requests.get(url,headers=headers).json()
        return res
    except:
        msg('API请求失败，请检查网路重试❗\n')   


# 助力码
def inviteCode(cookie):
    global inviteCode_1_list,inviteCode_2_list
    body={"linkId":linkId}
    url=get_h5st_url(body,'happyDigHome')
    res=taskGetUrl(url, cookie)
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


# post请求，将参数timestamp, md5_file，body, typeid上传, 计算url的h5st, 返回带h5st的url
def get_h5st_url(body,typeid):
    time.sleep(0.5)
    with open(os.path.abspath(__file__), 'rb') as f:
        md5obj = hashlib.md5()
        md5obj.update(f.read())
        md5_file = md5obj.hexdigest()
        # print(md5_file)
    body=body
    typeid=typeid
    timestamp=gettimestamp()
    md5_file=hmac.new(timestamp.encode('utf-8'), md5_file.encode('utf-8'), digestmod=hashlib.md5).hexdigest()
    url='http://121.4.99.83:5000/get_h5st'
    data={'timestamp': timestamp, 'md5_file': md5_file, 'body': body, 'typeid': typeid}
    res=requests.post(url,json=data).json()
    if res['code']=='200':
        return res['url']
    else:
        print('请求h5st失败')


# 助力
def happyDigHelp(cookie,fcwbinviter,fcwbinviteCode,flag=False):
    global Calculator
    if flag:
        msg(f"账号1 {get_pin(cookie)} 去助力作者")
    else:
        msg(f"账号 {get_pin(cookie)} 去助力{fcwbinviteCode}")
    body={"linkId":linkId,"inviter":fcwbinviter,"inviteCode":fcwbinviteCode}
    url=get_h5st_url(body,'happyDigHelp')
    headers={
        'accept': 'application/json, text/plain, */*',
        'origin': 'https://bnzf.jd.com',
        'user-agent': ua(),
        'sec-fetch-mode': 'cors',
        'x-requested-with': 'com.jd.jdlite',
        'sec-fetch-site': 'same-site',
        'referer': 'https://bnzf.jd.com/?activityId=pTTvJeSTrpthgk9ASBVGsw&inviterId=t8WU7JDAfgD38T-JcrTPcvPU1jIG_31s6BE-7-g2tx0&inviterCode=8bcde7e9a2044250989df74454d3ff7496691640589643091&utm_user=plusmember&ad_od=share&utm_source=androidapp&utm_medium=appshare&utm_campaign=t_335139774&utm_term=QQfriends&sid=e97be74f93dda4d8c6ba6a8123b6d58w&un_area=4_134_19915_0',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'cookie': cookie
    }
    res=requests.get(url,headers=headers).json()
    if res['success']:
        if not flag:
            Calculator+=1
        print('助力成功')
    else:
        print(res['errMsg'])
    

# 账号1助力作者
def author_helpcode(cookie):
    url_list = ['']
    for e,url in enumerate(url_list):
        try:
            response = requests.get(url,timeout=10).json()
            break
        except:
            if e >= (len(url_list)-1):
                print('获取助力码，请检查网络连接...')   
    helpcode_list=response['jd_wabao_help']
    helpcode=random.choice(helpcode_list)
    fcwbinviter=helpcode.split('&&&')[0]
    fcwbinviteCode=helpcode.split('&&&')[1]
    happyDigHelp(cookie,fcwbinviter,fcwbinviteCode,True)


def main():
    global cookie_list
    msg('🔔发财挖宝内部互助，开始!\n')
    msg(f'====================共{len(cookie_list)}京东个账号Cookie=========\n')

    msg('获取助力码\n')
    global inviteCode_1_list,inviteCode_2_list
    inviteCode_1_list=list()
    inviteCode_2_list=list()
    n=int(len(cookie_list)/30)+1
    for cookie in cookie_list[:n]:
        inviteCode(cookie) 

    msg('\n互助\n')
    global Calculator
    for e,fcwbinviter in enumerate(inviteCode_2_list):
        fcwbinviteCode=inviteCode_1_list[e]
        Calculator=0
        for f,cookie in enumerate(cookie_list):
            if f==0:
                author_helpcode(cookie)
            elif Calculator>=30:
                cookie_list=cookie_list[f-1:]
                break
            else: 
                happyDigHelp(cookie,fcwbinviter,fcwbinviteCode)

    if run_send=='yes':
        send('### 发财挖宝内部互助 ###')   # 通知服务


if __name__ == '__main__':
    main()
    


