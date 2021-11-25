# 逛好物，赚京豆
# 入口>   https://ifanli.m.jd.com/rebate/earnBean.html?from=earnbean
# 脚本功能为 完成任务，获得100京豆
# 环境变量JD_COOKIE，多账号用&分割
# export JD_COOKIE="第1个cookie&第2个cookie"
# 11 6 9:00 修bug

import os,json,random,time,re,string,functools,asyncio
import sys
sys.path.append('../../tmp')
sys.path.append(os.path.abspath('.'))
from  multiprocessing import Pool
try:
    import requests
except Exception as e:
    print(str(e) + "\n缺少requests模块, 请执行命令：pip3 install requests\n")
requests.packages.urllib3.disable_warnings()


JD_API_HOST = 'https://api.m.jd.com'
run_send='no'     # yes或no, yes则启用通知推送服务


# 获取pin
cookie_findall=re.compile(r'pt_pin=(.+?);')
def get_pin(cookie):
    try:
        return cookie_findall.findall(cookie)[0]
    except:
        print('ck格式不正确，请检查')


# 随机ua
def ua():
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


# 检查账号有效性
def getUserInfo(cookie):
    if not (pin:=get_pin(cookie)):
        return
    time.sleep(0.2)
    url = 'https://me-api.jd.com/user_new/info/GetJDUserInfoUnion?orgFlag=JD_PinGou_New&callSource=mainorder&channel=4&isHomewhite=0&sceneval=2&sceneval=2&callback='
    headers = {
        'Cookie': cookie,
        'Accept': '*/*',
        'Connection': 'close',
        'Referer': 'https://home.m.jd.com/myJd/home.action',
        'Accept-Encoding': 'gzip, deflate, br',
        'Host': 'me-api.jd.com',
        'User-Agent': ua(),
        'Accept-Langua()ge': 'zh-cn'
    }
    try:
        resp = requests.get(url=url, headers=headers, timeout=60).json()
        if resp['retcode'] == "0":
            nickname = resp['data']['userInfo']['baseInfo']['nickname']  # 账号名
            return True
        else:
            msg(f"账号 {pin} Cookie 已失效！请重新获取。\n")
    except Exception:
        msg(f"账号 {pin} Cookie 已失效！请重新获取。\n")
cookie_list=list(filter(getUserInfo,cookie_list)) 


def taskPostUrl(functionId, body, cookie):
    url=f'https://ifanli.m.jd.com/rebateapi/task/{functionId}'
    headers={
        'Cookie': cookie,
        'Host': 'ifanli.m.jd.com',
        'Connection': 'keep-alive',
        'origin': 'https://ifanli.m.jd.com',
        'referer': 'https://ifanli.m.jd.com/rebate/earnBean.html?paltform=null',
        'Content-Type': 'application/json;charset=UTF-8',
        "User-Agent": ua(),
        "Accept": "application/json, text/plain, */*",
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
    }
    data=body
    for n in range(3):
        try:
            res=requests.post(url=url,headers=headers,json=data).json()
            return res
        except:
            if n==2:
                msg('API请求失败，请检查网路重试❗\n')  


def taskGetUrl(functionId, cookie):
    url=f'https://ifanli.m.jd.com/rebateapi/task/{functionId}'
    headers={
        'Cookie': cookie,
        'Host': 'ifanli.m.jd.com',
        'Connection': 'keep-alive',
        'referer': 'https://ifanli.m.jd.com/rebate/earnBean.html?paltform=null',
        'Content-Type': 'application/json;charset=UTF-8',
        "User-Agent": ua(),
        'accept':'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
    }
    for n in range(3):
        try:
            res=requests.get(url=url,headers=headers).json()
            return res
        except:
            if n==2:
                msg('API请求失败，请检查网路重试❗\n')

# 任务列表
def getTaskList(cookie):
    global log
    log=list()
    res=taskGetUrl("getTaskList", cookie)
    if not res:
        return
    if res['code']==1:
        content_list=res['content']
        for content in content_list:
            if taskId:=content['taskId']:

                log.append(f"{get_pin(cookie)}:开始任务 {content['taskName']}")
                log.append(f"{get_pin(cookie)}:等待 {content['watchTime']} 秒任务完成 ")

                uid,tt=saveTaskRecord_2(cookie,taskId,content['businessId'],content['taskType'])
                time.sleep(content['watchTime']+1)
                saveTaskRecord(cookie,taskId,content['businessId'],content['taskType'],uid,tt)
                log=functools.reduce(lambda a,i: a+'\n'+i,log)
                msg(log)
                if log:
                    if log != ' ' and log != '\n':
                        return getTaskList(cookie)
                log=list()
        log.append(f'{get_pin(cookie)}: 全部任务已完成\n')
    else:
        log.append(f"{get_pin(cookie)}:{res['msg']}\n")
    log=functools.reduce(lambda a,i: str(a)+'\n'+str(i),log)
    msg(log)


# 获取京豆
def saveTaskRecord(cookie,taskId,businessId,taskType,uid,tt):
    global log
    body={"taskId":taskId,"taskType":taskType,"businessId":businessId,"uid":uid,"tt":tt}
    res=taskPostUrl("saveTaskRecord", body, cookie)
    if not res:
        return
    if res['code']==1:
        try:
            log.append(f"{get_pin(cookie)}:{res['content']['msg']}\n")
        except:
            log.append(f"{get_pin(cookie)}:获取京豆失败")
    else:
        log.append(f"{get_pin(cookie)}:{res['msg']}\n")


# 获取uid,tt
def saveTaskRecord_2(cookie,taskId,businessId,taskType):
    global log
    body={"taskId":taskId,'businessId':businessId,"taskType":taskType}
    res=taskPostUrl("saveTaskRecord", body, cookie)
    if not res:
        return
    if res['code']==1:
        uid=res['content']['uid']
        tt=res['content']['tt']
        return uid,tt
    else:
        log.append(f"{get_pin(cookie)}:{res['msg']}\n")
 

def main():
    msg('🔔逛好物，赚京豆，开始！\n')
    msg(f'====================共{len(cookie_list)}京东个账号Cookie=========\n')
    # pool = Pool(p:=3)
    # msg(f'为节省时间，当前采用 {p} 账号并行\n')

    # for e,cookie in enumerate(cookie_list,start=1):
    #     pool.apply_async(func=getTaskList,args=(cookie,))

    # pool.close()
    # pool.join()

    [getTaskList(cookie) for cookie in cookie_list]
    
    if run_send=='yes':
        send('逛好物，赚京豆')   # 通知服务


if __name__ == '__main__':
    main()



