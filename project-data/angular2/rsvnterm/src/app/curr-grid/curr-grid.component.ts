import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { IStatuslog } from '@app/_interface/statuslog'
import { IGuest } from '@app/_interface/guest'
import { IDropdown } from '@app/_interface/dropdown'
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';

import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-curr-grid',
  templateUrl: './curr-grid.component.html',
  styleUrls: ['./curr-grid.component.scss']
})
export class CurrGridComponent implements OnInit {

  bldgList: IBldg[] = []
  roomList: IRoominfo[] = []
  dispList: any = []
  roomstatusList: IDropdown[] = []
  user: any
  currRoominfo: IRoominfo = {} as IRoominfo
  currBldg:any   
  statuslogList: IStatuslog[] = []
  @Input() cellMenu: any[] = []

  // -------------------------------------------

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private roomService: RoomService,
    private authService: AuthService,

    private appCons: AppConstants,
  ) { }
  
  setCurrent(r:IRoominfo) {
    this.currBldg = this.bldgList.find(bl => bl.id == r.bldg)
    this.currRoominfo = r
  }

  logView(r: IRoominfo) {
    this.setCurrent(r) 
    this.roomService.getStatusLog(r.id)
      .subscribe(data => {
        this.statuslogList = data
      })
  }
  // -------------------------------------------
  setStatus(newstatus: any, r: IRoominfo) {
    let statuslog = {} as IStatuslog
    statuslog.id = 0
    statuslog.roominfo = r.id
    statuslog.from_status = r.status
    statuslog.to_status = newstatus
    statuslog.clerk = this.user.username
    if (newstatus != r.status) {
      r.status = newstatus
      this.genericService.updateItem("roominfo", r)
        .subscribe(data => {
          this.genericService.updateItem('statuslog', statuslog)
            .subscribe(
              data => {
                this.logView(r)
              }
            )
        })
    }
  }
  // -------------------------------------------
  makeList() {
    this.dispList = []
    this.bldgList.forEach(
      bld => {
        let rooms = this.roomList.filter(r => r.bldg == bld.id)
        let bldg = bld.name
        this.dispList.push({ bldg, rooms })
      }
    )
  }

  // -------------------------------------------

  ngOnChanges(changs: SimpleChanges) {
    this.ngOnInit()
  }
  // -------------------------------------------
  ngOnInit(): void {
    this.authService.getSession().subscribe(
      data => this.user = data
    )
    this.systemService.getDropdownList('roomstatus').subscribe(
      data => 
      {
        this.roomstatusList = data
        console.log(data)
      }
    )
    this.genericService.getItemList('roominfo')
      .subscribe(data => {
        this.roomList = data
        this.genericService.getItemList("bldg").subscribe(
          bldgs => {
            this.bldgList = bldgs
            this.makeList()
          }
        )
      })
  }
}
