# !/usr/bin/env python3
# -*- encoding: utf-8 -*-

import time
from helljson_proc import *
from google_oauth import *
from fuckehell import *
from gcalendar import *

# CONSTANT
token_gettime = None
g_authtoken = ''
is_ynu_exist = 0
# CONSTANT

# Refresh Token Function
# Before requests sent, always check whether token expired or not, always refresh

def check_token_expire(token_time,g_authtoken):
    current_time = int(time.time())
    expiredon = token_time + 3600
    if current_time >= expiredon:
        refreshed = f5_oauth_token(g_authtoken['refresh_token'], gcalapi)
        return refreshed['access_token']
    else:
        return 400

# Menu and main function

def main():
    menu = \
        '''
        1. First Time Initialize, Get Auth Credentials
        2. Import Class from EHELL System and Export to Google Calendar
        3. Revoke Tokens and Exit
        4. Manually Refresh Tokens
        '''
    print(menu)
    choice = input("Choose here: __(1/2/3/4)")
    totalweeks = input("This semester has __ weeks.")
    if choice == '3':
        revoke_token()
    elif choice == '2':
        seccalid = getSeccalLst(g_authtoken['access_token'])
        if seccalid == None or isinstance(seccalid,int):
            seccalid = createSecCal(g_authtoken['access_token'],seccalid)['id']
        dataproc_post(totalweeks)
    elif choice == '1':
        g_authcode = get_oauth_authcode(gcalapi)
        g_authtoken = get_oauth_token(g_authcode, gcalapi)
        token_gettime = int(time.time())
    elif choice == '4':
        if token_gettime == None:
            print("Please use Option 1 First.")
        else:
            refreshcode = check_token_expire(token_gettime,gcalapi)
            print(refreshcode)
    else:
        print("Illegal Input!")


# EHALL GET

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


if __name__ == '__main__':
    main()
