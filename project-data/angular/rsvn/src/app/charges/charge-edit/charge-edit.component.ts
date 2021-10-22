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
  selector: 'app-charge-edit',
  templateUrl: './charge-edit.component.html',
  styleUrls: ['./charge-edit.component.scss']
})
export class ChargeEditComponent implements OnInit {

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

  form_error: any
  user: any
  numDays = 0
  chargeEditForm = new FormGroup({

    id: new FormControl(''),
    item: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    descr: new FormControl(''),
    count: new FormControl('', Validators.required),
    unit: new FormControl('', Validators.required),
    amount: new FormControl({ value: '', disabled: true }),
    clerk: new FormControl(''),
    created: new FormControl(''),

  })

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

  deleteCharge(chg:ICharge) {
    this.genericService.deleteItem('charge',chg)
      .subscribe(data => {
        this.newCharge()
        this.currChargeChange.emit(data)

      })

  }


//---------------------------------
  
  selectCharge(chg:ICharge) {
    this.genericService.getItem('charge',chg.id)
      .subscribe(data => {
        this.currCharge= data
        this.currChargeChange.emit(data)
        this.chargeEditForm.patchValue(this.currCharge)

      })

  }
  //---------------------------------
  toHTMLDate(d: Date) {
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = String(d.getFullYear())
    return `${year}-${month}-${day}`
  }
  //---------------------------------
  fromHTMLDate(date: string) {
    let ndate = new Date(`${date}`).toISOString().slice(0, 10)
    return ndate
  }
  //--------------------------
  updateCharge(charge: ICharge) {
    if (this.currRsvn.id) {
      this.form_error = {}
      charge.rsvn = Number(this.currRsvn.id)
      charge.date = this.fromHTMLDate(charge.date)
      if (charge && !charge.clerk) {
        charge.clerk = this.user.username
      }
      charge = this.blankCharge(charge)
      this.genericService.updateItem('charge', charge).subscribe(
        data => {
          this.newCharge()
          this.ngOnInit()
        },
        err => console.log("Error",err)


      )
    }
  }
 //---------------------------------
 blankCharge(charge: any) {
  for (const field in charge) {
    if (charge[field] == null) {
    charge [field] = ''
    }
  }
  return charge
}
  //--------------------------
  newCharge() {
    this.chargeEditForm.reset()
    this.currCharge = {} as ICharge
  }
  //--------------------------


  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit()
    
    if (this.currCharge && this.currCharge.id) {
      this.chargeEditForm.patchValue(this.currCharge)

    } else {
      this.newCharge()
    }

  }
  //--------------------------
  frlCheck(rms:any[]) {
    rms.forEach( r => {
     r.ratelist = {peakSeason:r.roominfo.rate.peakSeason,
                    highSeason: r.roominfo.rate.highSeason,
                    lowSeason: r.roominfo.rate.lowSeason,
                    offSeason: r.roominfo.rate.offSeason}
                    })
    return rms
  }
  //--------------------------

  newRoomall(roomall:IRoom) {
  this.ngOnInit()
}


  //--------------------------
  chargeTotal() {
    this.roomTotal = 0
    this.fullRoomList.forEach(
      rm => {
        this.roomTotal += rm.rateCharge * this.numDays
      }
    )
  }
  //--------------------------
  transTally() {
    this.transTotal = 0
    this.chargeList.forEach(
      tt => {
        this.transTotal += tt.amount
      }
    )
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

    this.roomService.getRsvnRoomAll(this.currRsvn.id)
      .subscribe(data => {
        this.fullRoomList = this.frlCheck(data)
        this.chargeTotal()

        this.chargeService.getRsvnCharge(this.currRsvn.id)
        .subscribe( data => {
          this.chargeList = this.chargeSort(data)
          this.transTally()
          this.grandTotal = this.roomTotal + this.transTotal
        })
      })

    this.numDays = ((new Date(this.currRsvn.dateOut).getTime() - new Date(this.currRsvn.dateIn).getTime()) / this.appConstants.DAILYSECONDS) 

    // fill roomList


    //    this.systemService.getDropdownList('status').subscribe(
    //      data => this.statusList = data
    //    )

  }

}
