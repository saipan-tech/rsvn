import { Component, Input, OnInit } from '@angular/core';
import { IRoominfo } from '@app/_interface/roominfo';

@Component({
  selector: 'app-matrix-line',
  templateUrl: './matrix-line.component.html',
  styleUrls: ['./matrix-line.component.scss']
})
export class MatrixLineComponent implements OnInit {
@Input() dayList:any[] = []
@Input() gridwidth:any
@Input() gridline:any
lineArray:any
constructor() { }

  ngOnInit(): void {
    this.lineArray = new Array(this.dayList.length)
    this.gridline.rooms.forEach((rm:any) => 
      {
        for(let y=rm.startOffset; y<=rm.endOffset; ++y) {
          this.lineArray[y] = { 
            color:rm.rsvn.color
          }
        }
        console.log(this.gridline)

      })


  }

}
