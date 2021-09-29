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
import { RESOURCE_CACHE_PROVIDER } from '@angular/platform-browser-dynamic';
import { RsvnListComponent } from '../rsvn-list/rsvn-list.component';


@Component({
  selector: 'app-curr-grid',
  templateUrl: './curr-grid.component.html',
  styleUrls: ['./curr-grid.component.css']
})
export class CurrGridComponent implements OnInit {

  bldgList: IBldg[] = []
  roomList: IRoominfo[] = []
  dispList: any = []
// -------------------------------------------
  
  constructor(
    private genericService: GenericService,
    private rsvnService: RsvnService,
    private roomService: RoomService,
    private appCons: AppConstants,
  ) { }

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

  ngOnChanges(changs:SimpleChanges) {
    this.ngOnInit()
  }
  // -------------------------------------------
  ngOnInit(): void {
    this.roomService.getRoominfoList()
      .subscribe(data => {
        this.roomList = data
        this.genericService.getItemList("bldg").subscribe(
          bldgs => {
            this.bldgList = bldgs
            this.makeList()
          }
        )
      }
      )
    }

}
