from .common import *


#===========================
class RateViewSet(viewsets.ModelViewSet):
    serializer_class = RateSerializer
    queryset = Rate.objects.all()
    permission_classes = [permissions.IsAuthenticated]


#===========================
class TaxRateViewSet(viewsets.ModelViewSet):
    serializer_class = TaxRateSerializer
    queryset = TaxRate.objects.all()
    permission_classes = [permissions.IsAuthenticated]

#===========================
class SeasonViewSet(viewsets.ModelViewSet):
    serializer_class = SeasonSerializer
    queryset = Season.objects.all()
    permission_classes = [permissions.IsAuthenticated]

#===========================
class SeasonRateViewSet(viewsets.ModelViewSet):
    serializer_class = SeasonRateSerializer
    queryset = SeasonRate.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        queryset = super().get_queryset() 
        if "alias" in self.request.GET :
            queryset = queryset.filter(rate__alias=self.request.GET['alias'])
        if "rate" in self.request.GET :
            queryset = queryset.filter(rate__id=self.request.GET['rate'])
        if "season" in self.request.GET :
            queryset = queryset.filter(season__id=self.request.GET['season'])
        return queryset
    def create(self,request):

        season = Season.objects.get(id=int(request.data['season']))
        rate = Rate.objects.get(id=int(request.data['rate']))
        seasonrate = SeasonRate()
        seasonrate.season = season
        seasonrate.rate = rate
        serializer = SeasonRateSerializer(seasonrate,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
#===========================
class SeasonRateAllViewSet(viewsets.ModelViewSet):
    serializer_class = SeasonRateAllSerializer
    queryset = SeasonRate.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        queryset = super().get_queryset() 
        if "alias" in self.request.GET :
            queryset = queryset.filter(rate__alias=self.request.GET['alias'])
        if "rate" in self.request.GET :
            queryset = queryset.filter(rate__id=self.request.GET['rate'])
        if "season" in self.request.GET :
            queryset = queryset.filter(season__id=self.request.GET['season'])
        return queryset
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
            
        return queryset
