import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IGuest } from '@app/_interface/guest';
import { IRate } from '@app/_interface/rate';
import { IRoominfo } from '@app/_interface/roominfo';

import { IRsvn } from '@app/_interface/rsvn';
import { IRoom } from '@app/_interface/room';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
//import { GenericService } from '@app/_services/generic.service';
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
  
  currRooms$: Observable<any[]>  = of() 

  constructor(
    private roomService: RoomEntityService,
    private roominfoService: RoominfoEntityService,
    private bldgService:BldgEntityService,
  //  private genericService: GenericService
  ) { }

  currNumRooms: number = 0

  ngOnChanges(changes:SimpleChanges) {
    if(! changes.currRsvn.firstChange) this.reload()
  }
// ===========================
  reload() {

    let currRooms$ = this.roomService.entities$.pipe(
      map(roomList => { 
        return roomList.filter(room => room.rsvn == this.currRsvn.id)
      })
    )
    this.currRooms$ = combineLatest([currRooms$,this.roominfoService.entities$,this.bldgService.entities$])
    .pipe(
      map(([r,rinfo,bldg]) => {
        let roomList:any = []
        this.currNumRooms = r.length;
        r.forEach(r => {
          let ri  = rinfo.find(ri=> r.roominfo == ri.id)
          roomList.push(
            {  room : r,
               roominfo : ri,
               bldg : bldg.find(b => b.id == ri?.bldg )
              })  
        })
        return roomList
     }))
    }

  ngOnInit(): void {
    this.reload()
  }

}
