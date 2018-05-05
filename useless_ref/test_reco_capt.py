#!/usr/bin/env python3
# -*- encoding:utf-8 -*-

from PIL import Image
import pytesseract
import requests
import os

correctence = []

def imgpreproc(imgobj):
    imgobj = imgobj.convert('L')
    threshold = 125
    table = []
    for i in range(256):
        if i < threshold:
            table.append(0)
        else:
            table.append(1)
    imgobj = imgobj.point(table,'1')
    imgobj.show()
    opt_seccode = pytesseract.image_to_string(imgobj)
    return opt_seccode


def confirm_correct():
    choice1 = input("Correct?(Y/N)")
    if choice1 == 'Y':
        correctence.append(1)
        return True
    else:
        correctence.append(0)
        correctname = input("Correct one is?")
        return correctname


def main():
    captimage = requests.get('http://ids.ynu.edu.cn/authserver/captcha.html', stream=True, allow_redirects=True)
    capimgsaved = open('testcap.jpg', 'wb')
    capimgsaved.write(captimage.content)
    capimgsaved.close()
    imgcapt = Image.open('testcap.jpg')
    optseccode = str(imgpreproc(imgcapt))
    optseccode = optseccode.replace(' ','')
    optseccode = optseccode.replace('><','X')
    print('After Process, Possible: '+ optseccode)
    corre = confirm_correct()
    if isinstance(corre,bool):
        newname = str(optseccode) + '.jpg'
        os.rename('testcap.jpg',newname)
    elif isinstance(corre, str):
        newname = corre + '.jpg'
        os.rename('testcap.jpg',newname)

if __name__ == '__main__':
    for i in range(100):
        main()
    print('Correct:' + str(correctence.count(1)) + '/100')


    # TEST RESULT:  70/100 CORRECT!