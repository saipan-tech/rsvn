import { Component, Input, OnInit } from '@angular/core';
import { ICharge } from '@app/_interface/charge';
import { IRsvn } from '@app/_interface/rsvn';
import { ChargeService } from '@app/_services/charge.service';
import { RoomService } from '@app/_services/room.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

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
            widths: [ '*', '*', '*', 150 ],
            body: [
              [ 'Date', 'Room Name', 'Room #', 'Price' ],
              ...this.roomCharges(),
              ['', '', 'Subtotal', this.roomChargesSubtotal()]
            ]
          },
        },
        {text: 'Charges', style: 'subheader'},
        {
          style: 'invoiceTable',
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [ '*', '*', '*', '*', '*', 150 ],
            body: [
              [ 'Date', 'Item', 'Description', 'Count', 'Unit', 'Amount' ],
              ...this.charges(),
              ['', '', '', '', 'Subtotal', this.chargesSubtotal()]
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
        accu.push([roomDay.date, roomDay.alias, room.roominfo.number,  roomDay.amount])
      })
      return accu
    }, []);
  }

  roomChargesSubtotal(): string {
    return this.roomCharges().reduce((total, charge): number => charge[3] as number + total, 0).toFixed(2)
  }

  charges(): any[] {
    return this.chargeList.map((charge)=> [
      charge.date,
      charge.item,
      charge.descr,
      charge.count,
      charge.unit,
      Number(charge.amount).toFixed(2),
    ])
  }

  chargesSubtotal(): string {
    return this.chargeList.reduce((total, charge: ICharge): number => charge.amount + total, 0).toFixed(2)
  }

  //--------------------------
  ngOnInit(): void {
    this.roomService.getRsvnCalc(this.currRsvn.id).subscribe((data: any) => {
      this.fullRoomList = data
    })
    this.chargeService.getRsvnCharge(this.currRsvn.id).subscribe(data => {
      this.chargeList = data;
    })
  }
}

