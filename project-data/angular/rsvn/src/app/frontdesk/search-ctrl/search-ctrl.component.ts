import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { catchError, tap, map, mergeMap, subscribeOn, filter } from 'rxjs/operators';
import { combineLatest, Observable, of, throwError } from 'rxjs';

import { IRsvn } from '@app/_interface/rsvn';
import { IGuest } from '@app/_interface/guest';

import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { GuestService } from '@app/_services/guest.service';

import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { GuestEntityService } from '@app/_ngrxServices/guest-entity.service';
import { IRoominfo } from '@app/_interface/roominfo';
import { IRoom } from '@app/_interface/room';


@Component({
  selector: 'app-search-ctrl',
  templateUrl: './search-ctrl.component.html',
  styleUrls: ['./search-ctrl.component.scss']
})
export class SearchCtrlComponent implements OnInit {
  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();
  @Input() currGuest: any
  @Output() currGuestChange = new EventEmitter<IGuest>();
  @Output() viewControl = new EventEmitter<string>();
  @Input() query: any
  @Input() dquery: any

  constructor(
    private roominfoService: RoominfoEntityService,
    private roomService: RoomEntityService,
    private rsvnService: RsvnEntityService,
    private guestService: GuestEntityService,
    private genericService: GenericService


  ) { }

  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)

  searchForm = new FormGroup({
    dquery: new FormControl(''),
    query: new FormControl(''),
    archive: new FormControl(''),
  });

  activeRsvn$: Observable<IRsvn[]> = of()
  lateCheckout$: Observable<any> = of()
  multiList :any

  //--------------------------------------
  selectRsvn(rsvn: any) {
    this.currRsvnChange.emit(rsvn)
//    this.currGuestChange.emit(rsvn.primary)
  }
  //--------------------------------------
  rsvnSelect(rsvnid:any) {
    this.rsvnService.getByKey(rsvnid).subscribe(d=>this.currRsvnChange.emit(d))
  } 
  
  
  reload() {
    this.activeRsvn$ = this.rsvnService.entities$.pipe(
      map(rsvn => rsvn.filter(r => r.dateIn <= this.Today && r.dateOut >= this.Today)))

    let checkouts$ = this.roomService.entities$.pipe(
      map(rooms => rooms.filter(room => room.status == 'checkin' && room.dateOut < this.Today)))

    let roominfos$ = this.roominfoService.entities$
    let bldgs$ = this.genericService.getItemList('bldg')

    this.lateCheckout$ = combineLatest([checkouts$, roominfos$, bldgs$]).pipe(
      map(([checkouts, roominfo, bldg]) => {
        let result: any = []
        checkouts.forEach(co => {
          let ri = roominfo.find(r => r.id == co.roominfo)
          result.push({
            room: co, roominfo: ri, bldg: bldg.find(b => b.id == ri?.bldg)
          })
        })
        return result
      })
    )


  }
//--------------------------------------
  ngOnInit(): void {
    this.reload()
    this.searchForm.valueChanges
      .subscribe(val => {
        if (val.dquery) {
          let date = new Date(val.dquery).toISOString().slice(0, 10)
          let dateRsvn$ = this.rsvnService.entities$.pipe(
            map(rsvn => rsvn.filter(r => r.dateIn <= date && r.dateOut >= date)),
            map(rsvn => rsvn.sort((a, b) => a.dateIn.localeCompare(b.dateIn)))
          )
          this.multiList= {rsvn:dateRsvn$}
        } else if (val.query && val.query.length > 1) {
          let rsvnList$ = this.rsvnService.getWithQuery(`query=${val.query}`)
          let guestList$ = this.guestService.getWithQuery(`query=${val.query}`)
          this.multiList = {rsvn:rsvnList$,guest:guestList$}
        }
      })
   }
}
