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
import { catchError, tap, map, concatMap } from 'rxjs/operators';
import { iif, of, interval,Observable } from 'rxjs';


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
  
  refreshTimer : any
  everySecond$:Observable<number> = interval(1000)
  sub:any

  constructor(
    private genericService: GenericService,
    private dialogManagerService: DialogManagerService,

  ) { }



  //=================================
  assignRoom(roominfo: IRoominfo) {
    if (this.currNumRooms < Number(this.currRsvn.numrooms)) {
      let newroom = { rsvn: this.currRsvn.id, roominfo: roominfo.id, status: 'none' }
      this.genericService.updateItem("room", newroom)
        .subscribe(data => {

          this.refreshRsvn();
        })
    }
  }
  //=================================
  rsvnDateActive() {
    const today = new Date().getTime()
    const inDate = new Date(this.currRsvn.dateIn).getTime()
    const outDate = new Date(this.currRsvn.dateOut).getTime()
    if (inDate <= today && outDate >= today) return true
    return false
  }
  //=================================
  check(room: any, mode: string) {
    if (this.rsvnDateActive()) {
      this.genericService.getItem('room', room.roomid)
        .pipe(
          map(rm => {
            rm.status = mode;
            return rm;
          }),
          concatMap(rm => this.genericService.updateItem('room', rm)),
          concatMap(() => this.genericService.getItem('roominfo', room.roominfo.id)),
          map((ri: any) => {
            if (mode == 'checkin') {
              ri.check = true
              ri.status = 'occupied'
            }
            else {
              ri.check = false
              ri.status = 'dirty'
            }
            console.log(ri)
            return ri
          }),
          concatMap((ri: any) => this.genericService.updateItem('roominfo', ri))
        )
        .subscribe(
          d => {
            // this.ngOnInit()
            // this.refreshRsvn();
          }
        )
    }
  }
  //=================================
  unassignRoom(room: any) {
    let rm = this.currRoomList.find(rec => room.id == rec.room.id)

    this.dialogManagerService.openDialog<DangerDialogComponent>(DangerDialogComponent, {
      data: {
        title: `Delete Room (${rm.bldg.name} - ${rm.roominfo.number}) from the 
             (${this.currRsvn.primary.firstname} ${this.currRsvn.primary.lastname}) Reservation?`,
        content: 'You cannot undue this action',
        confirmAction: 'Delete',
      }
    }).afterClosed().subscribe(deleteConfirmed => {
      if (deleteConfirmed) {
        this.genericService.deleteItem("room", room)
          .subscribe(data => {

            this.refreshRsvn();
          })
      }
    })
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
    console.log("Changes", changes)
  
    // this.refreshRsvn();
  }
  //=================================

  refreshRoomlist(index:number) {
    console.log("Index",index)
    if (this.currRsvn && this.currRsvn.id) {
      this.genericService.getItemQueryList('room', `rsvn=${this.currRsvn.id}&all=1`)
        .subscribe(
          rooms => {
            this.roomList = rooms.map(rms => rms = { roominfo: rms.roominfo, status: rms.status, roomid: rms.id })
            this.roomList = this.sortRoomList(this.roomList);
          }
        )
    }

  }
  //=================================
  ngOnInit(): void {
    this.refreshTimer = setInterval(
      () => { this.refreshRoomlist(1) },3000)
  
     this.sub =  this.everySecond$.subscribe(tick => console.log("ticking",tick))
    }
  ngOnDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
    this.sub.unsubscribe()

  }
}

/*


  //=================================
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
