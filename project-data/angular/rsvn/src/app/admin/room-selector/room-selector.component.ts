import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { concatMap, map, tap } from 'rxjs/operators';
import { IRoominfo } from '@app/_interface/roominfo';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-room-selector',
  templateUrl: './room-selector.component.html',
  styleUrls: ['./room-selector.component.scss']
})
export class RoomSelectorComponent implements OnInit,OnChanges {
  
  @Input() roomString:string = ''
  @Input() warnString:string = ''
  @Output() roomStringChange = new EventEmitter<string>()
  @Output() refreshString = new EventEmitter<string>()
  
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
    this.refreshString.emit(result)
    
    this.reload()
  }

//---------------------------------
reload() {
  this.roomList$ = this.roominfoService.entities$.pipe(
    map((roominfo) => {
      
      let actrooms:any = []
      let warnrooms:any = []
      if( this.roomString && this.roomString.length) {
        actrooms = this.roomString.split(',')
      }
      if( this.warnString && this.warnString.length) {
        warnrooms = this.warnString.split(',')
      }
      
      let result: any = []
      roominfo.map((ri: IRoominfo) => {
        result.push({ ...ri, 
          check: actrooms.find((a: any) => a == ri.id),
          warn:warnrooms.find((a: any) => a == ri.id) 
        })

      })
      return result
    }),
    concatMap((ri:any) => this.roominfoService.bldgRoominfoList$(ri))
  )
  
}
  // -------------------------------------------

ngOnChanges(changes: SimpleChanges): void {
  this.reload()
}

  ngOnInit(): void {

    this.reload()
    
  }

}
