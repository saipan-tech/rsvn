import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { ICalendar } from '@app/_interface/calendar';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AppEnv } from '@app/_helpers/appenv';
import { BehaviorSubject, concat, Observable } from 'rxjs';
import { catchError, tap, map, concatMap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}; 

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(
    private genericService:GenericService,
    private env: AppEnv,
    private http: HttpClient

  ) { }

  private urlRoot = `${this.env.WEB_API}`


}


