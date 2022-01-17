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
#------------------------------------------
class RsvnCalc(APIView):
#------------------------------------------
    def get(self,request,rsvnid, format=None)  :
        rooms = Room.objects.filter(rsvn__id=rsvnid)
        season = Season.objects.all()
        roomArray = []
        rate = Rate()
        if request.user.is_authenticated :
            for rms in rooms :
                alias = rms.roominfo.rateAlias
                try:
                    rate = Rate.objects.get(alias=alias)
                except:
                    raise Http404                    
                dspan = Dspan(rms.rsvn.dateIn.isoformat(),rms.rsvn.dateOut.isoformat())            
                xarray = []


                for x in dspan.datestack() :
                    dd = SeasonCalSerializer(SeasonCal.objects.get(date=x)).data
                    rc = RoomCharge.objects.filter(date=x,room=rms)
                    if rc :
                        dd['amount'] = rc[0].amount     
                        dd['seasonnow'] = season.get(name=dd['season']).discount * rate.rack
                        dd['signal']= 'RoomCharge'
                        
                    else :

                        dd['amount'] = season.get(name=dd['season']).discount * rate.rack
                        dd['seasonnow'] = dd["amount"]
                        dd['signal'] = "Season Charge"
                        rc = RoomCharge()
                        rc.date=x
                        rc.amount = dd['amount']
                        rc.room = rms
                        rc.save()
                    dd['delta'] = dd['seasonnow'] - dd['amount']  
                    dd['alias'] = alias
                    
                    xarray.append(dd)
                roomArray.append({'days':xarray, 'roominfo':RoominfoSerializer(rms.roominfo).data, 'room':RoomSerializer(rms).data})        

            # create a date list
        # match seasoncal and season rate
        # send off
        

        return Response( roomArray)        

        