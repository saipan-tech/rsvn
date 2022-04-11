import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { IRoominfo } from '@app/_interface/roominfo';
import { SystemService } from '@app/_services/system.service';
import { catchError, tap, map, mergeMap, concatMap } from 'rxjs/operators';

import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { ActionEntityService } from '@app/_ngrxServices/action-entity.service';
import { combineLatest, Observable, of } from 'rxjs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-current-matrix',
  templateUrl: './current-matrix.component.html',
  styleUrls: ['./current-matrix.component.scss']
})
export class CurrentMatrixComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private roominfoService: RoominfoEntityService,
    private roomService: RoomEntityService,
    private bldgService: BldgEntityService,
    private rsvnService: RsvnEntityService,
    private actionService: ActionEntityService

  ) { }

  


@Input() currRoominfo:IRoominfo = {} as IRoominfo

@Output() currRoominfoChange = new EventEmitter<IRoominfo>();


  roomStatus: any;

  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)

  dispList$: Observable<any> = of()
  statusList: any = {}
  bldgList$: Observable<any> = of()
  currRsvn$: Observable<any> = of()
  rsvnRooms$: Observable<any> = of()


  roomStats(roominfo:IRoominfo) {
    this.currRoominfoChange.emit(roominfo)
  }

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

    let mergedRooms$ = combineLatest([rsvnRooms$, this.bldgService.entities$, this.roominfoService.entities$, occList$]).pipe(
      map(([rooms, bldg, roominfo, occ]) => {
        let result: any[] = []
        roominfo.forEach((ri) => {
          let rms = rooms.filter(room => room.room.roominfo == ri.id)
          result.push({
            rooms: rms,
            roominfo: ri,
            bldg: bldg.find(b => b.id == ri.bldg),
            occ: occ.filter(oc => ri.id == oc.id)
          })
        })
        return result
      }))


    mergedRooms$.pipe(
      map((x:any) => {
        let status: any = {};
        x.forEach((disp: any) => {

          if (!status.hasOwnProperty(disp.bldg.name)) {
            status[disp.bldg.name] = {}
          }

          if (!status[disp.bldg.name].hasOwnProperty(disp.roominfo.status)) {
            status[disp.bldg.name][disp.roominfo.status] = []
          }
          status[disp.bldg.name][disp.roominfo.status].push(disp)
        })
        return status
      })).subscribe(data=> this.statusList = data)
    
    this.bldgList$ = this.bldgService.entities$
    this.dispList$ = mergedRooms$
    this.rsvnRooms$ = rsvnRooms$
  }

  


  //====================================================
  ngOnInit(): void {

    this.reload()

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
