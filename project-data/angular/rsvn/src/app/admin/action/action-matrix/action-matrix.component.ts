import { Component, OnInit } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { IRoominfo } from '@app/_interface/roominfo';
import { AuthService } from '@app/_services/auth.service';
import { SystemService } from '@app/_services/system.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';
import { catchError, tap, map, mergeMap, concatMap } from 'rxjs/operators';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { GuestEntityService } from '@app/_ngrxServices/guest-entity.service';
import { combineLatest, Observable, of } from 'rxjs';
@Component({
  selector: 'app-action-matrix',
  templateUrl: './action-matrix.component.html',
  styleUrls: ['./action-matrix.component.scss']
})
export class ActionMatrixComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
   // private roomService: RoomService,
    private authService: AuthService,
    private roominfoService: RoominfoEntityService,
    private roomService: RoomEntityService,
    private bldgService: BldgEntityService,
    private rsvnService:RsvnEntityService,
    private guestService:GuestEntityService,
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
  sidebarData: any;
  rsvnList: any;
  staffList: any;
  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
  
  
  dispList$:Observable<any> = of()
  bldgList$:Observable<any> = of()
  
  
  //====================================================
  newRefreshGrid() {

    let dispList: any = []
    let actionList: any = []
    let activeList: any = []
    let rsvnList: any = []
    let roomList: any = []
    let bldgList: any = []

    let Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
    // Grab all of the roominfos
    
    
    
    
    this.genericService.getItemList('bldg')
      // getting all rooms 
      .pipe(
        map(d => bldgList = d),
        //getting todays action
        mergeMap((d) => this.genericService.getItemQueryList('action', 'today=1')),
        tap((action) => actionList = action),
        // scan rsvn rooms active
 //       mergeMap((d) => this.roomService.getRoomDateScan(Today, '')),
//        tap((active) => activeList = active),
        // get active rsvns
        mergeMap(() => this.genericService.getItemQueryList('rsvn', `active=${Today}`)),
        tap((rsvn) => this.rsvnList = rsvn),
        // get all roominfo
        mergeMap(() => this.genericService.getItemList('roominfo')),
        tap((roominfo) => roomList = roominfo),
        mergeMap(() => this.genericService.getItemList('staff')),
        tap((staff) => this.staffList = staff),
      )
      .subscribe(
        (d) => {
          this.dispList = this.mergeDisplist(bldgList, roomList, actionList, activeList)
          this.loaded = true

        }
      )
  }

  //====================================================
  reload() {
    let activeRoom$ = this.roomService.entities$
    .pipe(map(rooms => rooms.filter(room => room.dateIn <= this.Today && room.dateOut >= this.Today)))
    
    let mergedRooms$ = combineLatest([activeRoom$,this.bldgService.entities$,this.roominfoService.entities$]).pipe(
      map(([rooms,bldg,roominfo]) => {
        let result:any[] = []
        roominfo.forEach((ri) => {
          result.push({ rooms:rooms.filter(room=>room.roominfo == ri.id), roominfo:ri, bldg:bldg.find(b=>b.id == ri.bldg)})
        })  
        return result
      })
    )
    
    let action$   =   this.genericService.getItemQueryList('action', 'today=1')
    let staff$    =   this.genericService.getItemList('staff')
    

    this.bldgList$ = this.bldgService.entities$
    this.dispList$ = mergedRooms$
  /*  
    this.dispList$ = combineLatest([mergedRooms$,action$,staff$]).pipe(
     map(([roominfo,action,staff])=>{


     })
   ) 
*/
  
  
  }




  //====================================================
  layout(act: any) {
    this.sidebarData = act
  }
  //====================================================
  mergeDisplist(bldgList: any, roomList: any, action: any, active: any) {
    //inject action 
    action.forEach((act: any) => {
      let srec = this.staffList.find((sl: any) => sl.id == act.staff)
      act.roominfos.forEach((ari: any) => {
        let found = roomList.find((rl: any) => rl.id == ari)
        if (!found.action) found.action = []
        found.action.push({ action: act, staff: srec })
      })
    })
    // Inject active 
    for (let key of Object.keys(active)) {
      active[key].forEach((act: any) => {
          let found = roomList.find((rl: any) => rl.id == act.roominfo)
          if (!found.active) found.active = []
          found.active.push({ active: key, room: act })
      })
    }

    let dispList: any = []
    bldgList.forEach((bldg: any) => {
      dispList.push({ bldg: bldg, rooms: roomList.filter((rl: any) => rl.bldg == bldg.id) })

    })
    return dispList
  }
  //====================================================
  ngOnInit(): void {

    this.reload()

    this.authService.getSession().subscribe(
      data => this.user = data
    )
    this.systemService.getDropdownList('roomstatus').subscribe(
      data => this.roomStatus = data
    )

   // this.newRefreshGrid()
  }
  //=================================
  ngOnDestroy() {
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
