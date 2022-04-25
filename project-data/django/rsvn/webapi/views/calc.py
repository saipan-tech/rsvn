from .common import *
from webapi.tools.datespan import *




#------------------------------------------
class ChargeCalc(APIView):
#------------------------------------------
    ''' 
    Here is where we aggregate charge data
    over time
    '''
    def get(self,request, format=None)  :
        result = { 'count':0,'total':0}
        found = ''
        if request.user.is_authenticated :
            if 'date' in request.GET :
                found = RoomCharge.objects.filter(date=request.GET['date'])
                result['total'] = found.aggregate(Sum('amount'))
                result['count'] = len(found)
            elif 'year' in request.GET :
                found = RoomCharge.objects.filter(date__year=request.GET['year'])
                result['total'] = found.aggregate(Sum('amount'))
                result['count'] = len(found)

        return Response(result)        
#------------------------------------------
class RoomCalc(APIView):
#------------------------------------------
    def get(self,request,roominfo_id,dateIn,dateOut, format=None)  :
        roominfo = Roominfo.objects.filter(id=roominfo_id)
        if not roominfo :
            return Response([])
        alias = roominfo[0].rateAlias
        dspan = Dspan(dateIn,dateOut)
        xarray = []
        if request.user.is_authenticated :
            for x in dspan.datestack() :
                dd = SeasonCalSerializer(SeasonCal.objects.get(date=x)).data
                dd['alias'] = alias
                xarray.append(dd)
        return Response( xarray)        
