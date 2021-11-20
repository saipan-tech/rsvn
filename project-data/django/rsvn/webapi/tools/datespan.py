from datetime import datetime, date,  time , timedelta
import pytz
saipan_tz = pytz.timezone("Pacific/Saipan")
class Dspan(object) :
    # provides  .workhours between timespan(dt1,dt2)
    
    def __init__(self,dt1,dt2) :
        dt1 = self.convert(dt1)
        dt2 = self.convert(dt2)
        self.date1 = min(dt1,dt2)
        self.date2 = max(dt1,dt2)

    #--------------------------------
    def convert(self,dt) :
    #--------------------------------
        return date.fromisoformat(dt)
    #--------------------------------
    def dayspan(self) :
    #--------------------------------
        sec_per_day  = 60 * 60 * 24
        return (self.date2 - self.date1).days
    #--------------------------------
    def datestack(self) :
    #--------------------------------
        dstack = []
        for x in range(int(self.dayspan())) :
            dstack.append(self.date1 + timedelta(days=x))
        return (dstack)

            
