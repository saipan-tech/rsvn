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
  
  currRooms$: Observable<IRoom[]>  = of() 

  constructor(
    private roomService: RoomEntityService,
    private genericService: GenericService



  ) { }

  currNumRooms: number = 0

  ngOnChanges(changes:SimpleChanges) {
    if(! changes.currRsvn.firstChange) this.reload()
  }

  reload() {

    this.currRooms$ = this.roomService.entities$.pipe(
      map(rooms => { 
        let r =  rooms.filter(r => r.rsvn == this.currRsvn.id)
        this.currNumRooms = r.length
        return r
      })
    )
  }

  ngOnInit(): void {
    this.reload()
  }

}
