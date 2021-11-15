from .common import *
#===========================
class CalendarViewSet(viewsets.ModelViewSet):
    serializer_class = CalendarSerializer
    queryset = Calendar.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        queryset = super().get_queryset() 
        if "year" in self.request.GET :
            queryset = queryset.filter(date__year=int(self.request.GET['year'])).order_by('date')
        if "month" in self.request.GET :
            queryset = queryset.filter(date__month=int(self.request.GET['month'])).order_by('date')
        return queryset
