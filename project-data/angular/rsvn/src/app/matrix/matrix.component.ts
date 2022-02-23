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
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
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
  @Input() currRsvn = {} as IRsvn
  @Input() currGuest = {} as IGuest
  @Input() currDateStart = this.addDay(this.Today, -4)
  // -------------------------------------------
  @Output() currRsvnChange = new EventEmitter<IRsvn>()
  @Output() currGuestChange = new EventEmitter<IGuest>()
  @Output() gridSelect = new EventEmitter<IRsvn>()
  // -------------------------------------------

  constructor(
    private genericService: GenericService,
    private rsvnService: RsvnService,
    private roomService: RoomEntityService,

    private bldgService: BldgEntityService,
    private roominfoService: RoominfoEntityService,
    private appCons: AppConstants,
    private systemService: SystemService,
    private activatedRoute: ActivatedRoute

  ) { }
changeDate() {
this.reload()
}
slide() {
this.reload()
}
  

addDay(day: string, offset: number) {
  return new Date(new Date(day).getTime() + (this.appCons.DAILYSECONDS * offset)).toISOString().slice(0, 10)
}

  reload() {
    this.dayList = this.systemService.daylister(this.currDateStart, this.days)
    this.gridwidth = 100 / (Number(this.days) + 1)
    let roominfo$ = this.roominfoService.entities$
    let bldg$ = this.bldgService.entities$
    let dateIn = this.currDateStart
    let dateOut = this.addDay(this.currDateStart,this.days)

    let rooms$ = this.roomService.entities$.pipe(
      map(room => {
        return room.filter(rm => 
          rm.dateIn <= dateIn  && rm.dateOut >= dateIn ||
          rm.dateIn <= dateOut &&  rm.dateOut >= dateIn ||
          rm.dateIn <= dateOut && rm.dateOut  >=  dateOut ) 
      }),
    )





    let stageRooms$ = combineLatest([roominfo$, bldg$,rooms$]).pipe(
      map(([roominfo, bldg,rooms]) => {
        let riList:any[] = []
        roominfo.forEach(ri => {
          let rms:any  = rooms.filter(rf=>ri.id==rf.roominfo)
          let rmm:any[] = []
            rms.forEach((r:any)=> {
              rmm.push({
                room:{...r}, 
                startOffset:Math.max(Number(this.systemService.daySpan(this.currDateStart,r.dateIn)),0),
                endOffset:Math.min(Number(this.systemService.daySpan(this.currDateStart,r.dateOut)),this.days)
              })
            })
          riList.push({ roominfo:ri,rooms:rmm })
        })
        let result: any = []
        bldg.forEach(bldg => {
          result.push({ bldg, roominfo: riList.filter(ri => ri.roominfo.bldg == bldg.id) })
        })
        return result
      })
    )

    //    rooms$.subscribe(d => console.log(d))
   this.gridList$ = stageRooms$
   stageRooms$.subscribe(d=>console.log(d))
  }


  ngOnInit(): void {
    this.reload()



  }

}
