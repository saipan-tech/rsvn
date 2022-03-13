import { Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';
import { catchError, tap, map, mergeMap, concatMap } from 'rxjs/operators';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { combineLatest, Observable, of } from 'rxjs';
import { IAction } from '@app/_interface/action';

@Component({
  selector: 'app-action-staff',
  templateUrl: './action-staff.component.html',
  styleUrls: ['./action-staff.component.scss']
})
export class ActionStaffComponent implements OnInit, OnChanges {

  constructor(
    private genericService: GenericService,
    private eroomService: RoomService,
    private appCons: AppConstants,
    private roominfoService: RoominfoEntityService,
    private bldgService: BldgEntityService
  ) { }

  @Input() actionRec: IAction = {} as IAction
  @Output() actionRecChange = new EventEmitter<IAction>()

  roominfos: any
  roomList: any;
  dispList: any[] = [];
  loaded = false;
  roomStatus: any;
  sidebarData: any;
  dow = this.appCons.DOW
  user: any
  staffList: any;
  startTime: any;
  bldgList: any[] = []
  actionList: any = [];
  hkList: any = []
  staff: any
  dow_now = new Date().getDay()
  dispList$: Observable<any> = of()
  currAction: any
  //====================================================
  selectAction(actionid: number) {
    this.genericService.getItem('action', actionid)
      .subscribe(d => {
        this.actionRec = d
        this.actionRecChange.emit(d)
      })
  }
  //====================================================
  refresh() {
    let Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
    let action$ = combineLatest([this.genericService.getItemQueryList('action', 'today=1'),
    this.genericService.getItemList('staff')])
    let bldg$ = this.bldgService.entities$
    let staff$ = this.genericService.getItemList('staff')
    // initialize roomlist
    this.roominfoService.entities$.pipe(
      map(ri => {
        let result: any = []
        ri.map(ri => result.push({ ...ri, week: {}, mark: {} }))
        return result
      }),
      concatMap((roomlist: any) => action$.pipe(
        map(([act, staff]) => {
          act.forEach(action => {
            let mark = action.id == this.actionRec.id
            let st = staff.find(staff => staff.id == action.staff)
            // stepping through each action roominfos 
            action.roominfos.forEach((rinfo: any) => {
              let found_room = roomlist.find((f: any) => rinfo == f.id)
              action.days.split(',').forEach((day: any) => {
                if (day && day != '') {
                  if (found_room && found_room.week && !found_room.week[day]) found_room.week[day] = []
                  found_room.week[day].push(
                    {
                      name: st.last_name,
                      item: action.item,
                      id: action.id,
                      mark
                    }
                  )
                }
              })
            })
          })
          return roomlist
        }))),
      concatMap((roomlist) => bldg$.pipe(
        map((bldg) => {
          let result: any = []
          bldg.forEach(b => {
            result.push({ bldg: b, rooms: roomlist.filter((m: any) => m.bldg == b.id) })
          })
          return result
        })
      ))).subscribe(d => this.dispList = d)

  }
  //====================================================
  ngOnChanges(changes: SimpleChanges): void {
    this.refresh()
  }
  //====================================================
  ngOnInit(): void {
    this.refresh()
  }
}



