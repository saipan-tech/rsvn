import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { ICharge } from '@app/_interface/charge'
import { IDropdown} from '@app/_interface/dropdown'
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { RoomService } from '@app/_services/room.service';

import { ChargeService } from '@app/_services/charge.service';
import { AppConstants } from '@app/app.constants';
import { from } from 'rxjs';
import { concatMap,tap } from 'rxjs/operators';
@Component({
  selector: 'app-charge-room-list',
  templateUrl: './charge-room-list.component.html',
  styleUrls: ['./charge-room-list.component.scss']
})
export class ChargeRoomListComponent implements OnInit {

  constructor(
    private roomService: RoomService,
    private systemService: SystemService,
    private authService: AuthService,
    private appConstants: AppConstants,
    private genericService: GenericService
    


  ) { }
  @Input() currRsvn: any
  @Input() currCharge: ICharge = {} as ICharge
  @Output() currChargeChange = new EventEmitter<ICharge>()
  @Output() roomSubTotal = new EventEmitter<Number>()

  form_error: any
  user: any
  numDays = 0
  
  roomList: IRoom[] = []
  roominfoList: IRoominfo[] = []
  chargeList: ICharge[] = []
  bldgList: IBldg[] = []
  fullRoomList :any[] = []
  selectedValue =0
  roomTotal = 0
  grandTotal = 0
  transTotal = 0
  chgtypeList :IDropdown[] = []
  



  ngOnChanges(changes: SimpleChanges) {
    console.log("changes",changes)
    if(! changes.currRsvn.firstChange) {
        this.ngOnInit()
    }
  
  }
  //--------------------------

  newRoomall(roomall:IRoom) {
  this.ngOnInit()
}


  //--------------------------
  chargeTotal() {
    this.roomTotal = 0
    this.fullRoomList.forEach(
      rm => {
        this.roomTotal += rm.rateCharge * this.numDays
      }

    )
   this.roomSubTotal.emit(this.roomTotal)
  }
 
  //--------------------------
  chargeSort(chgs:ICharge[]) {
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

    this.genericService.getItemQueryList('room',`rsvn=${this.currRsvn.id}`)
      .subscribe(data => {
        this.fullRoomList = data
        console.log("FullRoomList",data)
        this.chargeTotal()
      })
    this.genericService.getItemQueryList('room',`rsvn=${this.currRsvn.id}`)
      .pipe(
        concatMap((result) =>
          from(result).pipe(
            tap( r => console.log(r,this.currRsvn.dateIn,this.currRsvn.dateOut))
          )
        )
      ).subscribe()
/*

          this.systemService.getHoliday(year)
          .pipe(
            concatMap(
              (result: any) =>
                // separate the array into individual observables
                from(result).pipe(
                  concatMap(
                    (hol: any) =>
                      // check for duplicates
                      this.noDuplicate(hol)
                        .pipe(
                          // if not a duplicate save to db
                          concatMap(dd => iif(() => dd, this.saveHoliday(hol))),
                        )
                  )
                )
            )
        
*/























    this.numDays = ((new Date(this.currRsvn.dateOut).getTime() - new Date(this.currRsvn.dateIn).getTime()) / this.appConstants.DAILYSECONDS) 

    // fill roomList


    //    this.systemService.getDropdownList('status').subscribe(
    //      data => this.statusList = data
    //    )

  }

}
