import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { IGuest } from '@app/_interface/guest'
import { ICharge } from '@app/_interface/charge'
import { GenericService } from '@app/_services/generic.service';
import { RsvnService } from '@app/_services/rsvn.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { RoomService } from '@app/_services/room.service';

import { ChargeService } from '@app/_services/charge.service';
import {MatRadioModule} from '@angular/material/radio';
@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrls: ['./charge-list.component.css']
})
export class ChargeListComponent implements OnInit {
  
  
  @Input() currRsvn : IRsvn = {} as IRsvn
  chargeList : ICharge[] = []


  constructor(
    private genericService: GenericService,
    private roomService: RoomService,
    private chargeService: ChargeService,
    private systemService: SystemService,
    private authService: AuthService,

  ) { }
  
  ngOnChanges(changes : SimpleChanges) {
    console.log("Changing RSVN")
    this.ngOnInit()
  }

  ngOnInit(): void {

    if( this.currRsvn && this.currRsvn.id) {
      this.chargeService.getRsvnCharge(this.currRsvn.id)
       .subscribe(data => {
         this.chargeList = data
         
       })
    }

  }

}
