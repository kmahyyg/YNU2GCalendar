#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

import json

from .sentry import *
import requests


def getSeccalLst(acstoken):
    httpauth = "Bearer " + acstoken
    header = {"Authorization": httpauth}
    base = 'https://www.googleapis.com/calendar/v3/users/me/calendarList'
    query = ''
    url = base + query
    r = requests.get(url=url, headers=header)
    resp = r.json()
    STATUS_YNUEXIST = None
    print('-------------------------')
    print('All Secondary Calendars here:')
    for calends in resp['items']:
        if calends['summary'] != 'YNU CLASSES':
            pass
        else:
            STATUS_YNUEXIST = 1
            return calends['id']
        print(calends['summary'])
    print('-------------------------')
    STATUS_YNUEXIST = 0
    return STATUS_YNUEXIST

    # background hex color code: f4426e


def createSecCal(acstoken, status_ynuexist):
    if status_ynuexist == None:
        return print("YNU Secondary Calendars already exists.")
    httpauth = "Bearer " + acstoken
    header = {"Authorization": httpauth}
    postdata = {"timeZone": "Asia/Shanghai", "summary": "YNU CLASSES"}
    r = requests.post('https://www.googleapis.com/calendar/v3/calendars', headers=header, json=postdata)
    resp = r.json()
    return resp


# passing data structure in json

def createCalEvent(acstoken, seccalid, eventmetadata):
    base = 'https://www.googleapis.com/calendar/v3/calendars/'
    query = seccalid + '/events'
    url = base + query
    httpauth = "Bearer " + acstoken
    header = {"Authorization": httpauth}
    r = requests.post(url=url, headers=header, json=eventmetadata)
    if r.status_code >= 400:
        print("Create Calendar event failed!")
        resp = r.json()
        resp = json.dumps(resp)
        sendlog_my('YNU2GCalendar: Request for Create events failed!\n' + resp)
        return 255
    else:
        print("Event Created Successfully!")
        return 0


def listSecCalEvent(acstoken, seccalid):
    base = 'https://www.googleapis.com/calendar/v3/calendars/'
    query = seccalid + '/events?maxResults=100'
    url = base + query
    httpauth = "Bearer " + acstoken
    header = {"Authorization": httpauth}
    r = requests.post(url=url, json=header)
    resp = r.json()['items']
    return resp
