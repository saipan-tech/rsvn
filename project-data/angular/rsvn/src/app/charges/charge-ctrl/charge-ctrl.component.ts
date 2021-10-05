import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { IGuest } from '@app/_interface/guest'
import { ITransaction } from '@app/_interface/transaction'
import { GenericService } from '@app/_services/generic.service';
import { RsvnService } from '@app/_services/rsvn.service';
import { RoomService } from '@app/_services/room.service';
import {MatRadioModule} from '@angular/material/radio';
@Component({
  selector: 'app-charge-ctrl',
  templateUrl: './charge-ctrl.component.html',
  styleUrls: ['./charge-ctrl.component.css']
})
export class ChargeCtrlComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private roomService: RoomService,

  ) { }

  @Input() currRsvn: any
  currTrans : ITransaction | any

  
    transEditForm = new FormGroup({

      id: new FormControl(''),
      item: new FormControl('', Validators.required),
      descr:new FormControl(''),
      count: new FormControl('', Validators.required),
      unit: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      clerk: new FormControl(''),
      created: new FormControl(''),

   })

   clearTransaction() {
   }
   updateTransaction(trans:ITransaction) {

   }

   ngOnInit(): void {
  }
}









