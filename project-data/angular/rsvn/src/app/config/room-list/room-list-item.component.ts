import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RoomService } from '@app/_services/room.service';
import { SystemService } from '@app/_services/system.service';
import { GenericService } from '@app/_services/generic.service';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { IBldg } from '@app/_interface/bldg';
import { IRoom } from '@app/_interface/room';
import { IRate } from '@app/_interface/rate';
import { IRoominfo } from '@app/_interface/roominfo';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-room-list-item',
  templateUrl: './room-list-item.component.html',
  styleUrls: ['./room-list-item.component.scss'],
})
export class RoomListItemComponent implements OnInit {
  @Input() rcolorList: any = []
  @Input() rateList: IRate[] = []
  @Input() room: IRoominfo = {} as IRoominfo
  @Output() refresh  = new EventEmitter<any>(); 

  roomEditForm = new FormGroup({
    id: new FormControl(''),
    number: new FormControl('', Validators.required),
    floor: new FormControl(''),
    rateAlias: new FormControl(''),
    beds: new FormControl('', Validators.required),
    style: new FormControl(''),
    color: new FormControl(''),
    size: new FormControl(''),
    status: new FormControl(''),
    rsvn: new FormControl(''),
    bldg: new FormControl(''),
    name: new FormControl(''),
    descr: new FormControl(''),
  })
  constructor(
    private roomService: RoomService,
    private genericService: GenericService,
    private systemService: SystemService,


  ) { }

  updateRoom(room: any) {

    for (const field in room) {
      if (room[field] == null) {
        room[field] = ''
      }
    }
    this.genericService.updateItem('roominfo', room).subscribe(
      data => {
        console.log(data)

      }
    )
  }

  deleteRoom(room: any) {
    this.genericService.deleteItem('roominfo', room).subscribe(
      data => {
        this.refresh.emit(true)

      }
    )
  }
  ngOnInit(): void {
    this.roomEditForm.patchValue(this.room)


    this.roomEditForm.valueChanges.subscribe(x => {
      this.updateRoom(x)
  })
   
  }


}
