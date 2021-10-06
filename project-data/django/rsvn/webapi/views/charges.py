from .common import *

#===========================
class ChargeViewSet(viewsets.ModelViewSet):
    serializer_class = ChargeSerializer
    queryset = Charge.objects.all()
    permission_classes = [permissions.IsAuthenticated]



    def create(self,request):
        rsvn = Rsvn.objects.get(id=int(request.data['rsvn']))
        drec = request.data 
        charge = Charge()
        charge.rsvn = rsvn  
        serializer = ChargeSerializer(charge,data=drec)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)