#!/usr/bin/env python3
# -*- encoding:utf-8 -*-

from bs4 import BeautifulSoup
from apikey import *


def getpagecont(session_getobj):
    pagecont = session_getobj.text.encode()
    soup = BeautifulSoup(pagecont, 'lxml')
    hidden_tags = soup.find_all("input", type="hidden")
    return hidden_tags


def hidden_form2dict(hidden_tags):
    formdata = {}
    for i in hidden_tags:
        nm = i['name']
        valus = i['value']
        formdata[nm] = valus
    formdata['username'] = ynu_ehell_name
    formdata['password'] = ynu_ehell_password
    return formdata


def singlelgn(reqobj):
    pagecont = reqobj.text.encode()
    soup = BeautifulSoup(pagecont, 'lxml')
    contn_form = soup.find('form', id="continue")
    for n in contn_form.children:
        if n.name == 'input' and n['name'] == 'execution':
            return n['value']
    # reserved for single log-on process


def genRandomString(size=20):
    import random
    import string
    chars = string.ascii_lowercase + string.digits
    return ''.join(random.choice(chars) for _ in range(size))


def genUserClientId():
    import time
    curTimeStamp = int(time.time() * 1000)
    ranStr = genRandomString(20)
    userCliID = str(curTimeStamp) + str(ranStr)
    return userCliID
