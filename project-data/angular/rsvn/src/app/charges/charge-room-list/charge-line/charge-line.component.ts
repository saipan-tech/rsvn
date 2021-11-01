import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';

import { RsvnService } from '@app/_services/rsvn.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { IGuest } from '@app/_interface/guest'
import { ICharge } from '@app/_interface/charge'
import { ISeason } from '@app/_interface/season'
import { GenericService } from '@app/_services/generic.service';
import { RoomService } from '@app/_services/room.service';
import { SeasonService } from '@app/_services/season.service';

import { ChargeService } from '@app/_services/charge.service';
import { AppConstants } from '@app/app.constants';
import { ISeasonRate } from '@app/_interface/seasonrate';
import { subscribeOn } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-charge-line',
  templateUrl: './charge-line.component.html',
  styleUrls: ['./charge-line.component.scss']
})
export class ChargeLineComponent implements OnInit {

  @Input() roomall: IRoom | any
  @Output() roomallChange = new EventEmitter<IRoom>();

  numDays = 0
  selectSeason: any
  seasonrateList: ISeasonRate[] = []
  seasonList: ISeason[] = []
  seasonRate: ISeasonRate = {} as ISeasonRate
  aliasRates:any = []

  constructor(
    private appConstants: AppConstants,
    private roomService: RoomService,
    private genericService: GenericService,
    private seasonService: SeasonService

  ) { }



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

  ngOnInit(): void {
    this.genericService.getItemList('season')
        .subscribe(data => {
        this.seasonList = data
        this.seasonService.getSeasonRate(`alias=${this.roomall.roominfo.rateAlias}`)
          .subscribe(data2 => {
              data2.forEach( ar => {
                let aliasMerge = Object.assign(data.find(sl => sl.id == ar.season),ar)
                this.aliasRates.push(aliasMerge)
                if(this.roomall.rateCharge == ar.amount) {
                  this.selectSeason = aliasMerge
                  

                }
              })
          })
      })
    
    
    


    this.numDays = ((new Date(this.roomall.rsvn.dateOut).getTime() - new Date(this.roomall.rsvn.dateIn).getTime()) / this.appConstants.DAILYSECONDS)
  }

}



