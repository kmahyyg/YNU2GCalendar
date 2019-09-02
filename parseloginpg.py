#!/usr/bin/env python3
# -*- encoding:utf-8 -*-

from bs4 import BeautifulSoup
from apikey import *
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from base64 import b64encode
from urllib.parse import quote_plus as urlencode


def getpagecont(session_getobj):
    pagecont = session_getobj.text.encode()
    soup = BeautifulSoup(pagecont, 'lxml')
    hidden_tags = soup.find_all("input", type="hidden")
    return hidden_tags


def randstrgen(length):
    from random import random
    rds_base = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    rds_baselen = len(rds_base)
    result = ''
    for i in range(length):
        result += rds_base[int(random() * rds_baselen)]
    return result


def encryptPasswd(curr_pwd, websalt):
    # AES-128-CBC-PKCS7, which was default pad of pycryptodome
    # Data = _randomstring(length=64 bytes) + data
    # Key = P1 (salt, 16 bytes)
    # IV = _randomstring (16 bytes)
    # After encryption, base64 encoded
    data = randstrgen(64) + curr_pwd
    data = data.encode()
    key = websalt.encode()
    iv = randstrgen(16).encode()
    cipher = AES.new(key=key, mode=AES.MODE_CBC, iv=iv)
    ciptext = cipher.encrypt(pad(data, AES.block_size, style='pkcs7'))
    result = b64encode(ciptext).decode('utf-8')
    return result


def hidden_form2dict(hidden_tags):
    formdata = {}
    for i in hidden_tags:
        try:
            nm = i['name']
            valus = i['value']
            formdata[nm] = valus
        except KeyError:
            nm = i['id']
            valus = i['value']
            formdata[nm] = valus
    formdata['username'] = ynu_ehell_name
    formdata['password'] = encryptPasswd(ynu_ehell_password, formdata['pwdDefaultEncryptSalt'])
    formdata.pop('pwdDefaultEncryptSalt', None)
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
