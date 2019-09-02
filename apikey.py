#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

from datetime import datetime

from pytz import timezone

# semester sign

current_term = '2018-2019-2'

# hardcoded
bjtz = timezone('Asia/Shanghai')
sentryid = 'https://43b3b4ea4f724fda919fdfc7af178a25:d3ba0a16090041b592701abb106da138@sentry.io/297885'  # Don't modify

startday = input("When will the semester Begin? yyyy.mm.dd ")
sembegin = startday.split(".")

semester_start = datetime(int(sembegin[0]), int(sembegin[1]), int(sembegin[2]), 0, 0, 0,
                          tzinfo=bjtz)  # Semester starts at

# read from varenv when compiled into an exe
from getpass import getpass

ynu_ehell_name = input('Ehall Username:')  # Your EHALL SYSTEM Username
ynu_ehell_password = getpass('Password:')  # Your EHALL SYSTEM Password
mailacc = 'MAILTO:' + input('Your email:')  # Your email account
