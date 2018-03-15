#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

# This semester starts from Mar.3

import time

import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from apikey import ynu_ehell_password, ynu_ehell_name
from sentry import *

chrome_options = Options()
chrome_options.add_argument("--headless")
driver = webdriver.Chrome(chrome_options=chrome_options)
# driver = webdriver.Chrome()


def getcookie():
    driver.get(
        'http://ids.ynu.edu.cn/authserver/login?service=http%3A%2F%2Fehall.ynu.edu.cn%2Flogin%3Fservice%3Dhttp%3A%2F%2Fehall.ynu.edu.cn%2Fnew%2Findex.html')
    username = driver.find_element_by_id("username")
    username.send_keys(ynu_ehell_name)
    passwd = driver.find_element_by_id("password")
    passwd.send_keys(ynu_ehell_password)
    loginbutton = driver.find_element_by_xpath('//*[@id="casLoginForm"]/p[4]/button')
    loginbutton.submit()
    if driver.title == '统一身份认证':
        driver.find_element_by_xpath('/html/body/div[2]/div[2]/div/div/div[2]/input[1]').click()
        time.sleep(5)
    if driver.title == '统一身份认证平台':
        print('You may need to input the captcha yourself.')
        sendlog_my("YNU2GCalendar: Meet CAPTCHA Test! <REWRITE BURNING!>")
    if driver.title == '网上办事服务大厅':
        time.sleep(8)
        availapps = driver.find_element_by_xpath('//*[@id="ampPersonalAsideLeftTabHead"]/div[2]')
        availapps.click()
        myclasses = driver.find_element_by_xpath('//*[@id="ampPersonalAsideLeftAllCanUseAppsTabContent"]/div[1]/div[9]')
        currentWindow = driver.current_window_handle
        myclasses.click()
        for handle in driver.window_handles:
            if handle != currentWindow:
                driver.switch_to.window(driver.window_handles[1])
        time.sleep(10)
    else:
        pass

    if driver.title == '我的课程表':
        time.sleep(10)
        cookies_list = driver.get_cookies()
        cookies_dict = {}
        for cookie in cookies_list:
            cookies_dict[cookie['name']] = cookie['value']
        driver.quit()
        return cookies_dict
    else:
        sendlog_my("YNU2GCalendar: Error to focus tab to Classes List")


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
        classes['datas']['xskcb']['rows']['WEEKNO'] = weeknum
        if classes['code'] == '0':
            return classes['datas']['xskcb']['rows']
        else:
            return sendlog_my("YNU2Gcalendar: Cookies get, but Failed to fetch class table data.")
    except:
        sendlog_sent()
        sendlog_my("YNU2Gcalendar: Cookies get, but Failed to fetch class table data.")
        return 254
