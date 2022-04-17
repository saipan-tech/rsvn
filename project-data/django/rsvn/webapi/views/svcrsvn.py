from .common import *

#------------------------------------------
class SvcRsvnViewSet(viewsets.ModelViewSet):
#------------------------------------------
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = SvcRsvn.objects.all().order_by('dateIn')
    serializer_class = SvcRsvnSerializer
    permission_classes = [permissions.IsAuthenticated]
#------------------------------------------

