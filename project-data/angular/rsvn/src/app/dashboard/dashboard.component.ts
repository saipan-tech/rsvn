import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { GuestEntityService } from '@app/_ngrxServices/guest-entity.service';
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { catchError, tap, map, mergeMap, concatMap, startWith } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { IRoom } from '@app/_interface/room';
import { IRoominfo } from '@app/_interface/roominfo';
import { IBldg } from '@app/_interface/bldg';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    private roominfoService: RoominfoEntityService,
    private roomService: RoomEntityService,
    private bldgService: BldgEntityService,
    private rsvnService:RsvnEntityService,
    private guestService:GuestEntityService
  ) { }

  rsvnList: any;
  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
  workList$:Observable<any> = of()

  reload() {
    var activeRsvn$ = this.rsvnService.entities$
    .pipe(map(rsvns => rsvns.filter(rsvn => rsvn.dateIn <= this.Today && rsvn.dateOut >= this.Today)))
    var activeRoom$ = this.roomService.entities$
    .pipe(map(rooms => rooms.filter(room => room.dateIn <= this.Today && room.dateOut >= this.Today)))
    
    let mergedRooms$ = combineLatest([activeRoom$,this.bldgService.entities$,this.roominfoService.entities$]).pipe(
      map(([rooms,bldg,roominfo]) => {
        let result:any[] = []
        rooms.forEach((r) => {
          let rinfo = roominfo.find(ri => ri.id==r.roominfo)
          result.push({ room:r, roominfo:rinfo, bldg:bldg.find(b=>b.id == rinfo?.bldg)})
        })  
        return result
      })
    )
    this.workList$ = combineLatest([activeRsvn$,mergedRooms$,this.guestService.entities$]).pipe(
      map(([rsvn,room,guest]) => {
        let result:any[] = []
        rsvn.forEach(r=> {
          result.push({rsvn:r,guest:guest.find(g=>g.id==r.primary),rooms:room.filter(rm=>rm.room.rsvn==r.id)})
        })
        return result
      })
    )


  }
  ngOnInit(): void {
    this.reload()
    
  }
}

