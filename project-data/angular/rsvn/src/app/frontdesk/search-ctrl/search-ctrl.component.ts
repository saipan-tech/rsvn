import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { GuestService } from '@app/_services/guest.service';
import { RsvnService } from '@app/_services/rsvn.service';

import { IRsvn } from '@app/_interface/rsvn';
import { IGuest } from '@app/_interface/guest';
import { subscribeOn } from 'rxjs/operators';


@Component({
  selector: 'app-search-ctrl',
  templateUrl: './search-ctrl.component.html',
  styleUrls: ['./search-ctrl.component.css']
})

export class SearchCtrlComponent implements OnInit, OnChanges {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private guestService: GuestService,
    private rsvnService: RsvnService,

  ) { }


  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  @Input() currGuest: any
  @Output() currGuestChange = new EventEmitter<IGuest>();


  @Output() viewControl = new EventEmitter<string>();

  @Input() query: any
  @Input() dquery: any

  today = new Date().toISOString().slice(0,10)


  guestList: any[] = []
  rsvnList: any[] = []
  resultInfo: any

  view_rsvn = false
  cell = 'cell'
  resultList: any[] = []

  searchForm = new FormGroup({
    dquery: new FormControl(''),
    query: new FormControl(''),
    archive: new FormControl(''),
  });

  activeRes(mode: string) {
    this.resultList = []
    this.rsvnList = []
    this.guestList = []

    switch (mode) {
      case 'active':
        this.rsvnService.getDateRsvn(new Date().toISOString())
          .subscribe(data => {
            this.rsvnList = data
            this.makeActiveList()
          })
        break;
      case 'guests':
        this.genericService.getItemList('guest')
          .subscribe(data => {
            this.guestList = data
            this.makeList()
          })
        break;
      case 'rsvns':
        this.genericService.getItemList('rsvn')
          .subscribe(data => {
            this.rsvnList = data
            this.makeActiveList()
          })
        break;

      case 'in':
        this.rsvnService.rsvnSpecial(`checkin=${this.today }`)
          .subscribe(data => {
             this.rsvnList = data
            this.makeActiveList()
          })
        break;

        case 'out':
        this.rsvnService.rsvnSpecial(`checkout=${ this.today }`)
          .subscribe(data => {
            this.rsvnList = data
            this.makeActiveList()
          })
        break;

        case 'future':
        this.rsvnService.getFutureDateRsvn(new Date().toISOString())
          .subscribe(data => {
            this.rsvnList = data
            this.makeActiveList()
          })

        break;
    }
  }


  makeActiveList() {
    this.resultList = []
    this.rsvnList.forEach(
      rsvlist => {
        let rsvn = [rsvlist]
        let guest = rsvlist.primary
        this.resultList.push({ guest, rsvn })
      }
    )
  }


  makeList() {
    this.resultList = []
    this.guestList.forEach(
      grec => {
        let guest = grec
        let rsvn = this.rsvnList.filter(
          rsvlist => rsvlist.primary.id == grec.id
        )
        this.resultList.push({ guest, rsvn })
      }
    )

  }



  runSearch(search: any) {
    // with a partial search Guests and return list
    this.guestService.getGuestRsvn(search)
      .subscribe(
        rsvlist => {
          this.rsvnList = rsvlist
          this.guestService.getGuest(search)
            .subscribe(
              gstlist => {
                this.guestList = gstlist
                this.makeList()
              }
            )

        }
      )
  }

  selectRsvn(rsvn: any) {
    this.clearFields()
    this.currRsvnChange.emit(rsvn)
    this.currGuestChange.emit(rsvn.primary)
  }

  selectGuest(guest: any) {
    this.clearFields()
    this.currGuestChange.emit(guest)
  }

  clearFields() {
    this.currRsvn = {} as IRsvn
    this.currGuest = {} as IGuest
    this.currGuestChange.emit(this.currGuest)
    this.currRsvnChange.emit(this.currRsvn)
  }

  changeView(view: string) {
    this.viewControl.emit(view)
  }

  clearLists() {
    this.rsvnList = []
  }

  newGuest() {
    this.clearFields()
    this.currGuest.id = 0
    this.currGuestChange.emit(this.currGuest)

  }


  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    
  }



}
