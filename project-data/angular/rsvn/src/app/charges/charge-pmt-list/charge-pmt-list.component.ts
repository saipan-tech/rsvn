import { IPayment } from '@app/_interface/payment'
import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IDropdown } from '@app/_interface/dropdown'
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';
import { ChargeService } from '@app/_services/charge.service';


@Component({
  selector: 'app-charge-pmt-list',
  templateUrl: './charge-pmt-list.component.html',
  styleUrls: ['./charge-pmt-list.component.scss']
})
export class ChargePmtListComponent implements OnInit {

  @Input() currRsvn: any
  @Input() currPayment: IPayment = {} as IPayment
  @Output() currPaymentChange = new EventEmitter<IPayment>()
  @Output() pmtSubTotal = new EventEmitter<Number>()

  constructor(

    private genericService: GenericService,
    private roomService: RoomService,
    private chargeService: ChargeService

  ) { }

  form_error: any;
  user: any
  numDays = 0
  paymentList: IPayment[] = []
  roomTotal = 0
  grandTotal = 0
  payTotal = 0
  balance = 0
  pmttypeList:IDropdown[] = []
//---------------------------------
  blankPayment(payment: any) {
    for (const field in payment) {
      if (payment[field] == null) {
        payment[field] = ''
      }
    }
    return payment
  }
   //---------------------------------
   selectPayment(pmt: IPayment) {
    this.genericService.getItem('payment', pmt.id)
      .subscribe(data => {
        this.currPayment = data
        this.currPaymentChange.emit(data)
      })
  }
  //--------------------------
  refreshPmt() {
    this.ngOnInit()
  }

  //--------------------------
  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit()
  }
  //--------------------------
  paymentTally() {
    this.payTotal = 0
    this.paymentList.forEach(
      tt => {
        this.payTotal += Number(tt.amount)
      }
    )
    this.pmtSubTotal.emit(this.payTotal)
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
  //--------------------------
  ngOnInit(): void {
 
    this.genericService.getItemQueryList('roomall',`rsvn=${this.currRsvn.id}`)
      .subscribe(data => {
        this.chargeService.getRsvnPayment(this.currRsvn.id)
          .subscribe(data => {
            this.paymentList = this.paymentSort(data)
            this.paymentTally()

          })
      })
  }
}
