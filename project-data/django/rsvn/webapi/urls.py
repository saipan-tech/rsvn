"""rsvn URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from rest_framework.authtoken import views as tkn_views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers

from django.views.decorators.csrf import ensure_csrf_cookie
from webapi.views.users import *
from webapi.views.room import *
from webapi.views.roominfo import *
from webapi.views.rsvn import *
from webapi.views.system import *
from webapi.views.guest import *
from webapi.views.rates import *
from webapi.views.charges import *

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'bldg', BldgViewSet)
router.register(r'room', RoomViewSet)
router.register(r'roomall', RoomAllViewSet)
router.register(r'roominfo', RoominfoViewSet)
router.register(r'amenity',AmenityViewSet)
router.register(r'rsvn',RsvnViewSet)
router.register(r'rsvnguest',RsvnGuestViewSet)
router.register(r'guest',GuestViewSet)
router.register(r'dropdown',DropdownViewSet)
router.register(r'rate',RateViewSet)
router.register(r'taxrate',TaxRateViewSet)
router.register(r'charge',ChargeViewSet)
router.register(r'payment',PaymentViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.

urlpatterns = [
    path('', include(router.urls)),
    path('droplist/<name>/',DropListView.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('module/<rsvnid>/<mod>/<modid>/',RsvnModuleView.as_view()),
    path('search/',SearchView.as_view()),
    path('session/',Session.as_view()),
    path('filein/',WorkFileView.as_view()),
    path('rsvntest/<id>/',RsvnTestView.as_view())
]
