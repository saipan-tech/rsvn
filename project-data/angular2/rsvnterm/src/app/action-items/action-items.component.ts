import { Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { IAction } from '@app/_interface/action';
import { IRoominfo } from '@app/_interface/roominfo';
import { IDropdown } from '@app/_interface/dropdown';
import { catchError, tap, map, concatMap,mergeMap } from 'rxjs/operators';
import { IStaff } from '@app/_interface/staff';
import { RoomService } from '@app/_services/room.service';

@Component({
  selector: 'app-action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.scss']
})
export class ActionItemsComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private roomService: RoomService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  @Input() currUsername : any
  actionRec: any
  today = new Date().toISOString().slice(0,10)
  roominfos: IRoominfo[] = []
  actionList: any[] = []
  currRoominfos:any[] = []
  bldgList:any[] = []
  todayAction :any[] = []

 
  bldgName(id: number) {
    let b = this.bldgList.find(f => f.id == id)
    if (b) return b.name
    else return {}
  }
 
  ngOnInit(): void {
    console.log(this.today)
    this.actionList=[]
      this.genericService.getItemQueryList("action",`username=${this.currUsername}&all`)
      .pipe(
        tap(data => {
          this.actionList = data
          data.forEach(x => {
            if(x.date == this.today || x.continuous) this.todayAction.push([x])
            
          })
        }
          ),
        mergeMap(() => this.genericService.getItemList('bldg')),
        tap(data => this.bldgList =  data)

      ).subscribe( () => console.log(this.todayAction))
    }
}

