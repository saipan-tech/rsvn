import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { ICharge } from '@app/_interface/charge'
import { IDropdown } from '@app/_interface/dropdown'
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { RoomService } from '@app/_services/room.service';

import { ChargeService } from '@app/_services/charge.service';
import { AppConstants } from '@app/app.constants';
import { from } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
@Component({
  selector: 'app-charge-room-list',
  templateUrl: './charge-room-list.component.html',
  styleUrls: ['./charge-room-list.component.scss']
})
export class ChargeRoomListComponent implements OnInit {

  constructor(
    private roomService: RoomService,
    private systemService: SystemService,
    private authService: AuthService,
    private appConstants: AppConstants,
    private genericService: GenericService
  ) { }
  @Input() currRsvn: any
  @Input() currCharge: ICharge = {} as ICharge
  @Output() currChargeChange = new EventEmitter<ICharge>()
  @Output() roomSubTotal = new EventEmitter<Number>()

  form_error: any
  user: any
  numDays = 0
  roomList: IRoom[] = []
  roominfoList: IRoominfo[] = []
  chargeList: ICharge[] = []
  bldgList: IBldg[] = []
  fullRoomList: any[] = []
  selectedValue = 0
  roomTotal = 0
  grandTotal = 0
  transTotal = 0
  chgtypeList: IDropdown[] = []

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.currRsvn.firstChange) {
      this.ngOnInit()
    }

  }
  //--------------------------

  newRoomall(roomall: IRoom) {
    this.ngOnInit()
  }


  //--------------------------
  chargeTotal() {
    this.roomTotal = 0
//    console.log(this.fullRoomList)
    this.fullRoomList.forEach(
      rm  => {
        let rr = {} as {days:any[],roominfo:any}
        rr = rm
        rr.days.forEach(
          r =>  {
            this.roomTotal += Number(r.amount) 
          }
        )
      }
   )
    this.roomSubTotal.emit(this.roomTotal)
  }

  //--------------------------
  chargeSort(chgs: ICharge[]) {
    chgs.sort((a, b) => {
      if (a.date < b.date) {
        return -1
      }
      if (a.date > b.date) {
        return 1
      }
      return 0
    })
    return chgs
  }
  //--------------------------
  ngOnInit(): void {
    this.authService.getSession().subscribe(
      data => this.user = data
    )
    this.systemService.getDropdownList('chgitem').subscribe(
      data => this.chgtypeList = data
    )
    
    this.roomService.getRsvnCalc(this.currRsvn.id)
      .subscribe(data => {
        this.fullRoomList = data  
        console.log(data)
        this.chargeTotal()
        
      })
   
    this.numDays = ((new Date(this.currRsvn.dateOut).getTime() - new Date(this.currRsvn.dateIn).getTime()) / this.appConstants.DAILYSECONDS)

  
  }

}
