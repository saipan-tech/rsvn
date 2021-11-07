import { IPayment } from '@app/_interface/payment'
import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { IDropdown } from '@app/_interface/dropdown'
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';


@Component({
  selector: 'app-charge-pmt-edit',
  templateUrl: './charge-pmt-edit.component.html',
  styleUrls: ['./charge-pmt-edit.component.scss']
})

export class ChargePmtEditComponent implements OnInit {
  @Input() currRsvn: any
  @Input() currPayment: IPayment = {} as IPayment
  @Output() currPaymentChange = new EventEmitter<IPayment>()

  constructor(
     private genericService: GenericService,
    private systemService: SystemService,
    private authService: AuthService,

  ) { }

  form_error: any;
  user: any
 
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
 
  //--------------------------
  updatePayment(payment: IPayment) {
    if (this.currRsvn.id) {
      this.form_error = {}
      payment.rsvn = Number(this.currRsvn.id)
      payment.date = this.systemService.fromHTMLDate(payment.date)
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
    this.paymentEditForm.reset()
    this.currPayment = {} as IPayment
    this.currPaymentChange.emit(this.currPayment)

  }
   
  //--------------------------

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit()
  
    if (this.currPayment && this.currPayment.id) {
      this.paymentEditForm.patchValue(this.currPayment)
    } else {
      this.newPayment()
    }
  }
  //--------------------------
  ngOnInit(): void {
    this.systemService.getDropdownList('payitem').subscribe(
      data => this.pmttypeList = data
    )
    this.authService.getSession().subscribe(
      data => this.user = data
    )

  }
}
