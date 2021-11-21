## Version: v3.0.0
## Date: 2021-11-12
## Mod: Build20211112-002 Faker Repository config
## Update Content: 可持续发展纲要\n1. session管理破坏性修改\n2. 配置管理可编辑config下文件\n3. 自定义脚本改为查看脚本\n4. 移除互助相关

## 上面版本号中，如果第2位数字有变化，那么代表增加了新的参数，如果只有第3位数字有变化，仅代表更新了注释，没有增加新的参数，可更新可不更新

## 在运行 ql repo 命令时，是否自动删除失效的脚本与定时任务
AutoDelCron="true"

## 在运行 ql repo 命令时，是否自动增加新的本地定时任务
AutoAddCron="true"

## ql repo命令拉取脚本时需要拉取的文件后缀，直接写文件后缀名即可
RepoFileExtensions="js py ts"

## 由于github仓库拉取较慢，所以会默认添加代理前缀，如不需要请移除
GithubProxyUrl="https://ghproxy.com/"

## 设置定时任务执行的超时时间，默认1h，后缀"s"代表秒(默认值), "m"代表分, "h"代表小时, "d"代表天
CommandTimeoutTime="3h"

## 设置批量执行任务时的并发数，默认同时执行5个任务
MaxConcurrentNum="20"

## 在运行 task 命令时，随机延迟启动任务的最大延迟时间
## 默认给javascript任务加随机延迟，如 RandomDelay="300" ，表示任务将在 1-300 秒内随机延迟一个秒数，然后再运行，取消延迟赋值为空
RandomDelay=""

## 如果你自己会写shell脚本，并且希望在每次运行 ql update 命令时，额外运行你的 shell 脚本，请赋值为 "true"，默认为true
EnableExtraShell="true"

## 是否自动启动bot，默认不启动，设置为true时自动启动，目前需要自行克隆bot仓库所需代码，存到ql/repo目录下，文件夹命名为dockerbot
AutoStartBot="true"

## 安装bot依赖时指定pip源，默认使用清华源，如不需要源，设置此参数为空
PipMirror="https://pypi.tuna.tsinghua.edu.cn/simple"

## 通知环境变量
## 1. Server酱
## https://sct.ftqq.com
## 下方填写 SCHKEY 值或 SendKey 值
export PUSH_KEY=""

## 2. BARK
## 下方填写app提供的设备码，例如：https://api.day.app/123 那么此处的设备码就是123
export BARK_PUSH=""
## 下方填写推送声音设置，例如choo，具体值请在bark-推送铃声-查看所有铃声
export BARK_SOUND=""
## 下方填写推送消息分组，默认为"QingLong"
export BARK_GROUP="QingLong"

## 3. Telegram 
## 下方填写自己申请@BotFather的Token，如10xxx4:AAFcqxxxxgER5uw
export TG_BOT_TOKEN=""
## 下方填写 @getuseridbot 中获取到的纯数字ID
export TG_USER_ID=""
## Telegram 代理IP（选填）
## 下方填写代理IP地址，代理类型为 http，比如您代理是 http://127.0.0.1:1080，则填写 "127.0.0.1"
## 如需使用，请自行解除下一行的注释
export TG_PROXY_HOST=""
## Telegram 代理端口（选填）
## 下方填写代理端口号，代理类型为 http，比如您代理是 http://127.0.0.1:1080，则填写 "1080"
## 如需使用，请自行解除下一行的注释
export TG_PROXY_PORT=""
## Telegram 代理的认证参数（选填）
export TG_PROXY_AUTH=""
## Telegram api自建反向代理地址（选填）
## 教程：https://www.hostloc.com/thread-805441-1-1.html
## 如反向代理地址 http://aaa.bbb.ccc 则填写 aaa.bbb.ccc
## 如需使用，请赋值代理地址链接，并自行解除下一行的注释
export TG_API_HOST=""

## 4. 钉钉 
## 官方文档：https://developers.dingtalk.com/document/app/custom-robot-access
## 下方填写token后面的内容，只需 https://oapi.dingtalk.com/robot/send?access_token=XXX 等于=符号后面的XXX即可
export DD_BOT_TOKEN=""
export DD_BOT_SECRET=""

## 5. 企业微信机器人
## 官方说明文档：https://work.weixin.qq.com/api/doc/90000/90136/91770
## 下方填写密钥，企业微信推送 webhook 后面的 key
export QYWX_KEY=""

