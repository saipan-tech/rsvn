import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'

import { IGuest } from '@app/_interface/guest'
import { GenericService } from '@app/_services/generic.service';
import { RsvnService } from '@app/_services/rsvn.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';
import { RsvnListComponent } from '../rsvn-list/rsvn-list.component';
import { SystemService } from '@app/_services/system.service';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, OnChanges {

  bldgList: IBldg[] = []
  roomList: IRoominfo[] = []
  gridList: IRsvn[] = []
  dispList: any = []
  rsvnRoomList: any[] = []
  dayList: any = []
  view = 0
  gridwidth = 0;
  today = new Date().toISOString().slice(0, 10)
  selected: any
  sliderValue: any
  // -------------------------------------------
  @Input() currDateStart = this.addDay(this.today, -4)
  @Input() days = 24
  @Output() gridSelect = new EventEmitter<IRsvn>()
  currDateEnd = ""
  // -------------------------------------------

  constructor(
    private genericService: GenericService,
    private rsvnService: RsvnService,
    private roomService: RoomService,
    private appCons: AppConstants,
    private systemService: SystemService
  ) { }


  slide() {
    this.ngOnInit()
  }


  // -------------------------------------------
  changeDate() {
    this.ngOnInit()
  }
  // -------------------------------------------
  toDate(da: string) {
    return new Date(da).toISOString().slice(0.10)
  }
  // -------------------------------------------
  viewBump(view: number) {
    this.view = (view + 1) % 2

  }
  // -------------------------------------------
  makeList(bldg: IBldg[], roominfo: IRoominfo[]) {
    this.dispList = []
    bldg.forEach(
      bld => {
        let rooms = roominfo.filter(r => r.bldg == bld.id)
        let bldg = bld.name
        rooms.forEach(rms => {
          rms.info = this.rsvnRoomList.filter(rvl => rvl.roomid == rms.id)
        })
        this.dispList.push({ bldg, rooms })
      }
    )
   
  }

  // -------------------------------------------
  addDay(day: string, offset: number) {
    return new Date(new Date(day).getTime() + (this.appCons.DAILYSECONDS * offset)).toISOString().slice(0, 10)
  }
  // -------------------------------------------

  extractRooms(roomlist: any[]) {
    this.rsvnRoomList = []
    roomlist.forEach(rl => {
      var roomid = rl.roominfo.id
      var rsvnid = rl.rsvn.id;
      var dateIn = rl.rsvn.dateIn;
      var dateOut = rl.rsvn.dateOut;
      var primary: any = rl.rsvn.primary;
      var rsvnc = rl.rsvn.color;
      this.rsvnRoomList.push({ roomid, rsvnid, dateIn, dateOut, primary, rsvnc })
    }
    )
  }
  viewRefresh() {
    this.ngOnInit()
  }
  gridSelected(rec: any) {
    this.gridSelect.emit(rec)
  }


  shiftDate(d:string) {
    this.currDateStart = this.addDay(d,-2)
    this.ngOnInit()

  }
  // -------------------------------------------

  ngOnChanges(changs: SimpleChanges) {
    this.ngOnInit()
  }
  // -------------------------------------------
  ngOnInit(): void {
    this.gridwidth = 100 / (Number(this.days) + 1)
    this.dayList = this.systemService.daylister(this.currDateStart, this.days)
    this.currDateEnd = this.addDay(this.currDateStart, this.days)
    this.roomService.roomScan(this.currDateStart, this.currDateEnd)
      .subscribe(room => {
        this.extractRooms(room)
        this.genericService.getItemList("roominfo")
          .subscribe(roominfo => {
            this.genericService.getItemList("bldg")
              .subscribe(bldg => {
                this.makeList(bldg, roominfo)
              })
          })
      })
  }
}
