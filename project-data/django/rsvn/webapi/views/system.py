from .common import *
from .csvtools import load_data
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




#-----------------------------------------------------
def VerifyView(request) :
#-----------------------------------------------------
    result = {}
    if 'token' in request.GET:
        tmppass = request.GET['token']
        try:
            u = Staff.objects.get(temppass=tmppass)
        except:
            result["error_message"] = "Token Not Found"

    return  render(request,'verify.html',context=result)
 


