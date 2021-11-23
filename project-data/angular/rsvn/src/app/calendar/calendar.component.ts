import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { SystemService } from '@app/_services/system.service';
import { ICalendar } from '@app/_interface/calendar';
import { GenericService } from '@app/_services/generic.service';
import { catchError, tap, map, concatMap, mergeMap } from 'rxjs/operators';
import { from, iif, Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {
  constructor(
    private systemService: SystemService,
    private genericService: GenericService,
    private http: HttpClient
  ) { }

  @Input() currYear: number = new Date().getFullYear();
  holidayList: ICalendar[] = []
  currList: ICalendar[] = []
  dateSeasonList: { date: string, season: string }[] = []
  //====================================================
  refreshList() {
    this.genericService.getItemQueryList('calendar', `year=${this.currYear}`)
      .subscribe(data => {
        this.currList = data
      })
  }
  //====================================================
  syncCalendar(dateList: any[]) {
    dateList.forEach(rec => {
      this.genericService.getItemQueryList('calendar', `year=${this.currYear}&name=${rec.name}&date=${rec.date}`)
        .subscribe(data => {
          if (!!!data.length) {
            this.genericService.updateItem('calendar', { category: 'holiday', date: rec.date, name: rec.name })
              .subscribe(data2 => {
                this.refreshList()
              })
          }
        })
    })
  }
  //====================================================
  noDuplicate(rec: { name: string, date: string }) {
    let year = new Date(rec.date).getUTCFullYear()
    return this.genericService.getItemQueryList('calendar', `year=${year}&name=${rec.name}&date=${rec.date}`)
      .pipe(
        map(data => !!!data.length)
      )
  }
  //====================================================
  saveHoliday(rec: { name: string, date: string }) {
    let newrec = { name: rec.name, date: rec.date, category: 'holiday' }
    return this.genericService.updateItem('calendar', newrec)
  }

  //====================================================
  getHolidays(year: number) {
    this.systemService.getHoliday(year)
      .subscribe(data => {
        this.syncCalendar(data)
      })
  }
  //====================================================
  getHolidays2(year: number) {
    // get the holiday array from the API
    this.systemService.getHoliday(year)
      .pipe(
        concatMap(
          (result: any) =>
            // separate the array into individual observables
            from(result).pipe(
              concatMap(
                (hol: any) =>
                  // check for duplicates
                  this.noDuplicate(hol)
                    .pipe(
                      // if not a duplicate save to db
                      concatMap(dd => iif(() => dd, this.saveHoliday(hol))),
                    )
              )
            )
        )
      ).subscribe(data => { }, err => { }, () => this.refreshList())
  }
  //====================================================
  ngOnChanges(changes: SimpleChanges) {
    this.refreshList()
  }
  //====================================================
  ngOnInit(): void {
    let dsl: any = []
    this.refreshList()


  }
}
//       {date:d3[0].date;season:d3[0].season}),
