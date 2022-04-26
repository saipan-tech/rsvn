import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { ICharge } from '@app/_interface/charge'

import { IDropdown } from '@app/_interface/dropdown'
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';

import { ChargeService } from '@app/_services/charge.service';
import { AppConstants } from '@app/app.constants';
import { from, Observable, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
@Component({
  selector: 'app-charge-room-list',
  templateUrl: './charge-room-list.component.html',
  styleUrls: ['./charge-room-list.component.scss']
})
export class ChargeRoomListComponent implements OnInit {

  constructor(
    private roomService: RoomEntityService,
    private bldgService : BldgEntityService,
    private systemService: SystemService,
    private authService: AuthService,
    private appConstants: AppConstants,
    private genericService: GenericService,
    private roominfoService: RoominfoEntityService
  ) { }
  @Input() currRsvn: any
  @Input() currCharge: ICharge = {} as ICharge
  @Output() currChargeChange = new EventEmitter<ICharge>()
  @Output() roomSubTotal = new EventEmitter<Number>()

  roomList$: Observable<any> = of()




  form_error: any
  user: any
  numDays = 0

  roominfoList: IRoominfo[] = []
  chargeList: ICharge[] = []
  bldgList: IBldg[] = []
  fullRoomList: any[] = []
  selectedValue = 0
  roomTotal = 0
  grandTotal = 0
  transTotal = 0
  chgtypeList: IDropdown[] = []

  //--------------------------
  ngOnChanges(changes: SimpleChanges) {
    if (!changes['currRsvn'].firstChange) {
      this.ngOnInit()
    }
  }
  //--------------------------
  newRoomall(roomall: IRoom) {
    this.ngOnInit()
  }
  //--------------------------



  //--------------------------

  chargeTotal() {
    this.roomTotal = 0
    this.fullRoomList.forEach(
      rm => {
        let rr = {} as { days: any[], roominfo: any }
        rr = rm
        rr.days.forEach(
          r => {
            this.roomTotal += Number(r.amount)
          }
        )
      }
    )


    this.roomSubTotal.emit(this.roomTotal)
  }
  //--------------------------
  chargeSort(chgs: ICharge[]) {
    chgs.sort((a, b) => {
      if (a.date < b.date) {
        return -1
      }
      if (a.date > b.date) {
        return 1
      }
      return 0
    })
    return chgs
  }
  //--------------------------
  ngOnInit(): void {
    this.authService.getSession().subscribe(
      data => this.user = data
    )
    this.systemService.getDropdownList('chgitem').subscribe(
      data => this.chgtypeList = data
    )
    this.roomList$ = this.bldgService.entities$.pipe( 
    concatMap((bldg) => this.roominfoService.entities$.pipe(
      concatMap((roominfos) => this.genericService.getItemQueryList("roomcharge", `rsvn=${this.currRsvn.id}`).pipe(
        concatMap((roomcharge) => this.roomService.getWithQuery(`rsvn=${this.currRsvn.id}`).pipe(
          map((rooms) => {
            let result: any = []

            rooms.map((rm) => {
              let rinfo:any  = roominfos.find(ri => ri.id == rm.roominfo)
              // run a reduce on the charges right here
              let rcCharges = roomcharge.filter(rc => rc.room == rm.id).reduce((prev: any, curr: any) => {
                return Number(prev) + Number(curr.amount)
              }, 0)        

              
              result.push(
                {
                  room:rm,
                  bldg: bldg.find((b)=> b.id == rinfo.bldg ),
                  roominfo: rinfo,
                  charges: roomcharge.filter(rc => rc.room == rm.id),
                  total_charges:rcCharges
                })
               
            })
            console.log(result)
            return result
          })
        )))))))

    this.numDays = ((new Date(this.currRsvn.dateOut).getTime() - new Date(this.currRsvn.dateIn).getTime()) / this.appConstants.DAILYSECONDS)
  }
}
