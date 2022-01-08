from django.shortcuts import render,redirect

# Create your views here.
import requests
import re
import csv
import os
from django.contrib.auth.models import User, Group
from rest_framework import viewsets,filters
from rest_framework import permissions
from webapi.serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from webapi.models import *
from rest_framework.decorators import action
from django.http import Http404
from django.db.models import Q
from rest_framework.parsers import FileUploadParser
from rest_framework import status
from datetime import datetime, date, time, timezone,timedelta
import os, binascii
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import PermissionRequiredMixin, LoginRequiredMixin
from webapi.tools.mailtools import *


import pytz
portland_tz = pytz.timezone("America/Los_Angeles")
TODAY = datetime.datetime.now().astimezone(portland_tz)
TOMORROW = datetime.datetime.now().astimezone(portland_tz)+timedelta(days=1)
YESTERDAY = datetime.datetime.now().astimezone(portland_tz)+timedelta(days=-1)