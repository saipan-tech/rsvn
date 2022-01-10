import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { AuthService } from '@app/_services/auth.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';
import { catchError, tap, map, mergeMap, concatMap } from 'rxjs/operators';
import { IRsvn } from '@app/_interface/rsvn';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  constructor(
    private genericService: GenericService,
    private roomService: RoomService,
    private authService: AuthService,

    private appCons: AppConstants,

  ) { }

  @Input() mode: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  user: any
  refreshTimer: any;
  startTime: any;
  sidebarData: any;
  activeList: any;

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
  refreshInfo() {
    let activeList: any = []
    let bldgList:any = []
    let Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
    this.startTimer()
    // Grab all of the roominfos
    this.roomService.getRoomDateScan(Today, '')
      // getting all rooms that are active today 
      .pipe(
        tap((active) => activeList = active),
        concatMap(() => this.genericService.getItemList('bldg')),
        tap((bld)=> bldgList = bld),
        // get all roominfo
        concatMap(() => this.genericService.getItemList('roominfo')),
        tap((roominfo: any[]) => {
          for (let key of Object.keys(activeList)) {
            activeList[key].forEach((act: any) => {
                let found = roominfo.find((rl: any) => rl.id == act.roominfo)
                let bf    = bldgList.find((bl:any) => bl.id == found.bldg)
                act.roominfo  = found
                act.bldg      = bf.name
             })}
          this.activeList = activeList
          console.log(this.activeList)
        })
      )
      .subscribe(
        (d) => {
          this.markTime("completed")
        }
      )
  }
  //====================================================
  setRsvn(rsvnid:number) {
    this.genericService.getItem("rsvn",rsvnid)
      .subscribe(data => this.currRsvnChange.emit(data))

  }
  //====================================================
  ngOnInit(): void {
    this.authService.getSession().subscribe(
      data => this.user = data
    )
    this.refreshTimer = setInterval(
      () => { this.refreshInfo() }, 15000)
    this.refreshInfo()
  }
  //=================================
  ngOnDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  }
}
