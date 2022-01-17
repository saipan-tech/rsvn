from .common import *

#------------------------------------------
class BldgViewSet(viewsets.ModelViewSet):
#------------------------------------------
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Bldg.objects.all().order_by('name')
    serializer_class = BldgSerializer
    permission_classes = [permissions.IsAuthenticated]
#------------------------------------------
class RoomViewSet(viewsets.ModelViewSet):
#------------------------------------------
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Room.objects.all().order_by('roominfo__bldg__name','roominfo__number')
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        today = TODAY 
        tomorrow = TODAY - timedelta(days=1)
        queryset = super().get_queryset() 
        if "active" in self.request.GET :
            queryset = queryset.filter(rsvn__dateIn__lte = today, rsvn__dateOut__gte = TODAY )
        if "rsvn" in self.request.GET :
            queryset = queryset.filter(rsvn__id=self.request.GET['rsvn'])
        
        if "future" in self.request.GET :
            queryset = queryset.filter( rsvn__dateOut__gt=self.request.GET['future'])

        if  "dateIn" in self.request.GET and "dateOut" in self.request.GET :
            dateIn = self.request.GET['dateIn']
            dateOut = self.request.GET['dateOut']
            if "exclude" in self.request.GET  :
                queryset = queryset.exclude(
                    Q(rsvn__dateIn__lte = dateIn)  & Q(rsvn__dateOut__gte = dateIn) |
                    Q(rsvn__dateIn__lte = dateOut) & Q(rsvn__dateOut__gte = dateIn) |
                    Q(rsvn__dateIn__lte = dateOut) & Q(rsvn__dateOut__gte =  dateOut) 
                    )
            elif "include" in self.request.GET :
                queryset = queryset.filter(
                    Q(rsvn__dateIn__lte = dateIn) & Q(rsvn__dateOut__gte = dateIn) |
                    Q(rsvn__dateIn__lte = dateOut) & Q(rsvn__dateOut__gte = dateIn) |
                    Q(rsvn__dateIn__lte = dateOut) & Q(rsvn__dateOut__gte =  dateOut) 

                    )
        if "all" in self.request.GET :
            self.serializer_class = RoomAllSerializer
            
        return queryset    

#------------------------------------------
class RoomDateScan(APIView):
#------------------------------------------
    '''
        For viewing rooms from checkin checkout and inhouse 
    '''  
    def get(self,request,date, format=None)  :
        listing = []
        room = Room.objects.all().order_by('roominfo__bldg__name','roominfo__number')
        checkin = room.filter(rsvn__dateIn=date)
        checkout =room.filter(rsvn__dateOut=date)
        inhouse = room.filter(rsvn__dateIn__lt=date,rsvn__dateOut__gt=date)
        if "all" in request.GET :
            s_checkin = RoomAllSerializer(checkin,many=True)
            s_checkout = RoomAllSerializer(checkout,many=True)
            s_inhouse = RoomAllSerializer(inhouse,many=True)
        elif "one" in request.GET:
            s_checkin = RoomOneSerializer(checkin,many=True)
            s_checkout = RoomOneSerializer(checkout,many=True)
            s_inhouse = RoomOneSerializer(inhouse,many=True)
        else:
            s_checkin = RoomSerializer(checkin,many=True)
            s_checkout = RoomSerializer(checkout,many=True)
            s_inhouse = RoomSerializer(inhouse,many=True)

        return Response({ 'checkin':s_checkin.data,'checkout':s_checkout.data,'inhouse':s_inhouse.data})        


#------------------------------------------
class BldgRoom(APIView):
#------------------------------------------
    def get(self,request, format=None)  :
        roominfo = Roominfo.objects.all()
        bldgs = Bldg.objects.all().order_by('name')
        result = []
        for b in bldgs :
            r = roominfo.filter(bldg__id=b.id).order_by('number')
            result.append({'bldg':BldgSerializer(b).data,'rooms':RoominfoSerializer(r,many=True).data})
        return Response(result)    
#------------------------------------------
class RoomClear(APIView) : 
#------------------------------------------
    def get(self,request, format=None)  :
        rooms = Room.objects.filter(status='checkin',rsvn__dateOut__lt=TODAY)
        for r in rooms:
            ri =  Roominfo.objects.get(id=r.roominfo.id)
            ri.status = 'dirty'
            ri.check = False
            ri.save()
            r.status = 'checkout'
            r.save()
        return Response(RoomSerializer(rooms,many=True).data)    
    