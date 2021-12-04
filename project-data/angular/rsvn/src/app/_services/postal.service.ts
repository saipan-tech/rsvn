import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AppEnv } from '@app/_helpers/appenv';
import { IRsvn } from '@app/_interface/rsvn';
import { IGuest } from '@app/_interface/guest';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }; 
  

@Injectable({
  providedIn: 'root'
})

export class PostalService {

    constructor(  
        private env: AppEnv,
        private http: HttpClient
    ) { }
  
    private urlRoot = `${this.env.WEB_API}`
  
    sendEmail(email:string,body:any) :Observable<any> {
          return this.http.post<any>(`${this.urlRoot}/email/`,body, httpOptions)
      }
  }