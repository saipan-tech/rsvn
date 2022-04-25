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


    def get_queryset(self):
        queryset = super().get_queryset() 

        if "rsvn" in self.request.GET :
            queryset = queryset.filter(rsvn__id=self.request.GET['rsvn'])

        return queryset    
#===========================
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()
    permission_classes = [permissions.IsAuthenticated]



    def create(self,request):
        rsvn = Rsvn.objects.get(id=int(request.data['rsvn']))
        drec = request.data 
        payment = Payment()
        payment.rsvn = rsvn  
        serializer = PaymentSerializer(payment,data=drec)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


    def get_queryset(self):
        queryset = super().get_queryset() 

        if "rsvn" in self.request.GET :
            queryset = queryset.filter(rsvn__id=self.request.GET['rsvn'])

        return queryset    


#------------------------------------------
class RoomChargeViewSet(viewsets.ModelViewSet):
#------------------------------------------
    """
    API endpoint for viewing RoomCharges
    """
    queryset = RoomCharge.objects.all().order_by('date')
    serializer_class = RoomChargeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset() 

        if "roominfo" in self.request.GET:
            queryset = queryset.filter(room__roominfo__id=self.request.GET['roominfo'])

        if "rsvn" in self.request.GET :
            queryset = queryset.filter(room__rsvn__id=self.request.GET['rsvn'])

        if "room" in self.request.GET :
            queryset = queryset.filter(room__id=self.request.GET['room'])
        
        if "future" in self.request.GET :
            queryset = queryset.filter( room__rsvn__dateOut__gt=self.request.GET['future'])

        if  "dateIn" in self.request.GET and "dateOut" in self.request.GET :
            dateIn = self.request.GET['dateIn']
            dateOut = self.request.GET['dateOut']
            if "exclude" in self.request.GET :
                queryset = queryset.exclude(
                    Q(room__rsvn__dateIn__lte = dateIn)  & Q(room__rsvn__dateOut__gte = dateIn) |
                    Q(room__rsvn__dateIn__lte = dateOut) & Q(room__rsvn__dateOut__gte = dateIn) |
                    Q(room__rsvn__dateIn__lte = dateOut) & Q(room__rsvn__dateOut__gte =  dateOut) 
                    )
            elif "include" in self.request.GET :
                queryset = queryset.filter(
                    Q(room__rsvn__dateIn__lte = dateIn) & Q(room__rsvn__dateOut__gte = dateIn) |
                    Q(room__rsvn__dateIn__lte = dateOut) & Q(room__rsvn__dateOut__gte = dateIn) |
                    Q(room__rsvn__dateIn__lte = dateOut) & Q(room__rsvn__dateOut__gte =  dateOut) 
                    )
        return queryset
        