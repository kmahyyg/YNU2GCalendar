![AGPL](https://img.shields.io/github/license/kmahyyg/YNU2GCalendar.svg)
![Python](https://img.shields.io/badge/Python-3.5%2B-blue.svg)

# Disclaimer

This program should **NOT** be used for any illegal purpose. All source code must be used under AGPL-V3.
Your sensitive data will **NOT** be stored in our server after you finished all your operations.
We will not leak any of your data to any third-party service provider.

# YNU2GCalendar with ICS

Use iCalendar format(RFC5545) to convert YNU Classes to Google Calendar to make it much more easier for students managing class.

# Installation and Deployment

Clone this repo to wherever you want first.
Don't forget to modify apikey.py.example first.

My captcha recognition feature is using Tesseract OCR by Google Inc.
It works smoothly on Linux, if you are using Windows and still want to experience this feature, check here first:
https://github.com/tesseract-ocr/tesseract/wiki#windows

> **If you want to have a more detailed support, please don't modify ```sentryid``` in apikey.py.example**

## Run and Enjoy

Linux:

```bash
$ git clone https://github.com/kmahyyg/ynu2gcalendar.git
$ sudo pip install -r ./requirements.txt
$ sudo apt install tesseract-ocr
$ sudo apt install libtesseract-dev
$ cp ./apikey.py.example ./apikey.py
$ vi ./apikey.py
$ python3 ./client.py
```

After that, you should copy&paste the ynucal.ics file on your desktop folder to your phone.
Then you can import this file to whichever calendar software you want.

If you're using **Windows**, just clone this repo and then run `python -m pip install -r requirements.txt` to install
dependencies and after that, give the correct value to `apikey.py.example` and then rename it to `apikey.py`,
finally run `client.py` .

# MIUI User Please read this

Because the system calendar and its backend is modified heavily by MIUI, the *.ics file cannot import even you install a
Google Calendar. The solution is create a new shared local account on your phone and download another app to parse this
file. The app you may need is here: [Play Store Link](https://play.google.com/store/apps/details?id=tk.drlue.icalimportexport)

# PR Welcome

Need someone to convert it into a web service. (Frontend + Backend)

# Ehell System

Because learning is going to more informative. Our school finally decided to selectively migrate to new system.
This system is written by WisEDU Co.,Ltd with an incredibly low-extensible framework and user-unfriendly interface.

# Idea

Thanks to the future of human, Google provided a powerful calendar.
As it always do, cooperating with my Pixel, It provided a useful and efficient notification and GTD system.

Without any connection to the world, you can still use this package.

Using At-A-Glance(C) Feature of Google Pixel Launcher will help you improve your productivity.
The default event notification is Pop-up Notification at 30 minutes before it happened.

Captcha auto recognition is still an **experimental feature**. It relies on Google's [tesseract](https://github.com/tesseract-ocr/tesseract/wiki)
and also relies on ```xv``` or ```ImageMagick```.

# License

Licensed under AGPL V3.0

# Issues requirements

LOGCAT OR GTFO!

Provide all of your logs and submit it via Issues. If the file is too large(or you cannot identify which is related one),
please SHARE YOUR LOG via [Pastebin](http://pastebin.ubuntu.com) or [Hastebin](http://hastebin.com).
 
If you don't follow those rules and Issue template, your issue will get **no response and closed directly**.
I will **NOT** receive(also reply) any request via any IM or Email.
