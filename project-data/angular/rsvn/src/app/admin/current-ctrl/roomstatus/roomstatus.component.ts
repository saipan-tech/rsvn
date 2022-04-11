import { Input, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { IRoominfo } from '@app/_interface/roominfo';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { GenericService } from '@app/_services/generic.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-roomstatus',
  templateUrl: './roomstatus.component.html',
  styleUrls: ['./roomstatus.component.scss']
})
export class RoomstatusComponent implements OnInit, OnChanges {

  @Input() currRoominfo: IRoominfo = {} as IRoominfo

  roomList$: Observable<any> = of()


  constructor(
    private roomService: RoomEntityService,
    private genericService: GenericService

  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.currRoominfo && this.currRoominfo.id) {
      this.roomList$ = this.roomService.entities$.pipe(
        map((rooms) => rooms.filter(r => r.roominfo == this.currRoominfo.id))
      )
    }
  }



ngOnInit(): void {

  if(this.currRoominfo && this.currRoominfo.id) {
}
  }

}
