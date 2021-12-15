import { Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { IAction } from '@app/_interface/action';
import { ActionEditComponent } from '../action-edit/action-edit.component';
import { IRoominfo } from '@app/_interface/roominfo';

@Component({
  selector: 'app-action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.scss']
})
export class ActionItemsComponent implements OnInit {

  actionRec: any
  roominfos : IRoominfo[] = []
  actionList:IAction[] = []

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

  newAction() {
    this.actionRec = {} as IAction
    this.openDialog(this.actionRec)
  }

  ngOnInit(): void {
    this.genericService.getItemList('action')
      .subscribe(data => this.actionList = data)
  }

}
