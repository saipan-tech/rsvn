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


    sidebar = "test"

  user: any
  roomList: any;
  dispList: any[] = [];
  actionList: any = [];
  loaded = false;
  refreshTimer: any;
  roomStatus: any;
  startTime: any;
  sidebarData:any;
  rsvnList:any;

  markTime(comment: string) {
    console.log("Marking Time -->", comment, '  ', new Date().getTime() - this.startTime)
  }
  startTimer() {
    this.startTime = new Date().getTime()
    console.log("Starting Timer")
  }

  //====================================================
  newRefreshGrid() {
    
    let dispList: any = []
    let actionList: any = []
    let activeList:any = []
    let rsvnList:any = []
    let roomList:any = []
    let bldgList:any = []

    
    this.startTimer()
    // Grab all of the roominfos
    this.genericService.getItemList('bldg')
      // getting all rooms 
      .pipe(
        map(d => bldgList = d),
        //getting todays action
        mergeMap((d) => this.genericService.getItemQueryList('action', 'today=1')),
        tap((action) => actionList=action),
        // scan rsvn rooms active
        mergeMap((d) => this.roomService.getRoomDateScan(this.appCons.TODAY, '')),
        tap((active) => activeList = active),
        mergeMap(() => this.genericService.getItemQueryList('rsvn', `active=${this.appCons.TODAY}`)),
        tap((rsvn) => this.rsvnList = rsvn),
        mergeMap(() => this.genericService.getItemList('roominfo')),
        tap((roominfo) => roomList = roominfo)
      )
      .subscribe(
        (d) => {
          this.dispList = this.mergeDisplist(bldgList,roomList,actionList,activeList)
          this.loaded = true
          this.markTime("completed")
        }
      )
  }


  layout(act:any) {
    act.type = 'active' 
    act.rsvnData = this.rsvnList.find((rl:any)=> rl.id=act.room.rsvn)
    this.sidebarData = act
    console.log(act)
  }
 
  //====================================================
  mergeDisplist(bldgList:any,roomList:any,action:any,active:any) {
    //inject action 
    action.forEach((act:any) => {
      act.roominfos.forEach((ari:any) => {
        let found = roomList.find((rl:any) => rl.id==ari)
        if(! found.action) found.action = []
        found.action.push(act)
      })
    })
    // Inject active 
    for (let key of Object.keys(active)) {
      active[key].forEach( (act:any) => {
        let found = roomList.find((rl:any) => rl.id==act.roominfo)
        if(! found.active) found.active = []
          found.active.push({act:key,room:act})
      })
    }
    let dispList:any = []
    bldgList.forEach( (bldg:any) => {
      dispList.push({ bldg:bldg,rooms:roomList.filter((rl:any) => rl.bldg == bldg.id)})

    })
    return dispList
  }
  //====================================================
  ngOnInit(): void {
    this.authService.getSession().subscribe(
      data => this.user = data
    )
    this.systemService.getDropdownList('roomstatus').subscribe(
      data => this.roomStatus = data
    )
    this.refreshTimer = setInterval(
      () => { this.newRefreshGrid() }, 15000)
    this.newRefreshGrid()
  }
  //=================================
  ngOnDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  }
  //=================================
  roomStatusChange(roominfoID: any, mode: string) {
    this.genericService.getItem('roominfo', roominfoID)
      .pipe(
        map((ri: any) => {
          ri.status = mode
          return ri
        }),
        concatMap((ri: any) => this.genericService.updateItem('roominfo', ri))
      )
      .subscribe(
        d => {
          this.newRefreshGrid()
        }
      )
  }
  //=================================

}

/*
  refreshGrid() {
    let _dispList: any = {}
    let dispList: any = []
    let actionList: any = []
    let staffRoomList: any = []
    let activeRoomList: any = []

    // Grab all of the roominfos
    this.genericService.getItemQueryList('roominfo', `all=1`)
      // getting all rooms
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
        //getting todays action
        concatMap((d) => this.genericService.getItemQueryList('action', 'today=1&all=1')),
        tap((action) => {
            staffRoomList = []
            action.forEach((act: any) => {
              act.roominfos.forEach(
                (ri: any) => staffRoomList.push({
                  roominfoID: ri.id, actID: act.id,
                  actDept: act.department, name: `${act.staff.first_name} ${act.staff.last_name}`,
                })
              )
            })
          }),
        // scan rsvn rooms active
        concatMap((d) => this.roomService.getRoomDateScan(this.appCons.TODAY,'all')) ,
        tap((active:any) => {
            activeRoomList = active
          console.log("Active",active)
          })
        )
        .subscribe(
        (d) => {

          this.dispList = dispList
          this.loaded =true

        }
      )
  }
*/