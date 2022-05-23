import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-collision',
  templateUrl: './room-collision.component.html',
  styleUrls: ['./room-collision.component.scss']
})
export class RoomCollisionComponent implements OnInit {

  constructor() { }

@Input() collList:any = []



  ngOnInit(): void {
  }

}
