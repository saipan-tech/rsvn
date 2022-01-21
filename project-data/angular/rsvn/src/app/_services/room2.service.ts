import { Injectable } from '@angular/core';
import {IBldg } from '@app/_interface/bldg';
import {IRoom2 } from '@app/_interface/room2';
import {IRsvn } from '@app/_interface/rsvn';
import {IRoominfo } from '@app/_interface/roominfo';
import {IStatuslog } from '@app/_interface/statuslog';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AppEnv } from '@app/_helpers/appenv';
import { IDStatus } from '@app/admin/grid-select/grid-select.component';
import { room2sReducer } from '@app/_state/room2.reducer';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}; 

@Injectable({
  providedIn: 'root'
})
export class Room2Service {

  constructor(
    private env: AppEnv ,
    private http: HttpClient
  ) { }

  private urlRoot = `${this.env.WEB_API}` 


 
  getRoom2s(): Observable<Array<IRoom2>> {
    return this.http.get<IRoom2[]>(`${this.urlRoot}/room/`)
      .pipe(
        tap( d=> console.log(d)),
        map ((room2s )=> room2s || []));
  }



}