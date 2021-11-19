from .common import *
#===========================
class CalendarViewSet(viewsets.ModelViewSet):
    serializer_class = CalendarSerializer
    queryset = Calendar.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        queryset = super().get_queryset() 
        if "category" in self.request.GET :
            queryset = queryset.filter(category=self.request.GET['category']).order_by('date')
        if "year" in self.request.GET :
            queryset = queryset.filter(date__year=int(self.request.GET['year'])).order_by('date')
        if "month" in self.request.GET :
            queryset = queryset.filter(date__month=int(self.request.GET['month'])).order_by('date')
        if "name" in self.request.GET  and  "date" in self.request.GET :
            queryset = queryset.filter(date=self.request.GET['date'],name=self.request.GET['name']).order_by('date')

        return queryset

