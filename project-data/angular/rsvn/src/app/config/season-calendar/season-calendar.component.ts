import { Component, OnInit } from '@angular/core';
import { SystemService } from '@app/_services/system.service';
import { IDropdown } from '@app/_interface/dropdown';
import { SeasonService } from '@app/_services/season.service';
import { ISeasonCal } from '@app/_interface/seasoncal';
@Component({
  selector: 'app-season-calendar',
  templateUrl: './season-calendar.component.html',
  styleUrls: ['./season-calendar.component.scss']
})
export class SeasonCalendarComponent implements OnInit {

  constructor(
    private systemService : SystemService,
    private seasonService : SeasonService
  ) { }

  monthList:any  
  weekdays = ['Sun','Mon','Tue','Wed','Thr','Fri','Sat']
  months= ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  yearList:IDropdown[] = []
  currYear = new Date().getFullYear()
  currCal:ISeasonCal[]= []

  
  //===========================================================
  makeDisplayList(currCal:ISeasonCal[]) {
    let dater = this.seasonService.yearDater(currCal)
    let monthList:any[] = []
    let maxMonth = 0
    let mCounter :any[] = []
    let year = dater.days[0].slice(0,4)
    console.log(currCal)
    dater.months.forEach(
      month => {
        let date = new Date(month[0])
        let head = {year:date.getFullYear(),dow:date.getDay(),date:date,month:this.months[date.getMonth()]}
        let days = Array(date.getDay())
        days = days.concat(month)
        monthList.push({head,days})
        maxMonth= Math.max(days.length,maxMonth)
      })
      mCounter = Array(maxMonth)
      
      this.monthList= {year,mCounter,maxMonth,monthList}
      console.log(this.monthList)
    }

  //===========================================================
  setTable(year:number) {
    this.currYear = year
    this.ngOnInit()
  }  

  //===========================================================
  selectDay(event:any,date:any) {
    console.log(event.shiftKey,event.ctrlKey,date)
  }
  //===========================================================
  ngOnInit(): void {
 
    this.systemService.getDropdownList('years').subscribe(
      data => this.yearList = data
    )
    this.seasonService.seasonCalInitialize(this.currYear)
    this.seasonService.getSeasonCalendar(`year=${this.currYear}`)
      .subscribe( data => {
        this.currCal = data
        this.makeDisplayList(this.currCal)
      })

  }
  //===========================================================
  setResults(file:[]) {
  }


}