import { Component, OnInit } from '@angular/core';
import { SystemService } from '@app/_services/system.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
@Component({
  selector: 'app-rate-calendar',
  templateUrl: './rate-calendar.component.html',
  styleUrls: ['./rate-calendar.component.scss']
})
export class RateCalendarComponent implements OnInit {

  constructor(
    private systemService : SystemService
  ) { }

  monthLister:any[] = []  
  weekdays = ['Sun','Mon','Tue','Wed','Thr','Fri','Sat']
  months= ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  
  makeDisplayList(year:any) {
    year = Number(year)
    let dater = this.systemService.yearDater(year)
    let monthList:any[] = []
    let maxMonth = 0
    let mCounter :any[] = []

    console.log(dater)
    
    dater.months.forEach(
      month => {
        let date = new Date(month[0])
        let head = {year:date.getUTCFullYear(),dow:date.getUTCDay(),date:date,month:this.months[date.getUTCMonth()]}
        let days = Array(date.getUTCDay())
        days = days.concat(month)
        monthList.push({head,days})
        maxMonth= Math.max(days.length,maxMonth)
      })
      mCounter = Array(maxMonth)
      console.log(mCounter,maxMonth,monthList)
      return {mCounter,maxMonth,monthList}
     
  
    }


  ngOnInit(): void {
    for (let i of [0,1]) {
      console.log("i",i)
      this.monthLister.push(this.makeDisplayList(i))

    }
  }

  setResults(file:[]) {

  }


}