import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { IGuest } from '@app/_interface/guest'
import { ICharge } from '@app/_interface/charge'
import { GenericService } from '@app/_services/generic.service';
import { RsvnService } from '@app/_services/rsvn.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { RoomService } from '@app/_services/room.service';

import { ChargeService } from '@app/_services/charge.service';
import {MatRadioModule} from '@angular/material/radio';
@Component({
  selector: 'app-charge-edit',
  templateUrl: './charge-edit.component.html',
  styleUrls: ['./charge-edit.component.css']
})
export class ChargeEditComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private roomService: RoomService,
    private chargeService: ChargeService,
    private systemService: SystemService,
    private authService: AuthService,

  ) { }
  @Input() currRsvn:any
  @Input() currCharge: ICharge = {} as ICharge

  @Output() currChargeChange = new EventEmitter<ICharge>()


  form_error:any
  user : any
  
    chargeEditForm = new FormGroup({

      id: new FormControl(''),
      item: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      descr:new FormControl(''),
      count: new FormControl('', Validators.required),
      unit: new FormControl('', Validators.required),
      amount: new FormControl({ value: '', disabled: true }),
      clerk: new FormControl(''),
      created: new FormControl(''),

   })

   deleteCharge() {
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
    this.genericService.updateItem('charge', charge).subscribe(
      data => {
        this.chargeEditForm.reset()
        this.currChargeChange.emit(data)
      }

    )
  }
}

//--------------------------
newCharge() {
  this.chargeEditForm.reset()
  this.currCharge = {} as ICharge
}


//--------------------------

  ngOnChanges(changes : SimpleChanges) {
    console.log("Changing in editor",changes)
    
    this.chargeEditForm.reset()
    if(changes.currCharge) {
      this.chargeEditForm.patchValue(this.currCharge)
    }
    this.ngOnInit()
  }

//--------------------------
  ngOnInit(): void {
     this.authService.getSession().subscribe(
      data => this.user = data
    )
//    this.systemService.getDropdownList('status').subscribe(
//      data => this.statusList = data
//    )
    
  }

}
