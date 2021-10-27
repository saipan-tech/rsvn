import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRsvn } from '@app/_interface/rsvn'
import { IRoom } from '@app/_interface/room'
import { IRate } from '@app/_interface/rate'
import { IRoominfo } from '@app/_interface/roominfo'
import { IGuest } from '@app/_interface/guest'
import { GenericService } from '@app/_services/generic.service';
import { RsvnService } from '@app/_services/rsvn.service';
import { RoomService } from '@app/_services/room.service';
import { MatRadioModule } from '@angular/material/radio';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-room-ctrl',
  templateUrl: './room-ctrl.component.html',
  styleUrls: ['./room-ctrl.component.scss']
})
export class RoomCtrlComponent implements OnInit, OnChanges {


  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  @Input() currGuest: any
  @Output() currGuestChange = new EventEmitter<IGuest>();


  currNumRooms = 0
  currRooms: IRoom[] = []

  bldgList: IBldg[] = []
  roomList: IRoominfo[] = []
  rateList: IRate[] = []

  currRoomList: any[] = []


  dispList:any = []
  availRoominfo: IRoominfo[] = []
  unavailRoominfo: IRoominfo[] = []
  rsvnRoom: IRoom[] = []

  constructor(
    private genericService: GenericService,
    private rsvnService: RsvnService,
    private roomService: RoomService
  ) { }




  refreshRsvn() {
    this.genericService.getItem("rsvn", this.currRsvn.id).subscribe(
      data => {
        this.currRsvn = data
        this.currRsvnChange.emit(data)
      }
    )
  }

  assignRoom(roominfo: IRoominfo) {
    if (this.currNumRooms < Number(this.currRsvn.numrooms)) {
      let newroom = { rsvn: this.currRsvn.id, roominfo: roominfo.id, status: 'new' }
      this.genericService.updateItem("room", newroom)
        .subscribe(data => {
          this.ngOnInit()
          this.refreshRsvn();
        })
    }

  }

  unassignRoom(room: any) {
    this.genericService.deleteItem("room", room)
      .subscribe(data => {
        this.ngOnInit()
        this.refreshRsvn();
      })
  }





  makeList() {
    this.dispList = []
    this.bldgList.forEach(
      bdg => {
        
        let rates:any = []
        let bldg:IBldg  = bdg
        let rms = this.availRoominfo.filter(r => r.bldg == bldg.id)
        this.rateList.forEach( rate => {
          rates.push({rate,rooms:rms.filter(x => x.rate == rate.alias)})
        })  
        this.dispList.push({rates,bldg})
      }
    )

         console.log(this.dispList)
  }





  sortRateList(rooms:any) {
    rooms.sort(function(a:any, b:any) {
      var A = a.alias; // ignore upper and lowercase
      var B = b.alias; // ignore upper and lowercase
      if (A > B) { return 1; }
      if (A < B) { return -1;  }
      return 0; });
    return rooms
  }


/*
  bldgText(bldg: number) {
    return this.bldgList.find(b => b.id == bldg)?.name
  }
*/




  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit()
  }






  ngOnInit(): void {

    // Get Rate List
    if (this.currRsvn && this.currRsvn.id) {
      this.genericService.getItemList("rate")
        .subscribe(
          data => {
            this.rateList = this.sortRateList(data)
          })

    // Get rooms for this RSVN
    this.roomService.getRsvnRoom(this.currRsvn.id).subscribe(
        rooms => {
          this.currNumRooms = rooms.length
          this.currRooms = rooms
        }
      )
    }


    // Looking at this rsvn date frame  - what is the state of rooms
    if (this.currRsvn && this.currRsvn.dateIn && this.currRsvn.dateOut) {
      // we are creating our UnAssigned Rooms here
      this.roomService.availableRooms(this.currRsvn.dateIn, this.currRsvn.dateOut)
        .subscribe(avail => {
          this.availRoominfo = avail
          this.genericService.getItemList("bldg").subscribe(
            bldgs => {
              this.bldgList = bldgs
              this.makeList()
              console.log(this.bldgList)
            })
        })
      // we are creating our Assigned Rooms here
      this.roomService.unavailableRooms(this.currRsvn.dateIn, this.currRsvn.dateOut)
        .subscribe(unavail => {
          this.unavailRoominfo = unavail
          this.roomService.getRsvnRoom(this.currRsvn.id)
            .subscribe(rroom => {
              this.rsvnRoom = rroom
              this.currRoomList = []
              this.rsvnRoom.forEach(rsvrm => {
                let roominfo:any  = unavail.find(rrf => rrf.id == rsvrm.roominfo)
                let room = rsvrm
                let bldg = this.bldgList.find(bl => bl.id == roominfo.bldg)
                this.currRoomList.push({ bldg, room, roominfo })
              })
              console.log(this.currRoomList)
            })
        })
    } 
  }
}

