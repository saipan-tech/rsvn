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
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ChargeRoomViewComponent } from '../charge-room-view/charge-room-view.component'; 


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
    private roominfoService: RoominfoEntityService,  
    private chargeService: ChargeService,
    private dialog: MatDialog


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
  openDialog(roomid: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = ['rvclass'];
    dialogConfig.width = '50%';
    dialogConfig.maxHeight = '700px';
    
    dialogConfig.data = {
      roomid,
      currRsvn:this.currRsvn
    }

    const dialogRef = this.dialog.open(ChargeRoomViewComponent, dialogConfig)
    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.ngOnInit()
     
        }
      )
  }

  //--------------------------
  ngOnChanges(changes: SimpleChanges) {
    if (!changes['currRsvn'].firstChange) {
      this.ngOnInit()
    }
  }
  //--------------------------

roomView(roomid:any) {
  this.openDialog(roomid)
}
  //--------------------------
  ngOnInit(): void {
 

    this.numDays = ((new Date(this.currRsvn.dateOut).getTime() - new Date(this.currRsvn.dateIn).getTime()) / this.appConstants.DAILYSECONDS)
    this.authService.getSession().subscribe(
      data => this.user = data
    )
    this.systemService.getDropdownList('chgitem').subscribe(
      data => this.chgtypeList = data
    )
    this.roomTotal = 0
    this.roomList$ = this.chargeService.getRsvnRoomCharge(this.currRsvn.id).pipe(
      tap(rl => {
        this.roomTotal = rl.reduce((prev: any, curr: any) => {
          return Number(prev) + Number(curr.total_charges)
        }, 0)
        this.roomSubTotal.emit(this.roomTotal)
      } )
    )
 }
}
