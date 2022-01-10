import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  template: `<h5 style="margin-top:.5em">{{ today | date : 'EEEE, MMMM d, y, H:mm:ss '}}</h5>`,
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
  today  = new Date();
  clockid : any;
  
  constructor() { }
  
  ngOnInit(): void {
      // Clock
      this.clockid = setInterval(
        () =>  this.today = new Date(),1000

       )
  }

  ngOnDestroy() {
    if (this.clockid) {
      clearInterval(this.clockid)
    }
  }



}