## 6. 企业微信应用
## 参考文档：http://note.youdao.com/s/HMiudGkb
## 下方填写素材库图片id（corpid,corpsecret,touser,agentid），素材库图片填0为图文消息, 填1为纯文本消息
export QYWX_AM=""

## 7. iGot聚合
## 参考文档：https://wahao.github.io/Bark-MP-helper
## 下方填写iGot的推送key，支持多方式推送，确保消息可达
export IGOT_PUSH_KEY=""

## 8. Push Plus
## 官方网站：http://www.pushplus.plus
## 下方填写您的Token，微信扫码登录后一对一推送或一对多推送下面的token，只填 PUSH_PLUS_TOKEN 默认为一对一推送
export PUSH_PLUS_TOKEN=""
## 一对一多推送（选填）
## 下方填写您的一对多推送的 "群组编码" ，（一对多推送下面->您的群组(如无则新建)->群组编码）
## 1. 需订阅者扫描二维码 2、如果您是创建群组所属人，也需点击“查看二维码”扫描绑定，否则不能接受群组消息推送
export PUSH_PLUS_USER=""

## 9. go-cqhttp
## gobot_url 推送到个人QQ: http://127.0.0.1/send_private_msg  群：http://127.0.0.1/send_group_msg 
## gobot_token 填写在go-cqhttp文件设置的访问密钥
## gobot_qq 如果GOBOT_URL设置 /send_private_msg 则需要填入 user_id=个人QQ 相反如果是 /send_group_msg 则需要填入 group_id=QQ群 
## go-cqhttp相关API https://docs.go-cqhttp.org/api
export GOBOT_URL=""
export GOBOT_TOKEN=""
export GOBOT_QQ=""

## 10. 临时屏蔽某个Cookie
## 如果某些 Cookie 已经失效了，但暂时还没法更新，可以使用此功能在不删除该Cookie和重新修改Cookie编号的前提下，临时屏蔽掉某些编号的Cookie
## 多个Cookie编号以半角的空格分隔，两侧一对半角双引号，使用此功能后，在运行js脚本时账户编号将发生变化
## 举例1：TempBlockCookie="2"    临时屏蔽掉 Cookie2
## 举例2：TempBlockCookie="2 4"  临时屏蔽掉 Cookie2 和 Cookie4

## 如果只是想要屏蔽某个 Cookie 不参加某些活动，可以参考下面 case 这个命令的例子来控制
## case $1 in
##     *jd_fruit*)                            # 东东农场活动脚本关键词
##         TempBlockCookie="5"                # Cookie5 不玩东东农场
##         ;;
##     *jd_dreamFactory* | *jd_jdfactory*)    # 京喜工厂和东东工厂的活动脚本关键词
##         TempBlockCookie="2"                # Cookie2 不玩京喜工厂和东东工厂
##         ;;
##     *jd_jdzz* | *jd_joy*)                  # 京喜赚赚和宠汪汪的活动脚本关键词
##         TempBlockCookie="3 7_8 9-10 12~13" # Cookie3 、Cookie7至8、Cookie9至10、Cookie12至13 不玩京东赚赚和宠汪汪
##         ;;
##     *)                                     # 必选项。其他活动
##         TempBlockCookie=""                 # 必选项。默认为空值，表示其他帐号参加全部活动。填写帐号序号表示指定的 Cookie 只能参加之前 case 选项的活动
##         ;;
## esac
case $1 in
    *jd_fruit*)
        TempBlockCookie=""
        ;;
    *jd_dreamFactory* | *jd_jdfactory*)
        TempBlockCookie=""
        ;;
    *jd_jdzz* | *jd_joy*)
        TempBlockCookie=""
        ;;
    *)
        TempBlockCookie=""
        ;;
esac

