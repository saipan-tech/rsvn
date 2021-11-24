from .common import *



# ----------------------------
def contact_keygen() :
# ----------------------------
  return binascii.b2a_hex(os.urandom(int(30))).upper().decode()

class StaffViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [permissions.IsAuthenticated]    
    

    def create(self,request):
        if request.data['username'] :
            user = User.objects.filter(username=request.data['username'])
            if not user and request.data['email']:
                datarec = request.data
                username = request.data['username']
                password = contact_keygen()
                email = request.data['email']
                u = User.objects.create_user(username, email, password)
                serializer = UserSerializer(u)
                if serializer.is_valid():
                    user_rec = serializer.save()        
                    newstaff = Staff()
                    newstaff.user = user_rec
                    serializer = Staff(newstaff, data=datarec)
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data)
        return Response(serializer.errors)

#---------------------
class ResetPassword(APIView) :
#---------------------
  def get (self, request,id, format=None) :
    try:
      user =  User.objects.get(id=id)
      user.set_password(user.email)
      user.save()
    except :
      raise Http404
    return Response("Success")
# ----------------------------
class UpdateUserView(APIView) :
# ----------------------------
    def post(self, request, *args, **kwargs):
        if "username" in request.POST :
            username = request.POST["username"]
            if "password" in request.POST :
                password = request.POST["password"]
                if User.objects.filter(username=username) :
                    u = User.objects.get(username=username) 
                    u.set_password(password)
                    u.save()
                    serializer = UserSerializer(u)
                    return Response(serializer.data,status=status.HTTP_201_CREATED)
                return Response(request.POST, status=status.HTTP_400_BAD_REQUEST)
            else:
                keygen = contact_keygen()
                u = User.objects.create_user(username, username, keygen)
                serializer = UserSerializer(u)
                return Response({'user':serializer.data,'keygen':keygen}, status=status.HTTP_201_CREATED)

        return Response(request.POST, status=status.HTTP_400_BAD_REQUEST)



#-----------------------------------------------------
class StaffCreate(APIView) :
#-----------------------------------------------------
  def post (self,request,format=None) :
    serializer = StaffSerializerNoUser(data=request.data)
    if serializer.is_valid() :
      email = serializer.validated_data.get('email')
      u = User.objects.filter(email=email)
      if u :
        news =  serializer.data
        news.update({'user':u[0]})
        fresh = Staff(**news)
        fresh.save()
        ss = StaffSerializer(fresh)
      return Response(ss.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



#-----------------------------------------------------
class UserCreate(APIView) :
#-----------------------------------------------------
  def post (self,request,format=None) :
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():       
      email = serializer.validated_data.get('email')
      u = User.objects.create_user(email,email,email)
      serializer = UserSerializer(u,data=request.data)
      if serializer.is_valid():
        serializer.save()        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#-----------------------------------------------------
class UserChangePassword(APIView) :
  def post(self,request,format=None) :
    '''
    Username - Old Password - New Password should be in body
    '''
    uname = request.data['username']
    opwd  = request.data['oldpasswd']
    npwd  = request.data['newpasswd']
    user = authenticate(username=uname, password=opwd)
    if user is not None:
      u = User.objects.get(username=uname)
      u.set_password(npwd)
      u.save()
      return Response(['ok'], status=status.HTTP_201_CREATED)
    return Response(['ERROR changing Password'], status=status.HTTP_400_BAD_REQUEST)
    