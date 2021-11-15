import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//import { IStaff } from '@app/_interface/staff';
import { IUser } from '@app/_interface/user';
import { AppEnv } from '@app/_helpers/appenv';
import { IDropdown } from '@app/_interface/dropdown';
import { GenericService } from './generic.service';
import { AppConstants } from '@app/app.constants'

@Injectable({
    providedIn: 'root'
})

export class SystemService {
    constructor(
        private env: AppEnv,
        private http: HttpClient,
        private appCons: AppConstants
    ) { }

    private urlRoot = `${this.env.WEB_API}`

    //==================================================
    getDropdownList(name: string): Observable<IDropdown[]> {
        return this.http.get<IDropdown[]>(`${this.urlRoot}/droplist/${name}/`)
    }

    //==================================================
    getPeople(): Observable<any> {
        return this.http.get<any>(`${this.urlRoot}/people/`)
    }
   //==================================================
   getHoliday(year:number): Observable<any> {
        return this.http.get<any>(`${this.urlRoot}/holiday/${year}/`)
}

    //==================================================
    daylister(start: string, days: number): any[] {
        var dayList: any = []
        var startDate = new Date(start).getTime()
        for (var x = 0; x < days; ++x) {
            dayList.push(new Date(startDate + x * this.appCons.DAILYSECONDS).toISOString().slice(0, 10))
        }
        return dayList
    }
  //==================================================
  daySpanSeq(d1: string, d2: string): any[] {
    
    var d1D = new Date(d1).getTime()
    var d2D = new Date(d2).getTime()
    
    let start = Math.min(d1D,d2D)
    let end  = Math.max(d1D,d2D)
    var dayList: any = []
    while ( start <= end) {
        dayList.push(new Date(start).toISOString().slice(0, 10))
        start += this.appCons.DAILYSECONDS
    }
    return dayList
}

    //==================================================
    
    
   //---------------------------------
    toHTMLDate(d: Date) {
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = String(d.getFullYear())
        return `${year}-${month}-${day}`
    }
    //---------------------------------
    fromHTMLDate(date: string) {
        let ndate = new Date(`${date}`).toISOString().slice(0, 10)
        return ndate
    }

}