## 11. 随机Cookie
## Cookie 按随机顺序参加活动。取消 # 注释后，填 1 表示开启功能。
# RandomMode=""
## 从原 Cookie 中随机提取指定数量的 Cookie 参加活动，当 RandomMode="1" 时生效。取消 # 注释后，赋值后生效。
### 赋值要求："空值"、"非数字"、"小于2或大于 Cookie 总数的数值"，均自动调整为全部 Cookie 按随机顺序参加活动；
###           "大于或等于2，且小于或等于 Cookie 总数的数值"，抽取指定数值的 Cookie 按随机顺序参数活动。
# ran_num=""
## 如果想指定活动进行随机模式，可以参考下面 case 这个命令的例子来控制
## case $1 in
##     *jd_fruit*)                            # 东东农场活动脚本关键词
##         RandomMode="1"                     # 东东农场开启随机模式
##         ran_num=""                         # 东东农场全部 Cookie 按随机顺序参加活动
##         ;;
##     *jd_dreamFactory* | *jd_jdfactory*)    # 京喜工厂和东东工厂的活动脚本关键词
##         RandomMode="1"                     # 京喜工厂和东东工厂开启随机模式
##         ran_num="5"                        # 京喜工厂和东东工厂抽取指定 5 个 Cookie 按随机顺序参数活动。
##         ;;
##    *)                                      # 必选项。其他活动
##         RandomMode=""                      # 必选项。默认为空值，表示其他帐号均不开启随机模式。
##         ran_num=""                         # 必选项。默认为空值。若 RandomMode="1" 且此处赋值，表示其他活动均抽取指定数值的 Cookie 按随机顺序参数活动。
##        ;;
## esac
case $1 in
    *jd_fruit*)
        RandomMode=""
        ran_num=""
        ;;
    *jd_dreamFactory* | *jd_jdfactory*)
        RandomMode=""
        ran_num=""
        ;;
    *)
        RandomMode=""
        ran_num=""
        ;;
esac

## 12. 组队环境变量
### 环境变量填写要求较高，建议群组内确认填写结果
scr_name="$1"                                 ## 不可删除
case $1 in
    *jd_sendBean* | *jd_sddd*)                ## 送豆得豆活动脚本关键词
        teamer_num="11"                       ## 单个队伍中的总账号数为 11 个
        team_num="1"                          ## 每个账号发起组队的最大队伍数为 1 个
        ;;
    *xmGame*)                                 ## 小米-星空大冒险活动脚本关键词
        teamer_num="11"                       ## 单个队伍中的总账号数为 11 个
        team_num="1"                          ## 每个账号发起组队的最大队伍数为 1 个
        ;;
    *jd_zdjr*)                                ## 组队瓜分京豆活动脚本关键词
        teamer_num="5 5 5 5"                  ## 对应各个活动中单个队伍中的总账号数分别为 5 5 5 5 个
        team_num="2 3 3 5"                    ## 对应各个活动中每个账号发起组队的最大队伍数为 2 3 3 5 个
        activityId=(                          ## 活动 activityId；需手动抓包。按数组分行填写至括号内
          54f071f4eb794092a872392696be7d8d
          0582063f78434ed599becfc8f812c2ee
          bbda11ba7a9644148d65c8b0b78f0bd2
          92c03af2ce744f6f94de181ccee15e4f
        )
        activityUrl=(                         ## 活动 activityUrl；需手动抓包。按数组分行填写至括号内
          https://cjhydz-isv.isvjcloud.com
          https://lzkjdz-isv.isvjcloud.com
          https://lzkjdz-isv.isvjcloud.com
          https://cjhydz-isv.isvjcloud.com
        )
        ;;
    *)                                        ## 不可删除
        scr_name=""                           ## 不可删除
        ;;                                    ## 不可删除
esac
## 青蛙万能变量
export guaopencard_All="true"
export guaopencard_addSku_All="true"
export guaopencardRun_All="true"
export guaopencard_draw="true"
export guaunknownTask_addSku_All="true"
j=99
for (( i = 60; i <= j; i++ )); do
    export guaopencard$i="true"
    export guaopencardRun$i="true"
    export guaopencard_addSku$i="true"
    export guaopencard_draw$i="true"
done

