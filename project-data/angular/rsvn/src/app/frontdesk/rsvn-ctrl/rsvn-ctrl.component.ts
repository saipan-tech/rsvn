import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';

import { IGuest } from '@app/_interface/guest';
import { IRsvn } from '@app/_interface/rsvn';


@Component({
  selector: 'app-rsvn-ctrl',
  templateUrl: './rsvn-ctrl.component.html',
  styleUrls: ['./rsvn-ctrl.component.css']
})
export class RsvnCtrlComponent implements OnInit {

  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  @Input() currGuest: any
  @Output() currGuestChange = new EventEmitter<IGuest>();
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;

  more = true

  constructor() { }

  ngOnInit(): void {
  }

}
