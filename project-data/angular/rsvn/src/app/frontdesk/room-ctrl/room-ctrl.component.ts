import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRate } from '@app/_interface/rate'
import { IRoominfo } from '@app/_interface/roominfo'
import { ISeason } from '@app/_interface/season'
import { IGuest } from '@app/_interface/guest'
import { GenericService } from '@app/_services/generic.service';
import { DangerDialogComponent, DialogManagerService } from "@app/shared/dialog";
import { map, concatMap, tap, mergeMap } from 'rxjs/operators';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { combineLatest, iif, Observable, of } from 'rxjs';


@Component({
  selector: 'app-room-ctrl',
  templateUrl: './room-ctrl.component.html',
  styleUrls: ['./room-ctrl.component.scss'],
 changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomCtrlComponent implements OnInit, OnChanges {


  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  @Input() currGuest: any
  @Output() currGuestChange = new EventEmitter<IGuest>();

  currNumRooms = 0
  currRooms: IRoom[] = []
  bldgList: IBldg[] = []

  roomList: any[] = []
  rateList: IRate[] = []

  currRoomList: any[] = []
  dispList: any = []
  availRoominfo: IRoominfo[] = []
  unavailRoominfo: IRoominfo[] = []
  rsvnRoom: IRoom[] = []
  seasonList: ISeason[] = []

  roomQuery$: Observable<any> = of()
  roomQuery:any[] = []

  refreshTimer: any
  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)

  constructor(
    private genericService: GenericService,
    private dialogManagerService: DialogManagerService,
    private roomEntityService: RoomEntityService,
    private roominfoEntityService: RoominfoEntityService
  ) { }



  //=================================
  rsvnDateActive() {
    if (this.currRsvn.inDate <= this.Today && this.currRsvn.outDate >= this.Today) return true
    return false
  }
  //=================================
  rsvnArchive() {
    if (this.currRsvn.outDate <= this.Today) return true
    return false
  }
  //=================================
  roomActive$(room: IRoom):Observable<boolean> {

    return this.genericService.getItemQueryList('room', 'active=1')
      .pipe(
        map(r => { return !!r.filter(r => r.roominfo == room.roominfo && r.rsvn != room.rsvn).length })
      )
  }

  //=================================
  checkin(room: any) {

    let roominfoToggle$ = this.roominfoEntityService.getByKey(room.roominfo.id)
      .pipe(
        map((ri) => { return { ...ri } }),
        map((ri: any) => {
          ri.check = true
          ri.status = 'occupied'
          return ri
        }),
        concatMap((ri: any) => this.roominfoEntityService.update(ri))
      )


    let roomToggle$ = this.roomEntityService.getByKey(room.id)
      .pipe(
        map((rm) => { return { ...rm } }),
        map((rm: any) => {
          rm.status = 'checkin';
          return rm;
        }),
        concatMap(rm => this.roomEntityService.update(rm)),
      )

      this.roomActive$(room)
      .pipe(
        concatMap(v =>iif(() => v,of(),roominfoToggle$ )),
        mergeMap(() => roomToggle$)
      )
  }
  //=================================
  checkout(room: any) {
    // still needs to subscribe -- conditional to prevent damaging current listing

    let roominfoToggle$ = this.roominfoEntityService.getByKey(room.roominfo.id)
      .pipe(
        map((ri) => { return { ...ri } }),
        map((ri: any) => {
          ri.check = false
          ri.status = 'dirty'
          return ri
        }),
        concatMap((ri: IRoominfo) => this.roominfoEntityService.update(ri))
      )

    let roomToggle$ = this.roomEntityService.getByKey(room.id)
      .pipe(
        map((rm) => { return { ...rm } }),
        map(rm => {
          rm.status = 'checkout';
          return rm;
        }),
        concatMap(rm => this.roomEntityService.update(rm)),
      )


  }

  //=================================
  unassignRoom(r: any) {

    this.dialogManagerService.openDialog<DangerDialogComponent>(DangerDialogComponent, {
      data: {
        title: `Delete Room (${r.roominfo.bldg.name} - ${r.roominfo.number}) from the 
             (${this.currRsvn.primary.firstname} ${this.currRsvn.primary.lastname}) Reservation?`,
        content: 'You cannot undue this action',
        confirmAction: 'Delete',
      }
    }).afterClosed().subscribe(deleteConfirmed => {
      if (deleteConfirmed) {
        this.roomEntityService.delete(r.id)
          .subscribe(data => {

            this.refreshRoomlist()
          })

        /*       
        this.genericService.deleteItem("room", { id: r.roomid })
          .subscribe(data => {

            this.refreshRsvn();
            this.refreshRoomlist()
          })
*/
      }
    })
  }
  //=================================
  refreshRsvn() {
    this.genericService.getItem("rsvn", this.currRsvn.id).subscribe(
      data => {
        this.currRsvn = data
        this.currRsvnChange.emit(data)
      }
    )
  }
  //=================================
  ngOnChanges(changes: SimpleChanges) {
    this.refreshRoomlist()

    // this.refreshRsvn();
  }



  //=================================
  refreshRoomlist() {
    /*    this.roomService.roomClear().subscribe(
          data => console.log("clear Room",data)
        )
    */

        if (this.currRsvn && this.currRsvn.id) {
      let bldg$ = this.genericService.getItemList("bldg")
      let rQuery$ = this.roomEntityService.getWithQuery({ rsvn: this.currRsvn.id })
      this.roomQuery$ = combineLatest([rQuery$, this.roominfoEntityService.entities$, bldg$])
        .pipe(
          map(([rquery, roominfo, bldg]) => {
            let found: any = []
            rquery.forEach((rq: any) => {
              let newrq = { ...rq }
              newrq.roominfo = roominfo.find(r => r.id == rq.roominfo)
              newrq.bldg = bldg.find(b => b.id == newrq.roominfo.bldg)
              found.push(newrq)
            })
            return found
          }))

       

/*
      this.genericService.getItemQueryList('room', `rsvn=${this.currRsvn.id}&all=1`)
        .subscribe(
          rooms => {
            this.roomList = rooms.map(rms => rms = { roominfo: rms.roominfo, status: rms.status, roomid: rms.id })
            this.currNumRooms = this.roomList.length
          }
        )
  */
      }
  }
  //=================================

  // scan to be sure no expired reservation has rooms checked in if so check out
  // make sure occupied rooms have an associated valid room reservation
  //=================================
  ngOnInit(): void {
    this.refreshRoomlist()
    
  }
  //=================================
  ngOnDestroy() {
  }
}
//=================================

