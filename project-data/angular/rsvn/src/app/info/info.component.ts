import { Component, Input, OnInit } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { IRoominfo } from '@app/_interface/roominfo';
import { AuthService } from '@app/_services/auth.service';
import { SystemService } from '@app/_services/system.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';
import { catchError, tap, map, mergeMap, concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  


  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private roomService: RoomService,
    private authService: AuthService,

    private appCons: AppConstants,

  ) { }


  @Input() mode: any
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
  activeList:any;

  //====================================================
  markTime(comment: string) {
    console.log("Marking Time -->", comment, '  ', new Date().getTime() - this.startTime)
  }
  //====================================================
  startTimer() {
    this.startTime = new Date().getTime()
    console.log("Starting Timer")
  }
  //====================================================
  newRefreshGrid() {

    let dispList: any = []
    let actionList: any = []
    let activeList: any = []
    let rsvnList: any = []
    let roomList: any = []
    let bldgList: any = []

    let Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
    this.startTimer()
    // Grab all of the roominfos
    this.genericService.getItemList('bldg')
      // getting all rooms 
      .pipe(
        map(d => bldgList = d),
        //getting todays action
        mergeMap((d) => this.genericService.getItemQueryList('action', 'today=1')),
        tap((action) => actionList = action),
        // scan rsvn rooms active
        mergeMap((d) => this.roomService.getRoomDateScan(Today, '')),
        tap((active) => this.activeList = active),
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
          this.markTime("completed")

        }
      )
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
}
