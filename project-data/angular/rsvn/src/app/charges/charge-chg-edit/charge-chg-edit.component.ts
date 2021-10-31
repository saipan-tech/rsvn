import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { ICharge } from '@app/_interface/charge'
import { IDropdown} from '@app/_interface/dropdown'
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
@Component({
  selector: 'app-charge-chg-edit',
  templateUrl: './charge-chg-edit.component.html',
  styleUrls: ['./charge-chg-edit.component.scss']
})
export class ChargeChgEditComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private authService: AuthService,
    

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
    //--------------------------
  updateCharge(charge: ICharge) {
    if (this.currRsvn.id) {
      this.form_error = {}
      charge.rsvn = Number(this.currRsvn.id)
      charge.date = this.systemService.fromHTMLDate(charge.date)
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
    this.currChargeChange.emit(this.currCharge)
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
  ngOnInit(): void {
    this.authService.getSession().subscribe(
      data => this.user = data
    )
    this.systemService.getDropdownList('chgitem').subscribe(
      data => this.chgtypeList = data
    )


  }

}
