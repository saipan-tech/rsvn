from .common import *
from webapi.tools.datespan import *
#------------------------------------------
class RoominfoViewSet(viewsets.ModelViewSet):
#------------------------------------------
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

#------------------------------------------
class RoomActionViewSet(viewsets.ModelViewSet):
#------------------------------------------
    """
    API endpoint works on the RoomAction records.
    """
    queryset = RoomAction.objects.all().order_by('-date','department','staff')
    serializer_class = RoomActionSerializer
    permission_classes = [permissions.IsAuthenticated]    
    
     
    def get_queryset(self):
        queryset = super().get_queryset() 
        if "department" in self.request.GET :
            queryset = queryset.filter(department=self.request.GET['department'])
        if "staff" in self.request.GET :
            queryset = queryset.filter(staff=self.request.GET['staff'])
        if "date" in self.request.GET :
            queryset = queryset.filter(dateAssign=self.request.GET['date'])

        return queryset    

#------------------------------------------
class RoomActionRoominfo(APIView):
#------------------------------------------
    def get_object(self,id):
        try:
            return RoomAction.objects.get(id=id)
        except model.DoesNotExist:
            raise Http404
    
    def get(self,request,id, format=None)  :
        action = self.get_object(id)
        serializer = RoominfoSerializer(action.roominfos.all(),many=True)
        return Response(serializer.data)        

    def post(self,request,id, format=None)  :
        action = self.get_object(id)
        roominfo = Roominfo.objects.get(id=request.data['id'])
        action.roominfos.add(roominfo)
        return Response(["POST",request.data])        

    def put(self,request,id, format=None)  :
        action = self.get_object(id)
        roominfo = Roominfo.objects.get(id=request.data['id'])
        action.roominfos.remove(roominfo)
        return Response(["PUT",request.data])        



#------------------------------------------
class RoomCalc(APIView):
#------------------------------------------
  
    def get(self,request,roominfo_id,dateIn,dateOut, format=None)  :
        roominfo = Roominfo.objects.filter(id=roominfo_id)
        if not roominfo :
            return Response([])
        alias = roominfo[0].rateAlias
        dspan = Dspan(dateIn,dateOut)
        xarray = []
        if request.user.is_authenticated :
            for x in dspan.datestack() :
                dd = SeasonCalSerializer(SeasonCal.objects.get(date=x)).data
                dd['alias'] = alias
      #          dd['seasonrate'] = SeasonRateSerializer(SeasonRate.objects.get(rate__alias=alias,season__name=dd['season'])).data['amount']
                xarray.append(dd)
                        

            # create a date list
            # match seasoncal and season rate
            # send off
        

        return Response( xarray)        







#------------------------------------------
class RsvnCalc(APIView):
#------------------------------------------
    

    def get(self,request,rsvnid, format=None)  :
        rooms = Room.objects.filter(rsvn__id=rsvnid)
        season = Season.objects.all()
        roomArray = []
        rate = Rate()
        if request.user.is_authenticated :
            for rms in rooms :
                alias = rms.roominfo.rateAlias
                try:
                    rate = Rate.objects.get(alias=alias)
                except:
                    raise Http404                    
                dspan = Dspan(rms.rsvn.dateIn.isoformat(),rms.rsvn.dateOut.isoformat())            
                xarray = []


                for x in dspan.datestack() :
                    dd = SeasonCalSerializer(SeasonCal.objects.get(date=x)).data
                    rc = RoomCharge.objects.filter(date=x,room=rms)
                    if rc :
                        dd['amount'] = rc[0].amount     
                        dd['seasonnow'] = season.get(name=dd['season']).discount * rate.rack
                        dd['signal']= 'RoomCharge'
                        
                    else :

                        dd['amount'] = season.get(name=dd['season']).discount * rate.rack
                        dd['seasonnow'] = dd["amount"]
                        dd['signal'] = "Season Charge"
                        rc = RoomCharge()
                        rc.date=x
                        rc.amount = dd['amount']
                        rc.room = rms
                        rc.save()
                    dd['delta'] = dd['seasonnow'] - dd['amount']  
                    dd['alias'] = alias
                    
                    xarray.append(dd)
                roomArray.append({'days':xarray, 'roominfo':RoominfoSerializer(rms.roominfo).data, 'room':RoomSerializer(rms).data})        

            # create a date list
        # match seasoncal and season rate
        # send off
        

        return Response( roomArray)        

        