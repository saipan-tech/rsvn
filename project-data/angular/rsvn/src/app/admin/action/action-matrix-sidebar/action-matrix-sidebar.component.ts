import { Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { RoomService } from '@app/_services/room.service';
@Component({
  selector: 'app-action-matrix-sidebar',
  templateUrl: './action-matrix-sidebar.component.html',
  styleUrls: ['./action-matrix-sidebar.component.scss']
})
export class ActionMatrixSidebarComponent implements OnInit {
  @Input() data:any = {}
  
  constructor(
    private roomService:RoomService,
    private genericService:GenericService

  ) { }
  
loadData() {
  if(this.data && this.data.active) {
    console.log(this.data)
  }

}



  reset() {
    this.data = {info:"Reset it" }
  }
  ngOnChanges(changes:SimpleChanges) {
    this.loadData()
  }
  ngOnInit(): void {
    this.loadData()
  }

}
