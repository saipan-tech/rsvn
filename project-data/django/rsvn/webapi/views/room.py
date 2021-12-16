from .common import *

class BldgViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Bldg.objects.all().order_by('name')
    serializer_class = BldgSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoomViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Room.objects.all().order_by('roominfo__number')
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset() 

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

        return queryset    


class RoomAllViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Room.objects.all().order_by('roominfo__number')
    serializer_class = RoomAllSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset() 

        if "rsvn" in self.request.GET :
            queryset = queryset.filter(rsvn__id=self.request.GET['rsvn'])


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

        return queryset    


class RoomChargeViewSet(viewsets.ModelViewSet):
    
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = RoomCharge.objects.all().order_by('date')
    serializer_class = RoomChargeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset() 

        if "rsvn" in self.request.GET :
            queryset = queryset.filter(room__rsvn__id=self.request.GET['rsvn'])
        
        if "future" in self.request.GET :
            queryset = queryset.filter( room__rsvn__dateOut__gt=self.request.GET['future'])

        if  "dateIn" in self.request.GET and "dateOut" in self.request.GET :
            dateIn = self.request.GET['dateIn']
            dateOut = self.request.GET['dateOut']
            if "exclude" in self.request.GET  :
                queryset = queryset.exclude(
                    Q(room__rsvn__dateIn__lte = dateIn)  & Q(room__rsvn__dateOut__gte = dateIn) |
                    Q(room__rsvn__dateIn__lte = dateOut) & Q(room__rsvn__dateOut__gte = dateIn) |
                    Q(room__rsvn__dateIn__lte = dateOut) & Q(room__rsvn__dateOut__gte =  dateOut) 
                    )
            elif "include" in self.request.GET :
                queryset = queryset.filter(
                    Q(room__rsvn__dateIn__lte = dateIn) & Q(room__rsvn__dateOut__gte = dateIn) |
                    Q(room__rsvn__dateIn__lte = dateOut) & Q(room__rsvn__dateOut__gte = dateIn) |
                    Q(room__rsvn__dateIn__lte = dateOut) & Q(room__rsvn__dateOut__gte =  dateOut) 
                    )


#------------------------------------------
class RoomDateScan(APIView):
#------------------------------------------
    
    def get(self,request,date, format=None)  :
        checkin = Room.objects.filter(rsvn__dateIn=date)
        checkout =Room.objects.filter(rsvn__dateOut=date)
        inhouse = Room.objects.filter(rsvn__dateIn__lt=date,rsvn__dateOut__gt=date)
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
        return Response({ 'checkin':s_checkin.data,'checkout':s_checkout.data,'inhouse':s_inhouse.data })        
