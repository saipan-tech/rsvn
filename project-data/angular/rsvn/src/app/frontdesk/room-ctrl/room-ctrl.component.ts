import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRate } from '@app/_interface/rate'
import { IRoominfo } from '@app/_interface/roominfo'
import { ISeason } from '@app/_interface/season'
import { IGuest } from '@app/_interface/guest'
import { DangerDialogComponent, DialogManagerService } from "@app/shared/dialog";
import { map, concatMap, tap, mergeMap } from 'rxjs/operators';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { combineLatest, iif, Observable, of } from 'rxjs';


@Component({
  selector: 'app-room-ctrl',
  templateUrl: './room-ctrl.component.html',
  styleUrls: ['./room-ctrl.component.scss']
})
export class RoomCtrlComponent implements OnInit {


  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  @Input() currGuest: any
  @Output() currGuestChange = new EventEmitter<IGuest>();

  
  constructor(
  ) { }





  //=================================
  //=================================

  // scan to be sure no expired reservation has rooms checked in if so check out
  // make sure occupied rooms have an associated valid room reservation
  //=================================
  ngOnInit(): void {
   
  }
  //=================================
  ngOnDestroy() {
  }
}
//=================================

