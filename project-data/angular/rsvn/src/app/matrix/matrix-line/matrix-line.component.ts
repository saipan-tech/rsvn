import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IRoominfo } from '@app/_interface/roominfo';
import { IRsvn } from '@app/_interface/rsvn';


@Component({
  selector: 'app-matrix-line',
  templateUrl: './matrix-line.component.html',
  styleUrls: ['./matrix-line.component.scss']
})
export class MatrixLineComponent implements OnInit {
@Input() dayList:any[] = []
@Input() gridwidth:any
@Input() gridline:any
@Output() rsvnId = new EventEmitter<number>()

lineArray:any
constructor() { }

reload() {
  this.lineArray = new Array(this.dayList.length)

  this.gridline.rooms.forEach((rm:any) => 
    {
      for(let y=rm.startOffset; y<rm.endOffset; ++y) {
        this.lineArray[y] = { 
          color:rm.rsvn.color,
          rsvn:rm.rsvn.id,
          curr:rm.currRsvnId
        }
      }
    })


}

  selectRsvn(rsvnid:number) {
    this.rsvnId.emit(rsvnid)
    this.reload()

  }
  ngOnInit(): void {
    this.reload()
  }

}
