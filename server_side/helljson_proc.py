#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

from .apikey import semester_start,mailacc
from .sentry import *
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
    start_j = int(eachcls['KSJC'])    # included
    end_j = int(eachcls['JSJC'])      # included
    period = end_j - start_j
    # School Schedule Timetable
    # 1-4 Morning {8:30-10:10,10:30-12:10} 20MINS2REST
    # 5-8 Afternoon {14:00-15:40,16:00-17:40}
    # 9-10 Evening {19:00-20:40}
    # School Schedule Timetable
    if start_j >= 5:     # afternoon
        # The classes in school has two forms in time: 45mins*2 / 45mins*3 / 45mins*4
        basetime = baseday + timedelta(hours=14)
        start_j = start_j - 5
        if period == 1 and start_j == 0:
            evnttime['start']['datetime'] = str(basetime.isoformat())
            endtime = basetime + timedelta(minutes=100)
            evnttime['end']['dateTime'] = str(endtime.isoformat())
        elif period == 1 and start_j == 2:
            basetime = basetime + timedelta(minutes=120)
            evnttime['start']['datetime'] = str(basetime.isoformat())
            endtime = basetime + timedelta(minutes=100)
            evnttime['end']['dateTime'] = str(endtime.isoformat())
        elif period == 3:
            evnttime['start']['datetime'] = str(basetime.isoformat())
            endtime = basetime + timedelta(hours=3,minutes=40)
            evnttime['end']['dateTime'] = str(endtime.isoformat())
        elif period == 2 and start_j == 0:
            evnttime['start']['datetime'] = str(basetime.isoformat())
            endtime = basetime + timedelta(minutes=45*3+20)
            evnttime['end']['dateTime'] = str(endtime.isoformat())
        elif period == 2 and start_j == 1:
            basetime = basetime +timedelta(minutes=55)
            evnttime['start']['datetime'] = str(basetime.isoformat())
            endtime = basetime + timedelta(minutes=45*3+20)
            evnttime['end']['dateTime'] = str(endtime.isoformat())
        else:
            sendlog_my(json.dumps(eachcls) + 'Import Failed!')
    elif start_j ==9:    # evening
        basetime = baseday + timedelta(hours=19)
        evnttime['start']['datetime'] = str(basetime.isoformat())
        endtime = basetime + timedelta(minutes=100)
        evnttime['end']['dateTime'] = str(endtime.isoformat())
    else:    # morning
        basetime = baseday + timedelta(hours=8,minutes=30)
        start_j = start_j - 1
        if period == 1 and start_j ==0:
            evnttime['start']['datetime'] = str(basetime.isoformat())
            endtime = basetime + timedelta(minutes=100)
            evnttime['end']['dateTime'] = str(endtime.isoformat())
        elif period == 1 and start_j == 1:
            basetime = basetime + timedelta(minutes=55)
            evnttime['start']['datetime'] = str(basetime.isoformat())
            endtime = basetime + timedelta(minutes=100)
            evnttime['end']['dateTime'] = str(endtime.isoformat())
        elif period == 1 and start_j == 2:
            basetime = basetime + timedelta(minutes=120)
            evnttime['start']['datetime'] = str(basetime.isoformat())
            endtime = basetime + timedelta(minutes=100)
            evnttime['end']['dateTime'] = str(endtime.isoformat())
        elif period == 2 and start_j == 0:
            evnttime['start']['datetime'] = str(basetime.isoformat())
            endtime = basetime + timedelta(minutes=155)
            evnttime['end']['dateTime'] = str(endtime.isoformat())
        elif period == 2 and start_j == 1:
            basetime = basetime + timedelta(minutes=55)
            evnttime['start']['datetime'] = str(basetime.isoformat())
            endtime = basetime + timedelta(minutes=100)
            evnttime['end']['dateTime'] = str(endtime.isoformat())
        else:
            evnttime['start']['datetime'] = str(basetime.isoformat())
            endtime = basetime + timedelta(hours=3,minutes=40)
            evnttime['end']['dateTime'] = str(endtime.isoformat())
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