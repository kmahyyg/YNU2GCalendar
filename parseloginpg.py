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
