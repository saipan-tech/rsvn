from .common import *



# ----------------------------
def contact_keygen() :
# ----------------------------
  return binascii.b2a_hex(os.urandom(int(20))).upper().decode()

# ----------------------------
class StaffViewSet(viewsets.ModelViewSet):
# ----------------------------
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [permissions.IsAuthenticated]    
    # ----------------------------
    def create(self,request):
    # ----------------------------
        if request.data['username'] :
            user = User.objects.filter(username=request.data['username'])
            if not user and request.data['email']:
                datarec = request.data
                username = request.data['username']
                password = contact_keygen()
                email = request.data['email']
                u = User.objects.create_user(username, email, password)
                u.first_name =  request.data['firstname']
                u.last_name =  request.data['lastname']
                u.save()

                if u :
                  datarec["user"] = u.id
                  datarec['temppass'] = password
                  serializer = StaffSerializer(Staff(),data=datarec)
                  if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                  u.delete()
                  return Response(serializer.errors)
                return Response(["User create error",u])
        return Response(["no Username"])




# ----------------------------
class UserChangePassword(APIView) :
# ----------------------------
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
    