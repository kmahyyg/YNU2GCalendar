# !/usr/bin/env python3
# -*- encoding: utf-8 -*-

# The client side is responsible for their class information and oauth authorization code

from .apikey import *
from .fuckehell import *
from .google_oauth import *
from .sentry import *
import requests, json


def postAuthToServ(datajson):
    r = requests.post(url='https://ehall.55aiguo.xyz/api/v1/gauth', json=datajson)
    if r.status_code >= 300:
        sendlog_my('[client]Post GAuth failed:' + r.text())
        resp = {'bmsg': 'Failed!'}
    else:
        resp = r.json()
    return resp


def postCourseToServ(coursejson):
    r = requests.post(url='https://ehall.55aiguo.xyz/api/v1/courses', json=coursejson)
    if r.status_code >= 300:
        sendlog_my('[client]Post GAuth failed:' + r.text())
        resp = {'bmsg': 'Failed!'}
    else:
        resp = r.json()
    return resp


def postNumToServ(num):
    payload = {'data': num}
    r = requests.get(url='https://ehall.55aiguo.xyz/api/v1/curweek', params=payload)
    resp = r.json()
    return resp


def main():
    greeting = \
        '''
        Welcome to YNU2GCalendar. It's brought to you by @kmahyyg.
        You must setup apikey.py first according to README.
        '''
    print(greeting)
    print("PLEASE READ README.md first!!!!!!")
    input("\n Press any key to continue")
    authcode = get_oauth_authcode(gcalapi)
    print("Authentication Credentials get!")
    postAuthToServ(authcode)
    print("Authentication Credentials posted to server.")
    ehall_ckie = getcookie()
    print("Ehall cookies emulate successfully finished!")
    totalweek = int(input("Please input the total weeks in this semester: ___"))
    for i in range(1, totalweek + 1):
        cls = getclassjson(ehall_ckie, i)
        curwek = postNumToServ(i)
        print(" This week is " + str(i) + "posted to server.")
        print(curwek['bmsg'])
        recv = postCourseToServ(cls)
        print("Course data of Week" + str(i) + "posted to server.")
        print(recv['bmsg'])
    return 0


if __name__ == '__main__':
    print('Please read this disclaimer first: https://github.com/kmahyyg/YNU2GCalendar#disclaimer')
    print('Do you accept it? (Y/N)')
    choice = input()
    if choice == 'Y':
        main()
    else:
        print('See you!')
