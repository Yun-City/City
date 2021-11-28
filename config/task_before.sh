#!/usr/bin/env bash

# Build 20211128-002

name_js=(
  jd_fruit
  jd_pet
  jd_plantBean
  jd_dreamFactory
  jd_jdfactory
  jd_crazy_joy
  jd_jdzz
  jd_jxnc
  jd_bookshop
  jd_cash
  jd_sgmh
  jd_cfd
  jd_health
  jd_carnivalcity
  jd_city
  jd_moneyTree_heip
  jd_cfdtx
)
name_config=(
  Fruit
  Pet
  Bean
  DreamFactory
  JdFactory
  Joy
  Jdzz
  Jxnc
  BookShop
  Cash
  Sgmh
  Cfd
  Health
  Carni
  City
  MoneyTree
  TokenJxnc
)
name_chinese=(
  东东农场
  东东萌宠
  京东种豆得豆
  京喜工厂
  东东工厂
  crazyJoy任务
  京东赚赚
  京喜农场
  口袋书店
  签到领现金
  闪购盲盒
  京喜财富岛
  东东健康社区
  京东手机狂欢城
  城城领现金
  摇钱树
  京喜token
)
env_name=(
  FRUITSHARECODES                     ## 1、东东农场互助码
  PETSHARECODES                       ## 2、东东萌宠互助码
  PLANT_BEAN_SHARECODES               ## 3、种豆得豆互助码
  DREAM_FACTORY_SHARE_CODES           ## 4、京喜工厂互助码
  DDFACTORY_SHARECODES                ## 5、东东工厂互助码
  JDJOY_SHARECODES                    ## 6、疯狂的JOY互助码
  JDZZ_SHARECODES                     ## 7、京东赚赚互助码
  JXNC_SHARECODES                     ## 8、京喜农场助力码
  BOOKSHOP_SHARECODES                 ## 9、口袋书店互助码
  JD_CASH_SHARECODES                  ## 10、签到领现金互助码
  JDSGMH_SHARECODES                   ## 11、闪购盲盒互助码
  JDCFD_SHARECODES                    ## 12、京喜财富岛互助码
  JDHEALTH_SHARECODES                 ## 13、东东健康社区互助码
  JD818_SHARECODES                    ## 14、京东手机狂欢城互助码
  CITY_SHARECODES                     ## 15、城城领现金互助码
  MONEYTREE_SHARECODES                ## 16、摇钱树
  JXNCTOKENS                          ## 17、京喜Token(京喜财富岛提现用)
)
var_name=(
  ForOtherFruit                       ## 1、东东农场互助规则
  ForOtherPet                         ## 2、东东萌宠互助规则
  ForOtherBean                        ## 3、种豆得豆互助规则
  ForOtherDreamFactory                ## 4、京喜工厂互助规则
  ForOtherJdFactory                   ## 5、东东工厂互助规则
  ForOtherJoy                         ## 6、疯狂的JOY互助规则
  ForOtherJdzz                        ## 7、京东赚赚互助规则
  ForOtherJxnc                        ## 8、京喜农场助力码
  ForOtherBookShop                    ## 9、口袋书店互助规则
  ForOtherCash                        ## 10、签到领现金互助规则
  ForOtherSgmh                        ## 11、闪购盲盒互助规则
  ForOtherCfd                         ## 12、京喜财富岛互助规则
  ForOtherHealth                      ## 13、东东健康社区互助规则
  ForOtherCarni                       ## 14、京东手机狂欢城互助规则
  ForOtherCity                        ## 15、城城领现金互助规则
  ForOtherMoneyTree                   ## 16、摇钱树
  TokenJxnc                           ## 17、京喜Token(京喜财富岛提现用)
)

local_scr=$1

