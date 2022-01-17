from .common import *
from webapi.tools.datespan import *
#------------------------------------------
class RoominfoViewSet(viewsets.ModelViewSet):
#------------------------------------------
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Roominfo.objects.all().order_by('bldg__name','number')
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
                    Q(roominfoOf__rsvn__dateIn__lte = dateIn) & Q(roominfoOf__rsvn__dateOut__gt = dateIn) |
                    Q(roominfoOf__rsvn__dateIn__lte = dateOut) & Q(roominfoOf__rsvn__dateOut__gt = dateIn) |
                    Q(roominfoOf__rsvn__dateIn__lte = dateOut) & Q(roominfoOf__rsvn__dateOut__gt =  dateOut) 
                    )
            elif "include" in self.request.GET :
                queryset = queryset.filter(
                    Q(roominfoOf__rsvn__dateIn__lte = dateIn) & Q(roominfoOf__rsvn__dateOut__gte = dateIn) |
                    Q(roominfoOf__rsvn__dateIn__lte = dateOut) & Q(roominfoOf__rsvn__dateOut__gte = dateIn) |
                    Q(roominfoOf__rsvn__dateIn__lte = dateOut) & Q(roominfoOf__rsvn__dateOut__gte =  dateOut) 
                    )
        if "all" in self.request.GET :
            self.serializer_class = RoominfoAllSerializer



        return queryset    

#------------------------------------------
class StatusLogViewSet(viewsets.ModelViewSet):
#------------------------------------------
    """
    API endpoint that allows logs to be viewed.
    """
    queryset = StatusLog.objects.all().order_by('-created')
    serializer_class = StatusLogSerializer
    permission_classes = [permissions.IsAuthenticated]    
    
     
    def get_queryset(self):
        queryset = super().get_queryset() 
        if "roominfo" in self.request.GET :
            queryset = queryset.filter(roominfo__id=self.request.GET['roominfo'])

        return queryset    
