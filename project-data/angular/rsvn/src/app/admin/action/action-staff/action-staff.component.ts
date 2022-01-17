import { Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { IRoominfo } from '@app/_interface/roominfo';
import { AuthService } from '@app/_services/auth.service';
import { SystemService } from '@app/_services/system.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';
import { catchError, tap, map, mergeMap, concatMap } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-action-staff',
  templateUrl: './action-staff.component.html',
  styleUrls: ['./action-staff.component.scss']
})
export class ActionStaffComponent implements OnInit,OnChanges {

  constructor(

    private genericService: GenericService,
    private systemService: SystemService,
    private roomService: RoomService,
    private authService: AuthService,
    private appCons: AppConstants,

  ) { }



actionRec:any
roominfos:any

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
  staff : any 
  dow_now = new Date().getDay()
  
  //====================================================
  markTime(comment: string) {
    console.log("Marking Time -->", comment, '  ', new Date().getTime() - this.startTime)
  }
  //====================================================
  startTimer() {
    this.startTime = new Date().getTime()
    console.log("Starting Timer action staff")
  }


  hkroom(t: string, room: number) {


  }

openDialog(rec:any) {
console.log("Click",rec)
}

  //====================================================
  refreshGrid() {
    this.startTimer()
    let roomList: any[] = []
    let bldgList: any[] = []
    let Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)

    // Grab all of the roominfos

    this.genericService.getItemList('bldg')
      .pipe(
        tap(d => bldgList = d),
        concatMap(() => this.genericService.getItemList('roominfo')),
        tap(d => {
          d.forEach(q => {
            q.week = { mon: [], tue: [], wed: [], thr: [], fri: [], sat: [], sun: [] }
          })
          roomList = d
        }),
        concatMap(() => this.genericService.getItemList('staff')),
        tap((staff) => this.staffList = staff),
        concatMap(() => this.genericService.getItemQueryList('action', 'today=1')),
        tap(action => {
          this.actionList = action
          action.forEach(act => {
            act.staff = this.staffList.find((f: any) => f.id == act.staff)
            act.roominfos.forEach((ri: any) => {
              let ff = roomList.findIndex((f) => ri == f.id)
              act.days.split(',')
                .forEach((dy: any) => {
                  if (dy) {
                    roomList[ff].week[dy].push({ name: act.staff.last_name, item: act.item ,id:act.id})
                  }
                })
            })
          })
          bldgList.forEach(bldg => {
            bldg.rooms = roomList.filter(rl => rl.bldg == bldg.id)
          })
          this.bldgList=bldgList
          console.log(bldgList)
        
        })
      )
      .subscribe(() => {
        this.markTime('end of the road')
      })
  }



actionSelect(actionid:number) {
  this.genericService.getItem('action',actionid)
  .pipe(
    tap( action => this.actionRec = action),
    concatMap((action) => this.genericService.getItem('staff',action.staff)),
    tap(s => this.staff = s),
    concatMap(() => this.roomService.getActionRoominfo(this.actionRec.id)),
    map( (ri:any) => {
      this.roominfos =  ri.map((q:any) => q = q.id) 
      return ri
    }))
    .subscribe(data=> console.log(data,this.roominfos,this.actionRec))
}

ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
}
  //====================================================
  ngOnInit(): void {

    this.refreshGrid()
    this.authService.getSession().subscribe(
      data => this.user = data
    )
  }





}



