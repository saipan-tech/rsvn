import { Injectable } from '@angular/core';
import { ISeason } from '@app/_interface/season';
import { ISeasonCal } from '@app/_interface/seasoncal';
import { ISeasonRate } from '@app/_interface/seasonrate';
import { IRoom } from '@app/_interface/room';
import { IRsvn } from '@app/_interface/rsvn';
import { IRoominfo } from '@app/_interface/roominfo';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map, subscribeOn } from 'rxjs/operators';
import { Observable, concat, throwError } from 'rxjs';
import { AppEnv } from '@app/_helpers/appenv';
import { GenericService } from './generic.service';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SeasonService {

  constructor(
    private env: AppEnv,
    private http: HttpClient,
    private genericService: GenericService
  ) { }

  private urlRoot = `${this.env.WEB_API}`

  //==================================================
  getSeasonRate(query: string): Observable<ISeasonRate[]> {
    return this.http
      .get<ISeasonRate[]>(`${this.urlRoot}/seasonrate?${query}`)
  }
  //==================================================
  getSeasonRateAll(query: string): Observable<ISeasonRate[]> {
    return this.http
      .get<ISeasonRate[]>(`${this.urlRoot}/seasonrateall?${query}`)
  }
  //==================================================
  getSeasonCalendar(query: string): Observable<ISeasonCal[]> {
    return this.http
      .get<ISeasonCal[]>(`${this.urlRoot}/seasoncal?${query}`)
  }
  //==================================================
  makeCalendar(year: number) {
    let first_second = new Date(year, 0, 1).getTime()
    let last_second = new Date(year + 1, 0, 1).getTime()
    let tickperday = 60 * 60 * 24 * 1000
    let currDay
    let num_days = (last_second - first_second) / tickperday

    for (let x = 0; x < num_days; ++x) {
      currDay = new Date(first_second + (tickperday * x)).toISOString().slice(0, 10)

      this.genericService.updateItem("seasoncal", { id: '', date: currDay, season: 'noSeason' })
        .subscribe(
          data => console.log("success"),
          err => console.log("error", err))
    }
  }

  //==================================================
  seasonCalInitialize(year: number) {
    this.getSeasonCalendar(`year=${year}`).subscribe(
      data => {
        if (!!!data.length) {
          this.makeCalendar(year)
        }

      })
  }
  //==================================================
  yearDater(seaCal: ISeasonCal[]) {
    // year - wanted year 
    var dateList: any = []
    var dateObject: any = {}
    var monthList = []
    var currDay
    seaCal.forEach(
      scal => {
        currDay = new Date(scal.date)
        dateList.push(scal)
        if (!dateObject[currDay.getUTCMonth()]) {
          dateObject[currDay.getUTCMonth()] = []
        }
        dateObject[currDay.getUTCMonth()].push(scal)
      })
    for (let x = 0; x < 12; ++x) {
      monthList.push(dateObject[x])
    }

    return { months: monthList, days: dateList }
  }

  //==================================================
  // save multiple 
  saveList(dateList: any[]): Observable<any> {
      let obsArray:any = []
      dateList.forEach(
        date => {
          obsArray.push(this.http.put<any>(`${this.urlRoot}/seasoncal/${date.id}/`, date, httpOptions))
        })
      return concat(...obsArray)
    }







}
