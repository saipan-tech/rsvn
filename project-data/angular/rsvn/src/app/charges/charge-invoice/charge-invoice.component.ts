import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChargeInvoiceService } from './charge-invoice.service';


@Component({
  selector: 'app-charge-invoice',
  templateUrl: './charge-invoice.component.html',
  styleUrls: ['./charge-invoice.component.scss']
})
export class ChargeInvoiceComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      pmtSubTotal: number,
      roomSubTotal: number,
      chgSubTotal: number, 
      grandTotal: number,
      currRsvnId: number,
    },
    private chargeInvoiceService: ChargeInvoiceService
  ){}

  handlePrintInvoiceClick(): void {
    this.chargeInvoiceService.print({
      pmtSubTotal: this.data.pmtSubTotal,
      roomSubTotal: this.data.roomSubTotal,
      chgSubTotal: this.data.chgSubTotal, 
      grandTotal: this.data.grandTotal,
      currRsvnId: this.data.currRsvnId,
    });
  }

}
