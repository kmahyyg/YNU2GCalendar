#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

from raven import Client

from .apikey import sentryid

client = Client(sentryid)


def sendlog_sent():
    client.capture_exceptions()


def sendlog_my(msg):
    client.captureMessage(msg)
