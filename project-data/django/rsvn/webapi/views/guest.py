from .common import *


class GuestViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Guest.objects.all().order_by("lastname",'firstname','middlename')
    serializer_class = GuestSerializer
    permission_classes = [permissions.IsAuthenticated]
 
    def get_queryset(self):
        queryset = super().get_queryset() 

        if "query" in self.request.GET:
            queryset = queryset.filter(
                Q(lastname__icontains=self.request.GET['query']) |
                Q(middlename__icontains=self.request.GET['query']) |
                Q(firstname__icontains=self.request.GET['query']))
        return queryset

