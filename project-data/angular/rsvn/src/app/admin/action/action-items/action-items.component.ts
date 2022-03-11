import { Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { IAction } from '@app/_interface/action';
import { ActionEditComponent } from '../action-edit/action-edit.component';
import { IRoominfo } from '@app/_interface/roominfo';
import { IDropdown } from '@app/_interface/dropdown';
import { catchError, tap, map, concatMap } from 'rxjs/operators';
import { IStaff } from '@app/_interface/staff';
import { RoomService } from '@app/_services/room.service';

@Component({
  selector: 'app-action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.scss']
})
export class ActionItemsComponent implements OnInit {

  roominfos: IRoominfo[] = []
  actionList: any[] = []
  itemList: IDropdown[] = []
  staffList: any[] = []
  bldgList:any[] = []
  currRoominfos:any[] = []
  showall = false;
  search$ = this.genericService.getItemQueryList('action','today=1')
  
  
  
  @Output() changeItems:any  = new EventEmitter<any>()
  @Input() actionRec: IAction = {} as IAction
  @Output() actionRecChange  = new EventEmitter<IAction>()
  
  
  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private roomService: RoomService,
    private authService: AuthService,
  ) { }

  //--------------------------
  
  dropDisplay(ddlist: IDropdown[], key: string) {
    let found: IDropdown | any = ddlist.find(d => d.value == key)
    if (found) return found.display
    return ""
  }


  newAction() {
    this.actionRec = {} as IAction
  }


  getRooms(act_id:number ) {
    this.roomService.getActionRoominfo(act_id)
      .subscribe(d=> { 
        this.currRoominfos = d

      })
  }

  toggleView() {
    this.showall = !this.showall
    if(this.showall) {
      this.search$ = this.genericService.getItemList('action')
      this.showall = true
    }
    else {
      this.search$ = this.genericService.getItemQueryList('action','today=1')
      this.showall = false
    }
   
    
  }
 actionSelect(actionid:number):void {
this.genericService.getItem('action',actionid)
  .subscribe(d=> this.actionRecChange.emit(d))

 }

  ngOnInit(): void {


    this.actionList = []
      // we decide the observable to search on ahead of time
      this.search$.pipe(
        tap(data => this.actionList = data),
        concatMap(() => this.genericService.getItemList('staff')),
        tap(data => {
           this.staffList = data
          this.actionList.forEach(act => {
            let a = this.staffList.find(sl => sl.id == act.staff )
            act.fullname = `${a.first_name} ${a.last_name}`
          })
        }),
        concatMap(() => this.genericService.getItemList('bldg')),
        tap(data => this.bldgList =  data)

      ).subscribe()
  
    }

}
