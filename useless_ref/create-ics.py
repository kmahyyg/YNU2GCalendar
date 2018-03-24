#!/usr/bin/env python3
# -*- encoding: utf-8 -*-


import os

from icalendar import *
from icalendar.prop import *
from pytz import timezone

bjtz = timezone('Asia/Shanghai')
semester_start = datetime(2009, 12, 1, 0, 0, 0, tzinfo=bjtz)
mailacc = 'MAILTO:kmahyygyyg@gmail.com'

cal = Calendar()

cal.add('attendee', mailacc)
cal.add('prodid', '-//YNU2GCalendar//kmahyyg.xyz//')
cal.add('version', '2.0')
cal.add('dtstart', semester_start)
evnt = Event()
evnt.add('summary', 'xxxxx cls')
evnt.add('dtstart', datetime(2010, 1, 1, 0, 0, 0, tzinfo=bjtz))
evnt.add('dtend', datetime(2010, 1, 1, 10, 0, 0, tzinfo=bjtz))
evnt.add('dtstamp', datetime.now(tz=bjtz))
evnt.add('description', 'defined text')
organizer = vCalAddress(mailacc)
organizer.params['cn'] = vText('Patrick Young')
organizer.params['ROLE'] = vText('REQ-PARTICIPANT')
evnt.add('location', 'denmark')
alarm = Alarm()
alarm.add("action", "DISPLAY")
popuptime = datetime(2010, 1, 1, 0, 0, 0, tzinfo=bjtz) - timedelta(minutes=30)
alarm['TRIGGER'] = vText('-PT30M')
alarm.add("DESCRIPTION", "xxxx At xxxx after xxx")
evnt.add_component(alarm)
cal.add_component(evnt)
directory = os.path.expanduser('~/Desktop/temp.ics')
f = open(directory, 'wb')
f.write(cal.to_ical())
f.close()
