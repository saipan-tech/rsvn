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


  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
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
    console.log("get rooms", act_id)
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
        })
      ).subscribe()
  
    }

}
