## 重要通知
### 落日与孤鹜齐飞,秋水共长天一色。
收集全网目前能正常使用的脚本。


【集合仓库拉取命令】
``` 
ql repo https://ghproxy.com/https://github.com/Yun-City/City.git "jd_|jx_|gua_|jddj_|getJDCookie" "activity|backUp" "^jd[^_]|USER|function|utils|sendnotify|ZooFaker_Necklace.js|JDJRValidator_|sign_graphics_validate|ql"
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








