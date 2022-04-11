import { Component, OnInit } from '@angular/core';
import { IRoominfo } from '@app/_interface/roominfo';

@Component({
  selector: 'app-current-ctrl',
  templateUrl: './current-ctrl.component.html',
  styleUrls: ['./current-ctrl.component.scss']
})
export class CurrentCtrlComponent implements OnInit {
  
  currRoominfo:IRoominfo = {} as IRoominfo
  
  constructor() { }

  ngOnInit(): void {
  }

}
