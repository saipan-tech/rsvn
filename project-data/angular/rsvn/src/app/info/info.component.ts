import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { AuthService } from '@app/_services/auth.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';
import { catchError, tap, map, mergeMap, concatMap, filter, first, switchMap } from 'rxjs/operators';
import { IRsvn } from '@app/_interface/rsvn';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { from, Observable, of } from 'rxjs';
import { IRoom } from '@app/_interface/room'

let Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)

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
    private roominfoEntityService: RoominfoEntityService,
    private roomEntityService: RoomEntityService,



  ) { }

  @Input() mode: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  user: any
  refreshTimer: any;
  startTime: any;
  sidebarData: any;
  activeList: any;
  dispList: any[] = []
  rsvnList$: Observable<IRsvn[]> = of()
  roomList:IRoom[] = []

  checkinRooms$ : Observable<IRoom[]> = of()
  checkoutRooms$ : Observable<IRoom[]> = of()
  inhouseRooms$ : Observable<any> = of()
  result :any = []

  //====================================================
  
  

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
    let bldgList: any = []
    let Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
    // Grab all of the roominfos
    this.roomService.getRoomDateScan(Today, '')
      // getting all rooms that are active today 
      .pipe(
        tap((active) => activeList = active),
        concatMap(() => this.genericService.getItemList('bldg')),
        tap((bld) => bldgList = bld),
        // get all roominfo
        concatMap(() => this.genericService.getItemList('roominfo')),
        tap((roominfo: any[]) => {
          for (let key of Object.keys(activeList)) {
            activeList[key].forEach((act: any) => {
              let found = roominfo.find((rl: any) => rl.id == act.roominfo)
              let bf = bldgList.find((bl: any) => bl.id == found.bldg)
              act.roominfo = found
              act.bldg = bf.name
            })
          }
          this.activeList = activeList

        })
      )
      .subscribe(
        (d) => {
        }
      )
  }
    //====================================================
    refreshInfo2() {
      let Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
   
      this.startTimer()

      this.checkinRooms$ = this.roomEntityService.entities$
        .pipe(
          map (rooms => rooms.filter(rooms => rooms.dateIn == Today)),

        )
        
        this.checkoutRooms$ = this.roomEntityService.entities$
        .pipe(
          map (rooms => rooms.filter(rooms => rooms.dateOut == Today))
        )

        this.inhouseRooms$ = this.roomEntityService.entities$
        .pipe(
          map (rooms => rooms.filter(rooms => rooms.dateIn < Today && rooms.dateOut > Today)),
       )
        


         this.markTime("completed")
      }
  //====================================================
  setRsvn(rsvnid: number) {
    this.genericService.getItem("rsvn", rsvnid)
      .subscribe(data => this.currRsvnChange.emit(data))

  }
  //====================================================
  ngOnInit(): void {

    this.authService.getSession().subscribe(
      data => this.user = data
    )
    this.refreshInfo()
    this.refreshInfo2()



    }
  //=================================
  ngOnDestroy() {
  }
}
