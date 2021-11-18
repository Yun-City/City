# 发财挖宝
# 入口>   京东极速版，我的，发财挖宝
# 脚本功能为 完成部分任务，内部互助，挖宝，提现，可能大概应该也许解决火爆了
# 由于每个号只有两次助力机会，所有只助力前两个号，以节省资源
# 环境变量JD_COOKIE，多账号用&分割
# export JD_COOKIE="第1个cookie&第2个cookie"

import os,json,random,time,re,string,functools,asyncio
import sys
sys.path.append('../../tmp')
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

# 检查账号有效性
def getUserInfo(cookie):
    try:
        pin=get_pin(cookie)
    except:
        msg('有一个cookie 格式出错\n')
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
    return


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

    def main(self,n=1):
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
            if n < 5:
                n += 1
                return self.main(n)
            else:
                print('获取通知服务失败，请检查网络连接...')
Msg().main()   # 初始化通知服务   

def taskPostUrl(functionId, body, cookie, resp=True):
    url=f'{JD_API_HOST}/?functionId={functionId}&body={json.dumps(body)}&t={gettimestamp()}&appid=activities_platform&client=H5&clientVersion=1.0.0'
    headers={
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'origin': 'https://bnzf.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        "User-Agent": ua(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
    }
    if resp:
        for n in range(3):
            try:
                res=requests.get(url,headers=headers).json()
                return res
            except:
                if n==3:
                    msg('API请求失败，请检查网路重试❗\n')  
    else:
        return url,data,headers

def taskPostUrl2(functionId, body, cookie, resp=True):
    url=f'{JD_API_HOST}/?functionId={functionId}&body={json.dumps(body)}&t={gettimestamp()}&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=20211101103844667%3B0745683210997892%3Bce6c2%3Btk02wa5901c7918nvxUVYAJ28Nuw%2FBmcDGzVe558psmhDDnV7wlC8NVGKwyC87aOmkUVcTHkY7g9ZBrjqUpM9VRovTlf%3Bce732422fa03d42113aecff728d6d5508e1f79de80b6b496f70d23035528face%3B3.0%3B1635734324667'
    headers={
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'origin': 'https://bnzf.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        "User-Agent": ua(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
    }
    if resp:
        for n in range(3):
            try:
                res=requests.get(url,headers=headers).json()
                return res
            except:
                if n==3:
                    msg('API请求失败，请检查网路重试❗\n')  
    else:
        return url,data,headers

def taskPostUrl3(functionId, body, cookie, resp=True):
    url=f"https://api.m.jd.com/client.action?functionId={functionId}&client=wh5&clientVersion=1.0.0"
    headers={
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'origin': 'https://pro.m.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        "User-Agent": ua(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
    }
    body={"activityId":"3Xq1vUsZR9sAMKJkKQEgckUhs2pr","pageNum":"-1","innerIndex":"0","addressId":"3980494433","geo":{"lng":"107.64356","lat":"30.282319"},"flt":"","jda":"122270672.1632646584741845948371.1632646584.1635564529.1635573445.5","topNavStyle":"","autoSkipEmptyPage":False,"paginationParam":"2","paginationFlrs":"[[59871769,59871770,59871771,59871777,59871778,59871774,59871779,59871780,59871781],[59871782]]","transParam":"{\"bsessionId\":\"b4c6cfd9-a43f-4b43-8eda-fcad08d8acf6\",\"actId\":\"00827672\",\"enActId\":\"3Xq1vUsZR9sAMKJkKQEgckUhs2pr\",\"pageId\":\"2776327\",\"encryptCouponFlag\":\"1\",\"sc\":\"android\",\"requestChannel\":\"h5\",\"babelSite\":\"jdlite\",\"bsChannel\":\"wl\",\"jdAtHomePage\":\"0\",\"utmFlag\":\"0\"}","sid":"ea504fccb2a92c7920db5eb3693d0f3w","matProExt":{"unpl":"V2_ZzNtbUoFShZyXxUAeB4IAWICEw1LURMXJltAU3lJWgJvAxteclRCFnUUR1JnGlUUZAAZX0VcQxBFOEVVexlbAG4LG1xyZ0sdGwgLVBUaMgYqTl9tQVdzFEUIQVd9HFUFZwYUWkRSSxd0CU9Qfh1dNVcDFG1GVEMVdQxFV3MZWzVXAiJcclZzXhsJC1R8GloAbgMSWERQRRB9CkdVch1ZAWYzE21B"},"userInterest":{"whiteNote":"0_0_0","payment":"0_0_0","plusNew":"0_0_0","plusRenew":"0_0_0"},"bsChannel":"wl","siteClient":"android"}
    data=f"body={json.dumps(body)}&sid=ea504fccb2a92c7920db5eb3693d0f3w&uuid=1632646584741845948371.233.1635576026839&area=4_134_19915_0&screen=1242*2208"
    if resp:
        for n in range(3):
            try:
                requests.post(url,headers=headers,data=data).json()
                return res
            except:
                if n==3:
                    msg('API请求失败，请检查网路重试❗\n')  
    else:
        return url,data,headers

