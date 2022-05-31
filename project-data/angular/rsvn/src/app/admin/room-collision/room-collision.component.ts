import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IRoom } from '@app/_interface/room';
import { IRoominfo } from '@app/_interface/roominfo';
import { IRsvn } from '@app/_interface/rsvn';
import { ISvcRsvn } from '@app/_interface/svcrsvn';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { ChargeService } from '@app/_services/charge.service';

import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-room-collision',
  templateUrl: './room-collision.component.html',
  styleUrls: ['./room-collision.component.scss']
})
export class RoomCollisionComponent implements OnInit {

  constructor(
    private rsvnService: RsvnEntityService,
    private roomService: RoomEntityService,
    private roominfoService: RoominfoEntityService,
    private bldgService: BldgEntityService,
    private chargeService: ChargeService
  ) { }

  @Input() collList: any = []
  @Input() currRoominfos: any = ''
  @Output() listChange = new EventEmitter<any>();

  currRsvn = {} as IRsvn

  currScan: any = {}

  rsvnScan: Observable<any> = of()


  // checkRsvn(r.room.rsvn,r.roominfo.rateAlias)

  checkRsvn(r: any) {
    this.currScan = r
    let rsvnid = r.room.rsvn
    let rateAlias = r.roominfo.rateAlias
    this.rsvnScan = this.bldgService.entities$.pipe(
      concatMap(bldg => this.roominfoService.entities$.pipe(
        concatMap(roominfos => this.rsvnService.getByKey(rsvnid).pipe(
          concatMap(rsvn => this.roomService.activeRoom$(rsvn.dateIn, rsvn.dateOut).pipe(
            map(rooms => {
              this.currRsvn = rsvn

              // find our active rooms during this reservation
              let activeRooms = new Set()
              rooms.forEach(rms => {
                activeRooms.add(rms.roominfo)
              })
              this.currRoominfos.split(',').forEach((cri: string) => {
                activeRooms.add(Number(cri))
              })

              let exchange: any = {}
              let changeRate: any = {}
              roominfos.forEach((ri: any) => {
                if (!activeRooms.has(ri.id)) {
                  let rinew: any = { ...ri }

                  let b: any = bldg.find(b => b.id == ri.bldg)
                  rinew.bldgname = b.name

                  if (ri.rateAlias == rateAlias) {
                    if (!exchange.hasOwnProperty(b.name)) exchange[b.name] = []
                    exchange[b.name].push(rinew)
                  }
                  else {
                    if (!changeRate.hasOwnProperty(b.name)) changeRate[b.name] = {}
                    if (!changeRate[b.name].hasOwnProperty(rinew.rateAlias)) changeRate[b.name][rinew.rateAlias] = []

                    changeRate[b.name][rinew.rateAlias].push(rinew)
                  }
                }
              })
              let result_exc: any = []
              Object.keys(exchange).forEach(
                exk => {

                  result_exc.push(
                    {
                      bldg: exk,
                      roominfos: exchange[exk]
                    })
                })

              let result_new: any = []
              Object.keys(changeRate).forEach(
                chr => {
                  let record: any = { bldg: chr, rateList: [] }
                  Object.keys(changeRate[chr]).forEach(
                    ch_rate => {
                      record.rateList.push({
                        rate: ch_rate,
                        roominfos: changeRate[chr][ch_rate]
                      })
                    })
                  result_new.push(record)
                })


              return { bldg: r.bldg, roominfo: r.roominfo, rate: rateAlias, exchange: result_exc, newRate: result_new }


            }
            ))
          ))
        ))
      ))

  }




  assignRoom(ri: IRoominfo, rsvn: IRsvn) {
    // calculate number of rooms currently on Reservation

    let newroom = {
      rsvn: rsvn.id,
      roominfo: ri.id,
      status: 'swap',
      dateIn: rsvn.dateIn,
      dateOut: rsvn.dateOut
    }
    this.listChange.emit(true) 
    this.roomService.add(newroom).pipe(
      concatMap((room: any) => this.chargeService.synchRoomcharge(room.id).pipe(
        map((t) => console.log(t, room))
      ))
    ).subscribe()
  }


  removeRoom(room:IRoom) {
    this.roomService.delete(room)
  }


  swapRoom(ri: any) {
      // eventually there should be a confirmation Dialog here
  this.removeRoom(this.currScan.room)
  this.assignRoom(ri,this.currRsvn)
    // after confirmation remove room from reservation and delete
    // create a new room reservation with the new room
    // refresh and return but do not close edit screen
  }



  ngOnInit(): void {

  }

}


/*

//=========================================
  assignRoom(ri: IRoominfo) {


    if (this.currNumRooms < this.currRsvn.numrooms) {
      let newroom = {
        rsvn: this.currRsvn.id,
        roominfo: ri.id,
        status: 'new',
        dateIn: this.currRsvn.dateIn,
        dateOut: this.currRsvn.dateOut
      }
      this.roomService.add(newroom).pipe(
        concatMap((room:any)  => this.chargeService.synchRoomcharge(room.id).pipe(
          map((t) => console.log(t,room))
        ))
        ).subscribe(data => console.log("RETURN",data))
    }

  }


*/