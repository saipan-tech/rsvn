import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rate-calendar',
  templateUrl: './rate-calendar.component.html',
  styleUrls: ['./rate-calendar.component.scss']
})
export class RateCalendarComponent implements OnInit {

  constructor() { }
  ngOnInit(): void {
    var dateList = []
    var dateObject:any = {}
    
    let d1 = new Date()
  let first_second =new Date(d1.getFullYear(),0,1).getTime()
  let tickperday = 60 * 60 * 24 * 1000
  let currDay 
  for(let x=0;x<365;++x) {
    currDay = new Date(first_second + (tickperday * x) ) 
    dateList.push(currDay.toISOString().slice(0,10))
    if(!dateObject[currDay.getMonth()] ) {
      dateObject[currDay.getMonth()] = []   
    }
    dateObject[currDay.getMonth()].push(currDay.toISOString().slice(0,10))   

  }
  
  console.log(dateObject,dateList)
  



  
  }
  setResults(file:[]) {

  }


}