## 其他需要的变量，脚本中需要的变量使用 export 变量名= 声明即可
export JD_TRY="true"
export guaopencardRun24="true"
export dyjHelpPins="2328966047-800138"
export JD_CART="true"
#京东试用
export JD_TRY="true"
export JD_TRY_TABID="1@3@4@5"
export JD_TRY_TITLEFILTERS="教程@软件@英语@辅导@培训@表带@皮带@瑜伽垫@水饺@燕窝@树苗@集体课@现场课@看房游@口服液@灸贴@云南旅游@掌之友@金满缘@新兴港隆@拆机@品鉴@咨询@零基础@直播课@体验@网课@训练营@礼品袋@装修@快狐@疣@包皮@疏通@药@鱼胶@狗狗@幼犬@戒烟@尿垫@浪潮英信@专家@长高课@饲料@代办@美缝剂@体验@遮瑕@洗面奶@洁面乳@抗皱@膏@猫砂@购房@消食@积食@软胶囊@养生茶@驼背@房产@辅食@打印纸@财务管理@进销存@实战@生发液@早泄@阳痿@染发@补血@珍珠粉@玛咖@灰指甲@阿胶@讲堂@教材@补肾@精品课@开发@疹@疮@疥@软膏@真题@模拟题@专车接送@看海@看房@学员@投资@通关@名师@节课@酵素@滴眼液@全国流量@爱犬@课程@教学@教程@猫人@学车@你拍一@手机壳@宠物@会计@考试@职称@漱口水@胶原蛋白@蛋白粉@降血糖@降血脂@降血压@管理系统@收银系统@体检@检查@减肥@股票@丰胸@避孕套@大王卡@管理软件@博仑帅@月租@上网卡@不限流量@日租卡@甲醛检测@贴膜@美容器@桨叶@烫发@硒鼓@壁纸@添加剂@修复@祛疤@挂画@壁画@润滑油@机油@吸奶器@吸顶灯@冰箱底座@胶漆@小靓美@洁面扑@内衣@胸罩@文胸@卷尺@癣@脚气@阴道@生殖器@肛门@狐臭@老太太@妇女@私处@孕妇@卫生巾@卫生条@培训@女性内衣@女性内裤@女内裤@女内衣@女孩@三角裤@鱼饵@钓鱼@尿杯@安全座椅@网课@课程@辅导@网校@电商@车载充电器@网络课程@纸尿裤@英语@俄语@四级@六级@四六级@在线网络@在线@阴道炎@宫颈@糜烂@喷剂@飞机杯@手机膜@钢化膜@水凝膜@手机壳@钢化膜@猫粮@狗粮@墨盒@墨水@墨粉@震动棒@自慰器@延时@触媒"
export JD_TRY_MINSUPPLYNUM="1"
export JD_TRY_APPLYNUMFILTER="100000"
export JD_TRY_APPLYINTERVAL="5255"
export JD_TRY_MAXLENGTH="50"




export JOY_RUN_HELP_MYSELF="true"
export HELP_JOYPARK="false"
export earn30Pins="2328966047-800138"
export coinToBeans="'京豆包"
export blueCoin_Cc="true"


# 定义每日签到的通知形式
## js脚本每日签到提供3种通知方式，分别为：
## 关闭通知，那么请在下方填入0
## 简洁通知，那么请在下方填入1，其效果见：https://github.com/LXK9301/jd_scripts/blob/master/icon/bean_sign_simple.jpg
## 原始通知，那么请在下方填入2，如果不填也默认为2，内容比较长，这也是默认通知方式
NotifyBeanSign=""

# 定义每日签到每个接口间的延迟时间
## 默认每个签到接口并发无延迟，如需要依次进行每个接口，请自定义延迟时间，单位为毫秒，延迟作用于每个签到接口, 如填入延迟则切换顺序签到(耗时较长)
export JD_BEAN_STOP=""

# 脚本推送控制类环境变量
## 1、京东多合一签到脚本关闭运行结果推送，默认推送，填true表示不推送
export JD_BEAN_SIGN_STOP_NOTIFY=""
## 2、京东多合一签到脚本推送简单结果，默认推送完整版结果，填true表示启用简单推送
export JD_BEAN_SIGN_NOTIFY_SIMPLE="true"
## 3、东东萌宠关闭推送。填写false为不关闭推送，true为关闭推送
export PET_NOTIFY_CONTROL="false"
## 4、京东农场关闭推送。填写false为不关闭推送，true为关闭推送
export FRUIT_NOTIFY_CONTROL="false"
## 5、京东领现金关闭推送。填写false为不关闭推送，true为关闭推送
export CASH_NOTIFY_CONTROL="false"
## 6、京东摇钱树关闭推送。填写false为不关闭推送，true为关闭推送
export MONEYTREE_NOTIFY_CONTROL="true"
## 7、京东点点券关闭推送。填写false为不关闭推送，true为关闭推送
export DDQ_NOTIFY_CONTROL="false"
## 8、京东京东赚赚小程序关闭推送。填写false为不关闭推送，true为关闭推送
export JDZZ_NOTIFY_CONTROL="false"
## 9、宠汪汪兑换京豆关闭推送。填写false为不关闭推送，true为关闭推送
export JD_JOY_REWARD_NOTIFY="false"
## 10、宠汪汪赛跑获胜后是否推送通知。填false为不推送通知消息,true为推送通知消息
export JOY_RUN_NOTIFY="true"
## 11、东东超市兑换奖品是否关闭推送通知。填false为不关闭推送,true为关闭推送
export MARKET_REWARD_NOTIFY="false"
## 12、京喜财富岛控制是否运行脚本后通知。输入true为通知,不填则为不通知
export CFD_NOTIFY_CONTROL=""
## 13、京喜农场岛控制是否运行脚本后通知。0=只通知成熟;1=本次获得水滴>0;2=任务执行;3=任务执行+未种植种子
export JXNC_NOTIFY_LEVEL="3"

