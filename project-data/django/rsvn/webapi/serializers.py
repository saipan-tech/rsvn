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
    fields = [ 'username', 'email', 'groups']

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
class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model= Guest
        fields = '__all__'


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
class RoomAllSerializer(serializers.ModelSerializer):
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
