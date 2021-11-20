from .common import *
from webapi.tools.datespan import *

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

class StatusLogViewSet(viewsets.ModelViewSet):
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



class RoomCalc(APIView):
    def get(self,request,roominfo_id,dateIn,dateOut, format=None)  :
        roominfo = Roominfo.objects.filter(id=roominfo_id)
        if not roominfo :
            return Response([])
        alias = roominfo[0].rateAlias
        dspan = Dspan(dateIn,dateOut)
        xarray = []
        for x in dspan.datestack() :
            dd = SeasonCalSerializer(SeasonCal.objects.get(date=x)).data
            dd['alias'] = alias
            dd['seasonrate'] = SeasonRateSerializer(SeasonRate.objects.get(rate__alias=alias,season__name=dd['season'])).data['amount']
            xarray.append(dd)
                    

        # create a date list
        # match seasoncal and season rate
        # send off
        

        return Response( xarray)        