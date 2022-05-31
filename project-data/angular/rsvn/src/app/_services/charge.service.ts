import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map, concatMap } from 'rxjs/operators';
import { concat, Observable, throwError } from 'rxjs';
import { AppEnv } from '@app/_helpers/appenv';
import { IRsvn } from '@app/_interface/rsvn';
import { ICharge } from '@app/_interface/charge';
import { IPayment } from '@app/_interface/payment';
import { IRoomcharge } from '@app/_interface/roomcharge';
import { IRoom } from '@app/_interface/room';
import { GenericService } from './generic.service';
import { SystemService } from '@app/_services/system.service';
import { number } from 'echarts';
import { concatLatestFrom } from '@ngrx/effects';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';

@Injectable({
  providedIn: 'root'
})
export class ChargeService {

  constructor(
    private env: AppEnv,
    private http: HttpClient,
    private genericService: GenericService,
    private systemService: SystemService,
    private bldgService: BldgEntityService,
    private roominfoService: RoominfoEntityService,
    private roomService: RoomEntityService

  ) { }

  private urlRoot = `${this.env.WEB_API}`
  //==================================================
  getRsvnCharge(rsvnid: number): Observable<ICharge[]> {
    return this.http
      .get<ICharge[]>(`${this.urlRoot}/charge?rsvn=${rsvnid}`)
  }
  //==================================================
  getRsvnPayment(rsvnid: number): Observable<IPayment[]> {
    return this.http
      .get<IPayment[]>(`${this.urlRoot}/payment?rsvn=${rsvnid}`)
  }
  //==================================================
  getRsvnRoomCharge(rsvnid: number): Observable<any> {
    return this.genericService.getItem("rsvn", rsvnid).pipe(
      concatMap((rsvn) => this.genericService.getItemQueryList('seasoncal', `dateStart=${rsvn.dateIn}&dateEnd=${rsvn.dateOut}`).pipe(
        concatMap((seascal) => this.bldgService.entities$.pipe(
          concatMap((bldg) => this.roominfoService.entities$.pipe(
            concatMap((roominfos) => this.genericService.getItemQueryList("roomcharge", `rsvn=${rsvn.id}`).pipe(
              concatMap((roomcharge) => this.roomService.getWithQuery(`rsvn=${rsvn.id}`).pipe(
                map((rooms) => {
                  let result: any = []
                  let roomTotal = 0
                  rooms.map((rm) => {
                    let rinfo: any = roominfos.find(ri => ri.id == rm.roominfo)
                    // run a reduce on the charges right here
                    let rcCharges = roomcharge.filter(rc => rc.room == rm.id).reduce((prev: any, curr: any) => {
                      return Number(prev) + Number(curr.amount)
                    }, 0)

                    roomTotal += rcCharges
                    let charges = roomcharge.filter(rc => rc.room == rm.id)
                    charges.map((cc) => {
                      let testing = seascal.find((s) => s.date == cc.date)
                      if (testing) cc.season = testing.season
                    })
                    result.push(
                      {
                        days: this.systemService.daySpan(rsvn.dateIn, rsvn.dateOut),
                        room: rm,
                        bldg: bldg.find((b) => b.id == rinfo.bldg),
                        roominfo: rinfo,
                        charges: charges,
                        total_charges: rcCharges
                      })

                  })
                  return result
                })
              )))))))))))
  }
  //==================================================
  getChargeCalc(query: string): Observable<any> {
    return this.http
      .get<any>(`${this.urlRoot}/chargecalc?${query}`)
  }
 //==================================================
  synchRoomcharge(roomid: number): Observable<any> {
    return this.genericService.getItem('room', roomid).pipe(
      concatMap((room) => this.genericService.getItem('roominfo', room.roominfo).pipe(
        concatMap((roominfo) => this.genericService.getItemQueryList('seasoncal', `dateStart=${room.dateIn}&dateEnd=${room.dateOut}`).pipe(
          concatMap((seascal) => this.genericService.getItemList('rate').pipe(
            concatMap((rate) => this.genericService.getItemList('season').pipe(
              concatMap((seasons) => this.genericService.getItemQueryList('roomcharge', `room=${roomid}`).pipe(
                map((rcharges) => {
                  let obsStack: any = []
                  let dayStack = this.systemService.daySpanSeq(room.dateIn, room.dateOut, 1)

                  //  console.log(room, roominfo, seascal, seasons,rate, rcharges, dayStack)

                  rcharges.forEach(rc => {
                    if (!dayStack.find(ds => ds == rc.date)) {
                      obsStack.push(this.genericService.deleteItem('roomcharge', rc))
                    }
                  })

                  dayStack.forEach(ds => {
                    if (!rcharges.find(rc => rc.date == ds)) {
                      // making up charges
                      // grap season calendar day
                      let seacal = seascal.find((s) => s.date == ds)
                      let seas = seasons.find((sn) => sn.name == seacal.season)
                      let curr_rate = rate.find((r) => r.alias == roominfo.rateAlias)

                      //                    console.log("ADDING Records",ds, seacal.season, curr_rate.rack, seas.discount)
                      let record = {
                        room: roomid,
                        date: ds,
                        amount: Number(curr_rate.rack * seas.discount)
                      }
                      //                  console.log("ADDING Records",record)
                      obsStack.push(this.genericService.updateItem('roomcharge', record))
                    }
                  })
                  return obsStack
                }),
                concatMap(obsStack => concat(...obsStack))

              )),
            ))
          ))
        ))
      ))
    )

  }

}