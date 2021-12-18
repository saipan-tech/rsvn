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

  actionRec: any
  roominfos: IRoominfo[] = []
  actionList: any[] = []
  itemList: IDropdown[] = []
  staffList: any[] = []
  bldgList:any[] = []
  currRoominfos:any[] = []


  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private roomService: RoomService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  //--------------------------
  openDialog(actionRec: IAction) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = [];
    dialogConfig.width = '90%';
    dialogConfig.data = {
      actionRec: actionRec,

    }
    const dialogRef = this.dialog.open(ActionEditComponent, dialogConfig)
    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.actionRec = data;
          this.ngOnInit()
        }
      )
  }

 
  bldgName(id: number) {
    let b = this.bldgList.find(f => f.id == id)
    if (b) return b.name
    else return {}


  }
  dropDisplay(ddlist: IDropdown[], key: string) {
    let found: IDropdown | any = ddlist.find(d => d.value == key)
    if (found) return found.display
    return ""
  }
  newAction() {
    this.actionRec = {} as IAction
    this.openDialog(this.actionRec)
  }
  getRooms(act_id:number ) {
    this.roomService.getActionRoominfo(act_id)
      .subscribe(d=> { 
        this.currRoominfos = d
        this.currRoominfos.forEach( cri =>
          cri.bldgName = this.bldgName(cri.bldg) ) 
      })
  }

  ngOnInit(): void {


    this.genericService.getItemList('action')
      .subscribe(d => {
        this.actionList = d;
       
      
      })
  
  
      this.genericService.getItemList('action')
      .pipe(
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
