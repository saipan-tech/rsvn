import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRate } from '@app/_interface/rate'
import { IRoominfo } from '@app/_interface/roominfo'
import { ISeason } from '@app/_interface/season'
import { IGuest } from '@app/_interface/guest'
import { GenericService } from '@app/_services/generic.service';
import { RsvnService } from '@app/_services/rsvn.service';
import { RoomService } from '@app/_services/room.service';
import { SeasonService } from '@app/_services/season.service';
import { MatRadioModule } from '@angular/material/radio';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit, OnChanges {


  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  //@Input() currGuest: any
  //@Output() refresh = new EventEmitter<any>();


  currNumRooms = 0
  currRooms: IRoom[] = []

  bldgList: IBldg[] = []
  roomList: IRoominfo[] = []
  rateList: IRate[] = []
  seasonList: ISeason[] = []

  currRoomList: any[] = []
  dispList: any = []

  availRoominfo: IRoominfo[] = []
  unavailRoominfo: IRoominfo[] = []

  rsvnRoom: IRoom[] = []

  constructor(
    private genericService: GenericService,
    private rsvnService: RsvnService,
    private roomService: RoomService,
    private seasonService: SeasonService
  ) { }

  refreshRsvn() {
    this.genericService.getItem("rsvn", this.currRsvn.id).subscribe(
      data => {
        this.currRsvn = data
        this.currRsvnChange.emit(data)
      }
    )
  }

  assignRoom(roominfo: IRoominfo) {
    if (this.currNumRooms < Number(this.currRsvn.numrooms)) {
      this.genericService.getItemQueryList('room', `rsvn=${this.currRsvn.id}`)
        .subscribe(data => {
          if (data.length < this.currRsvn.numrooms) {


            let newroom = { rsvn: this.currRsvn.id, roominfo: roominfo.id, status: 'new' }
            this.genericService.updateItem("room", newroom)
              .subscribe(data => {
                this.ngOnInit()
                this.refreshRsvn();
              })
          }
        })
    }
  }
  makeList() {
    this.dispList = []
    this.bldgList.forEach(
      bdg => {
        let rates: any = []
        let bldg: IBldg = bdg
        let rms = this.availRoominfo.filter(r => r.bldg == bldg.id)
        this.rateList.forEach(rate => {
          rates.push({
            rate,
            rooms: rms.filter(x => x.rateAlias == rate.alias),
          })
        })
        this.dispList.push({ rates, bldg })
      }
    )
  }

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
  /*
    bldgText(bldg: number) {
      return this.bldgList.find(b => b.id == bldg)?.name
    }
  */

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['currRsvn'].firstChange) {
      this.ngOnInit()
    }

  }
  ngOnInit(): void {
    // Get Rate List
    if (this.currRsvn && this.currRsvn.id) {
      this.genericService.getItemList("rate")
        .subscribe(
          data => {
            this.rateList = this.sortRateList(data)
          })
    }
    // Looking at this rsvn date frame  - what is the state of rooms
    if (this.currRsvn && this.currRsvn.dateIn && this.currRsvn.dateOut) {
      // we are creating our UnAssigned Rooms here
      this.roomService.availableRooms(this.currRsvn.dateIn, this.currRsvn.dateOut)
        .subscribe(avail => {
          this.availRoominfo = avail
          this.genericService.getItemList("bldg").subscribe(
            bldgs => {
              this.bldgList = bldgs
              this.makeList()
            })
        })
    }
  }
}
