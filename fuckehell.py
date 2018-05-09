#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

# This semester starts from Mar.3

import time
import requests
from captcharecg import *
from apikey import *
from sentry import *
from parseloginpg import *


def chkcaptcha4u(stuid):
    curtime = str(int(time.time() * 1000))
    base = 'http://ids.ynu.edu.cn/authserver/needCaptcha.html'
    querydata = {'username':stuid,'_':curtime}
    checkcapt = requests.get(base,data=querydata)
    result = str(checkcapt.text)
    result = result.replace('\n','')
    return result



def getcookie():
    # start a new session to record info we need
    sesslog = requests.Session()
    baseurl = 'http://ids.ynu.edu.cn/authserver/login?service=http%3A%2F%2Fehall.ynu.edu.cn%2Flogin%3Fservice%3Dhttp%3A%2F%2Fehall.ynu.edu.cn%2Fnew%2Findex.html'
    custom_header = {'Host': 'ids.ynu.edu.cn', 'Connection':'keep-alive', 'Pragma': 'no-cache',
                     'Cache-Control': 'no-cache', 'Upgrade-Insecure-Requests': '1',
                     'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                     'DNT': '1', 'Referer': 'http://ehall.ynu.edu.cn/new/index.html', 'Accept-Encoding': 'gzip, deflate',
                     'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6'}
    loginpage = sesslog.get(baseurl,headers=custom_header)
    # check whether captcha is indeed or not
    needcaptcha_status = chkcaptcha4u(ynu_ehell_name)
    if needcaptcha_status == 'true':
        captopt = getcaptcha(sesslog)    # auto recognize or manually input
    if needcaptcha_status == 'false':
        captopt = None # don't do anything.
    # parse webpage and get a hidden input form
    pagehidtags = getpagecont(loginpage)
    loginform = hidden_form2dict(pagehidtags)
    if needcaptcha_status == 'true' and captopt != None:
        loginform['captchaResponse'] = captopt
    # auto login
    loginnow = sesslog.post(baseurl,data=loginform,allow_redirects=True)
    # go to ehall index page
    idxpage_ehall = sesslog.get('http://ehall.ynu.edu.cn/new/index.html',stream=True)
    goto_myclass = sesslog.get('http://ehall.ynu.edu.cn/appShow?appId=4770397878132218',allow_redirects=True,stream=True,timeout=40)
    # succeed to login and got the correct cookie
    # -------- Original JS Implementation --------
    # rdmstring += Math.random().toString(36).substr(2)  (LENGTH 20)
    # userClientId = new Date().getTime() + "" + CommonUtil.createRandomNum();
    # amp.locale = undefined and then s.cookies.set(DICT)
    # --------------------- END ------------------
    extra_cookies = {'amp.locale':'undefined'}
    extra_cookies['userClientId'] = genUserClientId()
    sesslog.cookies.set(extra_cookies)
    return sesslog.cookies.get_dict()


def getclassjson(cookies_dict, weeknum, term='2017-2018-1'):
    url = 'http://ehall.ynu.edu.cn/jwapp/sys/wdkb/modules/xskcb/xskcb.do'
    custom_header = {'Host': 'ehall.ynu.edu.cn', 'Connection': 'keep-alive', 'Content-Length': '25',
                     'Pragma': 'no-cache',
                     'Cache-Control': 'no-cache', 'Accept': 'application/json, text/javascript, */*; q=0.01',
                     'Origin': 'http://ehall.ynu.edu.cn', 'X-Requested-With': 'XMLHttpRequest',
                     'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                     'Referer': 'http://ehall.ynu.edu.cn/jwapp/sys/wdkb/*default/index.do?amp_sec_version_=1',
                     'Accept-Encoding': 'gzip, deflate', 'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7'}
    formdata = {'XNXQDM': term, 'SKZC': weeknum}
    r = requests.post(url=url, data=formdata, headers=custom_header, cookies=cookies_dict)
    try:
        classes = r.json()
        classes['datas']['xskcb']['WEEKNO'] = weeknum
        if classes['code'] == '0':
            return classes['datas']['xskcb']
        else:
            return sendlog_my("YNU2Gcalendar: Cookies get, but Failed to fetch class table data.")
    except:
        sendlog_sent()
        sendlog_my("YNU2Gcalendar: Cookies get, but Failed to fetch class table data.")
        return 254
