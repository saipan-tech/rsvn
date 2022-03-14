import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IAction } from '@app/_interface/action';

import { IRoominfo } from '@app/_interface/roominfo';
import { AppConstants } from '@app/app.constants';
import { catchError, tap, map, concatMap, mergeMap } from 'rxjs/operators';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { ActionEntityService } from '@app/_ngrxServices/action-entity.service';
import { combineLatest, concat, iif, Observable, of } from 'rxjs';

@Component({
  selector: 'app-grid-select',
  templateUrl: './grid-select.component.html',
  styleUrls: ['./grid-select.component.scss']
})
export class GridSelectComponent implements OnInit {
  @Input() actionRec: IAction = {} as IAction
  @Output() actionRecChange = new EventEmitter<IAction>()


  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
  roominfos: any;

  constructor(
    private roominfoService: RoominfoEntityService,
    private bldgService: BldgEntityService,
    private actionService: ActionEntityService,
    private appCons: AppConstants,

  ) { }
  //---------------------------------
  setRoom(roomid: string) {
    let actionRec = { ...this.actionRec }
    let arSet = new Set(actionRec.roominfos.split(','))

    if (arSet.has('')) arSet.delete('')

    if (arSet.has(String(roomid))) {
      arSet.delete(String(roomid))
    }
    else {
      arSet.add(roomid)
    }

    if (arSet.size) actionRec.roominfos = [...arSet].join(',')
    else actionRec.roominfos = ""
    this.actionRec = actionRec
    this.actionRecChange.emit(actionRec)
    this.reload()
    this.actionService.update(actionRec).subscribe()
  }
  //---------------------------------
  reload() {
    this.roominfoService.entities$.pipe(
      map((roominfo) => {
        
        let actrooms:any = []
        if( this.actionRec.roominfos && this.actionRec.roominfos.length) {
          actrooms = this.actionRec.roominfos.split(',')
        }
        let result: any = []
        roominfo.forEach((ri: IRoominfo) => {
          result.push({ ...ri, check: actrooms.find((a: any) => a == ri.id) })

        })
        return result
      }),
      concatMap((roominfo) => this.bldgService.entities$.pipe(
        map((bldg) => {
          let result: any = []
          bldg.forEach(b => {
            result.push({ bldg: b, rooms: roominfo.filter((ri: any) => ri.bldg == b.id) })
          })
          return result
        })
      )

      )).subscribe(d => this.roominfos = d)


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