#!/usr/bin/env python3
#-*- encoding: utf-8 -*-

from sentry import *
from fuckehell import *

# Firstly, Judge whether resp['code']=='0'
# Then request one week per time, after that process to defined format.
# request next week, do a loop.
# resp['datas']['xskcb']['rows']  -> array

def processweekclass(totalweeknum):
    # Get cookies using selenium
    chk_cookies = getcookie()
    for i in range(1,totalweeknum+1):
        # repeat to get every class in each week
        resplst = getclassjson(chk_cookies,i)
        allclsrows = resplst['datas']['xskcb']['rows']
        allnum = len(allclsrows)
        if resplst['code'] == '0':
            print("Ehell system response seems fine. Go ahead.")
            schclslst = resplst['datas']['xskcb']['rows']
            for ech in schclslst:

        else:
            sendlog_my("YNU2GCalendar: Seems something wrong with system response.")

# Data structure of response json
# YPSJDD: 总教学时间 空格分割
# KCH: 课程号
# KXH: Useless
# KCM: 课程名
# SKJS: 授课教师
# KSJC: 第几节开始
# JSJC: 第几节结束
# SKXQ: 星期几上课
# ZCMC: 课程总周数
# JASMC: 上课地点

def genISOtime(singlecls):
