from django.contrib import admin
from .models import * 
# Register your models here.
admin.site.register(Rsvn)
admin.site.register(Guest)
admin.site.register(Staff)
admin.site.register(Room)
admin.site.register(Amenity)
admin.site.register(RoomAction)
admin.site.register(StatusLog)

