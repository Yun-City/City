## 重要通知
### 落日与孤鹜齐飞,秋水共长天一色。
收集全网目前能正常使用的脚本。


【集合仓库拉取命令】
``` 
ql repo https://ghproxy.com/https://github.com/Yun-City/City.git "jd_|jx_|gua_|jddj_|getJDCookie" "activity|backUp" "^jd[^_]|USER|function|utils|sendnotify|ZooFaker_Necklace|jd_Cookie|JDJRValidator_|sign_graphics_validate|ql|magic|cleancart_activity"
```

【安装docker、安装2.9.3青龙、配置本仓库】

```bash
wget -q  https://raw.githubusercontents.com/buqian123/Tasks/main/ql.sh -O ql.sh && bash ql.sh
```


【已安装青龙的用户一键配置代码 配置City仓库助力】

```bash
docker exec -it qqinglong bash -c "$(curl -fsSL  https://raw.githubusercontent.com/Yun-City/City/main/Shell/1customCDN.sh)"
```



【青龙依赖一键配置】

```bash
docker exec -it qinglong bash -c "$(curl -fsSL https://ghproxy.com/https://raw.githubusercontent.com/Yun-City/City/main/Shell/QLOneKeyDependency.sh | sh)"
```

【NvJdc一键配置】

```bash
bash <(curl -sL  https://raw.githubusercontents.com/buqian123/Tasks/main/onekey-install-nvjdc.sh)
```

#### 说明



* 想跑gua开卡的可以加,false改成true
    ```
	export guaopencard_All="true" # 青蛙开卡总开关
    export guaopencard_addSku_All="false" # 青蛙开卡加购
    export guaopencardRun_All="true" # 青蛙开卡做任务
    export guaopencard_draw="true" # 青蛙开卡抽奖
	export guaopencard_rewardBean="1,2,3" # 京豆奖励判断 | 1=邀请 2=开卡 3=关注  | 填1,2,3
    ```


 - 更新一个整库脚本
 ```
 ql repo <repourl> <path> <blacklist> <dependence> <branch>
 ```

 - 更新单个脚本文件
 ```
 ql raw <fileurl>
 ```
 
### 安装青龙需要一些的依赖
<details>
<summary>查看依赖列表</summary>


* 最新青龙支持安装依赖需要啥依赖，去依赖管理添加即可，简单方便
* 遇到Cannot find module 'xxxxxx'报错就进入青龙容器
* docker exec -it QL(自己容器名) bash
* pnpm install xxxxx(报错中引号里的复制过来)

 

 安装青龙的一些依赖，按需求安装
* docker exec -it qinglong(自己容器名) bash -c "npm install -g typescript"

* docker exec -it qinglong bash -c "npm install axios date-fns"

* docker exec -it qinglong bash -c "npm install crypto -g"

* docker exec -it qinglong bash -c "npm install png-js"

* docker exec -it qinglong bash -c "npm install -g npm"

* docker exec -it qinglong bash -c "pnpm i png-js"

* docker exec -it qinglong bash -c "pip3 install requests"

* docker exec -it qinglong bash -c "apk add --no-cache build-base g++ cairo-dev pango-dev giflib-dev && cd scripts && npm install canvas --build-from-source"

* docker exec -it qinglong bash -c "apk add python3 zlib-dev gcc jpeg-dev python3-dev musl-dev freetype-dev"

* docker exec -it qinglong bash -c "cd /ql/scripts/ && apk add --no-cache build-base g++ cairo-dev pango-dev giflib-dev && npm i && npm i -S ts-node typescript @types/node date-fns axios png-js canvas --build-from-source"

或者

* npm install -g png-js
* npm install -g date-fns
* npm install -g axios
* npm install -g crypto-js
* npm install -g ts-md5
* npm install -g tslib
* npm install -g @types/node
* npm install -g requests

</details>

## Special statement:

* Any unlocking and decryption analysis scripts involved in the Script project released by this warehouse are only used for testing, learning and research, and are forbidden to be used for commercial purposes. Their legality, accuracy, completeness and effectiveness cannot be guaranteed. Please make your own judgment based on the situation. .

* All resource files in this project are forbidden to be reproduced or published in any form by any official account or self-media.

* This warehouse is not responsible for any script problems, including but not limited to any loss or damage caused by any script errors.

* Any user who indirectly uses the script, including but not limited to establishing a VPS or disseminating it when certain actions violate national/regional laws or related regulations, this warehouse is not responsible for any privacy leakage or other consequences caused by this.

* Do not use any content of the Script project for commercial or illegal purposes, otherwise you will be responsible for the consequences.

* If any unit or individual believes that the script of the project may be suspected of infringing on their rights, they should promptly notify and provide proof of identity and ownership. We will delete the relevant script after receiving the certification document.

* Anyone who views this item in any way or directly or indirectly uses any script of the Script item should read this statement carefully. This warehouse reserves the right to change or supplement this disclaimer at any time. Once you have used and copied any relevant scripts or rules of the Script project, you are deemed to have accepted this disclaimer.

 **You must completely delete the above content from your computer or mobile phone within 24 hours after downloading.**  </br>
> ***You have used or copied any script made by yourself in this warehouse, it is deemed to have accepted this statement, please read it carefully*** 


## Special thanks to: new scripts actor


* [@NobyDa](https://github.com/NobyDa)
* [@Andy Woo](https://t.me/update_help_group)
* [@Oreo](https://github.com/Oreomeow) 「青龙Faker仓库一键安装配置」
* [@Aaron-lv](https://github.com/Aaron-lv/sync) 「小小」
* [@ccwav](https://github.com/ccwav/QLScript2) 「白嫖榜」
* [@cdle](https://github.com/cdle/carry) 「老年人」
* [@FKPYW](https://github.com/FKPYW/dongge) 「小埋」
* [@Smiek2121](https://github.com/smiek2121/scripts) 「呱呱」
* [@star261](https://github.com/star261/jd) 