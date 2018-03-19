#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

print('You must accept this disclaimer first: https://github.com/kmahyyg/YNU2GCalendar#disclaimer')
input("Accept? Press any key to continue.")
# the server must process the json uploaded by the user and submit it to google server

from flask import Flask, abort, jsonify, request, json
import json

app = Flask(__name__)

# Constant
totalweek = 1
# Constant


@app.route('/api/v1/gauth',methods=['POST'])
def procGauth():
    gauth_authcode = request.get_json()
    return 0

@app.route('/api/v1/courses',methods=['POST'])
def procCourses():
    pass


@app.route('/api/v1/tlweek',methods=['GET'])
def procWeeks():
    totalweek = int(request.args.get('data'))
    return jsonify({"code":0,"bmsg":"200 Total Weeks OK"})


if __name__ == '__main__':
    sslcont = ('/root/letsssl/fullchain.pem', '/root/letsssl/privkey.pem')
    app.run(host='0.0.0.0', debug=True, port=443, ssl_context=sslcont)
