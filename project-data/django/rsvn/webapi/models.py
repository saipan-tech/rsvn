from django.db import models
from .lists import * 
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User
from decimal import Decimal
#
# Create your models here.
#---------------------------------------------------------
class Staff (models.Model):
    user        =   models.ForeignKey(User,models.CASCADE)
    firstname	=	models.CharField(max_length=80)
    middlename  =   models.CharField(max_length=80, blank=True)
    lastname 	=	models.CharField(max_length=80)
    phone1 		=	models.CharField(max_length=20)
    phone2 		=	models.CharField(max_length=20, blank=True)
    address1 	=	models.CharField(max_length=120)
    address2 	=	models.CharField(max_length=120, blank=True)
    city 		= 	models.CharField(max_length=60)
    state  	    = 	models.CharField(max_length=60)
    country 	= 	models.CharField(max_length=60, blank=True)
    email 		= 	models.EmailField()

#---------------------------------------------------------
class Guest (models.Model):
    firstname	=	models.CharField(max_length=80)
    middlename  =   models.CharField(max_length=80, blank=True)
    lastname 	=	models.CharField(max_length=80)
    phone 		=	models.CharField(max_length=20, blank=True)
    address 	=	models.CharField(max_length=120)
    city 		= 	models.CharField(max_length=60)
    state  	    = 	models.CharField(max_length=60, blank=True)
    zipcode 	= 	models.CharField(max_length=15, blank=True)
    email 		= 	models.EmailField()
    idtype      =   models.CharField(max_length=60, blank=True)
    idnum       =   models.CharField(max_length=40, blank=True)
    idexpire    =   models.CharField(max_length=20, blank=True)
    birthday    =	models.CharField(max_length=20, blank=True)
    company     =	models.CharField(max_length=128, blank=True)
    title       =	models.CharField(max_length=128, blank=True)
    notes       =   models.TextField(blank=True)
    clerk		=   models.CharField(max_length=20, blank=True)
    created     =   models.DateTimeField(auto_now_add=True)
    modified    =   models.DateTimeField(auto_now=True) 
    
    @property
    def fullname(self):
        return f"{self.firstname} {self.middlename} {self.lastname}"

#--------------------------------------------------------------------
class Bldg (models.Model):
    name		=	models.CharField(max_length=80,unique=True)
    location	=	models.CharField(max_length=256, blank=True)
    descr		=	models.CharField(max_length=1024, blank=True)
    def __str__(self) :
        return f"{self.name} -- {self.location}"
#---------------------------------------------------------
# Amenities are Pet Friendly, Cable Service etc
#---------------------------------------------------------
class Amenity (models.Model):
    name        =  	models.CharField(max_length=80, unique=True)
    type        =  	models.CharField(max_length=20)
    descr       =  	models.CharField(max_length=1024, blank=True)
    icon        =  	models.CharField(max_length=256, blank=True)

    def __str__(self) :
        return f"{self.name} -- {self.type}"
#---------------------------------------------------------
class Dropdown (models.Model):
    name        =  	models.CharField(max_length=80)
    sequence    =   models.IntegerField(default=0)
    display     =  	models.CharField(max_length=80)
    value       =  	models.CharField(max_length=20)
    def __str__(self) :
        return f"{self.name} -- {self.display}"        
#---------------------------------------------------------
class Rate(models.Model):
    alias       =   models.CharField(max_length=250,unique=True)
    rateCategory=   models.CharField(max_length=512)
    rateName	=	models.CharField(max_length=512)
    rateType	=  	models.CharField(max_length=512, blank=True)
    rateClass   =  	models.CharField(max_length=512, blank=True)
    offSeason	= 	models.DecimalField(max_digits=12, decimal_places=2,default=Decimal('00.00'))
    lowSeason	= 	models.DecimalField(max_digits=12, decimal_places=2,default=Decimal('00.00'))
    highSeason	= 	models.DecimalField(max_digits=12, decimal_places=2,default=Decimal('00.00'))
    peakSeason	= 	models.DecimalField(max_digits=12, decimal_places=2,default=Decimal('00.00'))
    color       =  	models.CharField(max_length=40, default='white')
    descr		=	models.CharField(max_length=1028, blank=True)	
	
    def __str__(self):
        return(self.rateName)
