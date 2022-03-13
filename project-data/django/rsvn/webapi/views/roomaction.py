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
          
            queryset = queryset.filter(Q(date=Today())| Q(continuous=True))
        if "all" in self.request.GET:
            self.serializer_class = RoomActionAllSerializer
        return queryset    

