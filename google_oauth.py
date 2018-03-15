#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

import json
import random
from urllib.parse import urlencode
from uuid import uuid1 as uuidgen

import os
import pyperclip
import requests

from apikey import *


def code_vergen():
    seq1 = ['q', 'w''f', 'p', 'g', 'j', 'l', 'u', 'y', '-', '.', '_', '~',
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'r', 'a', 's', 't', 'd', 'h', 'n', 'e',
            'i', 'o', 'z', 'x', 'c', 'v', 'b', 'k', 'm']
    codeverkey = []
    for i in range(0, 4):
        keyori = random.sample(seq1, 16)
        codever = ''.join(keyori)
        codeverkey.append(codever)
    codeverify = ''.join(codeverkey)
    return codeverify  # tested


def get_oauth_authcode(gapijson):
    client_id = gapijson['client_id']
    redirect_uri = gapijson['redirect_uris'][0]
    auth_base_url = 'https://accounts.google.com/o/oauth2/v2/auth?'
    codeveri = code_vergen()
    userid = str(uuidgen())[-17:]
    # the oauth token has 3600s period, authorization code will never expire unless user revoked access
    querystr = {"client_id": client_id, "code_challenge_method": "plain", "code_challenge": codeveri,
                "login_hint": "YNU2GCalendar Tools", "state": userid, "scope": gcalapi_scope,
                "response_type": "code", "redirect_uri": redirect_uri}
    querystr = urlencode(querystr)
    urlcopy = auth_base_url + querystr
    pyperclip.copy(urlcopy)
    print("Already copied auth url, please paste it into your browser")
    authorization_code = input("Paste your authorization code here:")
    time1auth = {'authcode': authorization_code, 'userid': codeveri}
    return time1auth  # tested


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
