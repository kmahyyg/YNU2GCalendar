#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

import os

from icalendar import *
from icalendar.prop import *
from pytz import timezone

from apikey import semester_start, mailacc

bjtz = timezone('Asia/Shanghai')


def init_cal():
    cal = Calendar()
    cal.add('attendee', mailacc)
    cal.add('prodid', '-//YNU2GCalendar//kmahyyg.xyz//')
    cal.add('version', '2.0')
    cal.add('dtstart', semester_start)
    return cal


def add_evnt(cal, evnt):
    cal.add_component(evnt)
    return cal


def crea_evnt(coursedic):
    evnt_summary = coursedic['summary']
    evnt_desc = coursedic['description']
    evnt_loca = coursedic['location']
    evnt_start = coursedic['start']['dateTime']
    evnt_stop = coursedic['stop']['dateTime']
    evnt = Event()
    evnt.add('summary', evnt_summary)
    evnt.add('dtstart', evnt_start)
    evnt.add('dtend', evnt_stop)
    evnt.add('dtstamp', datetime.now(tz=bjtz))
    evnt.add('description', evnt_desc)
    organizer = vCalAddress(mailacc)
    organizer.params['cn'] = vText('Patrick Young')
    organizer.params['ROLE'] = vText('REQ-PARTICIPANT')
    evnt.add('location', evnt_loca)
    alarm = Alarm()
    alarm.add("action", "DISPLAY")
    alarm['TRIGGER'] = vText('-PT30M')
    alarm.add("DESCRIPTION", evnt_desc)
    evnt.add_component(alarm)
    return evnt


def export2f(cal):
    directory = os.path.expanduser('~/Desktop/ynucal.ics')
    f = open(directory, 'wb')
    f.write(cal.to_ical())
    f.close()
    return 0
