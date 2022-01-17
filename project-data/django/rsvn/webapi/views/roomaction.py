from .common import *


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
            queryset = queryset.filter(staff_id=self.request.GET['staff'])
        if "username" in self.request.GET :
            queryset = queryset.filter(staff__username=self.request.GET['username'])
        if "date" in self.request.GET :
            queryset = queryset.filter(dateAssign=self.request.GET['date'])
        if "today" in self.request.GET :
            today= date.today()
            queryset = queryset.filter(Q(date=today)| Q(continuous=True))
        if "all" in self.request.GET:
            self.serializer_class = RoomActionAllSerializer
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
        serializer = RoominfoSerializer(action.roominfos.all().order_by('bldg','number'),many=True)
        return Response(serializer.data)        

    def post(self,request,id, format=None)  :
        action = self.get_object(id)
        roominfo = Roominfo.objects.get(id=request.data['id'])
        action.roominfos.add(roominfo)
        return Response(request.data)        

    def put(self,request,id, format=None)  :
        action = self.get_object(id)
        roominfo = Roominfo.objects.get(id=request.data['id'])
        action.roominfos.remove(roominfo)
        return Response(request.data)        

