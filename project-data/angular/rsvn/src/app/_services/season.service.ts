import { Injectable } from '@angular/core';
import {ISeason } from '@app/_interface/season';
import {ISeasonRate } from '@app/_interface/seasonrate';
import {IRoom } from '@app/_interface/room';
import {IRsvn } from '@app/_interface/rsvn';
import {IRoominfo } from '@app/_interface/roominfo';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AppEnv } from '@app/_helpers/appenv';
@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  constructor(
    private env: AppEnv ,
    private http: HttpClient

  ) { }

  private urlRoot = `${this.env.WEB_API}` 
  
  getSeasonRate(query:string): Observable<ISeasonRate[]> {
    return this.http
      .get<ISeasonRate[]>(`${this.urlRoot}/seasonrate?${query}`)
  }
  getSeasonRateAll(query:string): Observable<ISeasonRate[]> {
    return this.http
      .get<ISeasonRate[]>(`${this.urlRoot}/seasonrateall?${query}`)
  }
  
  
}
