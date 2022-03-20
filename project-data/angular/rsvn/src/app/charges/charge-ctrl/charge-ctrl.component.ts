import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IRsvn } from '@app/_interface/rsvn';
import { ICharge } from '@app/_interface/charge';
import { jsPDF } from "jspdf";
@Component({
  selector: 'app-charge-ctrl',
  templateUrl: './charge-ctrl.component.html',
  styleUrls: ['./charge-ctrl.component.scss']
})
export class ChargeCtrlComponent implements OnInit {

  constructor(
    

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
    this.ngOnInit()
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

  handlePrintInvoiceClick() {
    const doc = new jsPDF();
    const tableEl = document.createElement('table');
    const trEl = document.createElement('tr')
    const tdEl = document.createElement('td')
    tdEl.textContent = 'Here\'s your invoice';
    tableEl.appendChild(trEl.appendChild(tdEl));
    doc.html(tableEl, {
      callback: function (doc) {
        doc.save("invoice.pdf");
      }
    })
  }

  //--------------------------
  ngOnInit(): void {
    
  }
}

