import { Component, OnInit } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRate } from '@app/_interface/rate';
import { IRoominfo } from '@app/_interface/roominfo';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { GenericService } from '@app/_services/generic.service';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface gridRec {
  bldg: IBldg;
  roominfo: IRoominfo[];

}


@Component({
  selector: 'app-room-avail',
  templateUrl: './room-avail.component.html',
  styleUrls: ['./room-avail.component.scss']
})
export class RoomAvailComponent implements OnInit {

  availRooms$: Observable<any[]> = of()



  constructor(
    private roomService: RoomEntityService,
    private roominfoService: RoominfoEntityService,
    private genericService: GenericService
  ) { }



  reload() {

    let bldg$ = this.genericService.getItemList("bldg")
    let rate$ = this.genericService.getItemList("rate")
    let ris$ = this.roominfoService.entities$
     this.availRooms$ = combineLatest([ris$, bldg$, rate$])
      .pipe(
        map(([roominfo, bldg, rate]) => {
          let found: any[] = []
          bldg.forEach((bldg:IBldg) => {
            let bldgrec:any = {bldg,rates:[]}
            rate.forEach((rate:IRate) => {
              bldgrec.rates.push({rate:rate,roominfo: roominfo.filter(ris=> ris.rateAlias == rate.alias)
                }
                  )})
                  found.push(bldgrec)
                })
          return found
        })
      )
  }


  ngOnInit(): void {
    this.reload()
  }

}


/*

makeList() {
    this.dispList = []
    this.bldgList.forEach(
      bdg => {
        let rates: any = []
        let bldg: IBldg = bdg
        let rms = this.availRoominfo.filter(r => r.bldg == bldg.id)
        this.rateList.forEach(rate => {
          rates.push({
            rate,
            rooms: rms.filter(x => x.rateAlias == rate.alias),
          })
        })
        this.dispList.push({ rates, bldg })
      }
    )
  }



if (this.currRsvn && this.currRsvn.id) {
      let bldg$ = this.genericService.getItemList("bldg")
      let rQuery$ = this.roomEntityService.getWithQuery({ rsvn: this.currRsvn.id })
      this.roomQuery$ = combineLatest([rQuery$, this.roominfoEntityService.entities$, bldg$])
        .pipe(
          map(([rquery, roominfo, bldg]) => {
            let found: any = []
            rquery.forEach((rq: any) => {
              let newrq = { ...rq }
              newrq.roominfo = roominfo.find(r => r.id == rq.roominfo)
              newrq.bldg = bldg.find(b => b.id == newrq.roominfo.bldg)
              found.push(newrq)
            })
            return found
          }))
*/