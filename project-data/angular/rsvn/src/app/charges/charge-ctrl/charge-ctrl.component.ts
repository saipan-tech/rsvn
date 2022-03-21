import { Component, Input, OnInit } from '@angular/core';
import { ICharge } from '@app/_interface/charge';
import { IRsvn } from '@app/_interface/rsvn';
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
  ) { }

  @Input() currRsvn:IRsvn = {} as IRsvn
  
  currCharge : ICharge = {} as ICharge
  grandTotal = 0
  balance = 0
  pmtSubTotal = 0
  chgSubTotal = 0
  roomSubTotal = 0
  fullRoomList: any[] = [];

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
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '*', '*', 150 ],
    
            body: [
              [ 'Room Name', 'Room #', 'Price' ],
              ...this.roomCharges()
            ]
          }
        }
      ]
    };
    
    // open new tab
    var win = window.open('', '_blank');

    // load pdf in new tab
    pdfMake.createPdf(docDefinition).open({}, win);
  }

  roomCharges(): any[] {
    return this.fullRoomList.reduce((accu, room)=> {
      room.days.forEach((roomDay: any)=> {
        accu.push([roomDay.alias, room.roominfo.number,  roomDay.amount])
      })
      return accu
    }, []);
  }

  //--------------------------
  ngOnInit(): void {
    this.roomService.getRsvnCalc(this.currRsvn.id).subscribe((data: any) => {
      this.fullRoomList = data  
    }) 
  }
}

