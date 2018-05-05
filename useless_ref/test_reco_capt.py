#!/usr/bin/env python3
# -*- encoding:utf-8 -*-

from PIL import Image
import pytesseract
import requests

captimage = requests.get('http://ids.ynu.edu.cn/authserver/captcha.html', stream=True, allow_redirects=True)
capimgsaved = open('testcap.jpg', 'wb')
capimgsaved.write(captimage.content)
capimgsaved.close()
imgcapt = Image.open('testcap.jpg')
try:
    global optcode
    optcode = pytesseract.image_to_string(imgcapt)
except:
    pass
if len(optcode) == 0:
    imgcapt = imgcapt.convert('L')
    # TODO: image pre-process
if len(optcode) >= 4:
    optcode = optcode[:4]
print('Captcha is:', optcode)
# ask user to do a confirmation
