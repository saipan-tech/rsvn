from django.shortcuts import render

# Create your views here.

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