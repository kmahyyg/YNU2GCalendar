#!/usr/bin/env python3
#-*- encoding: utf-8 -*-

print('You must accept this disclaimer first: https://github.com/kmahyyg/YNU2GCalendar#disclaimer')
# the server must process the json uploaded by the user and submit it to google server

def dataproc_post(totalweeks):
    sch_ckies = getcookie()
    for i in range(totalweeks + 1):
        weekclses = getclassjson(sch_ckies,i)
        allcls = weekclses['rows']
        for cls in allcls:
            icalevent = generate_event(cls,i)
            createCalEvent(g_authtoken['access_token'],seccalid,icalevent)
            print("createCalEvent 1.")
    return 0