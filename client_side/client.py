#!/usr/bin/env python3
#-*- encoding: utf-8 -*-

# The client side is responsible for their class information and oauth authorization code

from fuckehell import *
from google_oauth import *
from sentry import *
import requests


def postAuthToServ(datajson):
    r = requests.post(url='https://ehell.ynu.edu.pl/api/v1/gauth', json=datajson)
    # r = requests.post(url='http://127.0.0.1/api/v1/gauth', json=datajson)
    if r.status_code >= 300:
        sendlog_my('[client]Post GAuth failed:' + r.text)
        resp = {'bmsg': 'Failed!'}
    else:
        resp = r.json()
    return resp


def postCourseToServ(coursejson):
    r = requests.post(url='https://ehell.ynu.edu.pl/api/v1/courses', json=coursejson)
    # r = requests.post(url='http://127.0.0.1/api/v1/courses', json=coursejson)
    if r.status_code >= 300:
        sendlog_my('[client]Post GAuth failed:' + r.text)
        resp = {'bmsg': 'Failed!'}
    else:
        resp = r.json()
    return resp


def postNumToServ(num):
    payload = {'data': num}
    # r = requests.get(url='http://127.0.0.1/api/v1/curweek', params=payload)
    r = requests.get(url='https://ehell.ynu.edu.pl/api/v1/curweek', params=payload)
    resp = r.json()
    return resp


def getNewSecCal():
    r = requests.get(url='https://ehell.ynu.edu.pl/api/v1/createSecC')
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
    getNewSecCal()
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
