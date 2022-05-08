import { ChargeService } from '@app/_services/charge.service';
import { ICharge } from '@app/_interface/charge';
import { IPayment } from "@app/_interface/payment";
import { format, parseISO } from 'date-fns';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Alignment } from "pdfmake/interfaces";

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export class ChargeInvoiceService {
  fullRoomList: any[] = [];
  roomChargeData: any = [];
  chargeList: ICharge[] = [];
  paymentList: IPayment[] = [];

  constructor(
    private chargeService: ChargeService,
  ){}

  public print({
    pmtSubTotal,
    roomSubTotal,
    chgSubTotal, 
    grandTotal,
    currRsvnId,
  }:{
    pmtSubTotal: number,
    roomSubTotal: number,
    chgSubTotal: number, 
    grandTotal: number,
    currRsvnId: number,
  }) {
    this.loadData(currRsvnId);

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
              ['', '', { text: 'Subtotal', style: 'totalCell'}, { text: `$${roomSubTotal.toFixed(2)}`, style: 'alignRight' }]
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
              ['', '', '', '', { text: 'Subtotal', style: 'totalCell' }, { text: `$${chgSubTotal.toFixed(2)}`, style: 'alignRight' }]
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
              ['',  '', { text: 'Subtotal', style: 'totalCell' }, { text: `$${pmtSubTotal.toFixed(2)}`, style: 'alignRight' }]
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
              [ '', { text: 'Total', style: 'totalCell' }, { text: `$${grandTotal.toFixed(2)}`, style: 'alignRight' }]
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
    return this.roomChargeData.reduce((accu: any[], roomCharges: any)=> {
      roomCharges.charges.forEach((charge: any)=> {
        accu.push([
          format(parseISO(charge.date), 'MM/dd/yyyy'),
          roomCharges.roominfo.rateAlias,
          { text: roomCharges.roominfo.number, style: 'alignRight' },
          { text: charge.amount, style: 'alignRight' }
        ])
      })

      return accu;
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

  loadData(currRsvnId: number): void {
    this.chargeService.getRsvnRoomCharge(currRsvnId).subscribe(data => {
      this.roomChargeData = data;
    })

    this.chargeService.getRsvnCharge(currRsvnId).subscribe(data => {
      this.chargeList = data;
    })

    this.chargeService.getRsvnPayment(currRsvnId).subscribe(data=> {
      this.paymentList = data;
    })
  }
};