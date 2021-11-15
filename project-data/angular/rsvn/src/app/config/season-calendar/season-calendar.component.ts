import { Component, OnInit } from '@angular/core';
import { SystemService } from '@app/_services/system.service';
import { IDropdown } from '@app/_interface/dropdown';
import { SeasonService } from '@app/_services/season.service';
import { ISeasonCal } from '@app/_interface/seasoncal';
import { GenericService } from '@app/_services/generic.service';
import { ISeason } from '@app/_interface/season'; 
@Component({
  selector: 'app-season-calendar',
  templateUrl: './season-calendar.component.html',
  styleUrls: ['./season-calendar.component.scss']
})
export class SeasonCalendarComponent implements OnInit {

  constructor(
    private systemService : SystemService,
    private seasonService : SeasonService,
    private genericService : GenericService
  ) { }

  monthList:any  
  weekdays = ['Sun','Mon','Tue','Wed','Thr','Fri','Sat']
  months= ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  yearList:IDropdown[] = []
  currYear = new Date().getFullYear()
  currCal:ISeasonCal[]= []
  seasonList:ISeason[] = []
  clipboard : any[] = []
  dateList:any[] = []
  seasonColor:any  = {}
  holidayList:any[] = []
  //===========================================================
  makeDisplayList(currCal:ISeasonCal[]) {
    let dater = this.seasonService.yearDater(currCal)

    let monthList:any[] = []
    let maxMonth = 0
    let mCounter :any[] = []
    let year = new Date(dater.days[0].date).getUTCFullYear()

    dater.months.forEach(
      month => {
  
        let date = new Date(month[0].date)
        let head = {year:date.getUTCFullYear(),dow:date.getUTCDay(),date:date,month:this.months[date.getUTCMonth()]}
    
        let days = Array(date.getUTCDay())
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
  markDates(season:ISeason) {
    let objList:any = []
    if(this.clipboard.length >1 ) {
      this.dateList = this.systemService.daySpanSeq( this.clipboard.pop().date,this.clipboard.pop().date)
      this.dateList.forEach(
        dl => {
          let ol:any  = this.currCal.find(f => f.date == dl)
          ol.season = season.name
          objList.push(ol)
      })
    } else if(this.clipboard.length == 1) {

      let ol:any  = this.clipboard.pop() 
      ol.season = season.name
      objList.push(ol)
    }
    this.seasonService.saveList(objList)
    .subscribe(
      data => {
      console.log(data)
    },
    err => console.log(err)
   )


  }
  //===========================================================
  selectDay(event:any,date:any) {
    console.log(event.shiftKey,event.ctrlKey,date)
    if(event.shiftKey) {
      this.clipboard.push(date)
    } else {
      this.clipboard = [ date ]
    }
    console.log(this.clipboard)
  }
  //===========================================================
  ngOnInit(): void {
    this.genericService.getItemList("season")
      .subscribe( data =>  {
        this.seasonList = data
        this.seasonColor = {}
        data.forEach(
          d => {
            this.seasonColor[d.name] = d.color
          })
      })
    this.systemService.getDropdownList('years').subscribe(
      data => this.yearList = data
    )
    this.seasonService.seasonCalInitialize(this.currYear)
    this.seasonService.getSeasonCalendar(`year=${this.currYear}`)
      .subscribe( data => {
        this.currCal = data
        this.makeDisplayList(this.currCal)
      })
      this.systemService.getHoliday(this.currYear)
        .subscribe(data => {
          this.holidayList = data
          console.log(data)

        })
 }
  //===========================================================
  setResults(file:[]) {
  }


}