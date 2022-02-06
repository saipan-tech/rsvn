import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IRoominfo } from '@app/_interface/roominfo';
import { IRoom } from '@app/_interface/room';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { DialogManagerService, DangerDialogComponent } from '@app/shared/dialog';

@Component({
  selector: 'app-room-checks-widget',
  templateUrl: './room-checks-widget.component.html',
  //  styleUrls: ['./room-checks-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RoomChecksWidgetComponent implements OnInit {
  @Input() currRoom: any
  @Output() currRoomChange = new EventEmitter<IRoom>();

  currRoominfo:IRoominfo = {} as IRoominfo
  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)

  constructor(
    private roomService: RoomEntityService,
    private roominfoService: RoominfoEntityService,
    private dialogManagerService: DialogManagerService
  ) { }

  //=================================
  onSubmit() {
    this.currRoomChange.emit()
  }
  //=================================
  isCurrent() {
    return (this.currRoom.dateIn <= this.Today && this.currRoom.dateOut >= this.Today)
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
        this.roomService.delete(this.currRoom.id)
          .subscribe(data => {
            this.currRoomChange.emit()
          })
      }
    })
  }
  //=================================
  check(mode:boolean) {
    // still needs to subscribe -- conditional to prevent damaging current listing
    var currRoominfo  = { ...this.currRoominfo }
    var currRoom      = { ...this.currRoom }
    currRoom.status = mode ? 'checkin' : 'checkout';
    this.roomService.update(currRoom).subscribe()

    if (this.isCurrent()) {
      currRoominfo.check =mode
      currRoominfo.status = mode ? 'occupied' : 'dirty'
      this.roominfoService.update(currRoominfo).subscribe()
    } else {
      alert("this is not a current reservation no changes to Roominfo")
    }
    this.currRoomChange.emit()
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  ngOnInit(): void {
    this.roominfoService.getByKey(this.currRoom.roominfo).subscribe(d=>this.currRoominfo = d)
  }
}