## 临时屏蔽某账号运行活动脚本(账号序号匹配)
TempBlock_JD_COOKIE(){
    source $file_env
    local envs=$(eval echo "\$JD_COOKIE")
    local TempBlockCookieInterval="$(echo $TempBlockCookie | perl -pe "{s|~|-|; s|_|-|}" | sed 's/\(\d\+\)-\(\d\+\)/{\1..\2}/g')"
    local TempBlockCookieArray=($(eval echo $TempBlockCookieInterval))
    local envs=$(eval echo "\$JD_COOKIE")
    local array=($(echo $envs | sed 's/&/ /g'))
    local user_sum=${#array[*]}
    local m n t
    for ((m = 1; m <= $user_sum; m++)); do
        n=$((m - 1))
        for ((t = 0; t < ${#TempBlockCookieArray[*]}; t++)); do
            [[ "${TempBlockCookieArray[t]}" = "$m" ]] && unset array[n]
        done
    done
    jdCookie_1=$(echo ${array[*]} | sed 's/\ /\&/g')
    [[ ! -z $jdCookie_1 ]] && export JD_COOKIE="$jdCookie_1"
    temp_user_sum=${#array[*]}
}

## 临时屏蔽某账号运行活动脚本(pt_pin匹配)
TempBlock_JD_PT_PIN(){
    if [[ $jdCookie_1 ]]; then
        tmp_jdCookie=$jdCookie_1
    else
        source $file_env
        tmp_jdCookie=$JD_COOKIE
    fi
    local TempBlockPinArray=($TempBlockPin)
    local envs=$(eval echo "\$tmp_jdCookie")
    local array=($(echo $envs | sed 's/&/ /g'))
    local i m n t pt_pin_temp pt_pin_temp_block
    for i in "${!array[@]}"; do
        pt_pin_temp=$(echo ${array[i]} | perl -pe "{s|.*pt_pin=([^; ]+)(?=;?).*|\1|; s|%|\\\x|g}")
        [[ $pt_pin_temp == *\\x* ]] && pt_pin[i]=$(printf $pt_pin_temp) || pt_pin[i]=$pt_pin_temp
        for n in "${!TempBlockPinArray[@]}"; do
            pt_pin_temp_block=$(echo ${TempBlockPinArray[n]} | perl -pe "{s|%|\\\x|g}")
            [[ $pt_pin_temp_block == *\\x* ]] && pt_pin_block[n]=$(printf $pt_pin_temp_block) || pt_pin_block[n]=$pt_pin_temp_block
            [[ "${pt_pin[i]}" =~ "${pt_pin_block[n]}" ]] && unset array[i]
        done
    done
    jdCookie_2=$(echo ${array[*]} | sed 's/\ /\&/g')
    [[ ! -z $jdCookie_2 ]] && export JD_COOKIE="$jdCookie_2"
    temp_user_sum=${#array[*]}
}

# Cookie 有效性检查
check_jd_ck(){
    test_connect="$(curl -I -s https://bean.m.jd.com/bean/signIndex.action -w %{http_code} | tail -n1)"
    test_jd_cookie="$(curl -s --noproxy "*" "https://bean.m.jd.com/bean/signIndex.action" -H "cookie: $1")"
    if [ "$test_connect" -eq "302" ]; then
        [[ "$test_jd_cookie" ]] && return 0 || return 1
    else
        return 2
    fi
}

remove_void_ck(){
    local tmp_jdCookie m void_ck_num
    if [[ $jdCookie_2 ]]; then
        tmp_jdCookie=$jdCookie_2
    elif [[ $jdCookie_1 ]]; then
        tmp_jdCookie=$jdCookie_1
    else
        source $file_env
        tmp_jdCookie=$JD_COOKIE
    fi
    local envs=$(eval echo "\$JD_COOKIE")
    local array=($(echo $envs | sed 's/&/ /g'))
    local user_sum=${#array[*]}
    echo -e "# 开始检查 Cookie 的有效性，可能花费一定时间，请耐心等待 ..."
    echo -n "# 本次一共导入 $user_sum 个 Cookie ："
    for ((m = 0; m < $user_sum; m++)); do		
	    check_jd_ck ${array[m]}
	    [[ $? = 1 ]] && unset array[m]
    done
    jdCookie_3=$(echo ${array[*]} | sed 's/\ /\&/g')
	void_ck_num=$((user_sum - ${#array[*]}))
    [[ $void_ck_num = 0 ]] && echo "未检查到失效 Cookie 。" || echo "其中有 $void_ck_num 个 Cookie 已失效。"
    echo -e "# 开始启动任务 ... "
}

## CK 重组基础参数导入
recombin_ck_args_set(){
    local recombin_ck_array tmp_array i j k t tmp_jdCookie
	if [ $recombin_ck_envs ]; then
        recombin_ck_array=($(echo $recombin_ck_envs | sed 's/&/ /g'))
        for i in "${!recombin_ck_array[@]}"; do
            tmp_array=($(echo ${recombin_ck_array[i]}|awk -F "@" '{for(i=1;i<=NF;i++){print $i;}}'))
            for ((j = 0; j <= ${#tmp_array[*]}; j++)); do
                k=$((j + 1))
                eval local tmp_num_$k="${tmp_array[j]}"
            done
            if [[ $local_scr =~ $tmp_num_1 ]]; then
				Recombin_CK_Mode="$tmp_num_2"
                for ((m = 1; m <= 4; m++)); do
                    n=$((m+2))
                    eval Recombin_CK_ARG$m='$'"tmp_num_$n"
                done
            fi
        done
    fi
}

Recombin_CK(){
    ## 随机模式算法
    combine_random(){
        local combined_all ran_sub tmp i
        if [ $1 ]; then
            echo "# 正在应用 随机Cookie 模式..."
            echo -e "# 当前总共 $user_sum 个有效账号，本次随机抽取 $1 个账号按随机顺序参加活动。"
            ran_num=$1
            ran_sub="$(seq $user_sum | sort -R | head -$1)"
            for i in $ran_sub; do
                tmp="${array[i]}"
                combined_all="$combined_all&$tmp"
            done
            jdCookie_4=$(echo $combined_all | sed 's/^&//g')
            [[ $jdCookie_4 ]] && export JD_COOKIE="$jdCookie_4"
        else
            echo "# 由于参数缺失，切换回 正常 Cookie 模式..."
            export JD_COOKIE="$tmp_jdCookie"
        fi
    }

    ## 优先模式算法
    combine_priority(){
        local combined_all ran_sub jdCookie_priority jdCookie_random m n
        if [ $1 ]; then
            echo "# 正在应用 优先Cookie 模式..."
            echo -e "# 当前总共 $user_sum 个有效账号，其中前 $1 个账号为固定顺序。\n# 本次从第 $(($1 + 1)) 个账号开始按随机顺序参加活动。"
            ran_sub=$(seq $1 $user_sum | sort -R)
            for ((m = 0; m < $1; m++)); do
                tmp="${array[m]}"
                jdCookie_priority="$jdCookie_priority&$tmp"
            done
            for n in $ran_sub; do
                tmp="${array[n]}"
                jdCookie_random="$jdCookie_random&$tmp"
            done
            combined_all="$jdCookie_priority$jdCookie_random"
            jdCookie_4=$(echo $combined_all | perl -pe "{s|^&||; s|&&|&|; s|&$||}")
            [[ $jdCookie_4 ]] && export JD_COOKIE="$jdCookie_4"
        else
            echo "# 由于参数缺失，切换回 正常 Cookie 模式..."
            export JD_COOKIE="$tmp_jdCookie"
        fi
    }

    ## 轮换模式算法
    combine_rotation(){
        # 当月总天数
        local total_days=`cal | grep ^[0-9] | tail -1 | awk -F " " '{print $NF}'`
        # 今天几号
        local today_day=`date +%d`
        local rot_total_num=$((user_sum - $1))
        local combined_all jdCookie_rot_head jdCookie_rot_mid jdCookie_rot_tail rot_start_num a b c tmp_1 tmp_2 tmp_3
        if [[ $1 ]] && [[ $today_day -gt 1 ]]; then
            echo "# 正在应用 轮换Cookie 模式..."
            if [[ $rot_total_num -gt 2 ]]; then
                rot_num=$Recombin_CK_ARG2
                [[ ! $(echo $rot_num|grep '[0-9]') || ! $rot_num || $rot_num -lt 1 || $rot_total_num -lt $rot_num ]] && rot_num=$(((user_sum-$1)/total_days)) && [[ $rot_num -lt 1 ]] && rot_num="1"
                rot_start_num=$(($1 + rot_num * ((today_day - 1))))
                while [[ $user_sum -lt $rot_start_num ]]; do rot_start_num=$((rot_start_num - rot_total_num)); done
                echo -e "# 当前总共 $user_sum 个有效账号，其中前 $1 个账号为固定顺序。\n# 今天从第 $((rot_start_num + 1)) 个账号开始轮换，轮换频次为：$rot_num 个账号/天。"
                for ((a = 0; a < $1; a++)); do
                    tmp_1="${array[a]}"
                    jdCookie_rot_head="$jdCookie_rot_head&$tmp_1"
                done
                for ((b = $rot_start_num; b < $user_sum; b++)); do
                    tmp_2="${array[b]}"
                    jdCookie_rot_mid="$jdCookie_rot_mid&$tmp_2"
                done
                for ((c = $1; c < $((rot_start_num-1)); c++)); do
                    tmp_3="${array[c]}"
                    jdCookie_rot_tail="$jdCookie_rot_tail&$tmp_3"
                done
                combined_all="$jdCookie_rot_head$jdCookie_rot_mid$jdCookie_rot_tail"
                jdCookie_4=$(echo $combined_all | perl -pe "{s|^&||; s|&$||}")
                [[ $jdCookie_4 ]] && export JD_COOKIE="$jdCookie_4"
            else
                echo "# 由于参加轮换的账号数量不足 2 个，切换回 正常 Cookie 模式..."
                export JD_COOKIE="$tmp_jdCookie"
            fi
        else
            echo "# 由于参数缺失，切换回 正常 Cookie 模式..."
            export JD_COOKIE="$tmp_jdCookie"
        fi
    }

    ## 组队模式算法
    combine_team(){
        local teamer_num="$1"
        local team_num="$2"
        local jd_zdjr_activityId="$3"
        local jd_zdjr_activityUrl="$4"
        local combined_all jdCookie_team_part1 jdCookie_team_part2 jdCookie_4 i j k m n
        if [[ $1 ]] && [[ $(echo $2|grep '[0-9]') ]]; then
            echo "# 正在应用 组队Cookie 模式..."
            [[ $user_sum -lt $1  ]] && teamer_num=$user_sum
            [[ $team_num -ge $((user_sum/teamer_num)) ]] && team_num=$((user_sum/teamer_num)) && [[ $team_num -lt 1 ]] && team_num=1
            echo -e "# 当前总共 $user_sum 个有效账号，每支队伍包含 $1 个账号，每个账号可以发起 $2 次组队。"
            for ((i = 0; i < $user_sum; i++)); do
                j=$((i + 1))
                m=$((i/team_num))
                n=$(((teamer_num - 1)*i + 1))
                jdCookie_team_part1="${array[m]}"
                jdCookie_team_part2=""
                if [[ $j -le $team_num ]]; then
                    for ((k = 1; k < $teamer_num; k++)); do
                        jdCookie_team_part2="$jdCookie_team_part2&${array[n]}"
                        let n++
                    done
                elif [[ $j -eq $((team_num + 1)) ]]; then
                    for ((k = 1; k < $((teamer_num-1)); k++)); do
                        jdCookie_team_part1="${array[m]}&${array[0]}"
                        jdCookie_team_part2="$jdCookie_team_part2&${array[n]}"
                        let n++
                    done
                elif [[ $j -gt $((team_num + 1)) ]]; then
                    [[ $((n+1)) -le $user_sum ]] && n=$(((teamer_num - 1)*i)) || break
                    for ((k = $i; k < $((i + teamer_num -1)); k++)); do
                        jdCookie_team_part2="$jdCookie_team_part2&${array[n]}"
                        let n++
                        [[ $n = $m ]] && n=$((n+1))
                        [[ $((n+1)) -gt $user_sum ]] && break
                    done
                fi
                jdCookie_4=$(echo -e "$jdCookie_team_part1$jdCookie_team_part2")
                if [[ $jdCookie_4 ]]; then
                    export JD_COOKIE="$jdCookie_4"
                    [[ $local_scr =~ ".js" ]] && node /ql/scripts/$local_scr
                fi
            done
        else
            echo "# 由于参数缺失，切换回 正常 Cookie 模式..."
            export JD_COOKIE="$tmp_jdCookie"
        fi
    }

    ## 分段模式算法
    combine_segmentation(){
        local segment_length="$1"
        local delay_seconds="$2"
        local combined_all jdCookie_4 i j k m n
        if [[ $1 ]] && [[ $(echo $2|grep '[0-9]') ]]; then
            echo "# 正在应用 分段Cookie 模式..."
            [[ $user_sum -lt $1  ]] && segment_length=$user_sum
            segment_num=$(((user_sum + segment_length -1)/segment_length)) && [[ $segment_num -lt 1 ]] && segment_num=1
            echo -n "# 当前总共 $user_sum 个有效账号，每 $1 个账号分一段，一共分 $segment_num 段。"
			echo -e "各分段脚本启动时间延迟为 $2 秒。\n# 注意：如果每段的运行时间较长，运行日志可能会显示混乱，此为正常现象。"
            for ((i = 0; i < $user_sum; i++)); do
                j=$((i + 1))
                m=$((segment_length * i))
                n=$((segment_length * j))
                combined_all=""
                for ((k = m; k < $n; k++)); do
                    tmp="${array[k]}"
                    combined_all="$combined_all&$tmp"
                done
                jdCookie_4=$(echo $combined_all | sed 's/^&//g')
                if [[ $jdCookie_4 ]]; then
                    export JD_COOKIE="$jdCookie_4"
                    echo -e "本次提交的是第 $((m + 1)) - $n 位账号。"
                    [[ $local_scr =~ ".js" ]] && node /ql/scripts/$local_scr &
                    sleep $2					
                fi
            done
        else
            echo "# 由于参数缺失，切换回 正常 Cookie 模式..."
            export JD_COOKIE="$tmp_jdCookie"
        fi
    }

    local jdCookie_3
    recombin_ck_args_set # 基础参数设定
    
    if [ $(echo $Recombin_CK_ARG1|grep '[0-9]') ]; then
        ## 移除无效 Cookie
        [[ $Remove_Void_CK = 1 ]] && remove_void_ck
        ## 导入基础 JD_COOKIE 变量
        if [[ $jdCookie_3 ]]; then
            tmp_jdCookie=$jdCookie_3
        else
            source $file_env
            tmp_jdCookie=$JD_COOKIE
        fi
           
        local envs=$(eval echo "\$tmp_jdCookie")
        local array=($(echo $envs | sed 's/&/ /g'))
        local user_sum=${#array[*]}
        [[ $user_sum -lt $Recombin_CK_ARG1 || $Recombin_CK_ARG1 -lt 1 ]] && Recombin_CK_ARG1=$user_sum
    else
        Recombin_CK_ARG1=""
    fi

    case $Recombin_CK_Mode in
        1)
            combine_random $Recombin_CK_ARG1
            ;;
        2)
            combine_priority $Recombin_CK_ARG1
            ;;
        3)
            combine_rotation $Recombin_CK_ARG1 $Recombin_CK_ARG2
            ;;
        4)
            combine_team $Recombin_CK_ARG1 $Recombin_CK_ARG2 $Recombin_CK_ARG3 $Recombin_CK_ARG4
            ;;
        5)
            combine_segmentation $Recombin_CK_ARG1 $Recombin_CK_ARG2
            ;;
        *)
            export JD_COOKIE="$tmp_jdCookie"
            ;;
    esac
}

## 组合互助码格式化为全局变量的函数
combine_sub() {
    source $file_env
    local what_combine=$1
    local combined_all=""
    local tmp1 tmp2
    local TempBlockCookieInterval="$(echo $TempBlockCookie | perl -pe "{s|~|-|; s|_|-|}" | sed 's/\(\d\+\)-\(\d\+\)/{\1..\2}/g')"
    local TempBlockCookieArray=($(eval echo $TempBlockCookieInterval))
    local envs=$(eval echo "\$JD_COOKIE")
    local array=($(echo $envs | sed 's/&/ /g'))
    local user_sum=${#array[*]}
    local a b i j t sum combined_all
    for ((i=1; i <= $user_sum; i++)); do
        local tmp1=$what_combine$i
        local tmp2=${!tmp1}
        [[ ${tmp2} ]] && sum=$i || break
    done
    [[ ! $sum ]] && sum=$user_sum
    for ((j = 1; j <= $sum; j++)); do
        a=$temp_user_sum
        b=$sum
        if [[ $a -ne $b ]]; then
            for ((t = 0; t < ${#TempBlockCookieArray[*]}; t++)); do
                [[ "${TempBlockCookieArray[t]}" = "$j" ]] && continue 2
            done
        fi
        local tmp1=$what_combine$j
        local tmp2=${!tmp1}
        combined_all="$combined_all&$tmp2"
    done
    echo $combined_all | perl -pe "{s|^&||; s|^@+||; s|&@|&|g; s|@+&|&|g; s|@+|@|g; s|@+$||}"
}

## 正常依次运行时，组合互助码格式化为全局变量
combine_all() {
    for ((i = 0; i < ${#env_name[*]}; i++)); do
        result=$(combine_sub ${var_name[i]})
        if [[ $result ]]; then
            export ${env_name[i]}="$result"
        fi
    done
}

## 正常依次运行时，组合互助码格式化为全局变量
combine_only() {
    for ((i = 0; i < ${#env_name[*]}; i++)); do
        case $local_scr in
            *${name_js[i]}*.js | *${name_js[i]}*.ts)
	            if [[ -f $dir_log/.ShareCode/${name_config[i]}.log ]]; then
                    . $dir_log/.ShareCode/${name_config[i]}.log
                    result=$(combine_sub ${var_name[i]})
                    if [[ $result ]]; then
                        export ShareCodeConfigChineseName=${name_chinese[i]}
                        export ShareCodeConfigName=${name_config[i]}
                        export ShareCodeEnvName=${env_name[i]}
                    fi
                fi
                ;;
           *)
                export ${env_name[i]}=""
                ;;
        esac
    done
}

TempBlock_JD_COOKIE && TempBlock_JD_PT_PIN && Recombin_CK

combine_only

#if [[ $(ls $dir_code) ]]; then
#    latest_log=$(ls -r $dir_code | head -1)
#    . $dir_code/$latest_log
#    combine_all
#fi