def log(cookie, resp=True):
    url=f'https://httpfereport.jd.com/log'
    headers={
        'Cookie': cookie,
        'Host': 'httpfereport.jd.com/log',
        'Connection': 'keep-alive',
        'origin': 'https://bnzf.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        "User-Agent": ua(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
    }
    data="%7B%22params%22%3A%5B%7B%22logType%22%3A%22_trackPerformance%22%2C%22apiName%22%3A%22product-request-happyDigDo%22%2C%22apiTime%22%3A720%2C%22resolution%22%3A%7B%22availHeight%22%3A851%2C%22availWidth%22%3A393%2C%22clientHeight%22%3A726%2C%22clientWidth%22%3A393%7D%2C%22defaultErrorMsg%22%3A%22msg%3AUncaught%20TypeError%3A%20JDPerformance.sendResource%20is%20not%20a%20function%2C%20url%3Ahttps%3A%2F%2Fbnzf.jd.com%2F%3FactivityId%3DyCcpwTLIbY6pjaM42ACUVg%26lng%3D107.647038%26lat%3D30.28044%26sid%3D20f1a35cc9c79bd35a85b629b3cfb49w%26un_area%3D4_134_19915_0%2C%20lineNumber%3A1%2C%20columnNumber%3A15%22%2C%22currentUrl%22%3A%22https%3A%2F%2Fbnzf.jd.com%2F%3FactivityId%3DyCcpwTLIbY6pjaM42ACUVg%26lng%3D107.647038%26lat%3D30.28044%26sid%3D20f1a35cc9c79bd35a85b629b3cfb49w%26un_area%3D4_134_19915_0%22%2C%22appId%22%3A%22171%22%2C%22identity%22%3A%22bf5f8929-022d-431b-e38e-f938c071cf25%22%2C%22deviceInfo%22%3A%7B%22environment%22%3A%22qq%22%2C%22network%22%3A%22wifi%22%2C%22appVersion%22%3A%22unknown%22%2C%22deviceType%22%3A%22android%22%2C%22osVersion%22%3A%22android%209%22%2C%22deviceModel%22%3A%229%3B8363031323830343433313332303-13D2438366461633039353566366%3Bnetwork%2Fwifi%3Bmodel%2FRedmi%20Note%207%3Baddressid%2F3980494433%3Baid%2F48cfb189fc66ca09%3Boaid%2F697e77ebe3fde164%3BosVer%2F28%3BappBuild%2F1864%3Bpsn%2FGsCGkD48W1x%20kC3CSjkULDCvLGH%2FYvxGjShDHvGxIzk%3D%7C313%3Bpsq%2F5%3Badk%2F%3Bads%2F%3Bpap%2FJA2020_3112531%7C3.6.8%7CANDROID%209%3Bosv%2F9%3Bpv%2F247.16%3BinstallationId%2F991ccdcfc55f4e5e95c0bf7c28f23868%3Bjdv%2F0%7Ckong%7Ct_2011648980_%7Cjingfen%7C9c826fbe26e5400a87a3bb763a769182%7C1627482976154%7C1627482986%3Bref%2Fcom.jd.jdlite.lib.personal.view.fragment.JDPersonalFragment%3Bpartner%2Fxiaomi%3Bapprpd%2FMyJD_Main%3Beufv%2F1%3BMozilla%2F5.0%20(Linux%3B%20Android%209%3B%20Redmi%20Note%207%20Build%2FPKQ1.180904.001%22%2C%22deviceBrand%22%3A%229%3B8363031323830343433313332303-13D2438366461633039353566366%3Bnetwork%2Fwifi%3Bmodel%2FRedmi%20Note%207%3Baddressid%2F3980494433%3Baid%2F48cfb189fc66ca09%3Boaid%2F697e77ebe3fde164%3BosVer%2F28%3BappBuild%2F1864%3Bpsn%2FGsCGkD48W1x%20kC3CSjkULDCvLGH%2FYvxGjShDHvGxIzk%3D%7C313%3Bpsq%2F5%3Badk%2F%3Bads%2F%3Bpap%2FJA2020_3112531%7C3.6.8%7CANDROID%209%3Bosv%2F9%3Bpv%2F247.16%3BinstallationId%2F991ccdcfc55f4e5e95c0bf7c28f23868%3Bjdv%2F0%7Ckong%7Ct_2011648980_%7Cjingfen%7C9c826fbe26e5400a87a3bb763a769182%7C1627482976154%7C1627482986%3Bref%2Fcom.jd.jdlite.lib.personal.view.fragment.JDPersonalFragment%3Bpartner%2Fxiaomi%3Bapprpd%2FMyJD_Main%3Beufv%2F1%3BMozilla%2F5.0%20(Linux%3B%20Android%209%3B%20Redmi%20Note%207%20Build%2FPKQ1.180904.001%22%7D%7D%5D%7D"
    if resp:
        for n in range(3):
            try:
                requests.post(url,headers=headers,data=data).json()
                return res
            except:
                if n==3:
                    msg('API请求失败，请检查网路重试❗\n')  
    else:
        return url,data,headers

