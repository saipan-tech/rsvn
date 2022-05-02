import { Component, Input, OnInit } from '@angular/core';
import { ICharge } from '@app/_interface/charge';
import { IPayment } from "@app/_interface/payment";
import { IRsvn } from '@app/_interface/rsvn';
import { ChargeService } from '@app/_services/charge.service';
import { RoomService } from '@app/_services/room.service';
import { format, parseISO } from 'date-fns';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Alignment } from "pdfmake/interfaces";

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-charge-ctrl',
  templateUrl: './charge-ctrl.component.html',
  styleUrls: ['./charge-ctrl.component.scss']
})
export class ChargeCtrlComponent implements OnInit {

  constructor(
    private roomService: RoomService,
    private chargeService: ChargeService,
  ) { }

  @Input() currRsvn:IRsvn = {} as IRsvn

  currCharge : ICharge = {} as ICharge
  grandTotal = 0
  balance = 0
  pmtSubTotal = 0
  chgSubTotal = 0
  roomSubTotal = 0
  fullRoomList: any[] = [];
  chargeList: ICharge[] = [];
  paymentList: IPayment[] = [];

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
    var docDefinition = {
      content: [
        {text: 'Invoice', style: 'header'},
        {text: 'Room Charges', style: 'subheader'},
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [ 70, '*', 50, 100 ],
            body: [
              [ 'Date', 'Room Name', 'Room #', 'Price' ],
              ...this.roomCharges(),
              ['', '', { text: 'Subtotal', style: 'totalCell'}, { text: `$${this.roomSubTotal.toFixed(2)}`, style: 'alignRight' }]
            ]
          },
        },
        {text: 'Charges', style: 'subheader'},
        {
          style: 'invoiceTable',
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [ 70, '*', '*', 40, 50, 100 ],
            body: [
              [ 'Date', 'Item', 'Description', 'Count', 'Unit', 'Amount' ],
              ...this.charges(),
              ['', '', '', '', { text: 'Subtotal', style: 'totalCell' }, { text: `$${this.chgSubTotal.toFixed(2)}`, style: 'alignRight' }]
            ]
          }
        },
        {text: 'Payments', style: 'subheader'},
        {
          style: 'invoiceTable',
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [ 70,  '*', '*', 100 ],
            body: [
              [ 'Date', 'Item', 'Description', 'Amount' ],
              ...this.payments(),
              ['',  '', { text: 'Subtotal', style: 'totalCell' }, { text: `$${this.pmtSubTotal.toFixed(2)}`, style: 'alignRight' }]
            ]
          }
        },
        {text: 'Total', style: 'subheader'},
        {
          style: 'invoiceTable',
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [ '*', 50, 100 ],
            body: [
              [  '', '', '' ],
              [ '', { text: 'Taxes', style: 'alignRight' }, { text: `$${0}`, style: 'alignRight' }],
              [ '', { text: 'Other', style: 'alignRight' }, { text: `$${0}`, style: 'alignRight' }],
              [ '', { text: 'Total', style: 'totalCell' }, { text: `$${this.grandTotal.toFixed(2)}`, style: 'alignRight' }]
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10] as [number, number, number, number]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5] as [number, number, number, number]
        },
        invoiceTable: {
          margin: [0, 5, 0, 15] as [number, number, number, number]
        },
        alignRight: {
          alignment: 'right' as Alignment
        },
        totalCell: {
          bold: true,
          alignment: 'right' as Alignment
        }
      },
    };

    // open new tab
    var win = window.open('', '_blank');

    // load pdf in new tab
    pdfMake.createPdf(docDefinition).open({}, win);
  }

  roomCharges(): any[] {
    return this.fullRoomList.reduce((accu, room)=> {
      room.days.forEach((roomDay: any)=> {
        accu.push([
          format(parseISO(roomDay.date), 'MM/dd/yyyy'),
          roomDay.alias,
          { text: room.roominfo.number, style: 'alignRight' },
          { text: roomDay.amount, style: 'alignRight' }
        ])
      })
      return accu
    }, []);
  }

  charges(): any[] {
    return this.chargeList.map((charge)=> [
      format(parseISO(charge.date), 'MM/dd/yyyy'),
      charge.item,
      charge.descr,
      { text: charge.count, style: 'alignRight' },
      { text: charge.unit, style: 'alignRight' },
      { text: Number(charge.amount).toFixed(2), style: 'alignRight' },
    ])
  }

  payments(): any[] {
    return this.paymentList.map((payment: IPayment)=> [
      format(parseISO(payment.date), 'MM/dd/yyyy'),
      payment.item,
      payment.descr,
      { text: Number(payment.amount).toFixed(2), style: 'alignRight' },
    ]);
  }

  //--------------------------
  ngOnInit(): void {
    this.roomService.getRsvnCalc(this.currRsvn.id).subscribe((data: any) => {
      this.fullRoomList = data
    })
    this.chargeService.getRsvnCharge(this.currRsvn.id).subscribe(data => {
      this.chargeList = data;
    })
    this.chargeService.getRsvnPayment(this.currRsvn.id).subscribe(data=> {
      this.paymentList = data;
    })
  }
}

