import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AppEnv } from '@app/_helpers/appenv';
import { IRsvn } from '@app/_interface/rsvn';
import { ICharge } from '@app/_interface/charge';
import { IPayment } from '@app/_interface/payment';


@Injectable({
  providedIn: 'root'
})
export class ChargeService {

  constructor(
    private env: AppEnv,
    private http: HttpClient
  ) { }

  private urlRoot = `${this.env.WEB_API}`
  //==================================================
  getRsvnCharge(rsvnid: number): Observable<ICharge[]> {
    return this.http
      .get<ICharge[]>(`${this.urlRoot}/charge?rsvn=${rsvnid}`)
  }
  //==================================================
  getRsvnPayment(rsvnid: number): Observable<IPayment[]> {
    return this.http
      .get<IPayment[]>(`${this.urlRoot}/payment?rsvn=${rsvnid}`)
  }
}