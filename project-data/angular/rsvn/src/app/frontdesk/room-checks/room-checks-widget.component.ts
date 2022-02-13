import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { DialogManagerService, DangerDialogComponent } from '@app/shared/dialog';
import { combineLatest, Observable, of, scheduled } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { BldgListComponent } from '@app/config/bldg-list/bldg-list.component';

@Component({
  selector: 'app-room-checks-widget',
  templateUrl: './room-checks-widget.component.html',
  styleUrls: ['./room-checks-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RoomChecksWidgetComponent implements OnInit {
  @Input() currRoom: any
  @Output() roomChange = new EventEmitter<any>();

  
  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
  roominfo:any;
  building$:Observable<IBldg[]> = of();
  widgetInfo$:Observable<any> = of();

  constructor(
    private roomService: RoomEntityService,
    private roominfoService: RoominfoEntityService,
    private dialogManagerService: DialogManagerService
  ) { }


  //=================================
  isCurrent() {
    console.log(this.Today,this.currRoom.room.dateOut)
    return (this.currRoom.room.dateIn <= this.Today && this.currRoom.room.dateOut >= this.Today)
  }
  //=================================
  unassign() {
    this.dialogManagerService.openDialog<DangerDialogComponent>(DangerDialogComponent, {
      data: {
        title: `Delete Room ${this.currRoom.bldg.name} ${this.currRoom.roominfo.number} from this Reservation?`,
        content: 'You cannot undue this action',
        confirmAction: 'Delete',
      }
    }).afterClosed().subscribe(deleteConfirmed => {
      if (deleteConfirmed) {
        this.roomService.delete(this.currRoom.room.id)
          .subscribe(data => {
            this.roomChange.emit()
          })
      }
    })
  }
  //=================================
  check(mode:boolean) {
   
    var currRoominfo  = { ...this.currRoom.roominfo }
    var currRoom      = { ...this.currRoom.room }
    var check =  false
    console.log("Checking IN", mode,currRoominfo,currRoom)
    
    // We need to work this logic some more.
//    if(mode && currRoominfo.status == 'ready') {
    
    if(mode) {
      check = true
      currRoom.status = 'checkin';
      this.roomService.update(currRoom).subscribe()
    }

    if(! mode) {
      check = true
      currRoom.status = 'checkout';
      this.roomService.update(currRoom).subscribe()
    } 
    
    if (this.isCurrent() && check) {
      currRoominfo.check =mode
      currRoominfo.status = mode ? 'occupied' : 'dirty'
      this.roominfoService.update(currRoominfo).subscribe()
    } 
        
    this.roomChange.emit()
  }

  //=================================
  ngOnInit(): void {

  }
}

