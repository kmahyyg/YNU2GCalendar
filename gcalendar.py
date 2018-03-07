#!/usr/bin/env python3
#-*- encoding: utf-8 -*-

from apikey import gcalapi

def processweekclass(allclasslst,totalweeknum):
    for i in range(0,totalweeknum):
        thisweek = allclasslst[i]

# YPSJDD: 总教学时间 空格分割
# KXH: 没用
# KCM: 课名
# KSJC: