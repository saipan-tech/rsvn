import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//import { IStaff } from '@app/_interface/staff';
import { IUser } from '@app/_interface/user';
import { AppEnv } from '@app/_helpers/appenv';
import { IDropdown } from '@app/_interface/dropdown';
import { GenericService } from './generic.service';
import { AppConstants } from '@app/app.constants';

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

    // -------------------------------------------
    daylister(start: string, days: number): any[] {
        var dayList: any = []
        var startDate = new Date(start).getTime()
        for (var x = 0; x < days; ++x) {
            dayList.push(new Date(startDate + x * this.appCons.DAILYSECONDS).toISOString().slice(0, 10))
        }
        return dayList
    }
    // -------------------------------------------
    yearDater(year:number) {
        // year - current year offset 
       
        var dateList = []
        var dateObject: any = {}
        var monthList = []
        let d1 = new Date()
        let first_second = new Date(d1.getFullYear()+year, 0, 1).getTime()
        let tickperday = 60 * 60 * 24 * 1000
        let currDay, _currDay
        for (let x = 0; x < 365; ++x) {
            currDay = new Date(first_second + (tickperday * x))
            dateList.push(currDay.toISOString().slice(0,10))
            if (!dateObject[currDay.getMonth()]) {
                dateObject[currDay.getMonth()] = []
            }
            dateObject[currDay.getMonth()].push(currDay.toISOString().slice(0,10))
        }
        for (let x = 0; x < 12; ++x) {
            monthList.push(dateObject[x])
        }

        return({ months:monthList, days:dateList})
    }

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