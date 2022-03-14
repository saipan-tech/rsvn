import { Component, OnInit } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { IRoominfo } from '@app/_interface/roominfo';
import { AuthService } from '@app/_services/auth.service';
import { SystemService } from '@app/_services/system.service';
import { catchError, tap, map, mergeMap, concatMap } from 'rxjs/operators';

import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { GuestEntityService } from '@app/_ngrxServices/guest-entity.service';
import { ActionEntityService } from '@app/_ngrxServices/action-entity.service';
import { combineLatest, Observable, of } from 'rxjs';
@Component({
  selector: 'app-action-matrix',
  templateUrl: './action-matrix.component.html',
  styleUrls: ['./action-matrix.component.scss']
})
export class ActionMatrixComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private authService: AuthService,
    private roominfoService: RoominfoEntityService,
    private roomService: RoomEntityService,
    private bldgService: BldgEntityService,
    private rsvnService: RsvnEntityService,
    private guestService: GuestEntityService,
    private actionService: ActionEntityService

  ) { }


  sidebar = "test"

  user: any
  roomList: any;
  dispList: any[] = [];
  actionList: any = [];
  loaded = false;
  refreshTimer: any;
  roomStatus: any;
  startTime: any;
  sidebarData: any;
  rsvnList: any;
  staffList: any;

  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)


  dispList$: Observable<any> = of()
  bldgList$: Observable<any> = of()
  currRsvn$: Observable<any> = of()
  //====================================================
  reload() {
    let activeRoom$ = this.roomService.entities$
      .pipe(map(rooms => rooms.filter(room => room.dateIn <= this.Today && room.dateOut >= this.Today)))
    let activeRsvn$ = this.rsvnService.entities$
      .pipe(map(rsvns => rsvns.filter(rsvn => rsvn.dateIn <= this.Today && rsvn.dateOut >= this.Today)))

    let rsvnRooms$ = combineLatest([activeRsvn$, activeRoom$]).pipe(
      map(([rsvns, rooms]) => {
        let result: any[] = []
        rooms.forEach(room => result.push({ room: room, rsvn: rsvns.find(rvn => rvn.id == room.rsvn) }))
        return result
      }))

    let action$ = this.actionService.getWithQuery('today=1')
    let staff$ = this.genericService.getItemList('staff')

    let actionList$ = combineLatest([action$, staff$]).pipe(
      map(([actions, staffs]) => {
        let result: any[] = []
        actions.forEach((act: any) => {
          let srec = staffs.find((sl: any) => sl.id == act.staff)
          
          act.roominfos.split(',').forEach((ari: any) => {
            result.push({
              roominfo: ari,
              action: act.id,
              staff: srec
            })
          })
        })
        return result
      }))

    // we need to find rooms that are marked occupied but have no reservation
    let occList$ = combineLatest([activeRoom$, this.roominfoService.entities$]).pipe(
      map(([room, roominfo]) => {
        let occ: IRoominfo[] = roominfo.filter(ri => ri.status == 'occupied')
        let result: any[] = []
        occ.forEach(oc => {
          if (!room.find(rm => rm.roominfo == oc.id)) {
            result.push(oc)
          }
        })
        return result
      })
    )

    let mergedRooms$ = combineLatest([actionList$, rsvnRooms$, this.bldgService.entities$, this.roominfoService.entities$,occList$]).pipe(
      map(([action, rooms, bldg, roominfo,occ]) => {
        let result: any[] = []
        roominfo.forEach((ri) => {
          let rms = rooms.filter(room => room.room.roominfo == ri.id)
          result.push({
            rooms: rms,
            action: action.filter(act => ri.id == act.roominfo),
            roominfo: ri,
            bldg: bldg.find(b => b.id == ri.bldg),
            occ: occ.filter(oc=>ri.id == oc.id)
          })
        })
        return result
      }))

    this.bldgList$ = this.bldgService.entities$
    this.dispList$ = mergedRooms$

  }

  //====================================================
  layout(act: any) {
    this.sidebarData = act
  }


  //====================================================
  selectRsvn(rsvnid: number) {
    let rsvn$ = this.rsvnService.getByKey(rsvnid)
    this.currRsvn$ = combineLatest([rsvn$, this.guestService.entities$]).pipe(
      map(([rsvn, guests]) => {
        return { rsvn, guest: guests.find(g => g.id == rsvn.primary) }
      })
    )
  }

  //====================================================
  ngOnInit(): void {

    this.reload()

    this.authService.getSession().subscribe(
      data => this.user = data
    )
    this.systemService.getDropdownList('roomstatus').subscribe(
      data => this.roomStatus = data
    )

  }
  //=================================
  roomStatusChange(roominfoID: any, mode: string) {
    this.roominfoService.getByKey(roominfoID)
      .pipe(
        map((ri: any) => {
          let ricopy = { ...ri }
          ricopy.status = mode
          return ricopy
        }),
        concatMap((ri: IRoominfo) => this.roominfoService.update(ri))
      )
      .subscribe()
  }
  //=================================

}
