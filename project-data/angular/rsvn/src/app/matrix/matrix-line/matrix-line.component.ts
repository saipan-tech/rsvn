import { Component, Input, OnInit } from '@angular/core';
import { IRoominfo } from '@app/_interface/roominfo';

@Component({
  selector: 'app-matrix-line',
  templateUrl: './matrix-line.component.html',
  styleUrls: ['./matrix-line.component.scss']
})
export class MatrixLineComponent implements OnInit {
@Input() dayList:any
@Input() gridwidth:any
@Input() gridline:any
  constructor() { }

  ngOnInit(): void {
  }

}
