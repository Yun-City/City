#!/usr/bin/env bash
## Mod: Build20210825V2
## 添加你需要重启自动执行的任意命令，比如 ql repo
## 安装node依赖使用 pnpm install -g xxx xxx（Build 20210728-002 及以上版本的 code.sh，可忽略）
## 安装python依赖使用 pip3 install xxx（Build 20210728-002 及以上版本的 code.sh，可忽略）


#------ 说明区 ------#
## 1. 拉取仓库
### （1）定时任务→添加定时→命令【ql extra】→定时规则【15 0-23/4 * * *】→运行
### （2）若运行过 1custom 一键脚本，点击运行即可
### （3）推荐配置：如下。自行在设置区填写编号
## 2. 安装依赖
### （1）默认不安装，因为 Build 20210728-002 及以上版本的 code.sh 自动检查修复依赖
### （2）若需要在此处使用，请在设置区设置
## 3. Ninja
### （1）默认启动并自动更新
### （2）⚠未修改容器映射的请勿运行，否则会出现青龙打不开或者设备死机等不良后果，映射参考 https://github.com/MoonBegonia/ninja#%E5%AE%B9%E5%99%A8%E5%86%85


#------ 设置区 ------#
## 1. 拉取仓库编号设置，默认 Faker2 仓库
CollectedRepo=(1) ##示例：CollectedRepo=(1 2 3)
OtherRepo=() ##示例：OtherRepo=(1 3)
## 2. 是否安装依赖和安装依赖包的名称设置
dependencies="no" ##yes为安装，no为不安装
package_name="canvas png-js date-fns axios crypto-js ts-md5 tslib @types/node dotenv typescript fs require tslib"
## 3. Ninja 是否需要启动和更新设置
Ninja="down" ##up为更新，on为启动，down为不运行


#------ 编号区 ------#
:<<\EOF
一、集成仓库（Collected Repositories)
1-Yun-City
2-buqian123-faker3（自用）
二、其他仓库（Other Repositories）
1-青蛙库（开卡）
EOF


#------ 代码区 ------#
# 🌱拉取仓库
CR1(){
    ql repo https://ghproxy.com/https://github.com/Yun-City/City.git "jd_|jx_|gua_|jddj_|getJDCookie" "activity|backUp" "^jd[^_]|USER|function|utils|sendnotify|ZooFaker_Necklace.js|jd_Cookie.js|JDJRValidator_|sign_graphics_validate|ql"
}
CR2(){
    ql repo https://ghproxy.com/https://github.com/buqian123/faker3.git "jd_|jx_|gua_|jddj_|getJDCookie" "activity|backUp" "^jd[^_]|USER|function|utils|sendnotify|ZooFaker_Necklace.js|JDJRValidator_|sign_graphics_validate|ql"
}

for i in ${CollectedRepo[@]}; do
    CR$i
    sleep 10
done

OR1(){
    ql repo https://ghproxy.com/https://github.com/smiek2121/scripts.git "jd_|gua_" "" "ZooFaker_Necklace.js|JDJRValidator_Pure.js|sign_graphics_validate.js|cleancart_activity.js|jdCookie.js|sendNotify.js"
}

for i in ${OtherRepo[@]}; do
    OR$i
    sleep 5
done


# 🍪Ninja
update_Ninja_normal(){
    cd /ql/ninja/backend && git checkout . && git pull
    pnpm install && pm2 start
    cp sendNotify.js /ql/scripts/sendNotify.js
}

check_Ninja_normal(){
    NOWTIME=$(date +%Y-%m-%d-%H-%M-%S)
    i=0
    while ((i<=0)); do
        echo "扫描 Ninja 是否在线"
        ps -fe|grep ninja|grep -v grep
        if [ $? -ne 0 ]; then
            i=0
            echo $NOWTIME" 扫描结束！Ninja 掉线了不用担心马上重启！"
            cd /ql
            ps -ef|grep ninja|grep -v grep|awk '{print $1}'|xargs kill -9
            cd /ql/ninja/backend
            pnpm install
            pm2 start
            ps -fe|grep Daemon |grep -v grep 
            if [ $? -ne 1 ]; then
                i=1
                echo $NOWTIME" Ninja 重启完成！"
                curl "https://api.telegram.org/bot$TG_BOT_TOKEN/sendMessage?chat_id=$TG_USER_ID&text=Ninja 已重启完成"
            fi
        else
            i=1
            echo $NOWTIME" 扫描结束！Ninja 还在！"
        fi
    done
}

if [ "$Ninja" = "up" ]; then
    update_Ninja_normal &
elif [ "$Ninja" = "on" ]; then
    check_Ninja_normal
fi


# 📦依赖
install_dependencies_normal(){
    for i in $@; do
        case $i in
            canvas)
                cd /ql/scripts
                if [[ "$(echo $(npm ls $i) | grep ERR)" != "" ]]; then
                    npm uninstall $i
                fi
                if [[ "$(npm ls $i)" =~ (empty) ]]; then
                    apk add --no-cache build-base g++ cairo-dev pango-dev giflib-dev && npm i $i --prefix /ql/scripts --build-from-source
                fi
                ;;
            *)
                if [[ "$(npm ls $i)" =~ $i ]]; then
                    npm uninstall $i
                elif [[ "$(echo $(npm ls $i -g) | grep ERR)" != "" ]]; then
                    npm uninstall $i -g
                fi
                if [[ "$(npm ls $i -g)" =~ (empty) ]]; then
                    [[ $i = "typescript" ]] && npm i $i -g --force || npm i $i -g
                fi
                ;;
        esac
    done
}

install_dependencies_force(){
    for i in $@; do
        case $i in
            canvas)
                cd /ql/scripts
                if [[ "$(npm ls $i)" =~ $i && "$(echo $(npm ls $i) | grep ERR)" != "" ]]; then
                    npm uninstall $i
                    rm -rf /ql/scripts/node_modules/$i
                    rm -rf /usr/local/lib/node_modules/lodash/*
                fi
                if [[ "$(npm ls $i)" =~ (empty) ]]; then
                    apk add --no-cache build-base g++ cairo-dev pango-dev giflib-dev && npm i $i --prefix /ql/scripts --build-from-source --force
                fi
                ;;
            *)
                cd /ql/scripts
                if [[ "$(npm ls $i)" =~ $i ]]; then
                    npm uninstall $i
                    rm -rf /ql/scripts/node_modules/$i
                    rm -rf /usr/local/lib/node_modules/lodash/*
                elif [[ "$(npm ls $i -g)" =~ $i && "$(echo $(npm ls $i -g) | grep ERR)" != "" ]]; then
                    npm uninstall $i -g
                    rm -rf /ql/scripts/node_modules/$i
                    rm -rf /usr/local/lib/node_modules/lodash/*
                fi
                if [[ "$(npm ls $i -g)" =~ (empty) ]]; then
                    npm i $i -g --force
                fi
                ;;
        esac
    done
}

install_dependencies_all(){
    install_dependencies_normal $package_name
    for i in $package_name; do
        install_dependencies_force $i
    done
}

if [ "$dependencies" = "yes" ]; then
    install_dependencies_all &
fi