# 功能配置类环境变量
## 1、京东领现金红包兑换京豆开关。false为不换,true为换(花费2元红包兑换200京豆，一周可换四次)，默认为false
export CASH_EXCHANGE="false"
## 2、宠汪汪喂食数量。可以填的数字0,10,20,40,80,其他数字不可
export JOY_FEED_COUNT="80"
## 3、宠汪汪帮好友喂食。默认 "false" 不会自动给好友的汪汪喂食，如想自动喂食，请修改为 "true"
export JOY_HELP_FEED="true"
## 4、宠汪汪是否赛跑(默认参加双人赛跑)。false为不跑,true为跑
export JOY_RUN_FLAG="true"
## 5、宠汪汪参加什么级别的赛跑。可选数字为2,10,50，
## 当JOY_RUN_FLAG不设置或设置为 "true" 时生效
## 可选值：2,10,50，其他值不可以。其中2代表参加双人PK赛，10代表参加10人突围赛，50代表参加50人挑战赛，不填时默认为2
## 各个账号间请使用 & 分隔，比如：JOY_TEAM_LEVEL="2&2&50&10"
## 如果您有5个账号但只写了四个数字，那么第5个账号将默认参加2人赛，账号如果更多，与此类似
export JOY_TEAM_LEVEL="2&2&50&10"
## 6、宠汪汪赛跑自己账号内部互助。输入true为开启内部互助
export JOY_RUN_HELP_MYSELF="true"
## 7、宠汪汪积分兑换多少京豆。目前可填值为20或者500,脚本默认0,0表示不兑换京豆
export JD_JOY_REWARD_NAME="500"
## 8、东东超市兑换京豆数量。目前可输入值为20或者1000，或者其他商品的名称,例如碧浪洗衣凝珠
export MARKET_COIN_TO_BEANS="超值京豆包"
## 9、东东超市是否参加pk。true表示参加,false表示不参加
export JOIN_PK_TEAM="true"
## 10、东东超市是否用金币抽奖。true表示抽奖,false表示不抽奖
export SUPERMARKET_LOTTERY="true"
## 11、东东农场是否使用水滴换豆卡。true表示换,false表示不换
export FRUIT_BEAN_CARD="true"
## 12、是否取关商品。环境变量内容的意思依次是是否取关全部商品(0表示一个都不),是否取关全部店铺数(0表示一个都不),遇到此商品不再进行取关,遇到此店铺不再进行取关
export UN_SUBSCRIBES="300,300,,"
## 12、jd_unsubscribe这个任务是用来取关每天做任务关注的商品和店铺，默认在每次运行时取关20个商品和20个店铺
### 如果取关数量不够，可以根据情况增加，还可以设置 jdUnsubscribeStopGoods 和 jdUnsubscribeStopShop 
### 商品取关数量
export goodPageSize="30"
### 店铺取关数量
export shopPageSize="60"
### 遇到此商品不再取关此商品以及它后面的商品，需去商品详情页长按拷贝商品信息
export jdUnsubscribeStopGoods=""
### 遇到此店铺不再取关此店铺以及它后面的店铺，请从头开始输入店铺名称
export jdUnsubscribeStopShop=""
## 13、疯狂的JOY循环助力开关。true表示循环助力,false表示不循环助力，默认不开启循环助力
export JDJOY_HELPSELF="true"
## 14、疯狂的JOY京豆兑换。0表示不换,其他按可兑换数填写。目前最小2000
export JDJOY_APPLYJDBEAN="2000"
## 15、疯狂的JOY购买joy等级。如需要使用请自行解除注释，可购买等级为 "1~30"
export BUY_JOY_LEVEL=""
## 16、摇钱树是否卖出金果。true卖出，false不卖出，默认false
export MONEY_TREE_SELL_FRUIT="true"
## 17、东东工厂心仪商品。
export FACTORAY_WANTPRODUCT_NAME=""
## 18、东东工厂控制哪个京东账号不运行此脚本。多个使用&连接
export JDFACTORY_FORBID_ACCOUNT=""
## 19、京喜工厂控制哪个京东账号不运行此脚本。多个使用&连接
export DREAMFACTORY_FORBID_ACCOUNT=""
## 20、lxk0301脚本是否加购。如加设置true
export PURCHASE_SHOPS="true"
## 21、京喜工厂拼团瓜分电力活动的activeId（当前需抓包替换或去群里求别人分享）
export TUAN_ACTIVEID=""
## 22、京东UA。点点券脚本运行环境变量
export JD_USER_AGENT=""
## 23、京东试用jd_try相关环境变量
### 控制每次获取商品数量，默认12
export JD_TRY_PAGE_SIZE=""
### 商品分类，以 @ 隔开，示例：家用电器@手机数码@电脑办公@家居家装
export JD_TRY_CIDS_KEYS=""
### 试用类型，以 @ 隔开，示例：免费试用@闪电试
export JD_TRY_TYPE_KEYS=""
### 过滤试用商品关键字，以 @ 隔开(默认内置了很多关键字，建议使用默认)
export JD_TRY_GOOD_FILTERS=""
### 试用商品最低价格
export JD_TRY_MIN_PRICE=""
### 试用商品最多提供数量（过滤垃圾商品）
export JD_TRY_MAX_SUPPLY_COUNT=""

