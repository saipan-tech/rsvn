import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'

import { IGuest } from '@app/_interface/guest'
import { GenericService } from '@app/_services/generic.service';
import { RsvnService } from '@app/_services/rsvn.service';
import { RoomService } from '@app/_services/room.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { AppConstants } from '@app/app.constants';
import { SystemService } from '@app/_services/system.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {
  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
  roominfo$: Observable<IRoominfo[]> = of()
  gridwidth = 0
  days = 24
  gridList$: Observable<any> = of()
  dayList:any
  currDateStart = this.Today


  constructor(
    private genericService: GenericService,
    private rsvnService: RsvnService,
    private roomService: RoomService,

    private bldgService: BldgEntityService,
    private roominfoService: RoominfoEntityService,
    private appCons: AppConstants,
    private systemService: SystemService,
    private activatedRoute: ActivatedRoute

  ) { }

  
  reload() {
    
  
    this.dayList = this.systemService.daylister(this.currDateStart, this.days)
    this.gridwidth = 100 / (Number(this.days) + 1)
    let roominfo$ = this.roominfoService.entities$
    let bldg$ = this.bldgService.entities$

    let rooms$ = combineLatest([roominfo$, bldg$]).pipe(
      map(([roominfo, bldg]) => {
        let result: any = []
        bldg.forEach(bldg => {
          result.push({ bldg, roominfo: roominfo.filter(ri => ri.bldg == bldg.id) })
        })
        return result
      })
    )
    rooms$.subscribe(d => console.log(d))
    this.gridList$ = rooms$
  }


  ngOnInit(): void {
    this.reload()



  }

}
