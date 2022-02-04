import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IGuest } from '@app/_interface/guest';
import { IRate } from '@app/_interface/rate';
import { IRoominfo } from '@app/_interface/roominfo';
import { IRsvn } from '@app/_interface/rsvn';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { GenericService } from '@app/_services/generic.service';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-room-avail',
  templateUrl: './room-avail.component.html',
  styleUrls: ['./room-avail.component.scss']
})
export class RoomAvailComponent implements OnInit {

  availRooms$: Observable<any[]> = of()

  @Input() currRsvn: IRsvn = {} as IRsvn
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  
  constructor(
    private roomService: RoomEntityService,
    private roominfoService: RoominfoEntityService,
    private genericService: GenericService
  ) { }



  reload() {
    let dateIn = this.currRsvn.dateIn
    let dateOut = this.currRsvn.dateOut

    let bldg$ = this.genericService.getItemList("bldg")
    let rate$ = this.genericService.getItemList("rate")
    let ris$ = this.roominfoService.entities$
    
    

    let exclude$ = this.roomService.entities$
      .pipe(
          map( room => room.filter(room=>
            (room.dateIn <= dateIn && room.dateOut >= dateIn ) ||
            (room.dateIn <= dateOut && room.dateOut >= dateIn ) || 
            (room.dateIn <= dateOut && room.dateOut >= dateOut )
        ) 
      ))

    let edited$ = combineLatest([ris$,exclude$]).pipe(
      map(([roominfo,exclude]) => {
        var result:IRoominfo[] = []

        roominfo.forEach(ex=>{
          if  ( !exclude.find(r=> ex.id == r.roominfo))  
          {
            result.push(ex)           
          }
        })
        return result
      })
    )        


    this.availRooms$ = combineLatest([edited$, bldg$, rate$,])
      .pipe(
        map(([roominfo, bldg, rate]) => {
          let found: any[] = []

          bldg.forEach((bldg:IBldg) => {
            let bldgrec:any = {bldg,rates:[]}
            rate.forEach((rate:IRate) => {
              bldgrec.rates.push({rate:rate,roominfo: roominfo.filter(ris=> ris.rateAlias == rate.alias && bldg.id==ris.bldg)
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