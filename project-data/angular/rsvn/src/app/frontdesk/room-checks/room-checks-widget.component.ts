import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IRoominfo } from '@app/_interface/roominfo';
import { IRoom } from '@app/_interface/room';
import { IBldg } from '@app/_interface/bldg';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { DialogManagerService, DangerDialogComponent } from '@app/shared/dialog';
import { combineLatest, Observable, of, scheduled } from 'rxjs';
import { GenericService } from '@app/_services/generic.service';
import { concatMap, map } from 'rxjs/operators';
import { BldgListComponent } from '@app/config/bldg-list/bldg-list.component';
@Component({
  selector: 'app-room-checks-widget',
  templateUrl: './room-checks-widget.component.html',
  //  styleUrls: ['./room-checks-widget.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})

export class RoomChecksWidgetComponent implements OnInit {
  @Input() currRoom: any
  @Output() currRoomChange = new EventEmitter<IRoom>();

  
  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
  roominfo:any;
  building$:Observable<IBldg[]> = of();
  widgetInfo$:Observable<any> = of();

  constructor(
    private roomService: RoomEntityService,
    private roominfoService: RoominfoEntityService,
    private genericService: GenericService,
    private dialogManagerService: DialogManagerService
  ) { }


  //=================================
  isCurrent() {
    return (this.currRoom.room.dateIn <= this.Today && this.currRoom.room.dateOut >= this.Today)
  }
  //=================================
  unassign() {
    this.dialogManagerService.openDialog<DangerDialogComponent>(DangerDialogComponent, {
      data: {
        title: `Delete Room from this Reservation?`,
        content: 'You cannot undue this action',
        confirmAction: 'Delete',
      }
    }).afterClosed().subscribe(deleteConfirmed => {
      if (deleteConfirmed) {
        this.roomService.delete(this.currRoom.room.id)
          .subscribe(data => {
            this.currRoomChange.emit()
          })
      }
    })
  }
  //=================================
  check(mode:boolean) {
   
    var currRoominfo  = { ...this.currRoom.roominfo }
    var currRoom      = { ...this.currRoom.room }
    var check =  false

    if(mode && currRoom.status == 'ready') {
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
        
    this.currRoomChange.emit()
  }

  //=================================
  ngOnInit(): void {

  }
}

