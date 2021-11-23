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
  currYear = new Date().getUTCFullYear()
  currYearS = String(this.currYear)
  currCal:ISeasonCal[]= []
  seasonList:ISeason[] = []
  clipboard : any[] = []
  dateList:any[] = []
  seasonColor:any  = {}
  holidayList:any[] = []
  seasonCount:any = {}
  //===========================================================
  newDisplayList(currCal:any[]) {
    var dateObject: any = {}
    var currDay 
    var monthList =[]
    let maxMonth = 0
    let mCounter :any[] = []
    let year = this.currYear
    // initialize months
    for (let x = 0; x < 12; ++x) {
      dateObject[x] = []
    }
//step through each dates - add holidays or marker to the cell data
    currCal.forEach(
      scal => {
        currDay = new Date(scal.date)
        let h = this.holidayList.find(x => scal.date == x.date)
        if(h) {
          if(!scal.holiday) scal.holiday = []
          scal.holiday.push(h) 
        }
        let m = this.dateList.find(x => scal.date == x)
        scal.mark = false
        if(m) {
          scal.mark = true 
        }
        dateObject[currDay.getUTCMonth()].push(scal)
      // let's update the marks here
      
      
      })
      for (let x = 0; x < 12; ++x) {
        let m = dateObject[x]
        let date = new Date(m[0].date)
        let head = {year:date.getUTCFullYear(),dow:date.getUTCDay(),date:date,month:this.months[date.getUTCMonth()]}
        let days = Array(date.getUTCDay())
        days = days.concat(m)
        monthList.push({head,days})
        maxMonth= Math.max(days.length,maxMonth)

      }
      mCounter = Array(maxMonth)
      this.monthList= {year,mCounter,maxMonth,monthList}
    } 
  //===========================================================
  setTable(year:string) {
    this.currYear = Number(year)
    this.ngOnInit()
  }  
  //===========================================================
  saveDates(season:ISeason) {

    let objList:any = []
    this.dateList.forEach(
      dl => {
        let ol:any  = this.currCal.find(f => f.date == dl)
        ol.season = season.name
        objList.push(ol)
    })
    this.seasonService.saveList(objList)
     .subscribe(
       data => console.log(data),
       err => console.log("this is error"),
       () => {
         this.ngOnInit()
         console.log("finished")
       }
     )
  }
  //===========================================================
  markDates() {
    if(this.clipboard.length >1 ) {

    } else if(this.clipboard.length == 1) {
      this.dateList.push(this.clipboard.pop().date)
    }
  }
  //===========================================================
  selectDay(event:any,date:any) {
    if(event.shiftKey) {
      this.clipboard.push(date)
      if(this.clipboard.length >1)  {
        this.dateList = this.systemService.daySpanSeq( this.clipboard.pop().date,this.clipboard.pop().date)
      }
    } else {
      this.clipboard = [ date ]
      this.dateList = [ date.date ]
      
    }
    this.newDisplayList(this.currCal)
      
 
  }
  //===========================================================
  seasonTally() {
    this.seasonCount = {}
    this.currCal.forEach( cc => {
      if( !this.seasonCount[cc.season]) this.seasonCount[cc.season] = 0
      this.seasonCount[cc.season] += 1
    })
  
  }
  //===========================================================
  refreshTable() {
    this.seasonService.getSeasonCalendar(`year=${this.currYear}`)
    .subscribe( data => {

      this.currCal = data
      this.newDisplayList(this.currCal)
      this.seasonTally()
    })

  }
  //===========================================================
  ngOnInit(): void {
    this.clipboard = []
    this.dateList = []
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
      data =>  this.yearList = data    )
    this.seasonService.seasonCalInitialize(this.currYear)
    this.refreshTable()
    this.genericService.getItemQueryList('calendar',`year=${this.currYear}&category=holiday`)
      .subscribe(data => {
        this.holidayList = data
      })  

 }
  //===========================================================
  setResults(file:[]) {
  }


}