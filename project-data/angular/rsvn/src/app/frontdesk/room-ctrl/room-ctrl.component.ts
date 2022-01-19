import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter, ViewChild } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRate } from '@app/_interface/rate'
import { IRoominfo } from '@app/_interface/roominfo'
import { ISeason } from '@app/_interface/season'
import { IGuest } from '@app/_interface/guest'
import { GenericService } from '@app/_services/generic.service';
import { DangerDialogComponent, DialogManagerService } from "@app/shared/dialog";
import { catchError, filter, tap, map, mergeMap, concatMap } from 'rxjs/operators';
import { iif, of, interval, Observable } from 'rxjs';
import { AppConstants } from '@app/app.constants'
import { RoomService } from '@app/_services/room.service';
@Component({
  selector: 'app-room-ctrl',
  templateUrl: './room-ctrl.component.html',
  styleUrls: ['./room-ctrl.component.scss']
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

  refreshTimer: any
  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)

  constructor(
    private genericService: GenericService,
    private dialogManagerService: DialogManagerService,
    private appConstants: AppConstants,
    private roomService: RoomService
  ) { }



  //=================================
  assignRoom(roominfo: IRoominfo) {
    if (this.currNumRooms < Number(this.currRsvn.numrooms)) {
      let newroom = { rsvn: this.currRsvn.id, roominfo: roominfo.id, status: 'none' }
      this.genericService.updateItem("room", newroom)
        .subscribe(data => {

          this.refreshRsvn();
          this.refreshRoomlist()
        })
    }
  }
  //=================================
  rsvnDateActive() {
    const today = new Date(this.Today).getTime()
    const inDate = new Date(this.currRsvn.dateIn).getTime()
    // adjust till end of the day for checkouts
    const outDate = new Date(this.currRsvn.dateOut).getTime()
    if (inDate <= today && outDate >= today) return true
    return false
  }
  //=================================
  rsvnArchive() {
    const today = new Date(this.Today).getTime()
    const inDate = new Date(this.currRsvn.dateIn).getTime()
    const outDate = new Date(this.currRsvn.dateOut).getTime()
    if (outDate <= today) return true
    return false
  }



  //=================================
  checkin(room: any) {

    let roominfoToggle$ = this.genericService.getItem('roominfo', room.roominfo.id)
      .pipe(map((ri: any) => {
        ri.check = true
        ri.status = 'occupied'
        return ri
      }),
        concatMap((ri: any) => this.genericService.updateItem('roominfo', ri))
      )


    let roomToggle$ = this.genericService.getItem('room', room.roomid)
      .pipe(map(rm => {
        rm.status = 'checkin';
        return rm;
      }),
        concatMap(rm => this.genericService.updateItem('room', rm)),
      )


    this.genericService.getItemQueryList('room', 'active=1')
      .pipe(
//        filter((active) => active.find((al: any) => al.id == room.roomid)),
        mergeMap(() => roomToggle$),
        mergeMap(() => roominfoToggle$),
      ).subscribe(
        d => {
          this.refreshRoomlist()
          this.refreshRsvn();
        }
      )
  }
  //=================================
  checkout(room: any) {
    let roominfoToggle$ = this.genericService.getItem('roominfo', room.roominfo.id)
    
      .pipe(map((ri: any) => {
        ri.check = false
        ri.status = 'dirty'
        return ri
      }),
        concatMap((ri: any) => this.genericService.updateItem('roominfo', ri))
      )

    let roomToggle$ = this.genericService.getItem('room', room.roomid)
      .pipe(map(rm => {
        rm.status = 'checkout';
        return rm;
      }),
        concatMap(rm => this.genericService.updateItem('room', rm)),
      )


    roomToggle$.pipe(
      concatMap(() => this.genericService.getItemQueryList('room', 'active=1')),
      mergeMap((active) => iif(()=> active.find((al: any) => al.id == room.roomid),roominfoToggle$,of('No Roominfo Change'))),
      tap(d=> console.log("hey baby",d)),
      ).subscribe(
        d => {
          this.refreshRoomlist()
          this.refreshRsvn();
        }
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
        this.genericService.deleteItem("room", { id: r.roomid })
          .subscribe(data => {

            this.refreshRsvn();
            this.refreshRoomlist()
          })
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
      this.genericService.getItemQueryList('room', `rsvn=${this.currRsvn.id}&all=1`)
        .subscribe(
          rooms => {
            this.roomList = rooms.map(rms => rms = { roominfo: rms.roominfo, status: rms.status, roomid: rms.id })
            this.currNumRooms = this.roomList.length
          }
        )
    }
  }
  //=================================

  // scan to be sure no expired reservation has rooms checked in if so check out
  // make sure occupied rooms have an associated valid room reservation
  //=================================
  ngOnInit(): void {
    this.refreshRoomlist();
  }
  //=================================
  ngOnDestroy() {
  }
}
//=================================

