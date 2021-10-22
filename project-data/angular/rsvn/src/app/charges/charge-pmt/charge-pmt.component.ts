import { IPayment } from '@app/_interface/payment'
import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { IBldg } from '@app/_interface/bldg';
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { IDropdown } from '@app/_interface/dropdown'
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';
import { ChargeService } from '@app/_services/charge.service';



@Component({
  selector: 'app-charge-pmt',
  templateUrl: './charge-pmt.component.html',
  styleUrls: ['./charge-pmt.component.scss']
})
export class ChargePmtComponent implements OnInit {

  @Input() currRsvn: any
  @Input() currPayment: IPayment = {} as IPayment
  @Output() currPaymentChange = new EventEmitter<IPayment>()

  constructor(

    private genericService: GenericService,
    private roomService: RoomService,
    private systemService: SystemService,
    private authService: AuthService,
    private appConstants: AppConstants,
    private chargeService: ChargeService

  ) { }

  form_error: any;
  user: any
  numDays = 0
  paymentList: IPayment[] = []
  roomList: IRoom[] = []
  roominfoList: IRoominfo[] = []
  bldgList: IBldg[] = []
  fullRoomList: any[] = []
  selectedValue = 0
  roomTotal = 0
  grandTotal = 0
  payTotal = 0
  balance = 0
  pmttypeList:IDropdown[] = []

  paymentEditForm = new FormGroup({
    id: new FormControl(''),
    item: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    descr: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    clerk: new FormControl(''),
    created: new FormControl(''),
  })


  //---------------------------------

  deletePayment(pmt: IPayment) {
    this.genericService.deleteItem('payment', pmt)
      .subscribe(data => {
        this.newPayment()
        this.currPaymentChange.emit(data)
      })
  }
  //---------------------------------

  selectPayment(pmt: IPayment) {
    this.genericService.getItem('payment', pmt.id)
      .subscribe(data => {
        console.log("new payments", data)
        this.currPayment = data
        this.currPaymentChange.emit(data)
        this.paymentEditForm.patchValue(this.currPayment)
      })
  }

  //--------------------------
  updatePayment(payment: IPayment) {
    if (this.currRsvn.id) {
      this.form_error = {}
      payment.rsvn = Number(this.currRsvn.id)
      payment.date = this.fromHTMLDate(payment.date)
      if (payment && !payment.clerk) {
        payment.clerk = this.user.username
      }
      payment = this.blankPayment(payment)
      this.genericService.updateItem('payment', payment).subscribe(
        data => {
          this.newPayment()
          this.ngOnInit()
        },
        err => console.log("Error", err)
      )
    }
  }
  //---------------------------------
  blankPayment(payment: any) {
    for (const field in payment) {
      if (payment[field] == null) {
        payment[field] = ''
      }
    }
    return payment
  }
  //--------------------------
  newPayment() {
    console.log("New Payment")
    this.paymentEditForm.reset()
    this.currPayment = {} as IPayment
  }
  //--------------------------

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit()
    console.log("ngOnChanges", this.currPayment)

    if (this.currPayment && this.currPayment.id) {
      this.paymentEditForm.patchValue(this.currPayment)

    } else {
      this.newPayment()
    }

  }

  //--------------------------
  paymentTally() {
    this.payTotal = 0
    this.paymentList.forEach(
      tt => {
        this.payTotal += tt.amount
      }
    )
  }
  //--------------------------
  paymentSort(chgs: IPayment[]) {
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
  ngOnInit(): void {
    this.systemService.getDropdownList('payitem').subscribe(
      data => this.pmttypeList = data
    )

    this.authService.getSession().subscribe(
      data => this.user = data
    )

    this.roomService.getRsvnRoomAll(this.currRsvn.id)
      .subscribe(data => {
        this.chargeService.getRsvnPayment(this.currRsvn.id)
          .subscribe(data => {
            this.paymentList = this.paymentSort(data)
            this.paymentTally()

          })
      })
  }
}

