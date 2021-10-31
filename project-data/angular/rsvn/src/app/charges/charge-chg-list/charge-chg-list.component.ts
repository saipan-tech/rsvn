import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { IGuest } from '@app/_interface/guest'
import { ICharge } from '@app/_interface/charge'
import { IDropdown} from '@app/_interface/dropdown'
import { GenericService } from '@app/_services/generic.service';
import { RsvnService } from '@app/_services/rsvn.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { RoomService } from '@app/_services/room.service';

import { ChargeService } from '@app/_services/charge.service';
import { MatRadioModule } from '@angular/material/radio';
import { AppConstants } from '@app/app.constants';
@Component({
  selector: 'app-charge-chg-list',
  templateUrl: './charge-chg-list.component.html',
  styleUrls: ['./charge-chg-list.component.scss']
})
export class ChargeChgListComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private roomService: RoomService,
    private chargeService: ChargeService,
    private systemService: SystemService,
    private authService: AuthService,
    private appConstants: AppConstants,
    

  ) { }
  @Input() currRsvn: any
  @Input() currCharge: ICharge = {} as ICharge
  @Output() currChargeChange = new EventEmitter<ICharge>()
  @Output() chgSubTotal = new EventEmitter<Number>()

  form_error: any
  user: any
  numDays = 0
  
  roomList: IRoom[] = []
  roominfoList: IRoominfo[] = []
  chargeList: ICharge[] = []
  bldgList: IBldg[] = []
  fullRoomList :any[] = []
  selectedValue =0
  roomTotal = 0
  grandTotal = 0
  transTotal = 0
  chgtypeList :IDropdown[] = []
  

//---------------------------------
  
  selectCharge(chg:ICharge) {
    
    this.genericService.getItem('charge',chg.id)
      .subscribe(data => {
        this.currCharge= data
        this.currChargeChange.emit(data)

      })

  }

  
  //--------------------------
  refreshChg() {
    this.ngOnInit()
  }
  //--------------------------


  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit()
    
    if (this.currCharge && this.currCharge.id) {

    } else {
    }

  }
  //--------------------------

  newRoomall(roomall:IRoom) {
  this.ngOnInit()
}
 
  //--------------------------
  transTally() {
    this.transTotal = 0
    this.chargeList.forEach(
      tt => {
        this.transTotal += tt.amount
      }
    )
    this.chgSubTotal.emit(this.transTotal)
  }
  //--------------------------
  chargeSort(chgs:ICharge[]) {
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

   this.chargeService.getRsvnCharge(this.currRsvn.id)
        .subscribe( data => {
          this.chargeList = this.chargeSort(data)
          this.transTally()
        })

    this.numDays = ((new Date(this.currRsvn.dateOut).getTime() - new Date(this.currRsvn.dateIn).getTime()) / this.appConstants.DAILYSECONDS) 

    // fill roomList


    //    this.systemService.getDropdownList('status').subscribe(
    //      data => this.statusList = data
    //    )

  }

}