# 开局验证？
def activity(cookie):
    url="https://h5speed.m.jd.com/v2/speed/activity?flag=132&sid=f77337204fa0b3cdbc02fa03b6cfb45w&libVer=2.0.0&url=https%3A%2F%2Fbnzf.jd.com%2F&rts=1635613363462&title=%E5%8F%91%E8%B4%A2%E6%8C%96%E5%AE%9D&p1=1&p2=1&p3=1&p4=0&p5=0&p6=10&p7=249&p8=107&p9=7&p10=114&p11=1751&p12=1751&p13=0&p14=1893&p15=377&p16=1516&resources={%22badjs.json?Content=%20%5B%20Sun%20Oct%2031%202021%2001%3A02%3A39%20GMT%2B0800%20(%E5%8C%97%E7%BE%8E%E4%B8%AD%E9%83%A8%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)%20%5D%20configCenterAjaxPrame%20Exception&referer=https%3A%2F%2Fimk2.jd.com%2Fauto%2Fopen%2Fliteapp%2FconfigCenter%2Fajax%2Fsuccess%2Fexception%3Fwq&t=0.6081273460492731%22:397,%22preArousal?app=jdliteapp&refer=https%3A%2F%2Fbnzf.jd.com%2F%3FactivityId%3DyCcpwTLIbY6pjaM42ACUVg%26lng%3D107.648869%26lat%3D30.281194%26sid%3Df77337204fa0b3cdbc02fa03b6cfb45w%26un_area%3D4_134_19915_0&imkUserId=imk2291.330737368482&type=1&msg=configCenterAjaxPrame%20Exception&t=0.1307983996705202%22:407,%22api-getStaticResource%22:392,%22api-apTaskList%22:394,%22api-getStationMarquees%22:373,%22api-happyDigHome%22:432,%22blast.cfc8150d.gif%22:365,%22halo.6d8599b2.gif%22:370,%22crack.0f00e203.gif%22:374,%22exception?data=eyJmbGFnIjoxMzIsInJ0cyI6MTYzNTYxMzM2MDUxMCwibGliVmVyIjoiMi4xLjUiLCJ1cmwiOiJodHRwczovL2JuemYuamQuY29tLyIsInRpdGxlIjoi5Y%2BR6LSi5oyW5a6dIiwiZXJyVHlwZSI6NCwiZXJyQ29kZSI6NzUwLCJlcnJNc2ciOiJKRFBlcmZvcm1hbmNlLnNlbmRSZXNvdXJjZSBpcyBub3QgYSBmdW5jdGlvbiIsImV4Y2VwdGlvbkluZm8iOnsidHlwZSI6IlR5cGVFcnJvciIsInN0YWNrIjpbXX19%22:418,%22eff9a57761a0c45a.png%22:111,%22bbbee650e29a8525.png%22:190,%22hand.1e279b77.gif%22:153,%226e3d0e3f0efa29d3.jpg%22:532,%220af3dbd3ab14a953.jpg%22:695}"
    headers={
        'Cookie': cookie,
        'Host': 'h5speed.m.jd.com',
        'Connection': 'keep-alive',
        'referer': 'https://bnzf.jd.com/?activityId=yCcpwTLIbY6pjaM42ACUVg&lng=107.648869&lat=30.281194&sid=f77337204fa0b3cdbc02fa03b6cfb45w&un_area=4_134_19915_0',
        'Content-Type': 'application/x-www-form-urlencoded',
        "User-Agent": ua(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
    } 
    for n in range(3):
        try:
            requests.post(url,headers=headers,data=data).json()
            return res
        except:
            if n==3:
                msg('API请求失败，请检查网路重试❗\n')   


def log2(cookie):
    url="https://watchtower-logger.jd.com/log"
    headers={
        'Cookie': cookie,
        'Host': 'watchtower-logger.jd.com',
        'Connection': 'keep-alive',
        'origin': 'https://bnzf.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        "User-Agent": ua(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
    } 
    for n in range(3):
        try:
            requests.post(url,headers=headers,data=data).json()
            return res
        except:
            if n==3:
                msg('API请求失败，请检查网路重试❗\n')  




# 剩余血量
def xueliang(cookie):
    body={"linkId":"yCcpwTLIbY6pjaM42ACUVg"}
    res=taskPostUrl("happyDigHome", body, cookie)
    if not res:
        return
    if res['code']==0:
        if res['success']:
            curRound=res['data']['curRound']                        # 未知
            blood=res['data']['blood']                              # 剩余血量
            return blood      

def jinge(cookie,i):
    body={"linkId":"yCcpwTLIbY6pjaM42ACUVg"}
    res=taskPostUrl("happyDigHome", body, cookie)
    if not res:
        return
    if res['code']==0:
        if res['success']:
            curRound=res['data']['curRound']                        # 未知
            blood=res['data']['blood']                              # 剩余血量
            roundList=res['data']['roundList']                      # 3个总池子
            roundList_n=roundList[0]
            redAmount=roundList_n['redAmount']                  # 当前池已得京东红包
            cashAmount=roundList_n['cashAmount']                # 当前池已得微信红包

            return [blood,redAmount,cashAmount]   

# 页面数据
def happyDigHome(cookie):
    log(cookie)
    log2(cookie)
    body={"linkId":"yCcpwTLIbY6pjaM42ACUVg"}
    res=taskPostUrl("happyDigHome", body, cookie)
    if not res:
        return
    if res['code']==0:
        if res['success']:
            curRound=res['data']['curRound']                        # 未知
            blood=res['data']['blood']                              # 剩余血量
            roundList=res['data']['roundList']                      # 3个总池子
            for roundList_n in roundList:                           # 迭代每个池子
                roundid=roundList_n['round']                        # 池序号
                state=roundList_n['state'] 
                rows=roundList_n['rows']                            # 池规模，rows*rows
                redAmount=roundList_n['redAmount']                  # 当前池已得京东红包
                cashAmount=roundList_n['cashAmount']                # 当前池已得微信红包
                leftAmount=roundList_n['leftAmount']                # 剩余红包？
                chunks=roundList_n['chunks']                        # 当前池详情list

                a=jinge(cookie,roundid)
                msg(f'当前池序号为 {roundid} \n当前池规模为 {rows}*{rows}')
                msg(f'剩余血量 {a[0]}')
                msg(f'当前池已得京东红包 {a[2]}\n当前池已得微信红包 {a[1]}\n')
       
                if (_blood:=xueliang(cookie))>1:
                    happyDigDo(cookie,roundid,0,0)
                    for n in range(roundid+4):
                        for i in range(roundid+4):
                            if (_blood:=xueliang(cookie))>1:
                                msg(f'当前血量为 {_blood} 健康，继续挖宝')
                                msg(f'本次挖取坐标为 ({n},{i})')
                                happyDigDo(cookie,roundid,n,i)
                                _apTaskList(cookie)
                                log2(cookie)
                                log(cookie)
                            else:
                                a=jinge(cookie,roundid)
                                msg(f'当前血量为 {_blood} 不健康，结束该池挖宝')
                                msg(f'当前池已得京东红包 {a[2]}\n当前池已得微信红包 {a[1]}\n')
                                break
        else:
            msg(f'获取数据失败\n{res}\n')
    else:
        msg(f'获取数据失败\n{res}\n')


# 任务列表
def _apTaskList(cookie):
    body={"linkId":"yCcpwTLIbY6pjaM42ACUVg"}
    res=taskPostUrl("apTaskList", body, cookie)
    if not res:
        return
    pass

# 任务列表
def apTaskList(cookie):
    log2(cookie)
    body={"linkId":"yCcpwTLIbY6pjaM42ACUVg"}
    res=taskPostUrl("apTaskList", body, cookie)
    if res['code']==0:
        if res['success']:
            data=res['data']
            for _data in data:
                taskId=_data['id']                      # 任务id
                taskTitle=_data['taskTitle']            # 任务标题
                taskType=_data['taskType']              # 任务类型
                forwardUrl=_data['forwardUrl']          # 任务url
                if forwardUrl:
                    msg(f"任务id {taskId} ")
                    msg(f"任务标题 {taskTitle} ")
                    pro_m_jd(cookie,forwardUrl)
                    apTaskTimeRecord(cookie,taskId)
                    log(cookie)
        else:
            msg(f'获取数据失败\n{res}\n')
    else:
        msg(f'获取数据失败\n{res}\n')

# 浏览任务                   
def apTaskDetail(cookie):
    body={"linkId":"yCcpwTLIbY6pjaM42ACUVg","taskType":"BROWSE_CHANNEL","taskId":357,"channel":4}
    res=taskPostUrl("apTaskDetail", body, cookie)
    if res['code']==0:
        if res['success']:
            taskItemList=res['data']['taskItemList']
            for _taskItemList in taskItemList:
                itemName=_taskItemList['itemName']          # 任务名称
                itemId=_taskItemList['itemId']              # 任务url
                msg(f'任务标题 {itemName}')
                pro_m_jd(cookie,itemId)
                log(cookie)
                log2(cookie)
                apTaskTimeRecord(cookie,357)
        else:
            msg(f'获取数据失败\n{res}\n')
    else:
        msg(f'获取数据失败\n{res}\n')        


def pro_m_jd(cookie,url):
    url=f"{url}?lng=107.648869&lat=30.281194&sid=8ff526209834a2d76c539b278654553w&un_area=4_134_19915_0"
    headers={
        'Cookie': cookie,
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        "User-Agent": ua(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
    }   
    for n in range(3):
        try:
            requests.get(url,headers=headers).json()
            return res
        except:
            if n==3:
                msg('API请求失败，请检查网路重试❗\n')  


# 浏览任务
def apTaskTimeRecord(cookie,taskId):
    log2(cookie)
    body={"linkId":"yCcpwTLIbY6pjaM42ACUVg","taskId":taskId}
    taskPostUrl("apTaskTimeRecord", body, cookie)
    time.sleep(2)
    taskPostUrl("lite_qryBabelSiteBabelFloors", {}, cookie)
    time.sleep(2)
    taskPostUrl("lite_qryBabelSiteBabelFloors", {}, cookie)
    time.sleep(2)
    taskPostUrl("lite_qryBabelSiteBabelFloors", {}, cookie)
    time.sleep(2)
    taskPostUrl("lite_qryBabelSiteBabelFloors", {}, cookie)
    time.sleep(2)
    taskPostUrl("lite_qryBabelSiteBabelFloors", {}, cookie)
    log(cookie)
    xueliang(cookie)
    _apTaskList(cookie)
    msg('任务也许完成了\n')
    

# 挖宝
def happyDigDo(cookie,roundid,rowIdx,colIdx):
    body={"round":roundid,"rowIdx":rowIdx,"colIdx":colIdx,"linkId":"yCcpwTLIbY6pjaM42ACUVg"}
    res=taskPostUrl("happyDigDo", body, cookie)
    if not res:
        return
    if res['code']==0:
        if res['success']:
            typeid=res['data']['chunk']['type']
            if typeid==2:
                msg(f"挖到京东红包 {res['data']['chunk']['value']}\n")
            elif typeid==3:
                msg(f"挖到微信红包 {res['data']['chunk']['value']}\n")
            elif typeid==4:
                msg(f"挖到炸弹\n")
            elif typeid==1:
                msg(f"挖到优惠券\n")
            else:
                msg(f'挖到外星物品\n')
        else:
            msg(f'挖取失败\n{res}\n')
    else:
        msg(f'挖取失败\n{res}\n')

# 助力码
def inviteCode(cookie):
    global inviteCode_1_list,inviteCode_2_list
    body={"linkId":"yCcpwTLIbY6pjaM42ACUVg"}
    res=taskPostUrl("happyDigHome", body, cookie)
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
    log2(cookie)
    body={"linkId":"yCcpwTLIbY6pjaM42ACUVg","inviter":fcwbinviter,"inviteCode":fcwbinviteCode}
    res=taskPostUrl("happyDigHelp", body, cookie)
    log(cookie)
    if res['success']:
        msg('助力成功')
    else:
        msg(res['errMsg'])

# 领取奖励
def happyDigExchange(cookie):
    for n in range(0,4):
        log2(cookie)
        xueliang(cookie)
        _apTaskList(cookie)
        msg('开始领取奖励')
        body={"round":n,"linkId":"yCcpwTLIbY6pjaM42ACUVg"}
        res=taskPostUrl("happyDigExchange", body, cookie)
        log(cookie)
        if not res:
            return
        if res['code']==0:
            if res['success']:
                try:
                    msg(f"领取到微信红包 {res['data']['wxValue']}")
                except:
                    pass
                try:
                    msg(f"领取到京东红包 {res['data']['redValue']}\n")
                except:
                    pass
            else:
                msg(res['errMsg']+'\n')
        else:
            msg(res['errMsg']+'\n')



# 微信现金id
def spring_reward_list(cookie):
    log2(cookie)
    happyDigExchange(cookie)
    xueliang(cookie)
    _apTaskList(cookie)
    body={"linkId":"yCcpwTLIbY6pjaM42ACUVg","pageNum":1,"pageSize":5}
    res=taskPostUrl("spring_reward_list", body, cookie)
    _apTaskList(cookie)
    log(cookie)
    if res['code']==0:
        if res['success']:
            items=res['data']['items']
            for _items in items:
                amount=_items['amount']         # 金额
                prizeDesc=_items['prizeDesc']   # 金额备注
                amountid=_items['id']           # 金额id
                poolBaseId=_items['poolBaseId']
                prizeGroupId=_items['prizeGroupId']
                prizeBaseId=_items['prizeBaseId']
                if '极速版签到返红包' not in prizeDesc:
                    msg('尝试微信提现')
                    wecat(cookie,amountid,poolBaseId,prizeGroupId,prizeBaseId)
        else:
            msg(f'获取数据失败\n{res}\n')
    else:
        msg(f'获取数据失败\n{res}\n')                     

# 微信提现
def wecat(cookie,amountid,poolBaseId,prizeGroupId,prizeBaseId):
    log2(cookie)
    xueliang(cookie)
    _apTaskList(cookie)
    url='https://api.m.jd.com'
    headers={
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'origin': 'https://bnzf.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        "User-Agent": ua(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
    }
    body={"businessSource":"happyDiggerH5Cash","base":{"id":amountid,"business":"happyDigger","poolBaseId":poolBaseId,"prizeGroupId":prizeGroupId,"prizeBaseId":prizeBaseId,"prizeType":4},"linkId":"yCcpwTLIbY6pjaM42ACUVg"}
    data=f"functionId=apCashWithDraw&body={json.dumps(body)}&t=1635596380119&appid=activities_platform&client=H5&clientVersion=1.0.0"
    for n in range(3):
        try:
            res=requests.post(url,headers=headers,data=data).json()
            break
        except:
            if n==3:
                msg('API请求失败，请检查网路重试❗\n') 
    log(cookie)
    try:
        if res['code']==0:
            if res['success']:
                msg(res['data']['message']+'\n')
    except:
        msg(res)
        msg('')
    
def main_run(cookie):
    activity(cookie)
    log2(cookie)
    apTaskDetail(cookie)
    apTaskList(cookie)
    happyDigHome(cookie)
    spring_reward_list(cookie)
    

def main():
    msg('🔔发财挖宝，开始！\n')

    msg('获取助力码\n')
    global inviteCode_1_list,inviteCode_2_list
    inviteCode_1_list=list()
    inviteCode_2_list=list()
    for cookie in cookie_list:
       inviteCode(cookie) 

    msg('互助\n')
    inviteCode_2_list=inviteCode_2_list[:2]
    for e,fcwbinviter in enumerate(inviteCode_2_list):
        fcwbinviteCode=inviteCode_1_list[e]
        for cookie in cookie_list:
            happyDigHelp(cookie,fcwbinviter,fcwbinviteCode)

    msg(f'====================共{len(cookie_list)}京东个账号Cookie=========\n')

    tasksss=[]
    for e,cookie in enumerate(cookie_list,start=1):
        msg(f'******开始【账号 {e}】 {get_pin(cookie)} *********\n')
        a=getUserInfo(cookie)
        if not a:
            return
        main_run(cookie)
        
    if run_send=='yes':
        send('### 发财挖宝 ###')   # 通知服务


if __name__ == '__main__':
    main()