# 龙猪猪环境变量
## 京豆雨通知，填写true为不关闭推送，false为关闭推送
export RAIN_NOTIFY_CONTROL="false"
## 整点京豆雨RRA
export SUPER_RAIN_RRA=""
## 半点京豆雨RRA
export HALF_RAIN_RRA=""
export wy_debug_pin="2328966047-800138@wdNdTnCnhYPnnfS"
# 柠檬（胖虎部分环境变量）
## 1、京喜工厂抢茅台
### 自定义商品变量
export shopid="1598"   ##你要商品ID 冰箱
export shopid1="1607"  ##你要商品ID 茅台
## 2、推一推
### 入口：极速版-赚金币 
### 分享到QQ查看邀请码，packetId就是
### 自定义变量
export tytpacketId=""
## 3、拆红包
export chbpacketId=""
## 4、是兄弟就砍我
### 是兄弟就来砍我脚本要参加砍价的商品ID
export actId=""
export actId1=""
export actId2=""
export actId3=""
export actId4=""
### 是兄弟就来砍我脚本要要参加砍价的邀请码
export packetId="" 
## 5、是兄弟就砍我2
### 惊喜欢乐砍 自定义变量 入口：京喜APP-我的-惊喜欢乐砍
export launchid="" ##你的邀请码
### 第一次参加变量设置为true查看商品ID，填写商品ID后自动获取邀请码邀请；如果只助力，变量设置为false
export first="false"
export active="" ##商品ID
## 6、赚金币
### 入口：极速版-百元生活费-赚金币-邀请好友
### 第一次运行可不填写邀请码，运行一次查看自己的邀请码
export InviterPin="" ##你的邀请码
## 7、0元砍价，入口：京东-我的-0元砍价
### 使用教程：
### 第一步，运行脚本一次日志查看商品ID
### 获取你要砍价的商品ID后变量填写
export skuId="" ##这里填获取的商品ID
### 第二步，再运行一次日志查看商品activityId变量填写
export activity="" ##这里填获取的商品activityId
## 8、邀请有礼  
### 自定义邀请码环境变量
export yqm="" ##你的邀请码
## 9、全民挖现金
### 入口：京东-我的-全民挖现金
### 运行一次查看邀请码 变量你的邀请码 
export shareCode=""
## 10、省钱大赢家本期活动ID
export redEnvelopeId="" 
## 11、省钱大赢家邀请码
export inviter=""
## 12、签到领现金添加变量方式
## 自行添加变量设置邀请码 格式如下 默认10个
export cashinviteCode=""
export cashinviteCode2=""
export cashinviteCode3=""
## 13、大老板农场 新增自定义变量通知开关。true通知打开，false为关闭
export dlbtz="true"
## 14、零食街自动兑换变量
### 自行取消注释和注释
##export lsjdh="jdAward1" ##兑换5豆
##export lsjdh="jdAward2" ##兑换10豆
export lsjdh="jdAward3" ##兑换100豆
##export lsjdh="jdAward4" ##兑换牛奶




# Ninja 环境变量
## 1、通知黑名单
### 使用 & 分隔，例如 东东乐园&东东萌宠
export NOTIFY_SKIP_LIST=""

# Faker2库环境变量
## 1、清空购物车
export JD_CART_REMOVE=""
export JD_CART_REMOVESIZE=""