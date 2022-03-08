import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { AuthService } from '@app/_services/auth.service';
import { AppConstants } from '@app/app.constants';
import { tap, map, mergeMap, concatMap, filter, first, switchMap } from 'rxjs/operators';
import { IRsvn } from '@app/_interface/rsvn';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { combineLatest, from, Observable, of } from 'rxjs';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnChanges {
  constructor(
    private roominfoService: RoominfoEntityService,
    private roomService: RoomEntityService,
    private bldgService: BldgEntityService,
    private rsvnService: RsvnEntityService
  ) { }

  @Input() mode: any
  @Input() currRsvn: IRsvn = {} as IRsvn
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  result = []

  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)

  infoArray$: any = of()

  //====================================================
  selectRsvn(rsvn: number) {
    this.rsvnService.getByKey(rsvn).subscribe(rsvn => this.currRsvnChange.emit(rsvn))
  }
  //====================================================
  refreshInfo() {
    // var infoArray = []
    this.infoArray$ = of()
    var activeList$ = this.roomService.activeRoom$(this.Today,this.Today)
  
    var al$ = combineLatest([activeList$, this.bldgService.entities$, this.roominfoService.entities$]).pipe(
      map(([active, bldg, roominfo]) => {
        let result: any = []
        active.forEach(
          active => {
            let ri = roominfo.find(r => r.id == active.roominfo)
            result.push(
              { room: active, roominfo: ri, bldg: bldg.find(b => b.id == ri?.bldg) }
            )
          }
        )
        return result
      })
    )

    this.infoArray$ = al$
  }

  //====================================================
  ngOnChanges(changes: SimpleChanges): void {
    console.log("Changes here")
    this.refreshInfo()
  }
  //====================================================
  ngOnInit(): void {
    this.refreshInfo()
  }
  //=================================
  ngOnDestroy() {
  }
}
