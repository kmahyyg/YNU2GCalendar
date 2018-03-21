#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

print('You must accept this disclaimer first: https://github.com/kmahyyg/YNU2GCalendar#disclaimer')
input("Accept? Press any key to continue.")
# the server must process the json uploaded by the user and submit it to google server


from time import time as timeg
from os.path import expanduser
from flask import Flask, jsonify, request

from gcalendar import *
from google_oauth import *
from helljson_proc import *

app = Flask(__name__)

# Constant Predefine
current_week = 1
gauth_acstoken = ''
gauth_reftoken = ''
gauth_oauthtoken = ''
acstokentime = 0
seccalid = ''
# Constant Predefined


@app.route('/api/v1/gauth', methods=['POST'])
def procGauth():
    try:
        gauth_authcode = request.get_json()
        gauth_oauthtoken = get_oauth_token(gauth_authcode, gcalapi)
        gauth_reftoken = gauth_oauthtoken['refresh_token']
        gauth_acstoken = gauth_oauthtoken['access_token']
        acstokentime = int(timeg())
        return jsonify({"code": 0, "bmsg": "Request successfully processed."})
    except:
        sendlog_sent()
        return jsonify({"code": 254, "bmsg": "400 Invalid Request@Gauth. Uploaded to Sentry.io"})


@app.route('/api/v1/curweek', methods=['GET'])
def procWeeks():
    try:
        current_week = int(request.args.get('data'))
        return jsonify({"code": 0, "bmsg": "200 Current Week OK"})
    except:
        sendlog_sent()
        return jsonify({"code": 254, "bmsg": "400 Invalid Request@curWeek. Uploaded to Sentry.io"})


@app.route('/api/v1/createSecC',methods=['GET'])
def newSecCalendar():
    gauth_acstoken = open(expanduser('~/.gauthacsYyg')).read()
    checkSec = getSeccalLst(gauth_acstoken)
    seccalid = createSecCal(gauth_acstoken, checkSec)['id']
    return jsonify({'code':0,'bmsg':'200 Create Secondary Calendar Processed.'})


@app.route('/api/v1/courses', methods=['POST'])
def procCourses():
    try:
        gauth_acstoken = open(expanduser('~/.gauthacsYyg')).read()
        echwekcurs = request.get_json()
        current_week_cls = echwekcurs['rows']
        clsnums = len(current_week_cls)
        checkSec = getSeccalLst(gauth_acstoken)
        seccalid = createSecCal(gauth_acstoken, checkSec)['id']
        for i in range(0, clsnums):
            evnt = generate_event(current_week_cls[i], current_week)
            createCalEvent(gauth_acstoken, seccalid, evnt)
        return jsonify({"code": 0, "bmsg": "200 Courses data in this week proceeded."})
    except:
        sendlog_sent()
        return jsonify({"code": 254, "bmsg": "400 Invalid Request@courses. Uploaded to Sentry.io"})


if __name__ == '__main__':
    try:
        sslcont = ('/root/letsssl/fullchain.pem', '/root/letsssl/privkey.pem')
        app.run(host='0.0.0.0', debug=True, port=443, ssl_context=sslcont)
        # app.run(host='0.0.0.0', debug=True, port=80)
    except:
        sendlog_sent()
