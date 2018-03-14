# !/usr/bin/env python3
# -*- encoding: utf-8 -*-

from helljson_proc import *
from google_oauth import *


# Refresh Token Function
# Before requests sent, always check whether token expired or not, always refresh

def check_token_expire(token_time):
    current_time = int(time.time())
    expiredon = token_time + 3600
    if current_time >= expiredon:
        refreshed = f5_oauth_token(g_authtoken['refresh_token'], gcalapi)
        return refreshed['access_token']
    else:
        return 400


# Auth from Google API
g_authcode = get_oauth_authcode(gcalapi)
g_authtoken = get_oauth_token(g_authcode, gcalapi)
token_time = int(time.time())


# Menu and main function

def main():
    menu = \
        '''
        1. First Time Initialize, Get Auth Credentials
        2. Import Class from EHELL System
        3. Revoke Tokens and Exit
        4. Manually Refresh Tokens
        '''
    choice = input("Choose here: __(1/2/3/4)")


if __name__ == '__main__':
    main()
