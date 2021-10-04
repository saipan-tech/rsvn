import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';

import { IGuest } from '@app/_interface/guest';
import { IRsvn } from '@app/_interface/rsvn';


@Component({
  selector: 'app-rsvn-ctrl',
  templateUrl: './rsvn-ctrl.component.html',
  styleUrls: ['./rsvn-ctrl.component.css']
})
export class RsvnCtrlComponent implements OnInit,OnChanges {

  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  @Input() currGuest: any
  @Output() currGuestChange = new EventEmitter<IGuest>();
  
 guestChange(event:any) {
  this.currGuestChange.emit(event)
}
  
 rsvnChange(event:any) {
  this.currRsvnChange.emit(event)
 }
  constructor() { }
  ngOnChanges(changes : SimpleChanges) {
  
  }
 
  ngOnInit(): void {
  }

}
