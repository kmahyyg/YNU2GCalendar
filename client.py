#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

# The client side is responsible for their class information and oauth authorization code

from fuckehell import *
from helljson_proc import *
from icsgen import *

import logging
# from apikey import sentryid
# import sentry_sdk
# from sentry_sdk.integrations import excepthook
# from sentry_sdk.integrations.logging import LoggingIntegration
# sentry_logging = LoggingIntegration(
#     level=logging.INFO,        # Capture debug and above as breadcrumbs
#     event_level=logging.ERROR  # Send errors as events
# )
# sentry_sdk.init(sentryid, integrations=[excepthook.ExcepthookIntegration(always_run=True), sentry_logging])


logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(name)s | %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def main():
    greeting = \
        '''
        Welcome to YNU2GCalendar. It's brought to you by @kmahyyg.
        You must setup apikey.py first according to README.
        '''
    print(greeting)
    print("PLEASE READ README.md first!!!!!!")
    input("\n Press any key to continue")
    ehall_ckie = getcookie()
    ynucal = init_cal()
    print("Ehall cookies emulate successfully finished!")
    totalweek = input("Please input the total weeks in this semester: ")
    totalweek = int(totalweek)
    for i in range(1, totalweek + 1):
        cls = getclassjson(ehall_ckie, i)
        allcls = cls['rows']
        print('Classes in Week ' + str(i) + ' are gotten.')
        try:
            for j in allcls:
                evntresc = generate_event(j, i)
                evntical = crea_evnt(evntresc)
                ynucal = add_evnt(ynucal, evntical)
        except:
            raise OSError("You may encounter a problem due to unstable network connection in YNU, try again later.")
    export2f(ynucal)
    print('Export successfully finished.')
    return 0


if __name__ == '__main__':
    print('Please read this disclaimer first: https://github.com/kmahyyg/YNU2GCalendar#disclaimer')
    choice = input("Do you accept it? (Y/N)")
    if choice.upper() == 'Y':
        main()
    else:
        print('See you!')
