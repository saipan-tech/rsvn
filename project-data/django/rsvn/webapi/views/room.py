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
