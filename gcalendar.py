#!/usr/bin/env python3
#-*- encoding: utf-8 -*-

def processweekclass(allclasslst,totalweeknum):
    for i in range(0,totalweeknum):
        thisweek = allclasslst[i]

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
