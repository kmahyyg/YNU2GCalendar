#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

# This semester starts from Mar.3

import time
import requests
from captcharecg import *
from apikey import *
from parseloginpg import *

proxies = {
  'http': 'http://127.0.0.1:42779',
  'https': 'http://127.0.0.1:42779',
}
IS_DEBUG = True


def chkcaptcha4u(stuid):
    curtime = str(int(time.time() * 1000))
    base = 'https://ids.ynu.edu.cn/authserver/needCaptcha.html'
    querydata = {'username': stuid, '_': curtime}
    checkcapt = requests.get(base, data=querydata, timeout=25)
    result = str(checkcapt.text)
    result = result.replace('\n', '')
    return result


def getcookie():
    # start a new session to record info we need
    sesslog = requests.Session()
    baseurl = 'https://ids.ynu.edu.cn/authserver/login?service=http%3A%2F%2Fehall.ynu.edu.cn%2Flogin%3Fservice%3Dhttp%3A%2F%2Fehall.ynu.edu.cn%2Fnew%2Findex.html'
    custom_header = {'Host': 'ids.ynu.edu.cn', 'Connection': 'keep-alive', 'Pragma': 'no-cache',
                     'Cache-Control': 'no-cache', 'Upgrade-Insecure-Requests': '1',
                     'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                     'DNT': '1', 'Referer': 'http://ehall.ynu.edu.cn/new/index.html',
                     'Accept-Encoding': 'gzip, deflate',
                     'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6'}
    loginpage = sesslog.get(baseurl, headers=custom_header, timeout=25)
    # check whether captcha is indeed or not
    needcaptcha_status = chkcaptcha4u(ynu_ehell_name)
    if needcaptcha_status == 'true':
        print("-------------")
        print("Please ensure that your account name and password is correct in apikey.py first.")
        print("If not, terminate this program directly and correct it now.")
        print("-------------")
        captopt = getcaptcha(sesslog)  # auto recognize or manually input
    if needcaptcha_status == 'false':
        captopt = None  # don't do anything.
    # parse webpage and get a hidden input form
    pagehidtags = getpagecont(loginpage)
    loginform = hidden_form2dict(pagehidtags)
    if needcaptcha_status == 'true' and captopt != None:
        loginform['captchaResponse'] = captopt
    # auto login
    if IS_DEBUG:
        loginnow = sesslog.post(baseurl, verify=False, data=loginform, allow_redirects=True, timeout=25, proxies=proxies)
    else:
        loginnow = sesslog.post(baseurl, data=loginform, allow_redirects=True, timeout=25)

    usrclid = genUserClientId()
    sesslog.cookies.set('amp.locale', 'undefined')
    sesslog.cookies.set('userClientId', usrclid)
    # go to ehall index page
    idxpage_ehall = sesslog.get('http://ehall.ynu.edu.cn/new/index.html', stream=True, timeout=25, proxies=proxies)
    goto_myclass = sesslog.get('http://ehall.ynu.edu.cn/appShow?appId=4770397878132218', allow_redirects=True,
                               stream=True, timeout=40, proxies=proxies)
    # 20190909: update: choose group
    curtime = str(int(time.time() * 1000))
    getgroupurl = 'http://ehall.ynu.edu.cn/appMultiGroupEntranceList?r_t={}&appId=4770397878132218&param='.format(str(curtime))
    groupdata = sesslog.get(getgroupurl, timeout=25, allow_redirects=False, stream=True, proxies=proxies).json()
    if groupdata['result'] == 'success' and groupdata['hasLogin']:
        targeturl = groupdata['data']['groupList'][-1]['targetUrl']
        sesslog.get(targeturl, timeout=25, allow_redirects=True, stream=True, proxies=proxies)
    sesslog.get('http://ehall.ynu.edu.cn/jwapp/sys/emappagelog/config/wdkb.do', timeout=25,
                allow_redirects=True, stream=True, proxies=proxies)
    # succeed to login and got the correct cookie
    # -------- Original JS Implementation --------
    # rdmstring += Math.random().toString(36).substr(2)  (LENGTH 20)
    # userClientId = new Date().getTime() + "" + CommonUtil.createRandomNum();
    # amp.locale = undefined and then s.cookies.set(DICT)
    # --------------------- END ------------------
    return sesslog


def getclassjson(loginsession, weeknum):

    url = 'http://ehall.ynu.edu.cn/jwapp/sys/wdkb/modules/xskcb/xskcb.do'
    custom_header = {'Host': 'ehall.ynu.edu.cn', 'Connection': 'keep-alive', 'Content-Length': '25',
                     'Pragma': 'no-cache',
                     'Cache-Control': 'no-cache', 'Accept': 'application/json, text/javascript, */*; q=0.01',
                     'Origin': 'http://ehall.ynu.edu.cn', 'X-Requested-With': 'XMLHttpRequest',
                     'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                     'Referer': 'http://ehall.ynu.edu.cn/jwapp/sys/wdkb/*default/index.do?amp_sec_version_=1',
                     'Accept-Encoding': 'gzip, deflate', 'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7'}
    # BELOW: REQUEST TERM
    term_req = 'http://ehall.ynu.edu.cn/jwapp/sys/wdkb/modules/jshkcb/dqxnxq.do'
    term_r = loginsession.get(url=term_req, headers=custom_header, timeout=25, allow_redirects=True, proxies=proxies)
    resp_term = term_r.json()
    if resp_term["code"] == "0":
        try:
            term = resp_term["datas"]["dqxnxq"]["rows"][0]["DM"]
            print("Current Semester, Get: ", end='')
            print(resp_term["datas"]["dqxnxq"]["rows"][0]["MC"], end='')
            print(" " + term)
        except NameError:
            raise OSError("Can't find current semester sign.")
    # BELOW: REQUEST COURSE TABLE
    formdata = {'XNXQDM': term, 'SKZC': weeknum}
    r = loginsession.post(url=url, data=formdata, headers=custom_header, timeout=25, proxies=proxies)
    try:
        classes = r.json()
        classes['datas']['xskcb']['WEEKNO'] = weeknum
        if classes['code'] == '0':
            return classes['datas']['xskcb']
        else:
            raise OSError("YNU2Gcalendar: Cookies get, but Failed to fetch class table data.")
    except:
        raise OSError("YNU2Gcalendar: Cookies get, but Failed to fetch class table data.")
