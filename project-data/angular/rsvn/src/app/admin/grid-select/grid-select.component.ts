import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { IStatuslog } from '@app/_interface/statuslog'
import { IGuest } from '@app/_interface/guest'
import { IDropdown } from '@app/_interface/dropdown'
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';

import { AuthService } from '@app/_services/auth.service';
import { catchError, tap, map, concatMap, mergeMap } from 'rxjs/operators';
import { IAction } from '@app/_interface/action';


export interface IDStatus  {
  checkin: IRoom[];
  checkout: IRoom[];
  inhouse : IRoom[];
}


@Component({
  selector: 'app-grid-select',
  templateUrl: './grid-select.component.html',
  styleUrls: ['./grid-select.component.scss']
})
export class GridSelectComponent implements OnInit {
  @Input() roominfos:Number[] = []
  @Input() actionRec:IAction = {} as IAction
  @Output() roominfosChange = new EventEmitter<Number[]>()

  bldgList: IBldg[] = []
  roomList: IRoominfo[] = []
  dispList: any = []
  roomstatusList: IDropdown[] = []

  dateStatus : IDStatus = {} as IDStatus; 
  
  user: any
  
  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private roomService: RoomService,
    private authService: AuthService,

    private appCons: AppConstants,
  ) { }

  // -------------------------------------------
  makeList() {
    this.dispList = []
    let found : IRoominfo | any
    this.roominfos.forEach(
      ri => {
       found  = this.roomList.find( rl => ri == rl.id )
       if(found) {
        found['marker'] = 'marked'
       }
      }
    )
    this.dateStatus.checkout.forEach(
      ds => {
       let found  = this.roomList.find( rl => ds.roominfo == rl.id )
       if(found) {
        found['border'] = 'checkout'
       }
      }
    )
    this.dateStatus.checkin.forEach(
      ds => {
       let found  = this.roomList.find( rl => ds.roominfo == rl.id )
       if(found) {
         if(found.border == 'checkout') {
           found.border = 'priority'
         
         }
         else found.border = 'checkin'
       }
      }
    )
    this.dateStatus.inhouse.forEach(
      ds => {
       let found  = this.roomList.find( rl => ds.roominfo == rl.id )
       if(found) {
         found.border = 'inhouse'
       }
      }
    )

    this.bldgList.forEach(
      bld => {
        let rooms = this.roomList.filter(r => r.bldg == bld.id)
        let bldg = bld.name
        this.dispList.push({ bldg, rooms })
      }
    )
  }
  
  //---------------------------------
  checkMark(roominfo_id:number) {
    let found:any  = this.roomList.find(d=> d.id == roominfo_id)
    if(found  && found.marker) {
      found.marker = ''
      this.roomService.putActionRoominfo(this.actionRec.id,found)
        .subscribe(data => console.log(data))  
    } else {
      found.marker = "marked"
      this.roomService.postActionRoominfo(this.actionRec.id,found)
        .subscribe(data => console.log(data))  
    }
  }

  // -------------------------------------------
  ngOnChanges(changs: SimpleChanges) {
    this.ngOnInit()
  }

  // -------------------------------------------
  ngOnInit(): void {
    this.authService.getSession().subscribe(
      data => this.user = data
    )
    this.genericService.getItemList('roominfo')
      .pipe(
        tap( data => this.roomList = data),
        concatMap(() => this.genericService.getItemList("bldg")),
        tap(bldgs => this.bldgList = bldgs),
        concatMap(()=> this.roomService.getRoomDateScan(this.actionRec.date,'')),
        tap( d => this.dateStatus = d)
        )
        .subscribe(d => this.makeList())
  }
}