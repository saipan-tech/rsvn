import { Component, Input, OnInit } from '@angular/core';
import { DialogManagerService } from '@app/shared/dialog';
import { ICharge } from '@app/_interface/charge';
import { IRsvn } from '@app/_interface/rsvn';
import { ChargeInvoiceDialogComponent } from '../charge-invoice-dialog/charge-invoice-dialog.component';

@Component({
  selector: 'app-charge-ctrl',
  templateUrl: './charge-ctrl.component.html',
  styleUrls: ['./charge-ctrl.component.scss']
})
export class ChargeCtrlComponent {
  constructor(
    private dialogManagerService: DialogManagerService
  ) { }

  @Input() currRsvn:IRsvn = {} as IRsvn

  currCharge : ICharge = {} as ICharge
  grandTotal = 0
  balance = 0
  pmtSubTotal = 0
  chgSubTotal = 0
  roomSubTotal = 0

  changeCharge(event:ICharge) {
    this.currCharge = event
  }

  calcTotal(mode:any,event:any) {
    switch(mode) {
      case 'pmt' :
        this.pmtSubTotal = event;
      break;

      case 'room':
        this.roomSubTotal = event;
      break;

      case 'chg':
        this.chgSubTotal = event
      break;

    }
    this.grandTotal =  this.chgSubTotal + this.roomSubTotal - this.pmtSubTotal

  }

  handleInvoiceClick(): void {
    this.dialogManagerService.openDialog<ChargeInvoiceDialogComponent>(ChargeInvoiceDialogComponent, {
      data: {
        pmtSubTotal: this.pmtSubTotal,
        roomSubTotal: this.roomSubTotal,
        chgSubTotal: this.chgSubTotal,
        grandTotal: this.grandTotal,
        currRsvnId: this.currRsvn.id
      }
    });
  }
}

