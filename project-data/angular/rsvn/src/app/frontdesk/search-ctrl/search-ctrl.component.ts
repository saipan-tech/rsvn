import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { catchError, tap, map, mergeMap, subscribeOn, filter, concatMap } from 'rxjs/operators';
import { combineLatest, concat, Observable, of, throwError } from 'rxjs';

import { IRsvn } from '@app/_interface/rsvn';
import { IGuest } from '@app/_interface/guest';

//import { GenericService } from '@app/_services/generic.service';
//import { SystemService } from '@app/_services/system.service';
//import { GuestService } from '@app/_services/guest.service';

import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { GuestEntityService } from '@app/_ngrxServices/guest-entity.service';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
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
    private bldgService: BldgEntityService,

    // private genericService: GenericService


  ) { }

  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)

  searchForm = new FormGroup({
    dquery: new FormControl(''),
    query: new FormControl(''),
    archive: new FormControl(''),
  });

  activeRsvn$: Observable<IRsvn[]> = of()
  
  lateCheckout$: Observable<any> = of()
  lateCheckout: IRoom[] = []

  multiList: any
  roomCount$: Observable<IRsvn[]> = of()
  guestList$: Observable<any[]> = of()
  
  expiredOcc$: Observable<any[]> = of()
  expiredOcc: IRoom[] = []

  qv: boolean = false

  noRsvn() {
    combineLatest([this.guestService.entities$, this.rsvnService.entities$]).pipe(
      map(([guest, rsvn]) => {
        let result = []
        guest.forEach(g => {

        })
      })
    )
  }

  //--------------------------------------
  selectRsvn(rsvn: any) {
    this.currRsvnChange.emit(rsvn)
    this.guestService.getByKey(rsvn.primary).subscribe(d => this.currGuestChange.emit(d))
  }

  selectGuest(guest: any) {
    this.currGuestChange.emit(guest)
  }
  //--------------------------------------
  guestSelect(guestid: any) {
    this.guestService.getByKey(guestid).
      subscribe(d => {
        this.currGuestChange.emit(d)

      })
  }
  //--------------------------------------
  rsvnSelect(rsvnid: any) {
    this.rsvnService.getByKey(rsvnid).pipe(
      tap(rsvn => this.currRsvnChange.emit(rsvn)),
      concatMap(rsvn => this.guestService.getByKey(rsvn.primary)),
      tap(guest => this.currGuestChange.emit(guest))
    ).subscribe()
  }
  //--------------------------------------
  clearCheckin(room: number) {
    this.roomService.getByKey(room).pipe(
      map(room => {
        let rm = { ...room }
        rm.status = 'checkout'
        return rm
      }),
      concatMap((room: IRoom) => this.roomService.update(room))
    ).subscribe()
  }
  //--------------------------------------
  clearCheckinAll() {
    this.lateCheckout.forEach(
      (co:any) => {
        let rm = { ...co.room }
        rm.status = 'checkout'
        this.roomService.update(rm).subscribe()
      }
    )
  }


  reload() {

    this.guestList$ = combineLatest([this.rsvnService.entities$, this.guestService.entities$]).pipe(
      map(([rsvn, guest]) => {
        let result: any[] = []
        guest.forEach(gst => {
          if (!rsvn.find(v => v.primary == gst.id)) result.push(gst)

        })
        console.log(result)
        return result
      })
    )
    this.activeRsvn$ = this.rsvnService.entities$.pipe(
      map(rsvn => rsvn.filter(r => r.dateIn <= this.Today && r.dateOut >= this.Today)))

    let activeRooms$ = this.roomService.entities$.pipe(
      map(room => room.filter(r => r.dateIn <= this.Today && r.dateOut >= this.Today)))
    let checkouts$ = this.roomService.entities$.pipe(
      map(rooms => rooms.filter(room => room.status == 'checkin' && room.dateOut < this.Today)))

    let roominfos$ = this.roominfoService.entities$
    let bldgs$ = this.bldgService.entities$

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

    let rsvns$ = this.rsvnService.entities$
    let rooms$ = this.roomService.entities$

    // Room Counter
    this.roomCount$ = combineLatest([rsvns$, rooms$]).pipe(
      map(([rsvns, rooms]) => {
        let rres: any = []
        rsvns.forEach(rvn => {
          if (rvn.numrooms != rooms.filter(rms => rms.rsvn == rvn.id).length) {
            rres.push(rvn)
          }
        })
        return rres
      }))

    // Expired Occ
    this.expiredOcc$ = combineLatest([activeRooms$, roominfos$, bldgs$]).pipe(
      map(([arooms, roominfos, bldg]) => {
        let occRooms = roominfos.filter(ri => ri.status == 'occupied')
        let rres: any = []
        occRooms.forEach(oc => {
          if (!arooms.filter(ar => ar.roominfo == oc.id).length) {
            let bld: any = bldg.find(b => b.id == oc.bldg)
            rres.push(
              { ...oc, bldgname: bld.name })
          }
        })
        return rres
      }))
  }
  //--------------------------------------

  roominfoStatusChange$(roomid: number, value: string): Observable<any> {
    return this.roominfoService.getByKey(roomid).pipe(
      map(ri => {
        var rmin = { ...ri }
        rmin.status = value
        return rmin
      }),
      concatMap(rminfo => this.roominfoService.update(rminfo))
    )
  }

  //--------------------------------------

  clearOcc(roomid: number, value: string) {
    if (roomid == 0) {
      this.expiredOcc.forEach((ex: any) => {
        this.roominfoStatusChange$(ex.id, value).subscribe()
      })
    } else {
      this.roominfoStatusChange$(roomid, value).subscribe()

    }
  }


  //--------------------------------------
  ngOnInit(): void {
    this.reload()
    this.expiredOcc$.subscribe(data => this.expiredOcc = data)
    this.lateCheckout$.subscribe(data => this.lateCheckout = data)
    this.searchForm.valueChanges
      .subscribe(val => {
        if (val.dquery) {
          let date = new Date(val.dquery).toISOString().slice(0, 10)
          let dateRsvn$ = this.rsvnService.entities$.pipe(
            map(rsvn => rsvn.filter(r => r.dateIn <= date && r.dateOut >= date)),
            map(rsvn => rsvn.sort((a, b) => a.dateIn.localeCompare(b.dateIn)))
          )
          this.multiList = { rsvn: dateRsvn$ }
        } else if (val.query && val.query.length > 1) {
          let rsvnList$ = this.rsvnService.getWithQuery(`query=${val.query}`)
          let guestList$ = this.guestService.getWithQuery(`query=${val.query}`)
          this.multiList = { rsvn: rsvnList$, guest: guestList$ }
        }
      })
  }
}