#---------------------------------------------------------
class Roominfo (models.Model):
    bldg        =   models.ForeignKey(Bldg,models.CASCADE)
    rate        =   models.ForeignKey(Rate,models.CASCADE,related_name='rateOf')
    number  	=   models.CharField(max_length=20)
    floor       =   models.CharField(max_length=20, blank=True)
    style   	=   models.CharField(max_length=128, blank=True)
    name        =   models.CharField(max_length=512, blank=True)
    beds        =   models.CharField(max_length=128, blank=True)
    size        =  	models.CharField(max_length=20, blank=True)
    descr       =   models.TextField(blank=True)
    def __str__(self) :
        return f"{self.bldg.name} -- {self.number}"

#---------------------------------------------------------
class Rsvn (models.Model):
    primary     =    models.ForeignKey(Guest,models.CASCADE)
    guests      =    models.ManyToManyField(Guest, blank=True,related_name='guests')
    amenities   =    models.ManyToManyField(Amenity, blank=True,related_name='amenities')
    status		=	 models.CharField(max_length=13, default="New")
    confirm		=    models.CharField(max_length=20, blank=True)
    source  	=	 models.CharField(max_length=64)
    dateIn		=	 models.DateField()
    dateOut		=	 models.DateField()
    numrooms    =    models.IntegerField(default=1,validators = [ MinValueValidator(1) ])
    adult		=	 models.IntegerField(default=1,validators = [ MinValueValidator(1) ])
    child		=	 models.IntegerField(default=0,validators = [ MinValueValidator(0) ])
    infant		=	 models.IntegerField(default=0,validators = [ MinValueValidator(0) ])
    notes		=	models.TextField(blank=True)
    color       =  	models.CharField(max_length=40, default='white')
    clerk       =   models.CharField(max_length=80,default="FrontDesk")
    created     =   models.DateTimeField(auto_now_add=True)
    modified    =   models.DateTimeField(auto_now=True)
    def num_days (self):
        return  (self.dateOut - self.dateIn).days
    def __str__(self) :
        return f"{self.primary.firstname} {self.primary.lastname}  {self.dateIn}  {self.dateOut}"


#---------------------------------------------------------
class Service (models.Model):
	rsvn			= 	models.ForeignKey(Rsvn,on_delete=models.CASCADE)
	breakfast		=	models.BooleanField(default=False)
	lunch			=	models.BooleanField(default=False)
	dinner			=	models.BooleanField(default=False)
	from_airport	=	models.BooleanField(default=False)
	to_airport		=	models.BooleanField(default=False)
	dailymaid		=	models.BooleanField(default=False)
	mango			=	models.BooleanField(default=False)
	extrabed		=	models.BooleanField(default=False)
	crib			=	models.BooleanField(default=False)
	connect			=	models.BooleanField(default=False)
	earlyin			=	models.BooleanField(default=False)
	lateout			=	models.BooleanField(default=False)
	event			=	models.BooleanField(default=False)
#=================================================================================
class WorkFile(models.Model):
#=================================================================================
    file        =   models.FileField(blank=False,null=False)
    def __str__(self):
        return self.file.name



#---------------------------------------------------------
class TaxRate(models.Model):
    taxCategory = models.CharField(max_length=512)
    taxName 	=	models.CharField(max_length=512)
    taxType	    =  	models.CharField(max_length=512, blank=True)
    taxClass    =  	models.CharField(max_length=512, blank=True)
    taxAmount   = 	models.DecimalField(max_digits=12, decimal_places=2,default=Decimal('00.00'))
    descr		=	models.CharField(max_length=1028)	
	
    def __str__(self):
        return(self.taxName)        
#---------------------------------------------------------
class Charge(models.Model):
    rsvn        =   models.ForeignKey(Rsvn,models.CASCADE, related_name='rsvnCharge')
    item        =   models.CharField(max_length=512)
    date        =   models.DateField()
    descr       =   models.CharField(max_length=2048, blank=True)
    count      = 	models.IntegerField(default=1)
    unit    	= 	models.DecimalField(max_digits=12, decimal_places=2,default=Decimal('00.00'))
    clerk       =   models.CharField(max_length=80,default="FrontDesk")
    created     =   models.DateTimeField(auto_now_add=True)
    modified    =   models.DateTimeField(auto_now=True)
	
    @property
    def amount(self):
        return self.count * self.unit

#---------------------------------------------------------
class Room (models.Model):
    rsvn        =   models.ForeignKey(Rsvn,models.CASCADE, related_name='rsvnOf')
    roominfo 	=   models.ForeignKey(Roominfo,models.CASCADE, related_name='roominfoOf')
    rateCharge  =   models.DecimalField(max_digits=12, decimal_places=2,default=Decimal('00.00'))
    status      =   models.CharField(max_length=12, default="none")

    def __str__(self) :
        return f"{self.rsvn.primary.firstname} {self.rsvn.primary.lastname}  -- {self.roominfo.number}"