import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';

import { RsvnService } from '@app/_services/rsvn.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { IGuest } from '@app/_interface/guest'
import { ICharge } from '@app/_interface/charge'
import { GenericService } from '@app/_services/generic.service';
import { RoomService } from '@app/_services/room.service';
import { ChargeService } from '@app/_services/charge.service';
import { AppConstants } from '@app/app.constants';
@Component({
  selector: 'app-charge-line',
  templateUrl: './charge-line.component.html',
  styleUrls: ['./charge-line.component.scss']
})
export class ChargeLineComponent implements OnInit {
@Input()  roomall:IRoom | any 
@Output() roomallChange = new EventEmitter<IRoom>();
 numDays = 0
selectRate : any


constructor(
    private appConstants: AppConstants,
    private roomService : RoomService,
    private genericService :GenericService



  ) { }

updateRoomCharge(charge:any){
  this.genericService.getItem('room',this.roomall.id)
    .subscribe( data => {
      data.rateCharge=charge
      this.genericService.updateItem('room',data)
        .subscribe(
          data2 => {
            this.roomall.rateCharge = data2.rateCharge
            this.roomallChange.emit(this.roomall)
          }
        )
    })
}
   
  ngOnInit(): void {

    this.numDays = ((new Date(this.roomall.rsvn.dateOut).getTime() - new Date(this.roomall.rsvn.dateIn).getTime()) / this.appConstants.DAILYSECONDS) 
    this.selectRate = this.roomall.rateCharge
  }

}
