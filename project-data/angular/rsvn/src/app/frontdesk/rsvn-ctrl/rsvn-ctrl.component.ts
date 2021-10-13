import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core'

import { IGuest } from '@app/_interface/guest';
import { IRsvn } from '@app/_interface/rsvn';


@Component({
  selector: 'app-rsvn-ctrl',
  templateUrl: './rsvn-ctrl.component.html',
  styleUrls: ['./rsvn-ctrl.component.scss']
})
export class RsvnCtrlComponent implements OnInit,OnChanges {

  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  @Input() currGuest: any
  @Output() currGuestChange = new EventEmitter<IGuest>();


  more = false
  rmore= false
  CICOstring = ""
  guestString = ''
  constructor() { }
  ngOnChanges(changes : SimpleChanges) {
    this.currRsvnChange.emit(this.currRsvn)
    this.currGuestChange.emit(this.currGuest)
  }
 rsvnAction(rsvn:IRsvn) {
  this.currRsvnChange.emit(rsvn)

 }
 guestAction(guest:IGuest) {
  this.currGuestChange.emit(guest)

 }

 msgString(num:number) {
   let ret=""
  switch(num) {
    case 1 :
      ret =  `${this.currGuest.firstname} ${this.currGuest.middlename} ${this.currGuest.lastname} `
      break;
    case 2 :  
      ret = `Check-in ${this.currRsvn.dateIn} =>  Check-out ${this.currRsvn.dateOut}`
    break;
  }
  return ret
}


  ngOnInit(): void {
  }

}
