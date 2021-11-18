#!/usr/local/bin/python
# -*- coding: utf-8 -*-
#京东APP->我的->宠汪汪, 兑换京豆, 优先兑换500, 兑换失败则兑换20.
import random
import time
import asyncio
import aiohttp
import ujson
from dateutil.relativedelta import relativedelta
from config import JOY_EXCHANGE_COUNT
from jd_joy import JdJoy
from datetime import datetime

from utils.logger import logger
from utils.console import println
from utils.browser import close_browser


class JdJoyExchange(JdJoy):
    """
    宠汪汪兑换京豆
    """

    @logger.catch
    async def exchange_bean(self, session):
        """
        积分换豆
        """
        path = 'gift/getBeanConfigs'
        data = await self.request(session, path)
        if not data:
            println('{}, 获取奖品列表失败!'.format(self.account))
            return

        # 23~6点运行兑换8点场
        if datetime.now().hour >= 23:  # 0点场
            start_time = datetime.strftime((datetime.now() + relativedelta(days=1)), "%Y-%m-%d 00:00:00")
            key = 'beanConfigs0'
        elif 0 <= datetime.now().hour < 7:
            start_time = datetime.strftime((datetime.now()), "%Y-%m-%d 00:00:00")
            key = 'beanConfigs0'
        # 7~15点运行兑换8点场
        elif 7 <= datetime.now().hour < 15:  # 8点场
            start_time = datetime.strftime((datetime.now()), "%Y-%m-%d 08:00:00")
            key = 'beanConfigs8'
        # 15~22点运行兑换16点场
        elif 15 <= datetime.now().hour < 23:  # 16点场
            start_time = datetime.strftime((datetime.now()), "%Y-%m-%d 16:00:00")
            key = 'beanConfigs16'
        # 其他兑换16点场
        else:
            start_time = datetime.now().strftime("%Y-%m-%d 16:00:00")
            key = 'beanConfigs16'

        gift_list = data.get(key, None)
        if not gift_list:
            println('{}, 获取兑换商品列表失败!'.format(self.account))
            return
        pet_coin = data.get('petCoin')  # 当前积分
        if not pet_coin:
            pet_coin = 0

        println('{}, 当前积分:{}!'.format(self.account, pet_coin))

        can_exchange_map = dict()

        try:
            joy_exchange_count = int(JOY_EXCHANGE_COUNT)
        except Exception as e:
            logger.info(e.args)
            joy_exchange_count = 20

        for gift in gift_list:
            if pet_coin > gift['salePrice']:
                if joy_exchange_count == int(gift['giftValue']):
                    can_exchange_map[int(gift['giftValue'])] = gift['id']
                    break

        if not can_exchange_map:
            println('{}, 当前暂无可兑换商品!'.format(self.account))
            return

        can_exchange_map = {i[0]: i[1] for i in sorted(can_exchange_map.items(),
                                                       key=lambda item: item[1], reverse=True)}

        exchange_start_datetime = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")
        exchange_start_timestamp = int(time.mktime(time.strptime(start_time, "%Y-%m-%d %H:%M:%S")) * 1000)
        delay = random.randint(1, 5) / 10

        while True:
            now = int(time.time()*1000)
            if now + delay * 1000 >= exchange_start_timestamp or now >= exchange_start_timestamp:
                println('{}, 当前时间大于兑换时间, 去兑换商品!'.format(self.account))
                break
            else:
                now = datetime.now()
                seconds = int((exchange_start_datetime - now).seconds)
                millisecond = int((exchange_start_datetime - now).seconds * 1000 +
                                  (exchange_start_datetime - now).microseconds / 1000)
                println('{}, 距离兑换开始还有{}秒!'.format(self.account, seconds), millisecond)

                if seconds < 5:
                    timeout = millisecond / 1000
                else:
                    if seconds > 60:  # 尝试触发验证码
                        t = int(time.time())
                        await self.get_friend_list(session)  # 尝试触发验证码
                        seconds = seconds - (int(time.time()) - t)

                    if millisecond - seconds * 1000 > 0:
                        timeout = seconds
                    else:
                        timeout = int(seconds / 2) + delay

                    await asyncio.sleep(timeout)

                println('{}, 当前时间小于兑换时间, 等待{}秒!'.format(self.account, timeout))
                await asyncio.sleep(timeout)

        exchange_name = None # 兑换成功商品
        exchange_success = False  # 是否兑换成功
        exchange_success_datetime = None  # 兑换成功时间
        exchange_finish = False  # 表示兑换结束

        for gift_val, gift_id in can_exchange_map.items():
            exchange_path = 'gift/new/exchange'
            gift_name = f'{gift_val}京豆'

            exchange_params = {"buyParam": {"orderSource": 'pet', "saleInfoId": gift_id}, "deviceInfo": {}}

            println('{}, 正在兑换:{}京豆!'.format(self.account, gift_val))

            for i in range(10):
                println('{}, 正在尝试第{}次兑换!'.format(self.account, i+1))
                data = await self.request(session, exchange_path, exchange_params, method='POST')
                println('{}, 兑换:{}, 返回数据:{}'.format(self.account, gift_name, data))
                if data and data['errorCode'] and 'buy_success' in data['errorCode']:
                    exchange_success = True
                    exchange_name = gift_name
                    exchange_success_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
                    exchange_finish = True
                    break
                elif data and data['errorCode'] and 'limit' in data['errorCode']:
                    println('{}, 今日已兑换商品:{}!'.format(self.account, gift_name))
                    exchange_finish = True
                    break
                elif data and data['errorCode'] and 'empty' in data['errorCode']:
                    println('{}, 奖品:{}已无库存!'.format(self.account, gift_name))
                    break
                else:
                    println('{}, 兑换请求结果: {}'.format(self.account, data))
                await asyncio.sleep(0.2)

            if exchange_finish:
                break

        if exchange_success:
            println('{}, 成功兑换商品:{}, 兑换时间:{}'.format(self.account, exchange_name, exchange_success_datetime))
            self.message = '【活动名称】宠汪汪\n【京东账号】{}\n【兑换奖品】{}\n【兑换状态】成功\n【兑换时间】{}\n'.\
                format(self.account, exchange_name, exchange_success_datetime)

    async def run(self):
        async with aiohttp.ClientSession(headers=self.headers, cookies=self.cookies,
                                         json_serialize=ujson.dumps) as session:
            await self.exchange_bean(session)

        await close_browser(self.browser)


if __name__ == '__main__':
    from utils.process import process_start
    from config import JOY_PROCESS_NUM
    process_start(JdJoyExchange, '宠汪汪兑换', process_num=JOY_PROCESS_NUM)