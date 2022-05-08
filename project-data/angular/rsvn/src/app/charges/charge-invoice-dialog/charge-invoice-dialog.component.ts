import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChargeInvoiceDialogService } from './charge-invoice-dialog.service';


@Component({
  selector: 'app-charge-invoice-dialog',
  templateUrl: './charge-invoice-dialog.component.html',
  styleUrls: ['./charge-invoice-dialog.component.scss']
})
export class ChargeInvoiceDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      pmtSubTotal: number,
      roomSubTotal: number,
      chgSubTotal: number, 
      grandTotal: number,
      currRsvnId: number,
    },
    private chargeInvoiceDialogService: ChargeInvoiceDialogService
  ){}

  handlePrintInvoiceClick(): void {
    this.chargeInvoiceDialogService.print({
      pmtSubTotal: this.data.pmtSubTotal,
      roomSubTotal: this.data.roomSubTotal,
      chgSubTotal: this.data.chgSubTotal, 
      grandTotal: this.data.grandTotal,
      currRsvnId: this.data.currRsvnId,
    });
  }

}
