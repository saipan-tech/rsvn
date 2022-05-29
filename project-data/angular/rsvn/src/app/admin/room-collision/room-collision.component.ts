import { Component, Input, OnInit } from '@angular/core';
import { IRsvn } from '@app/_interface/rsvn';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';

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
    private bldgService: BldgEntityService
  ) { }

  @Input() collList: any = []
  @Input() currRoominfos:any = ''

  currRsvn = {} as IRsvn

  rsvnScan: Observable<any> = of()




  checkRsvn(rsvnid: number, rateAlias: any) {


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
             this.currRoominfos.split(',').forEach((cri:string)=>{
                activeRooms.add(Number(cri))
              })
              console.log(this.currRoominfos,activeRooms)
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

              
              return { rate: rateAlias, exchange:result_exc, newRate:result_new }


            }
            ))
          ))
        ))
      ))

  }

  ngOnInit(): void {

  }

}
