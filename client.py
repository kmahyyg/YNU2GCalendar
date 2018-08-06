#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

# The client side is responsible for their class information and oauth authorization code

from fuckehell import *
from helljson_proc import *
from icsgen import *
from sentry import sendlog_sent


def main():
    greeting = \
        '''
        Welcome to YNU2GCalendar. It's brought to you by @kmahyyg.
        You must setup apikey.py first according to README.
        '''
    print(greeting)
    print("PLEASE READ README.md first!!!!!!")
    input("\n Press any key to continue")
    ehall_ckie = getcookie()
    ynucal = init_cal()
    print("Ehall cookies emulate successfully finished!")
    totalweek = input("Please input the total weeks in this semester: ___")
    totalweek = int(totalweek)
    for i in range(1, totalweek + 1):
        cls = getclassjson(ehall_ckie, i, '2017-2018-2')
        allcls = cls['rows']
        print('Classes in Week ' + str(i) + ' is gotten.')
        try:
            for j in allcls:
                evntresc = generate_event(j, i)
                evntical = crea_evnt(evntresc)
                ynucal = add_evnt(ynucal, evntical)
        except:
            sendlog_sent()
    export2f(ynucal)
    print('Export successfully finished.')
    return 0


if __name__ == '__main__':
    print('Please read this disclaimer first: https://github.com/kmahyyg/YNU2GCalendar#disclaimer')
    print('Do you accept it? (Y/N)')
    choice = input()
    if choice == 'Y':
        main()
    else:
        print('See you!')
