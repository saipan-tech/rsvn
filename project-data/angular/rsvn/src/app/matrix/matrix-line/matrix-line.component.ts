import { Component, Input, OnInit } from '@angular/core';
import { IRoominfo } from '@app/_interface/roominfo';

@Component({
  selector: 'app-matrix-line',
  templateUrl: './matrix-line.component.html',
  styleUrls: ['./matrix-line.component.scss']
})
export class MatrixLineComponent implements OnInit {
@Input() roominfo:IRoominfo = {} as IRoominfo
  constructor() { }

  ngOnInit(): void {
  }

}
