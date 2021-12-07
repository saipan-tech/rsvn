import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RoomService } from '@app/_services/room.service';
import { SystemService } from '@app/_services/system.service';
import { GenericService } from '@app/_services/generic.service';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { IBldg } from '@app/_interface/bldg';
import { IRoom } from '@app/_interface/room';
import { IRate } from '@app/_interface/rate';
import { IRoominfo } from '@app/_interface/roominfo';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})

export class RoomListComponent implements OnInit, OnChanges {

  constructor(
    private roomService: RoomService,
    private genericService: GenericService,
    private systemService: SystemService,

  ) { }

  @Output() currRoomChange = new EventEmitter<IRoom>();
  @Input() currBldg = {} as IBldg;


  roomList: IRoominfo[] = [];
  currRoom: IRoominfo = {} as IRoominfo;
  currRoomID: number | null = null
  rcolorList: any = []
  rateList: IRate[] = []

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
  
  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit()
  }


  sortRates(rlist: any) {
    rlist.sort(function (a: any, b: any) {
      var A = a.alias.toUpperCase(); // ignore upper and lowercase
      var B = b.alias.toUpperCase(); // ignore upper and lowercase
      if (A < B) { return -1; }
      if (A > B) { return 1; }
      return 0;
    });
    return rlist
  }

  clearRoom() {
    this.roomEditForm.reset()
    this.blankRoom(this.currRoom)
    this.ngOnInit()
  }

  blankRoom(room: any) {
    room = {} as IRoominfo;
    this.currRoomID = 0
    room.id = 0
    for (const field in room) {
      if (room[field] == null) {
        room[field] = ''
      }
      this.roomEditForm.reset()
    }
  }
  selectRoom(room: IRoominfo) {

    if (room.id) {

      this.genericService.getItem('roominfo', room.id).subscribe(
        data => {
          this.roomEditForm.patchValue(data)
          this.currRoom = data
          this.currRoomChange.emit(data)
        }
      )
    }
  }

  updateRoom(room: any) {
    room.bldg = this.currBldg.id
    if (!room.id) {
      room.status = "none"
    }
    for (const field in room) {
      if (room[field] == null) {
        room[field] = ''
      }
    }
    this.genericService.updateItem('roominfo', room).subscribe(
      data => {
        this.ngOnInit()
        this.blankRoom(this.currRoom)
      }
    )
  }

  deleteRoom(room: any) {
    this.genericService.deleteItem('roominfo', room).subscribe(
      data => {
        this.ngOnInit()
      }
    )
  }

  refreshList() {
    this.ngOnInit()
  }

  setResults(list: any[]) {

    list.forEach(rec => {
      // find duplicatesd
      const founder = this.roomList.find(d => this.currBldg.id == d.bldg && d.number == rec.number)
      if (founder) {

        rec.id = founder.id
      }
      rec.bldg = this.currBldg.id
      this.genericService.updateItem('roominfo', rec).subscribe(
        data => {
          this.ngOnInit()
        }
      )

    })
  }
   

  ngOnInit(): void {
    if (this.currBldg.id) {
      this.roomEditForm.reset()
      this.roomList = [];

      this.roomService.getBldgRoominfoList(this.currBldg.id)
        .subscribe(
          data => this.roomList = data

        )
    }
    this.systemService.getDropdownList('rcolor').subscribe(
      data => this.rcolorList = data
    )



    this.genericService.getItemList("rate")
      .subscribe(data => {
        this.rateList = this.sortRates(data)
      })

  }
}






