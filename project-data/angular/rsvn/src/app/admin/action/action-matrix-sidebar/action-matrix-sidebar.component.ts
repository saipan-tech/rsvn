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
    this.genericService.getItem('rsvn',this.data.room.rsvn)
    .subscribe(r => { 
      this.data.rsvn =r;
      console.log(this.data)
    
    })
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

/*
"rsvn": { "id": 20, "status": "confirmed", "confirm": "R20220112-0020", "source": "fit", "dateIn": "2022-01-11", "dateOut": "2022-01-20", "numrooms": 4, "adult": 5, "child": 0, "infant": 0, "notes": "", "color": "pink", "clerk": "hoboland", "created": "2022-01-12T00:18:54.523482Z", "modified": "2022-01-12T00:18:54.551237Z", "primary": { "id": 37, "firstname": "Walter", "middlename": "", "lastname": "Christensen", "phone": "864-654-8222", "address": "Success", "city": "Austin", "state": "TX", "zipcode": "78767", "email": "walter@artman-conception.com", "idtype": "passport", "idnum": "499612056", "idexpire": "12/25/2040", "birthday": "6/10/1960", "company": "Salamander Hotels", "title": "PR Specialist", "notes": "", "clerk": "api", "created": "2021-11-03T07:31:33.591795Z", "modified": "2021-11-03T07:31:33.591833Z" }, "guests": [], "amenities": [] } }

*/