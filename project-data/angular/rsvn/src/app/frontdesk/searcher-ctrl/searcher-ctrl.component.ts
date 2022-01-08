import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { catchError, tap, map, mergeMap, subscribeOn } from 'rxjs/operators';
import { IRsvn } from '@app/_interface/rsvn';
import { IGuest } from '@app/_interface/guest';
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { GuestService } from '@app/_services/guest.service';
import { RsvnService } from '@app/_services/rsvn.service';
import { RoomService } from '@app/_services/room.service';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-searcher-ctrl',
  templateUrl: './searcher-ctrl.component.html',
  styleUrls: ['./searcher-ctrl.component.scss']
})

export class SearcherCtrlComponent implements OnInit, OnChanges {
  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();
  @Input() currGuest: any
  @Output() currGuestChange = new EventEmitter<IGuest>();
  @Output() viewControl = new EventEmitter<string>();
  @Input() query: any
  @Input() dquery: any

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private guestService: GuestService,
    private rsvnService: RsvnService,
    private roomService: RoomService,

  ) { }
  searchForm = new FormGroup({
    dquery: new FormControl(''),
    query: new FormControl(''),
    archive: new FormControl(''),
  });

  infoOn = false;

  today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
  guestList: any[] = []
  rsvnList: any[] = []
  resultInfo: any
  noRoomResult = ''
  view_rsvn = false
  cell = 'cell'
  resultList: any[] = []
  scanList: any[] = []
  rsvn$: any
  selectHead = 'Current Information'
  //--------------------------------------
  sortRsvnDateList(rlist: any) {
    rlist.sort(function (a: any, b: any) {
      var A = a.dateIn; // ignore upper and lowercase
      var B = b.dateIn; // ignore upper and lowercase
      if (A > B) { return -1; }
      if (A < B) { return 1; }
      return 0;
    });
    return rlist
  }
  //--------------------------------------
  sortResultNames(rlist: any) {
    rlist.sort(function (a: any, b: any) {
      var A = a.lastname.toUpperCase(); // ignore upper and lowercase
      var B = b.lastname.toUpperCase(); // ignore upper and lowercase
      if (A < B) { return -1; }
      if (A > B) { return 1; }
      return 0;
    });
    return rlist
  }
  //--------------------------------------
  runSearch(search: any) {
    // with a partial search Guests and return list
    this.guestService.getGuest(search)
      .pipe(tap(
        grec =>
          grec.forEach(g => {
            this.genericService.getItemQueryList("rsvn", `guest=${g.id}`)
              .subscribe(data => {
                g.rsvn = data;
                if (data.length) g.marker = 'rsvn'
              })
          })
      )
      ).subscribe(d => {
        this.resultList = d
      })
  }
  //--------------------------------------
  selectRsvn(rsvn: any) {
    this.clearFields()
    this.currRsvnChange.emit(rsvn)
    this.currGuestChange.emit(rsvn.primary)
  }
  //--------------------------------------
  selectGuest(guest: any) {
    this.clearFields()
    this.currGuestChange.emit(guest)
  }
  //--------------------------------------
  clearFields() {
    this.currRsvn = {} as IRsvn
    this.currGuest = {} as IGuest
    this.currGuestChange.emit(this.currGuest)
    this.currRsvnChange.emit(this.currRsvn)
  }
  //--------------------------------------
  guestConvert(guest$: any) {
    guest$
      .pipe(tap(
        (data: any[]) => {
          this.resultList = this.sortResultNames(data)
          this.resultList.forEach(guest => {
            this.genericService.getItemQueryList("rsvn", `guest=${guest.id}`)
              .subscribe(data => {
                guest.rsvn = data
              })
          }
          )
        }
      )).subscribe()
  }
  //--------------------------------------
  rsvnConvert(rsvn$: any) {
    rsvn$.subscribe(
      (data: any[]) => {
        this.rsvnList = data
        this.makeNewList(data).forEach(gid => {
          let _rec = this.rsvnList.find(rr => rr.primary.id == gid)
          let rec = _rec.primary
          rec.fullname = rec.firstname + ' ' + rec.lastname
          rec.rsvn = []
          this.resultList.push(rec)
        })
        this.resultList = this.sortResultNames(this.resultList)
        this.resultList.forEach(
          rec => {
            this.genericService.getItemQueryList("rsvn", `guest=${rec.id}`)
              .subscribe(data => rec.rsvn = data)
          }
        )
      },


    )

  }
  //--------------------------------------
  activeRes(mode: string) {
    this.resultList = []
    this.rsvnList = []
    this.guestList = []
    this.infoOn = false;
    let rsvn$
    let guest$
    switch (mode) {
      case 'current':
        this.selectHead = "Current Information"
      this.infoOn = true
   
        break;
    
      case 'active':
        rsvn$ = this.genericService.getItemQueryList("rsvn", `active=${this.today}`)
        this.selectHead = "Active Reservations"
        break;

      case 'guests':
        guest$ = this.genericService.getItemList("guest")
        this.selectHead = "All Guests"
        break;

      case 'rsvns':
        rsvn$ = this.genericService.getItemList("rsvn")
        this.selectHead = "All Reservations"
        break;

      case 'future':
        rsvn$ = this.genericService.getItemQueryList("rsvn", `future=${this.today}`)
        this.selectHead = "Future Reservations"
        break;

      case 'noroom':
        this.resultList = this.scanList;
        this.rsvn$.subscribe()
        this.selectHead = "Room Count Issues"
        break;
    }
    if (rsvn$) {
      this.rsvnConvert(rsvn$)
    } else if (guest$) {
      this.guestConvert(guest$)
    }
  }
  // create the result list
  //--------------------------------------
  makeNewList(rlist: any[]) {
    let glist = new Set()
    rlist.forEach(
      rsv => {
        glist.add(rsv.primary.id)
      }
    )
    return glist
  }

  //--------------------------------------
  ngOnChanges(changes: SimpleChanges) {

    if (this.rsvn$) this.rsvn$.subscribe()
  }
  //--------------------------------------
  ngOnInit(): void {
    this.searchForm.valueChanges
      .subscribe(val => {
        if (val.query && val.query.length > 1) {
          this.runSearch(val.query)
          this.selectHead = "Query Result"
        }

      })
    this.rsvn$ = this.rsvnService.rsvnCheck()
      .pipe(tap(
        data => {
          this.scanList = []
          data.forEach(d => {
            this.genericService.getItem("rsvn", d.rsvn)
              .subscribe(rsvn => {
                let g = rsvn.primary;
                g.fullname = g.firstname + ' ' + g.lastname
                g.marker = d.error;
                g.rsvn = [rsvn]
                this.scanList.push(g)
              })
          })
        })
      )
    this.rsvn$.subscribe()
  }

}
