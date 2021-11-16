import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { SystemService } from '@app/_services/system.service';
import { ICalendar } from '@app/_interface/calendar';
import { GenericService } from '@app/_services/generic.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})


export class CalendarComponent implements OnInit, OnChanges {

  constructor(
    private systemService: SystemService,
    private genericService: GenericService
  ) { }

  @Input() currYear: number = new Date().getFullYear();

  holidayList: ICalendar[] = []
  currList: ICalendar[] = []

  refreshList() {
    this.genericService.getItemQueryList('calendar', `year=${this.currYear}`)
      .subscribe(data => {
        this.currList = data
      })
  }
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
  getHolidays(year: number) {
    this.systemService.getHoliday(year)
      .subscribe(data => {
        this.syncCalendar(data)
      })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.refreshList()

  }

  ngOnInit(): void {
    this.refreshList()

  }

}
