import { Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { IRoominfo } from '@app/_interface/roominfo';
import { AuthService } from '@app/_services/auth.service';
import { SystemService } from '@app/_services/system.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';
import { catchError, tap, map, mergeMap, concatMap } from 'rxjs/operators';

import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { GuestEntityService } from '@app/_ngrxServices/guest-entity.service';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { combineLatest, Observable, of } from 'rxjs';


@Component({
  selector: 'app-action-staff',
  templateUrl: './action-staff.component.html',
  styleUrls: ['./action-staff.component.scss']
})
export class ActionStaffComponent implements OnInit, OnChanges {

  constructor(

    private genericService: GenericService,
    private systemService: SystemService,
    private eroomService: RoomService,
    private authService: AuthService,
    private appCons: AppConstants,

    private roominfoService: RoominfoEntityService,
    private bldgService: BldgEntityService

  ) { }

  actionRec: any
  roominfos: any

  roomList: any;
  dispList: any[] = [];

  loaded = false;
  roomStatus: any;
  sidebarData: any;
  dow = this.appCons.DOW

  user: any

  staffList: any;
  startTime: any;
  bldgList: any[] = []
  actionList: any = [];
  hkList: any = []
  staff: any
  dow_now = new Date().getDay()


  dispList$: Observable<any> = of()
  currAction:any


  hkroom(t: string, room: number) {


  }

  openDialog(rec: any) {
    console.log("Click", rec)
  }
  //====================================================
  newRefreshGrid() {
    let Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
    let action$ = this.genericService.getItemQueryList('action', 'today=1')
    let bldg$ = this.bldgService.entities$
    let staff$ = this.genericService.getItemList('staff')
    let roomlist$ = this.roominfoService.entities$.pipe(
      map(ri => {
        let result: any = []
        ri.map(ri => result.push({ ...ri, week: {}, marker: {} }))
        return result
      }))
    //------------------------------------------
    let mergeList$ = combineLatest([roomlist$, action$, staff$, bldg$]).pipe(
      map(([rooms, action, staff]) => {

        action.forEach(act => {
          act.staff = staff.find((f: any) => f.id == act.staff)
          act.roominfos.forEach((ri: any) => {
            let rm = rooms.find((f: any) => ri == f.id)
            act.days.split(',')
              .forEach((dy: any) => {
                if (dy) {
                  if (!rm.week[dy]) rm.week[dy] = []
                  rm.week[dy].push({ name: act.staff.last_name, item: act.item, id: act.id })
                }
              })
          })
        })
        return rooms
      }))
    //------------------------------------------
    let dispList$ = combineLatest([mergeList$, bldg$]).pipe(
      map(([merge, bldg]) => {
        let result: any = []
        bldg.forEach(b => {
          result.push({ bldg: b, rooms: merge.filter((m: any) => m.bldg == b.id) })
        })
        return result
      })
    )
    this.dispList$ = dispList$
  }
  //====================================================
  actionSelect(actionid: number) {
    this.currAction = actionid
    this.genericService.getItem('action', actionid)
      .pipe(
        tap(action => this.actionRec = action),
        concatMap((action) => this.genericService.getItem('staff', action.staff)),
        tap(s => this.staff = s),
        concatMap(() => this.eroomService.getActionRoominfo(this.actionRec.id)),
        map((ri: any) => {
          this.roominfos = ri.map((q: any) => q = q.id)
          return ri
        }))
      .subscribe(data => console.log(data, this.roominfos, this.actionRec))
  }
  //====================================================

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }
  //====================================================
  ngOnInit(): void {
    this.newRefreshGrid()

    this.authService.getSession().subscribe(
      data => this.user = data
    )
  }

}



