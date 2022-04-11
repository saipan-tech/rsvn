import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ICalendar } from '@app/_interface/calendar';
import { ISvcRsvn } from '@app/_interface/svcrsvn';
import { SvcrsvnEditComponent } from '../svcrsvn-edit/svcrsvn-edit.component';
import { IRoominfo } from '@app/_interface/roominfo';


@Component({
  selector: 'app-svcrsvn-list',
  templateUrl: './svcrsvn-list.component.html',
  styleUrls: ['./svcrsvn-list.component.scss']
})
export class SvcrsvnListComponent implements OnInit {

  constructor(
    private dialog: MatDialog

  ) { }

    currSvcRsvn:ISvcRsvn = {} as ISvcRsvn

    @Input() currRoominfo:IRoominfo = {} as IRoominfo
    
  //--------------------------
  openDialog(currSvcRsvn:ISvcRsvn) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = [];
    dialogConfig.minWidth = '25%';
    dialogConfig.data = {
      currSvcRsvn: currSvcRsvn
    }
    const dialogRef = this.dialog.open(SvcrsvnEditComponent, dialogConfig)
    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.currSvcRsvn = data;
          this.ngOnInit()
        }
      )
  }



  ngOnInit(): void {
  }

}
