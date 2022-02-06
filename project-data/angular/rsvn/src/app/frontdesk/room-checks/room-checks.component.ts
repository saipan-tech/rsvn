import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IGuest } from '@app/_interface/guest';
import { IRate } from '@app/_interface/rate';
import { IRoominfo } from '@app/_interface/roominfo';

import { IRsvn } from '@app/_interface/rsvn';
import { IRoom } from '@app/_interface/room';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { GenericService } from '@app/_services/generic.service';
import { RoomService } from '@app/_services/room.service';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-room-checks',
  templateUrl: './room-checks.component.html',
  styleUrls: ['./room-checks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomChecksComponent implements OnInit,OnChanges {


  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();
  roomQuery$ :any

  constructor(
    private roomService: RoomEntityService


  ) { }

  currNumRooms: number = 0

  ngOnChanges(changes:SimpleChanges) {
    if(! changes.currRsvn.firstChange) this.reload()
  }

  reload() {
    this.roomQuery$ = this.roomService.entities$
    .pipe(
      map(room => { 
        return room.filter(room => room.rsvn == this.currRsvn.id)
      })
    )
  }

  ngOnInit(): void {

    this.roomService.entities$.pipe(
      map(rooms => rooms.filter(r => r.rsvn == this.currRsvn.id))
    ).subscribe(d=>this.currNumRooms = d.length)

    this.reload()
  }

}
