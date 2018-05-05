#!/usr/bin/env python3
# -*- encoding:utf-8 -*-

import pytesseract

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