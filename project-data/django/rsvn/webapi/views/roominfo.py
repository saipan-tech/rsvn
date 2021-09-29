from .common import *

class RoominfoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Roominfo.objects.all().order_by('number')
    serializer_class = RoominfoSerializer
    permission_classes = [permissions.IsAuthenticated]    
    
    
    
    def get_queryset(self):
        queryset = super().get_queryset() 
        if "rsvn" in self.request.GET :
            queryset = queryset.filter(roominfoOf__rsvn__id=self.request.GET['rsvn'])

        if "bldgid" in self.request.GET :
            queryset = queryset.filter(bldg__id=self.request.GET['bldgid'])
        
        if  "dateIn" in self.request.GET and "dateOut" in self.request.GET :
            dateIn = self.request.GET['dateIn']
            dateOut = self.request.GET['dateOut']
            if "exclude" in self.request.GET  :
                queryset = queryset.exclude(
                    Q(roominfoOf__rsvn__dateIn__lte = dateIn) & Q(roominfoOf__rsvn__dateOut__gte = dateIn) |
                    Q(roominfoOf__rsvn__dateIn__lte = dateOut) & Q(roominfoOf__rsvn__dateOut__gte = dateIn) |
                    Q(roominfoOf__rsvn__dateIn__lte = dateOut) & Q(roominfoOf__rsvn__dateOut__gte =  dateOut) 
                    )
            elif "include" in self.request.GET :
                queryset = queryset.filter(
                    Q(roominfoOf__rsvn__dateIn__lte = dateIn) & Q(roominfoOf__rsvn__dateOut__gte = dateIn) |
                    Q(roominfoOf__rsvn__dateIn__lte = dateOut) & Q(roominfoOf__rsvn__dateOut__gte = dateIn) |
                    Q(roominfoOf__rsvn__dateIn__lte = dateOut) & Q(roominfoOf__rsvn__dateOut__gte =  dateOut) 
                    )
        return queryset    

