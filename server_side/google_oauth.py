#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

import json
import os
import time
from urllib.parse import urlencode

import requests

from apikey import *


def check_token_expire(token_time, g_authtoken):
    current_time = int(time.time())
    expiredon = token_time + 3600
    if current_time >= expiredon:
        refreshed = f5_oauth_token(g_authtoken['refresh_token'], gcalapi)
        return refreshed['access_token']
    else:
        return 400


def get_oauth_token(authcodelst, gapijson):
    tokenurl = 'https://www.googleapis.com/oauth2/v4/token'
    clientid = gapijson['client_id']
    clientscrt = gapijson['client_secret']
    postdata = {"code": authcodelst['authcode'], "client_id": clientid, "client_secret": clientscrt,
                "redirect_uri": gapijson['redirect_uris'][0], "grant_type": "authorization_code",
                "code_verifier": authcodelst['userid']}
    header = {'Content-Type': 'application/x-www-form-urlencoded'}
    postdata = urlencode(postdata)
    r = requests.post(tokenurl, data=postdata, headers=header)
    tokened = r.json()
    with open(os.path.expanduser('~/.gauthYyg'), 'w') as authf:
        postdata = {"code": authcodelst['authcode'], "client_id": clientid, "client_secret": clientscrt,
                    "redirect_uri": gapijson['redirect_uris'][0], "grant_type": "authorization_code",
                    "code_verifier": authcodelst['userid']}
        f5token = tokened['refresh_token']
        postdata['refresh_token'] = f5token
        authf.write(json.dumps(postdata))
        authf.close()
    with open(os.path.expanduser('~/.gauthacsYyg'), 'w') as authtkn:
        authtkn.write(tokened['access_token'])
        authtkn.close()
    return tokened  # tested


def f5_oauth_token(refreshtoken, gapijson):
    tokenurl = 'https://www.googleapis.com/oauth2/v4/token'
    clientid = gapijson['client_id']
    clientscrt = gapijson['client_secret']
    postdata = {"refresh_token": refreshtoken, "client_id": clientid, "client_secret": clientscrt,
                "grant_type": "refresh_token"}
    header = {'Content-Type': 'application/x-www-form-urlencoded'}
    postdata = urlencode(postdata)
    r = requests.post(tokenurl, data=postdata, headers=header)
    tokened = r.json()
    with open(os.path.expanduser('~/.gauthacsYyg'), 'w') as authtkn:
        authtkn.write(tokened['access_token'])
        authtkn.close()
    return tokened  # tested


def revoke_token():
    with open(os.path.expanduser('~/.gauthYyg'), 'r') as authf:
        loaded = json.loads(authf.read())
        token = loaded['refresh_token']
        authf.close()
    url = 'https://accounts.google.com/o/oauth2/revoke?token='
    urlquery = url + token
    header = {'Content-Type': 'application/x-www-form-urlencoded'}
    r = requests.get(urlquery, headers=header)
    if r.status_code == 200:
        return print("Successfully Revoked!")
    else:
        return print("Error!")
