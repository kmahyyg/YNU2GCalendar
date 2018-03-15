#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

from apikey import semester_start,mailacc
from sentry import *
from datetime import *
import json


# Firstly, Judge whether resp['code']=='0'
# Then request one week per time, after that process to defined format.
# request next week, do a loop.

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

#  event = {
#   'summary': 'Google I/O 2015',   // must
#   'location': '800 Howard St., San Francisco, CA 94103',      //must
#   'description': 'A chance to hear more about Google\'s developer products.',    //must
#   'start': {    //must
#     'dateTime': '2015-05-28T09:00:00-07:00',
#     'timeZone': 'America/Los_Angeles',
#   },
#   'end': {     //must
#     'dateTime': '2015-05-28T17:00:00-07:00',
#     'timeZone': 'America/Los_Angeles',
#   },
#   'attendees': [
#     {'email': 'lpage@example.com'},
#     {'email': 'sbrin@example.com'},    //must
#   ],
#   'reminders': {     //must
#     'useDefault': False,
#     'overrides': [
#       {'method': 'popup', 'minutes': 10},
#     ],
#   },
# }

weekscls = []


def generate_time(eachcls, weeknum, semstart=semester_start):
    evnttime = {'start':{'dateTime': '','timeZone': 'Asia/Shanghai'},'end':{'dateTime': '','timeZone': 'Asia/Shanghai'}}
    baseweek = semstart + timedelta(weeks=weeknum-1)
    clsday = int(eachcls['SKXQ'])
    baseday = baseweek + timedelta(days=clsday-1)
    start_j = int(eachcls['KSJC'])
    end_j = int(eachcls['JSJC'])
    period = end_j - start_j
    if start_j >= 7:
        basetime = baseday - timedelta(minutes=30,hours=8) + timedelta(hours=14)
        start_j = start_j - 7
        if period /2 == 1 and period %2 == 0:
            basetime = basetime + timedelta(minutes=)
        elif period /2 == 2 and period %2 == 0:
            evnttime['start']['datetime'] = str(basetime.isoformat())
            endtime = basetime + timedelta(hours=3,minutes=40)
            evnttime['end']['dateTime'] = str(endtime.isoformat())
        elif period /2 == 0 and period %2 == 1:

        else:

    else:

    return evnttime




def generate_event(eachclass,weekno):
    if eachclass['JASMC'] == None:
        eachclass['JASMC'] = '未安排地点'
    if eachclass['SKJS'] == None:
        eachclass['SKJS'] = '未安排教师'
    if eachclass['YPSJDD'] == None:
        eachclass['YPSJDD'] = '没有详细描述'
    descd = eachclass['SKJS'] + eachclass['YPSJDD']
    eventresc = {'summary': eachclass['KCM'],
             'location': eachclass['JASMC'],
             'description': descd,
             'attendees':[{'email':mailacc}],
             'reminders':{'useDefault': False,'overrides':[{'method':'popup', 'minutes': 30}]}}
    eventtime = generate_time(eachclass,weekno)
    eventresc['start'] = eventtime['start']
    eventresc['end'] = eventtime['end']
    return eventresc