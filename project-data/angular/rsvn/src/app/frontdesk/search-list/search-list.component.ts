import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IGuest } from '@app/_interface/guest';
import { IRsvn } from '@app/_interface/rsvn';
@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit,OnChanges {

  constructor() { }
  @Input() resultList:any

  @Output() currGuestChange = new EventEmitter<IGuest>();
  @Output() currRsvnChange = new EventEmitter<IRsvn>();


  ngOnInit(): void {
    console.log("test",this.resultList)
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log("test",this.resultList)
  
  }  
  selectRsvn(rsvn: any) {
    this.currRsvnChange.emit(rsvn)
  }
  selectGuest(guest:any) {
    this.currGuestChange.emit(guest)

  }
}
