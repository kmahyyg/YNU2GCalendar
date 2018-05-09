#!/usr/bin/env python3
# -*- encoding:utf-8 -*-

from PIL import Image
import pytesseract
import sys

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


def captcha_recg(imgcapt):
    optseccode = str(imgpreproc(imgcapt))
    optseccode = optseccode.replace(' ','')
    optseccode = optseccode.replace('><','X')
    return optseccode


def getcaptcha(sesslog):
    captimage = sesslog.get('http://ids.ynu.edu.cn/authserver/captcha.html', stream=True, allow_redirects=True)
    autoornot = input("Do you want to use captcha recognition feature [EXPERIMENTAL]? (Y/N)")
    capimgsaved = open('tmpcapt.jpg', 'wb')
    capimgsaved.write(captimage.content)
    capimgsaved.close()
    im = Image.open('tmpcapt.jpg')
    if autoornot == 'N':
        im.show()
        mancapt = input("Input the captcha here: ")
        return mancapt
    elif autoornot == 'Y':
        if sys.platform == 'win32':
            print("Currently, this feature is **NOT STABLE AND NOT TESTED** on Windows.")
            print('See https://github.com/tesseract-ocr/tesseract/wiki#windows to install dependency first.')
            win_confirm = input("Do you still want to continue and installed the dependency in need? (Y/N)")
            if win_confirm == 'Y':
                mancapt = captcha_recg(im)
                ask4user = input("Correct?(Y/N) The captcha read by machine is: " + str(mancapt))
                if ask4user == 'N':
                    ask4user = input('Input the correct one here: ')
                    return ask4user
            else:
                mancapt = input("Input the captcha here: ")
            return mancapt
        else:
            mancapt = captcha_recg(im)
            ask4user = input("Correct?(Y/N) The captcha read by machine is: " + str(mancapt))
            if ask4user == 'N':
                ask4user = input('Input the correct one here: ')
                return ask4user
            else:
                return mancapt
    else:
        print("Illegal input!")
        raise NotImplementedError