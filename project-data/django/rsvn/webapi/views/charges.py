from .common import *


#===========================
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()
    permission_classes = [permissions.IsAuthenticated]
