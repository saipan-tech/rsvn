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