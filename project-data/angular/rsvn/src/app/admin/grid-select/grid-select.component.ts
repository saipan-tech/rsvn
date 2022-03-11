import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { IStatuslog } from '@app/_interface/statuslog'
import { IGuest } from '@app/_interface/guest'
import { IDropdown } from '@app/_interface/dropdown'
import { IAction } from '@app/_interface/action';

import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { RoomService } from '@app/_services/room.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';

import { AppConstants } from '@app/app.constants';
import { AuthService } from '@app/_services/auth.service';


import { catchError, tap, map, concatMap, mergeMap } from 'rxjs/operators';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { combineLatest, concat, iif, Observable, of } from 'rxjs';
import { resultMemoize } from '@ngrx/store';

export interface IDStatus {
  checkin: IRoom[];
  checkout: IRoom[];
  inhouse: IRoom[];
}

@Component({
  selector: 'app-grid-select',
  templateUrl: './grid-select.component.html',
  styleUrls: ['./grid-select.component.scss']
})
export class GridSelectComponent implements OnInit {
  //  @Input() staff: any
  //  @Input() roominfos: Number[] = []
  @Input() actionRec: IAction = {} as IAction
  @Output() roominfosChange = new EventEmitter<Number[]>()

  bldgList: IBldg[] = []
  roomList: IRoominfo[] = []
  dispList: any = []
  roomstatusList: IDropdown[] = []
  dateStatus: IDStatus = {} as IDStatus;
  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
  user: any

  roomMerge$: any = of()
  actionRoominfo$: Observable<any> = of()


  staff: any
  roominfos: any



  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private oldroomService: RoomService,
    private authService: AuthService,
    private roominfoService: RoominfoEntityService,
    private bldgService: BldgEntityService,
    private appCons: AppConstants,
  ) { }
  //---------------------------------
  checkMark(roominfo_id: number) {
    let service$ = this.roominfoService.getByKey(roominfo_id).pipe(
      concatMap((rmselect) => this.oldroomService.getActionRoominfo(this.actionRec.id).pipe(
        map((ari) => {
          let found = ari.find((a: any) => a.id == rmselect.id)
          let ri: any
          if (found) {
            ri = { ...found }
            ri.marker == "marked" ? ri.marker = "" : ri.marker = "marked"
          return [true,ri]
          }
          else {
            ri = { ...rmselect, marker: 'marked' }
          return [false,ri]
          }
        }),
        tap((x)=>console.log(x)),
        concatMap((riCheck:any)=> iif(() => riCheck[0], this.oldroomService.putActionRoominfo(this.actionRec.id, riCheck[1]),
              this.oldroomService.postActionRoominfo(this.actionRec.id, riCheck[1]) ))
        
        
        ),

      )
    )
    service$.subscribe(d=>this.reload())
  }
  // -------------------------------------------

 matrix:any

  reload() {
    let result: any = []
    if (this.actionRec && this.actionRec.id) {
      this.roominfoService.entities$.pipe(
        map(ri => {
          ri.forEach(r => result.push({ ...r }))
          return result
        }),
        concatMap((mx: any) => this.oldroomService.getActionRoominfo(this.actionRec.id).pipe(
          map((act: any) => {
            act.forEach((a: any) => {
              let indx = mx.findIndex((m: any) => m.id == a.id)
              mx[indx].marker = "marked"
            })
            return mx
          }))),
        concatMap((mx) => this.bldgService.entities$.pipe(
          map((bldg: any) => {
            let result: any = []
            bldg.forEach((b: any) => result.push({ bldg: b, rooms: mx.filter((r: any) => r.bldg == b.id) }))
            console.log(result)
            return result
          })
        )
        )).subscribe(d=>this.matrix=d)


   
      }
  }

  // -------------------------------------------
  ngOnChanges(changes: SimpleChanges) {
    this.reload()
  }

  // -------------------------------------------
  ngOnInit(): void {
    this.reload()

  }
}