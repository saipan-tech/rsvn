import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IRsvn } from '@app/_interface/rsvn';
import { IGuest } from '@app/_interface/guest';
import { catchError, tap, map, mergeMap, subscribeOn, filter } from 'rxjs/operators';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { GuestEntityService } from '@app/_ngrxServices/guest-entity.service';
//import { GenericService } from '@app/_services/generic.service';


@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit,OnChanges {
  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();
  @Input() currGuest: any
  @Output() currGuestChange = new EventEmitter<IGuest>();
  @Input() multiList: any

  rsvnList$:Observable<any> = of()
  guestList$:Observable<any> = of()
   blankRsvn : IRsvn = {} as IRsvn
  constructor(
    private roominfoService: RoominfoEntityService,
    private roomService: RoomEntityService,
    private rsvnService: RsvnEntityService,
    private guestService: GuestEntityService,
  //  private genericService: GenericService

  ) { }

reload() {
  let rsvn$:Observable<IRsvn[]> = this.multiList.rsvn
  let guest$:Observable<IGuest[]> = this.multiList.guest
  
  this.guestList$ = combineLatest([rsvn$,guest$]).pipe(
    map(([rsvn,guest]) => {
      let result:any = []
      guest.forEach(gst => {
        if(! rsvn.find(v => v.primary == gst.id)) result.push(gst)
      })
      return result
    })
  )


  this.rsvnList$ =  combineLatest([rsvn$,this.guestService.entities$]).pipe(
    map(([rsvns,guest]) =>  {
      let result:any[]  = []
      rsvns.forEach((rsvn:IRsvn) => {
         result.push(
          {rsvn, guest:guest.find(g => rsvn.primary == g.id)}
        )
      })
      return result
    })  
  )
}
rsvnSelect(rsvnid:any) {
  this.rsvnService.getByKey(rsvnid).subscribe(r=>this.currRsvnChange.emit(r))

}
guestSelect(guest:any) {
  this.currGuestChange.emit(guest)
  this.currRsvnChange.emit(this.blankRsvn)
  

}

  ngOnChanges(changes:SimpleChanges) {
  this.reload()
}
  ngOnInit(): void {
    if(this.multiList && this.multiList.rsvn) {
      this.reload()

    }
  }

}
