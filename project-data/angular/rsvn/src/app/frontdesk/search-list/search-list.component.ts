import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { IGuest } from '@app/_interface/guest';
import { IRsvn } from '@app/_interface/rsvn';
@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit {

  constructor() { }
  @Input() resultList:any

  @Output() currGuestChange = new EventEmitter<IGuest>();
  @Output() currRsvnChange = new EventEmitter<IRsvn>();


  ngOnInit(): void {
  }
  selectRsvn(rsvn: any) {
    this.currRsvnChange.emit(rsvn)
  }
  selectGuest(guest:any) {
    this.currGuestChange.emit(guest)

  }
}
