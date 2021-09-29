import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AppEnv } from '@app/_helpers/appenv';
import { IRsvn } from '@app/_interface/rsvn';
import { IGuest } from '@app/_interface/guest';


@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(  private env: AppEnv,
    private http: HttpClient
  ) { }

  private urlRoot = `${this.env.WEB_API}`

// this returns Guest[]
  getGuest(query: string): Observable<any[]> {
    return this.http
    .get<any[]>(`${this.urlRoot}/search/?guest=${query}`)
}


// This returns Rsvn[]
getGuestRsvn(query: string): Observable<any[]> {
  return this.http
  .get<any[]>(`${this.urlRoot}/search/?guestrsvn=${query}`)
}


}
