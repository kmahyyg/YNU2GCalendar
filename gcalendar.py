#!/usr/bin/env python3
#-*- encoding: utf-8 -*-

import requests
from urllib.parse import urlencode     # for GET http method url generate

def getSeccalLst(acstoken):
    httpauth = "Bearer " + acstoken
    header = {"Authorization": httpauth}
    base = 'https://www.googleapis.com/calendar/v3/users/me/calendarList'
    query = ''
    url = base+query
    r = requests.get(url=url,headers=header)
    resp = r.json()
    STATUS_YNUEXIST = 0
    print('-------------------------')
    print('All Secondary Calendars here:')
    for calends in resp['items']:
        if calends['summary'] != 'YNU CLASSES':
            pass
        else:
            STATUS_YNUEXIST = 1
        print(calends['summary'])
    print('-------------------------')
    return STATUS_YNUEXIST

    # background hex color code: f4426e
def createSecCal(acstoken,status_ynuexist):
    if status_ynuexist == 1:
        return print("YNU Secondary Calendars already exists.")
    httpauth = "Bearer " + acstoken
    header = {"Authorization": httpauth}
    postdata = {"timeZone":"Asia/Shanghai","summary":"YNU CLASSES"}
    r= requests.post('https://www.googleapis.com/calendar/v3/calendars',headers=header,json=postdata)
    resp = r.json()
    return resp


# passing data structure in json
#TODO cooperate with ehell data structure

def createCalEvent(acstoken,seccalid,eventmetadata):
    base = 'https://www.googleapis.com/calendar/v3/calendars/'
    query = seccalid + '/events'
    #todo unfinished



def listSecCalEvent(acstoken,seccalid):
    base = 'https://www.googleapis.com/calendar/v3/calendars/'
    query = seccalid + '/events?maxResults=100'
    url = base + query
    httpauth = "Bearer " + acstoken
    header = {"Authorization": httpauth}
    r = requests.post(url=url,json=header)
    resp = r.json()['items']
    return resp