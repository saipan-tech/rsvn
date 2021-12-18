import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';

import { RsvnService } from '@app/_services/rsvn.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { IRoom } from '@app/_interface/room'
import { IBldg } from '@app/_interface/bldg'

import { IRoominfo } from '@app/_interface/roominfo'
import { IGuest } from '@app/_interface/guest'
import { ICharge } from '@app/_interface/charge'
import { ISeason } from '@app/_interface/season'
import { GenericService } from '@app/_services/generic.service';
import { RoomService } from '@app/_services/room.service';
import { SeasonService } from '@app/_services/season.service';

import { ChargeService } from '@app/_services/charge.service';
import { AppConstants } from '@app/app.constants';
import { subscribeOn } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-charge-line',
  templateUrl: './charge-line.component.html',
  styleUrls: ['./charge-line.component.scss']
})
export class ChargeLineComponent implements OnInit {

  @Input() roomall: any
  @Output() roomallChange = new EventEmitter<IRoom>();


  bldgList: IBldg[] = []
  roomTotal = 0

  constructor(
    private appConstants: AppConstants,
    private roomService: RoomService,
    private genericService: GenericService,
    private seasonService: SeasonService

  ) { }


  bldgName(id: number) {
    const b: any = this.bldgList.find(f => f.id == id)
    if (b) return b.name
    else return {}


  }
/*
  updateRoomCharge(season: any) {
    this.genericService.updateItem("room", {
      id: this.roomall.id,
      rateCharge: season.amount,
      rsvn: this.roomall.rsvn.id,
      roominfo: this.roomall.roominfo.id,
      status: "priced"
    })
      .subscribe(
        data => {
          this.roomallChange.emit(this.roomall)
        }
      )
  }
*/
  ngOnInit(): void {
    this.genericService.getItemList('bldg')
      .subscribe(
        data => {
          this.bldgList = data
          this.roomall.bldg = data.find(rec => rec.id == this.roomall.roominfo.bldg)
        }
      )
      this.roomall.days.forEach(
        (ra: { amount: number; }) => this.roomTotal += ra.amount
      )

  }
}



