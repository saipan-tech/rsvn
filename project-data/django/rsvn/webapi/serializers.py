from django.contrib.auth.models import User, Group
from .models import *

from rest_framework import serializers

#---------------------------------------------------------
class WorkFileSerializer(serializers.ModelSerializer):
  class Meta:
    model= WorkFile
    fields = '__all__'
#---------------------------------------------------------
class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model= User
    exclude=['password']

#---------------------------------------------------------
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = [ 'name']


#---------------------------------------------------------
class StaffSerializer(serializers.ModelSerializer):

    class Meta:
        model= Staff
        fields = '__all__'
#---------------------------------------------------------
class StaffSerializerNoUser(serializers.ModelSerializer):
    class Meta:
        model= Staff
        exclude=['user']

#---------------------------------------------------------
class GuestSerializer(serializers.ModelSerializer):
    fullname = serializers.SerializerMethodField()
    class Meta:
        model= Guest
        fields = '__all__'

    def get_fullname(self, instance):
        return f'{instance.firstname} {instance.lastname}' 


#---------------------------------------------------------
class RsvnSerializer(serializers.ModelSerializer):
    class Meta:
        model= Rsvn
        fields = '__all__'
        depth = 1
#---------------------------------------------------------
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model= Room
        fields = '__all__'

#---------------------------------------------------------
class RoomChargeSerializer(serializers.ModelSerializer):
    class Meta:
        model= RoomCharge
        fields = '__all__'
        depth = 1

#---------------------------------------------------------
class RoomAllSerializer(serializers.ModelSerializer):
    class Meta:
        model= Room
        fields = '__all__'
        depth = 2

#---------------------------------------------------------
class RoomOneSerializer(serializers.ModelSerializer):
    class Meta:
        model= Room
        fields = '__all__'
        depth = 1

#---------------------------------------------------------
class RoominfoSerializer(serializers.ModelSerializer):
    class Meta:
        model= Roominfo
        fields = '__all__'


#--------------------------------------------------------------------
class BldgSerializer(serializers.ModelSerializer):
    class Meta:
        model= Bldg
        fields = '__all__'
  
#---------------------------------------------------------
class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model= Amenity
        fields = '__all__'
#---------------------------------------------------------
class DropdownSerializer(serializers.ModelSerializer):
    class Meta:
        model= Dropdown
        fields = '__all__'
#---------------------------------------------------------
class RateSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Rate
        fields = '__all__'
#---------------------------------------------------------
class TaxRateSerializer(serializers.ModelSerializer) :
    class Meta:
        model = TaxRate
        fields = '__all__'
        
        #---------------------------------------------------------
class ChargeSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Charge
        fields = ['id','rsvn','date','item','descr','count','unit','amount','clerk','created','modified']
        
        #---------------------------------------------------------
class PaymentSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Payment
        fields = '__all__'

class SeasonSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Season
        fields = '__all__'

class SeasonCalSerializer(serializers.ModelSerializer) :
    class Meta:
        model = SeasonCal
        fields = '__all__'
      
class StatusLogSerializer(serializers.ModelSerializer) :
    class Meta:
        model = StatusLog
        fields = '__all__'

class CalendarSerializer(serializers.ModelSerializer) :
    class Meta:
        model = Calendar
        fields = '__all__'

class RoomActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomAction
        fields = '__all__'
