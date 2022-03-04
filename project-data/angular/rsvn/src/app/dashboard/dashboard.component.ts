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

  currRsvnId:number = 0
  currRsvnInfo$:Observable<any> = of()

  selectRsvn(rsvnId:number) {
    this.currRsvnId = rsvnId
    this.currRsvnInfo$= combineLatest([this.rsvnService.getByKey(rsvnId),this.guestService.entities$]).pipe(
      map(([rsvn,guest]) => {
        return {rsvn,guest:guest.find(g=> g.id==rsvn.primary)}
      })
    )
  }
  clearRsvn() {
    this.selectRsvn(0)
  }
  ngOnInit(): void {
    
  }
}

