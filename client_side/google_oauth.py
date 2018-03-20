#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

import random
from urllib.parse import urlencode
from uuid import uuid1 as uuidgen

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
    print('\n')
    print('-----------------------------------------------------------')
    print(urlcopy)
    print('-----------------------------------------------------------')
    print("Auth url has been shown above, please paste it into your browser")
    print('-----------------------------------------------------------')
    print('\n')
    authorization_code = input("Paste your authorization code here:")
    time1auth = {'authcode': authorization_code, 'userid': codeveri}
    return time1auth  # tested
