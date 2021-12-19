import { Injectable } from '@angular/core';
import {IBldg } from '@app/_interface/bldg';
import {IRoom } from '@app/_interface/room';
import {IRsvn } from '@app/_interface/rsvn';
import {IRoominfo } from '@app/_interface/roominfo';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AppEnv } from '@app/_helpers/appenv';
import { IDStatus } from '@app/grid-select/grid-select.component';
import { IStatuslog } from '@app/_interface/statuslog';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}; 

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private env: AppEnv ,
    private http: HttpClient
  ) { }

  private urlRoot = `${this.env.WEB_API}` 
  getStatusLog(roominfo:number):Observable<IStatuslog[]> {
    return this.http.get<IStatuslog[]>(`${this.urlRoot}/statuslog?roominfo=${roominfo}`)

  }
  getFullBldgList(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.urlRoot}/bldg?full=1`)
  }
  getBldgRoominfoList(bldgid:number): Observable<IRoominfo[]> {
    return this.http
      .get<IRoominfo[]>(`${this.urlRoot}/roominfo?bldgid=${bldgid}`)
  }
  availableRooms(dateIn:string,dateOut:string):Observable<IRoominfo[]> {
    return this.http.get<IRoominfo[]>(`${this.urlRoot}/roominfo?exclude=1&dateIn=${dateIn}&dateOut=${dateOut}`)
  }
  unavailableRooms(dateIn:string,dateOut:string):Observable<IRoominfo[]> {
    return this.http.get<IRoominfo[]>(`${this.urlRoot}/roominfo?include=1&dateIn=${dateIn}&dateOut=${dateOut}`)
  }
  roomScan(dateIn:string,dateOut:string):Observable<any> {
    return this.http.get<any[]>(`${this.urlRoot}/roomall?dateIn=${dateIn}&dateOut=${dateOut}`)
  }
  getActionRoominfo(action_id:number):Observable<any[]> {
    return this.http.get<any[]>(`${this.urlRoot}/actionrooms/${action_id}/`)
  }
  getRoomDateScan(date:string,modifier:string):Observable<IDStatus> {
    return this.http.get<IDStatus>(`${this.urlRoot}/roomdatescan/${date}/?${modifier}`)
  }

}
