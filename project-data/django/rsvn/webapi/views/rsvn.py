from .common import *

def checkRsvn(rsvn) :
    res = []
    rooms = Room.objects.filter(
        Q(rsvn__dateIn__lte = rsvn.dateIn) & Q(rsvn__dateOut__gte = rsvn.dateIn) |
        Q(rsvn__dateIn__lte = rsvn.dateOut) & Q(rsvn__dateOut__gte = rsvn.dateIn) |
        Q(rsvn__dateIn__lte = rsvn.dateOut) & Q(rsvn__dateOut__gte =  rsvn.dateOut) 
        )
    rooms = rooms.exclude(rsvn__id=rsvn.id)
    myrooms = Room.objects.filter(rsvn__id = rsvn.id)

    for r in myrooms :
     
        if rooms.filter(roominfo__id=int(r.roominfo.id)) :
            res.append(r.roominfo.number)
    


    # we now have all rooms for that time period minus ours.
    # let's see if we can find the desired room already spoken for
    return (RoomSerializer(rooms,many=True).data,RoomSerializer(myrooms,many=True).data ,res)

#===========================
class AmenityViewSet(viewsets.ModelViewSet):
    serializer_class = AmenitySerializer
    queryset = Amenity.objects.all()
    permission_classes = [permissions.IsAuthenticated]
#===========================
class RsvnTestView(APIView) :
    def get_object(self,id):
        try:
            return Rsvn.objects.get(id=id)
        except model.DoesNotExist:
            raise Http404
    
    def get(self, request,id,format=None):
        rsvn = self.get_object(id)
        return Response(checkRsvn(rsvn))

#===========================
class RsvnViewSet(viewsets.ModelViewSet):
    serializer_class = RsvnSerializer
    queryset = Rsvn.objects.all()
    permission_classes = [permissions.IsAuthenticated]

   
    def get_queryset(self):
        queryset = super().get_queryset() 
        
        if "checkin" in self.request.GET :
            queryset = queryset.filter( dateIn=self.request.GET['checkin'])

        if "checkout" in self.request.GET :
            queryset = queryset.filter( dateOut=self.request.GET['checkout'])

        if  "dateIn" in self.request.GET and "dateOut" in self.request.GET :
            dateIn = self.request.GET['dateIn']
            dateOut = self.request.GET['dateOut']
            if "exclude" in self.request.GET  :
                queryset = RsvnTestView
            elif "include" in self.request.GET :
                queryset = queryset.filter(
                    Q(dateIn__lte = dateIn) & Q(dateOut__gte = dateIn) |
                    Q(dateIn__lte = dateOut) & Q(dateOut__gte = dateIn) |
                    Q(dateIn__lte = dateOut) & Q(dateOut__gte =  dateOut) 
                    )

        return queryset    

    def create(self,request):
        guest = Guest.objects.get(id=int(request.data['primary']))
        drec = request.data 
        rsvn = Rsvn()
        rsvn.primary = guest  
        serializer = RsvnSerializer(rsvn,data=drec)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    def destroy(self,request,pk=None):
        rsvn = self.get_object()
        if not Room.objects.filter(rsvn__id=rsvn.id) :
            rsvn.delete()

        return Response(["deleted"])

#===========================
class RsvnGuestViewSet(viewsets.ModelViewSet):
    serializer_class = RsvnSerializer
    queryset = Rsvn.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self,request,pk=None) :
        rsvn = Rsvn.objects.filter(primary__id=pk)
        serializer = RsvnSerializer(rsvn, many=True)
        return Response(serializer.data)
#===========================
class RsvnModuleView(APIView):
    """
    This will be the module editor \n
    GET - will get the current module list\n
    PUT - Will add a new member to the module \n
    DELETE - Will remove the designated member from the group \n
    \n
    parameters are '/RsvnID/ModuleName/ItemID/'

    """
    #============================================
    def get_model_object(self,model,id):
    #============================================
        try:
            return model.objects.get(id=id)
        except model.DoesNotExist:
            raise Http404
    
    #============================================
    def get_model(self,name) :
    #============================================
        models = {  "guests":(Guest,GuestSerializer),
                    "amenities":(Amenity,AmenitySerializer) 
                }
        if name in models :
            return models[name] 
        else :
            raise Http404
    #============================================
    def get(self, request,rsvnid,mod,modid,format=None):
    #============================================
        rsvn = self.get_model_object(Rsvn,rsvnid)
        m = self.get_model(mod)
        
        modules = getattr(rsvn,mod).all()
        serializer = m[1](modules,many=True)
        return Response(serializer.data)


    #============================================
    def put(self, request,rsvnid,mod,modid,format=None):
    #============================================
        rsvn = self.get_model_object(Rsvn,rsvnid)
        m = self.get_model(mod)
        module = self.get_model_object(m[0],modid)
        getattr(rsvn,mod).add(module)
        modules = getattr(rsvn,mod).all()
        serializer = m[1](modules,many=True)
        return Response(serializer.data)

    #============================================
    def delete(self, request,rsvnid,mod,modid,format=None):
    #============================================
        rsvn = self.get_model_object(Rsvn,rsvnid)
        m = self.get_model(mod)
        module = self.get_model_object(m[0],modid)
        getattr(rsvn,mod).remove(module)
        modules = getattr(rsvn,mod).all()
        serializer = m[1](modules,many=True)
        return Response(serializer.data)
