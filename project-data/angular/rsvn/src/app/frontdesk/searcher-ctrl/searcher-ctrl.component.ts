import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { catchError, tap, map, mergeMap } from 'rxjs/operators';
import { IRsvn } from '@app/_interface/rsvn';
import { IGuest } from '@app/_interface/guest';
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { GuestService } from '@app/_services/guest.service';
import { RsvnService } from '@app/_services/rsvn.service';
import { RoomService } from '@app/_services/room.service';

@Component({
  selector: 'app-searcher-ctrl',
  templateUrl: './searcher-ctrl.component.html',
  styleUrls: ['./searcher-ctrl.component.scss']
})

export class SearcherCtrlComponent implements OnInit,OnChanges {
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

  today = new Date().toISOString().slice(0, 10)
  guestList: any[] = []
  rsvnList: any[] = []
  resultInfo: any
  noRoomResult = ''
  view_rsvn = false
  cell = 'cell'
  resultList: any[] = []

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

  sortResultNames(rlist: any) {
    rlist.sort(function (a: any, b: any) {
      var A = a.guest.lastname.toUpperCase(); // ignore upper and lowercase
      var B = b.guest.lastname.toUpperCase(); // ignore upper and lowercase
      if (A < B) { return -1; }
      if (A > B) { return 1; }
      return 0;
    });
    return rlist
  }


  runSearch(search: any) {
    // with a partial search Guests and return list
    this.guestService.getGuest(search)
      .pipe(tap(grec =>
        grec.forEach(g => {
          this.genericService.getItemQueryList("rsvn", `guest=${g.id}`)
            .subscribe(data => {
              g.rsvn = data;
              if (data.length) g.marker = 'rsvn'
            }
            )
        }
        ))).subscribe(d => {
          this.resultList = d
          console.log(this.resultList)
        })
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

  activeRes(mode: string) {
    this.resultList = []
    this.rsvnList = []
    this.guestList = []
    let rsvn$
    let guest$

    switch (mode) {
      case 'active':
        break;

      case 'guests':
        guest$ = this.genericService.getItemList("guest")
        break;

      case 'rsvns':
        rsvn$ = this.genericService.getItemList("rsvn")
        break;

      case 'future':
        break;

      case 'noroom':
        break;


    }
    if(rsvn$) {
      rsvn$.subscribe(
        data => {
          this.resultList = []
          this.rsvnList = data
          this.makeNewList(data).forEach(gid => {
            let _rec = this.rsvnList.find(rr => rr.primary.id == gid)
            let rec = _rec.primary
            rec.fullname = rec.firstname + ' ' + rec.lastname
            rec.rsvn = []
            this.resultList.push(rec)

          })
          this.resultList.forEach(
            rec => {
              this.genericService.getItemQueryList("rsvn",`guest=${rec.id}`)
                .subscribe(data => rec.rsvn = data)
            }
          )
        }
      )
    }
  }

  // create the result list
  makeNewList(rlist:any[]) {
    let glist = new Set()
    rlist.forEach(
      rsv => {
        glist.add(rsv.primary.id)
      }
    )
  return glist
  }
  ngOnChanges(changes: SimpleChanges) {

  }


  ngOnInit(): void {
    this.searchForm.valueChanges
      .subscribe(val => {
        if( val.query && val.query.length > 1) {
          console.log("search",val)
          this.runSearch(val.query)
        }

      })
  }

}
