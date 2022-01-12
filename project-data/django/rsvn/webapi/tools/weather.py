import json
from django.shortcuts import render,redirect
from webapi.models import *
def weather_admin(request) :
    result = {}
    return  render(request,'weather.html',context=result)


def load_cities() :
    Cities.objects.all().delete()

    with open('/usr/src/app/django/rsvn/media/city.list.json', 'r') as myfile:
        data=myfile.read()

    # parse file
    obj = json.loads(data)
    for x in obj :
        z = Cities()
        z.iid = x['id']
        z.name = x['name']
        z.state = x['state']
        z.country = x['country']
        z.lon = x['coord']['lon']
        z.lat = x['coord']['lat']
        try:
            z.save()
        except:
            print(f"Duplicate {z.name} {z.state}")
    return 