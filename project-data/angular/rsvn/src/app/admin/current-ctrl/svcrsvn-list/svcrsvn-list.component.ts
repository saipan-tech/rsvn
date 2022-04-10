import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ISvcRsvn } from '@app/_interface/svcrsvn';
import { SvcrsvnEditComponent } from '../svcrsvn-edit/svcrsvn-edit.component';



@Component({
  selector: 'app-svcrsvn-list',
  templateUrl: './svcrsvn-list.component.html',
  styleUrls: ['./svcrsvn-list.component.scss']
})
export class SvcrsvnListComponent implements OnInit {

  constructor(
    private dialog: MatDialog

  ) { }


  //--------------------------
  openDialog(currSRID:number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = [];
    dialogConfig.minWidth = '25%';
    dialogConfig.data = {
      currSvcRsvnID: currSRID
    }
    const dialogRef = this.dialog.open(SvcrsvnEditComponent, dialogConfig)
    dialogRef.afterClosed()
      .subscribe(
        data => {
  //        this.currxRec = data;
  //        this.ngOnInit()
        }
      )
  }



  ngOnInit(): void {
  }

}
