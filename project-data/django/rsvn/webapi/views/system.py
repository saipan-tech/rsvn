from .common import *
from .csvtools import load_data
from .staff import contact_keygen

import json
class DropdownViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Dropdown.objects.all().order_by('name')
    serializer_class = DropdownSerializer
    permission_classes = [permissions.IsAuthenticated]


class DropListView(APIView):
    def get(self,request,name, format=None)  :
        drop = Dropdown.objects.filter(name=name).order_by('sequence')
        serializer = DropdownSerializer(drop, many=True)
        return Response(serializer.data)


class SearchView(APIView) :
    def get(self,request,format=None) :
        if 'guest' in request.GET and len(request.GET['guest']) >= 2 :
            results = Guest.objects.filter(
                Q(lastname__icontains=request.GET['guest']) |
                Q(firstname__icontains=request.GET['guest'])).order_by('lastname')
            serializer = GuestSerializer(results, many=True)
            return Response(serializer.data)
            
        if 'guestrsvn' in request.GET and len(request.GET['guestrsvn']) >= 2 :
            results = Rsvn.objects.filter(
                Q(primary__lastname__icontains=request.GET['guestrsvn']) |
                Q(primary__firstname__icontains=request.GET['guestrsvn'])).order_by('primary__lastname')
            serializer = RsvnSerializer(results, many=True)
            return Response(serializer.data)
        
        
        if 'day' in request.GET :
            dday=request.GET['day'][0:10]
            results = Rsvn.objects.filter(
                dateIn__lte=dday, dateOut__gte=dday
            )
            
            serializer = RsvnSerializer(results, many=True)
            return Response(serializer.data)
        
        if 'future' in request.GET :
            dday=request.GET['future'][0:10]
            results = Rsvn.objects.filter(
                dateIn__gte=dday
            )
            
            serializer = RsvnSerializer(results, many=True)
            return Response(serializer.data)
        return Response([])


#-----------------------------------------------------
class Session(APIView) :
#-----------------------------------------------------
    def get (self, request,format=None) :
        user = User.objects.get(username=request.user.username)
        serializer = UserSerializer(user)
        return Response(serializer.data)


#-----------------------------------------------------
class WorkFileView(APIView):
#-----------------------------------------------------
    parser_class = (FileUploadParser,)

    def post(self, request, *args, **kwargs):

        file_serializer = WorkFileSerializer(data=request.data)

        if file_serializer.is_valid():
            fs=file_serializer.save()
            d = load_data(fs.id)
            return Response(d, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#-----------------------------------------------------
class PeopleAPI(APIView):
#-----------------------------------------------------
    
    def get (self, request,format=None) :
        url = "https://generate-people.p.rapidapi.com/generatepeople"
        headers = {
            'x-rapidapi-host': "generate-people.p.rapidapi.com",
            'x-rapidapi-key': "0472c1a4ebmshf78b78358f3592ep10ef9djsn502077cd455e",
             "content-type": "application/json",
            }
        response = requests.request("GET", url, headers=headers)

        return Response(json.loads(response.text))
#-----------------------------------------------------
class HolidayAPI(APIView):
#-----------------------------------------------------
    
    def get (self, request,year,format=None) :

        url = f"https://public-holiday.p.rapidapi.com/{year}/US"
        headers = {
            'x-rapidapi-host': 'public-holiday.p.rapidapi.com',
            'x-rapidapi-key': '0472c1a4ebmshf78b78358f3592ep10ef9djsn502077cd455e',
             "content-type": "application/json",
            }

        response = requests.request("GET", url, headers=headers)

        return Response(json.loads(response.text))

#
#api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=e1444f66c34120ecb5fccac5645c0a50
#-----------------------------------------------------
class WeatherAPI(APIView):
#-----------------------------------------------------
    
    def get (self, request,format=None) :
        units = 'metric'
#        newurl = f"https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid=e1444f66c34120ecb5fccac5645c0a50&exclude=minutely,hourly&units={units}"

        if 'units' in request.GET :
            units = request.GET['units']
        if 'id' in request.GET:
            id = request.GET['id']
            url = f"http://api.openweathermap.org/data/2.5/weather?id={id}&APPID=e1444f66c34120ecb5fccac5645c0a50&units={units}"
            response = requests.request("GET", url)
            return Response(json.loads(response.text))
        
        return Response(request)
 
#-----------------------------------------------------
class CitiesAPI(APIView):
#-----------------------------------------------------
    
    def get (self, request,city,format=None) :

        cities = Cities.objects.filter(name__icontains=city).order_by('name','state')
        serializer = CitiesSerializer(cities,many=True)
        return Response(serializer.data)

#===========================
class CityView(APIView) :
    def get_object(self,iid): 
        try:
            return Cities.objects.get(iid=iid)
        except:
            raise Http404
    
    def get(self, request,iid,format=None):
        city = self.get_object(iid)
        serializer = CitiesSerializer(city)
        return Response(serializer.data)    


#-----------------------------------------------------
def password_check(get) :
#-----------------------------------------------------
    if 'newpassword' in get and 'newconfirm' in get and get['newpassword'] == get['newconfirm']:
        passwd = get['newpassword']
        if len(passwd) < 8 :
            msg = ' Password too short'
        else :
            return True,'ok'
    else : 
        msg = 'Passwords do not match'
    return False, msg
#-----------------------------------------------------
def VerifyView(request) :
#-----------------------------------------------------
    result = {}
    result['post'] = request.POST
    result['get'] = request.GET
    result['step'] = '0'
    view_html = 'error.html'
    if 'token' in request.GET :
        tmppass = request.GET['token']
        try:
            u = Staff.objects.get(temppass=tmppass)
            view_html = "verify.html"
        except:
            view_html = "error.html"
        if ('continue' in request.POST and 
            request.POST['continue']== '1' and
            request.POST['username'] == u.username and
            request.POST['last_name'] == u.last_name and
            request.POST['first_name'] == u.first_name) :
            result['step'] = '1'
        elif 'continue' in request.POST and request.POST['continue'] == '1':
            result['step'] = '5'
        if 'continue' in request.POST and request.POST['continue'] == '2':
            if password_check(request.POST)[0] :
                user =  User.objects.get(username=request.POST['username'])
                user.set_password(request.POST['newpassword'])
                user.save()	
                u.temppass = ''
                u.save()
                result['step'] = '2'
            else:    
                result['error_message'] = password_check(request.POST)[1]
                result['step'] = '1'
    return  render(request,view_html,context=result)
 
#-----------------------------------------------------
class PostOfficeView(APIView):
#-----------------------------------------------------
    def reset(self,request) :
        token = contact_keygen()
        try:
            user = User.objects.get(username=request.data['Username'])
            staff = Staff.objects.get(username=request.data['Username'])
        except:
            return False

        user.set_password(token)
        user.save()
        staff.temppass = token
        staff.save()
        return True


    def post(self, request, *args, **kwargs):
        if 'Reset' in request.data :
            if self.reset(request): 
                return Response('user reset',status=status.HTTP_201_CREATED)
            else:
                return Response('ERROR',status=status.HTTP_400_BAD_REQUEST)

        else :

            po = PostOffice(request.data)
            po.multimail()
            return Response('message Sent',status=status.HTTP_201_CREATED)
