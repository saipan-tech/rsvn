from .common import *

#===========================
class RsvnCheckView(APIView) :
    def get(self, request,format=None):
        result = []
        rsvn_dict = Rsvn.objects.all()
        for x in rsvn_dict :
            rms = Room.objects.filter(rsvn__id=x.id)
            if not rms :
                result.append({"rsvn":x.id,"error":"noRooms"})
            elif not x.numrooms == len(rms) :
                result.append({"rsvn":x.id,"error":"roomCount"})
        return Response( result )




#===========================
def checkRsvn(rsvn,dI,dO) :
    res = []
    rooms = Room.objects.filter(
        Q(rsvn__dateIn__lt = dI) & Q(rsvn__dateOut__gt = dI) |
        Q(rsvn__dateIn__lt = dO) & Q(rsvn__dateOut__gt = dI) |
        Q(rsvn__dateIn__lt = dO) & Q(rsvn__dateOut__gt =  dO) 
        )
    rooms = rooms.exclude(rsvn__id=rsvn.id)
    myrooms = Room.objects.filter(rsvn__id = rsvn.id)

    for r in myrooms :
        # we check for room collisions
        if rooms.filter(roominfo__id=int(r.roominfo.id)) :
            res.append(r.id)
    return (res)

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

        if "dateIn" in request.GET and "dateOut" in request.GET :
            dI = request.GET['dateIn'] 
            dO = request.GET['dateOut']
            return Response({'result':checkRsvn(rsvn,dI,dO)})
        return Response({'result':["No Test"]})    
#-------------------------------------------------------
def confirm_gen (id) :
#-------------------------------------------------------
	today = Today()
	return 'R{:04}{:02}{:02}-{:04}'.format(today.year,today.month,today.day,id)

#===========================
class RsvnViewSet(viewsets.ModelViewSet):
    serializer_class = RsvnSerializer
    queryset = Rsvn.objects.all()
    permission_classes = [permissions.IsAuthenticated]
   
    def get_queryset(self):
        queryset = super().get_queryset() 

        if "query" in self.request.GET:
            queryset = queryset.filter(
                Q(primary__lastname__icontains=self.request.GET['query']) |
                Q(primary__middlename__icontains=self.request.GET['query']) |
                Q(primary__firstname__icontains=self.request.GET['query']) |
                Q(confirm__icontains=self.request.GET['query'])
                )


        if "guest" in self.request.GET:
            queryset = queryset.filter(primary__id=self.request.GET['guest'])

        if "rsvn" in self.request.GET:
            queryset = queryset.filter(dateOut__gte=self.request.GET['rsvn'])
    
        if "checkin" in self.request.GET :
            queryset = queryset.filter( dateIn=self.request.GET['checkin'])

        if "checkout" in self.request.GET :
            queryset = queryset.filter( dateOut=self.request.GET['checkout'])

        if "future" in self.request.GET :
            queryset = queryset.filter( dateIn__gt=self.request.GET['future'])

        if "active" in self.request.GET :
            queryset = queryset.filter( dateIn__lte=self.request.GET['active'],dateOut__gte=self.request.GET['active'])

        if  "dateIn" in self.request.GET and "dateOut" in self.request.GET :
            dateIn = self.request.GET['dateIn']
            dateOut = self.request.GET['dateOut']
        
        
            if "exclude" in self.request.GET  :
                queryset = queryset.exclude(
                    Q(dateIn__lte = dateIn) & Q(dateOut__gte = dateIn) |
                    Q(dateIn__lte = dateOut) & Q(dateOut__gte = dateIn) |
                    Q(dateIn__lte = dateOut) & Q(dateOut__gte =  dateOut) 
                    )
            elif "include" in self.request.GET :
                queryset = queryset.filter(
                    Q(dateIn__lte = dateIn) & Q(dateOut__gte = dateIn) |
                    Q(dateIn__lte = dateOut) & Q(dateOut__gte = dateIn) |
                    Q(dateIn__lte = dateOut) & Q(dateOut__gte =  dateOut) 
                    )
    
            
        return queryset.order_by('primary__lastname','primary__firstname')    

  
    
    def create(self,request):
        guest = Guest.objects.get(id=int(request.data['primary']))
        drec = request.data 
        rsvn = Rsvn()
        rsvn.primary = guest  
        serializer = RsvnSerializer(rsvn,data=drec)
        if serializer.is_valid():
            x = serializer.save()
            x.confirm = confirm_gen(x.id)
            x.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    def fix_charges(self,room):
        pass 

    def update(self,request,pk=None):
        rsvn = self.get_object()
        serializer = RsvnSerializer(rsvn,data=request.data)
        if serializer.is_valid():
            x = serializer.save()
            # This is were we change the rooms
            for ro in Room.objects.filter(rsvn__id=x.id):
               # from here we should change the charges as well
                ro.dateIn = x.dateIn
                ro.dateOut = x.dateOut
                ro.save()
                self.fix_charges(ro)
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
