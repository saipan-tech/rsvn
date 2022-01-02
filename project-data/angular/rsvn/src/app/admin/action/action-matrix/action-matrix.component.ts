import { Component, OnInit } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { IRoominfo } from '@app/_interface/roominfo';
import { AuthService } from '@app/_services/auth.service';
import { SystemService } from '@app/_services/system.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';
import { catchError, tap, map, mergeMap, concatMap } from 'rxjs/operators';
@Component({
  selector: 'app-action-matrix',
  templateUrl: './action-matrix.component.html',
  styleUrls: ['./action-matrix.component.scss']
})
export class ActionMatrixComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private roomService: RoomService,
    private authService: AuthService,

    private appCons: AppConstants,


  ) { }

  user: any
  roomList: any;
  dispList: any[] = []
  actionList: any = []

  refreshTimer: any
  //====================================================
  refreshGrid() {
    let _dispList: any = {}
    let dispList: any = []
    let actionList: any = []
    let staffRoomList: any = []
    this.genericService.getItemQueryList('roominfo', `all=1`)
      .pipe(map(d => {
        d.forEach(
          rec => {
            if (!_dispList[rec.bldg.name]) _dispList[rec.bldg.name] = []
            _dispList[rec.bldg.name].push(rec)
          })
        for (let key of Object.keys(_dispList)) {
          dispList.push({ name: key, rooms: _dispList[key] })
        }
      }
      ),
        concatMap((d) => this.genericService.getItemQueryList('action', 'today=1&all=1')
          .pipe(tap((action) => {
            staffRoomList = []
            action.forEach((act: any) => {
              act.roominfos.forEach(
                (ri: any) => staffRoomList.push({
                  roominfoID: ri.id, actID: act.id,
                  actDept: act.department, name: `${act.staff.first_name} ${act.staff.last_name}`,
                })
              )
            })
          }))))
      .subscribe( 
        (d) => {
          
          dispList.forEach((drec:any) => {
            drec.rooms.forEach((rec:any) => {
               rec.working = staffRoomList.filter((srl:any)=>srl.roominfoID == rec.id)
            })
          })
        this.dispList =dispList
        console.log(this.dispList)
        }
      )
  }
  //====================================================

  ngOnInit(): void {
    this.authService.getSession().subscribe(
      data => this.user = data
    )

    this.refreshTimer = setInterval(
      () => {
        this.refreshGrid();
      }, 15000)


    this.refreshGrid()
  }

  //=================================
  ngOnDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }

  }
}



