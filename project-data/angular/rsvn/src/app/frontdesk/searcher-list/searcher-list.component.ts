import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IGuest } from '@app/_interface/guest';
import { IRsvn } from '@app/_interface/rsvn';
@Component({
  selector: 'app-searcher-list',
  templateUrl: './searcher-list.component.html',
  styleUrls: ['./searcher-list.component.scss']
})
export class SearcherListComponent implements OnInit, OnChanges {
  @Input() resultList:any

  @Output() currGuestChange = new EventEmitter<IGuest>();
  @Output() currRsvnChange = new EventEmitter<IRsvn>();
  constructor() { }
  
  selectGuest(guest:IGuest) {
    console.log("Guest",guest)
    this.currGuestChange.emit(guest)
  }
  selectRsvn(rsvn:IRsvn) {
    console.log("RSVN",rsvn)
    this.currRsvnChange.emit(rsvn)
  }
  
  ngOnChanges(changes: SimpleChanges) {
    console.log("Changes",changes)
  }  
  
  ngOnInit(): void {
    console.log("Searcher List")
  }

}