/*


  makeList() {
    this.dispList = []
    this.bldgList.forEach(
      bdg => {

        let rates: any = []
        let bldg: IBldg = bdg
        let rms = this.availRoominfo.filter(r => r.bldg == bldg.id)
        this.rateList.forEach(rate => {
          rates.push({ rate, rooms: rms.filter(x => x.rateAlias == rate.alias) })
        })
        this.dispList.push({ rates, bldg })
      }
    )
  }

  //=================================
  sortRateList(rooms: any) {
    rooms.sort(function (a: any, b: any) {
      var A = a.alias; // ignore upper and lowercase
      var B = b.alias; // ignore upper and lowercase
      if (A > B) { return 1; }
      if (A < B) { return -1; }
      return 0;
    });
    return rooms
  }


  //=================================
  sortRoomList(rooms: any) {
    rooms.sort(function (a: any, b: any) {
      var A = a.roominfo.bldg.name + a.roominfo.number; // ignore upper and lowercase
      var B = b.roominfo.bldg.name + b.roominfo.number; // ignore upper and lowercase
      if (A > B) { return 1; }
      if (A < B) { return -1; }
      return 0;
    });
    return rooms
  }
  //=================================
  ngOnInit(): void {
    // Get Rate List
    this.newOnInit();
    if (this.currRsvn && this.currRsvn.id) {
      this.genericService.getItemList("rate")
        .subscribe(
          data => {
            this.rateList = this.sortRateList(data)
          })

      // Get rooms for this RSVN
      this.genericService.getItemQueryList('room', `rsvn=${this.currRsvn.id}`)
        .subscribe(
          rooms => {
            this.currNumRooms = rooms.length
            this.currRooms = rooms
          }
        )
    }
    this.genericService.getItemList("season")
      .subscribe(data => {
        this.seasonList = data

      })
    // Looking at this rsvn date frame  - what is the state of rooms
    if (this.currRsvn && this.currRsvn.dateIn && this.currRsvn.dateOut) {
      // we are creating our UnAssigned Rooms here
      this.roomService.availableRooms(this.currRsvn.dateIn, this.currRsvn.dateOut)
        .pipe(
          tap(avail => this.availRoominfo = avail),
          concatMap(() => this.genericService.getItemList("bldg")),
          tap(bldgs => {
            this.bldgList = bldgs
            this.makeList()
          })
        ).subscribe()
      // we are creating our Assigned Rooms here


      // we are creating our Assigned Rooms here
      this.roomService.unavailableRooms(this.currRsvn.dateIn, this.currRsvn.dateOut)
        .subscribe(unavail => {
          this.unavailRoominfo = unavail
          this.genericService.getItemQueryList('room', `rsvn=${this.currRsvn.id}`)
            .subscribe(rroom => {
              this.rsvnRoom = rroom
              this.currRoomList = []
              this.rsvnRoom.forEach(rsvrm => {
                let roominfo: any = unavail.find(rrf => rrf.id == rsvrm.roominfo)
                let room = rsvrm
                let bldg = this.bldgList.find(bl => bl.id == roominfo.bldg)
                this.currRoomList.push({ bldg, room, roominfo })
              })
            })
        })

    }

  }
}

      // we are creating our Assigned Rooms here
      this.roomService.unavailableRooms(this.currRsvn.dateIn, this.currRsvn.dateOut)
        .subscribe(unavail => {
          this.unavailRoominfo = unavail
          this.genericService.getItemQueryList('room', `rsvn=${this.currRsvn.id}&all=1`)
            .subscribe(rroom => {
              this.rsvnRoom = rroom
              this.currRoomList = []
              this.rsvnRoom.forEach(rsvrm => {
                let roominfo: any = unavail.find(rrf => rrf.id == rsvrm.roominfo)
                let room = rsvrm
                let bldg = this.bldgList.find(bl => bl.id == roominfo.bldg)
                this.currRoomList.push({ bldg, room, roominfo })
              })
            })
        })

*/
