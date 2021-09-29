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
    getDropdownList(name:string): Observable<IDropdown[]> {
        return this.http.get<IDropdown[]>(`${this.urlRoot}/droplist/${name}/`)

    }
    // -------------------------------------------
    daylister(start:string,days:number):any[] {
        var dayList:any = []
        var startDate = new Date(start).getTime()
        for (var x=0;x<days; ++x) {
        dayList.push(new Date(startDate + x * this.appCons.DAILYSECONDS).toISOString().slice(0,10))
        }
        return dayList
    }



}