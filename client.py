#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

# The client side is responsible for their class information and oauth authorization code

from fuckehell import *


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
    print("Ehall cookies emulate successfully finished!")
    totalweek = int(input("Please input the total weeks in this semester: ___"))
    for i in range(1, totalweek + 1):
        cls = getclassjson(ehall_ckie, i)

    return 0


if __name__ == '__main__':
    print('Please read this disclaimer first: https://github.com/kmahyyg/YNU2GCalendar#disclaimer')
    print('Do you accept it? (Y/N)')
    choice = input()
    if choice == 'Y':
        main()
    else:
        print('See you!')
