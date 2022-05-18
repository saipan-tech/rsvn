import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { concatMap, map, tap } from 'rxjs/operators';
import { IRoominfo } from '@app/_interface/roominfo';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-room-selector',
  templateUrl: './room-selector.component.html',
  styleUrls: ['./room-selector.component.scss']
})
export class RoomSelectorComponent implements OnInit {
  
  @Input() roomString:string = ''
  @Output() roomStringChange = new EventEmitter<string>()
  roomList$: Observable<any> = of()
  
  constructor(
    private roominfoService: RoominfoEntityService
  ) { }

  setRoom(roomid: string) {
    let result 
    let arSet = new Set(this.roomString.split(','))

    if (arSet.has('')) arSet.delete('')

    if (arSet.has(String(roomid))) {
      arSet.delete(String(roomid))
    }
    else {
      arSet.add(roomid)
    }

    if (arSet.size) result = [...arSet].join(',')
    else result = ""

    this.roomString =  result
    this.roomStringChange.emit(result)
    
    this.reload()
  }

//---------------------------------
reload() {
  this.roomList$ = this.roominfoService.entities$.pipe(
    map((roominfo) => {
      
      let actrooms:any = []
      if( this.roomString && this.roomString.length) {
        actrooms = this.roomString.split(',')
      }
      let result: any = []
      roominfo.map((ri: IRoominfo) => {
        result.push({ ...ri, check: actrooms.find((a: any) => a == ri.id) })

      })
      return result
    }),
    concatMap((ri:any) => this.roominfoService.bldgRoominfoList$(ri))
  )
  
}
  // -------------------------------------------



  ngOnInit(): void {

    this.reload()
    
  }

}
