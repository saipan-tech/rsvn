import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//import { IStaff } from '@app/_interface/staff';
import { IUser } from '@app/_interface/user';
import { AppEnv } from '@app/_helpers/appenv';
import { IRsvn } from '@app/_interface/rsvn';
import { IRoom } from '@app/_interface/room';
import { IGuest } from '@app/_interface/guest';



@Injectable({
  providedIn: 'root'
})
export class RsvnService {

  constructor(
    private env: AppEnv,
    private http: HttpClient
  ) { }

  private urlRoot = `${this.env.WEB_API}`
  //==================================================

  getGuestRsvn(guestid: any): Observable<IRsvn[]> {
    return this.http
      .get<IRsvn[]>(`${this.urlRoot}/rsvnguest/${guestid}/`)
  }

  getDateRsvn(query: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.urlRoot}/search/?day=${query}`)
  }
  getFutureDateRsvn(query: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.urlRoot}/search/?future=${query}`)
  }

 
  rsvnLocked(rsvn:IRsvn) : Observable<any[]> {
    return this.http
    .get<any[]>(`${this.urlRoot}/room/?rsvn=${rsvn.id}`)
  }

  rsvnScan(dateIn:string,dateOut:string):Observable<IRsvn[]> {
    return this.http.get<IRsvn[]>(`${this.urlRoot}/rsvn?include=1&dateIn=${dateIn}&dateOut=${dateOut}`)
  }

  rsvnSpecial(datequery:string):Observable<IRsvn[]> {
    return this.http.get<IRsvn[]>(`${this.urlRoot}/rsvn?${datequery}`)
  }
  rsvnTest(id:string,dateIn:string,dateOut:string):Observable<any> {
    return this.http.get<any>(`${this.urlRoot}/rsvntest/${id}?dateIn=${dateIn}&dateOut=${dateOut}`)
  }
}
