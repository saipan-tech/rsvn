from .common import *


#===========================
class RateViewSet(viewsets.ModelViewSet):
    serializer_class = RateSerializer
    queryset = Rate.objects.all().order_by('alias')
    permission_classes = [permissions.IsAuthenticated]


#===========================
class TaxRateViewSet(viewsets.ModelViewSet):
    serializer_class = TaxRateSerializer
    queryset = TaxRate.objects.all()
    permission_classes = [permissions.IsAuthenticated]

#===========================
class SeasonViewSet(viewsets.ModelViewSet):
    serializer_class = SeasonSerializer
    queryset = Season.objects.all().order_by('discount')
    permission_classes = [permissions.IsAuthenticated]


#===========================
class SeasonCalViewSet(viewsets.ModelViewSet):
    serializer_class = SeasonCalSerializer
    queryset = SeasonCal.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        queryset = super().get_queryset() 
        if "year" in self.request.GET :
            queryset = queryset.filter(date__year=int(self.request.GET['year'])).order_by('date')
        if "date" in self.request.GET :
            queryset = queryset.filter(date=self.request.GET['date'])
        if "dateStart" in self.request.GET and "dateEnd" in self.request.GET :
            queryset = queryset.filter(date__range=(self.request.GET['dateStart'],self.request.GET['dateEnd']))
        return queryset
