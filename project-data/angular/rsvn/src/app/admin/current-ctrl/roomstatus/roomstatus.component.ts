import { Input, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { IRoominfo } from '@app/_interface/roominfo';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { GenericService } from '@app/_services/generic.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { IRoom } from '@app/_interface/room';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { AppConstants } from '@app/app.constants';
import { RoomService } from '@app/_services/room.service';

@Component({
  selector: 'app-roomstatus',
  templateUrl: './roomstatus.component.html',
  styleUrls: ['./roomstatus.component.scss']
})



export class RoomstatusComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() currRoominfo: IRoominfo = {} as IRoominfo

  roomList:any[] = []
  roomUsage:any = {}
  displayedColumns = ['id','dateIn','dateOut','rsvn']
  
  // dataSource = new MatTableDataSource<IRoom>(this.roomList);
 
  // @ViewChild(MatSort) sort: MatSort | any;
 // @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private roomService: RoomEntityService,
    private genericService: GenericService,
    private roominfoService: RoominfoEntityService,
    private appCons: AppConstants,
  ) { 

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.currRoominfo && this.currRoominfo.id) {
      this.roomService.entities$.pipe(
        map((rooms) => rooms.filter(r => r.roominfo == this.currRoominfo.id)),
        map((rooms) => {
            let result:any[] = []
            let totals:number = 0
            rooms.map((r:any)=> {
              result.push({...r,span:this.dayspan(r)})
              totals += this.dayspan(r)
            }
          )
            return ({result,totals})
        })

      ).subscribe(data => this.roomUsage = data)
    }
  }

  ngAfterViewInit() {
//    this.dataSource.sort = this.sort;
  //  this.dataSource.paginator = this.paginator;
  }

dayspan(room:IRoom):number {
  let dateIn = new Date(room.dateIn).getTime()
  let dateOut = new Date(room.dateOut).getTime()
  return  (dateOut - dateIn)/this.appCons.DAILYSECONDS
}

  ngOnInit(): void {

    
  if(this.currRoominfo && this.currRoominfo.id) {
}
  }

}
