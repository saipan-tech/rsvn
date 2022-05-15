import { Component, OnInit } from '@angular/core';
import { IRoominfo } from '@app/_interface/roominfo';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { of } from 'rxjs';

import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { IBldg } from '@app/_interface/bldg';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { RoomprefEditComponent } from './roompref-edit/roompref-edit.component';
@Component({
  selector: 'app-roompref',
  templateUrl: './roompref.component.html',
  styleUrls: ['./roompref.component.scss']
})
export class RoomprefComponent implements OnInit {
  roomList$: any = of()
  data: IRoominfo[] = []
  displayedColumns = ['number','rateAlias','descr','status',]
  currBldg:IBldg = {} as IBldg
  currRoominfo:IRoominfo = {} as IRoominfo


  constructor(
    private roominfoService: RoominfoEntityService,
    private bldgService: BldgEntityService,
    private dialog: MatDialog
  ) {

  }

  openDialog(roominfo:IRoominfo) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = [];
    dialogConfig.width = '50%';
    dialogConfig.maxHeight = '700px';
    
    dialogConfig.data = {
       roominfo
    }

    const dialogRef = this.dialog.open(RoomprefEditComponent, dialogConfig)
    dialogRef.afterClosed()
      .subscribe(
        data => {
       
     
        }
      )
  }


  bldgEditForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    abbrev: new FormControl('', Validators.required),
    location: new FormControl(''),
    descr: new FormControl(''),
  })

  clearBldg() {
    this.bldgEditForm.reset()
    this.currBldg = {} as IBldg;
    this.currBldg.id = 0
    this.bldgEditForm.reset()
  }

  editBldg(bldg:IBldg) {
    this.bldgEditForm.patchValue(bldg)
  }



  updateBldg(bldg: any) {
    for (const field in bldg) {
      if (bldg[field] == null) {
        bldg[field] = ''
      }
    }
     this.bldgService.update(bldg).subscribe(
      data => {
        this.clearBldg()
        this.ngOnInit()
      }
    )
  }

  addBldg(bldg: any) {
    for (const field in bldg) {
      if (bldg[field] == null) {
        bldg[field] = ''
      }
    }
     this.bldgService.add(bldg).subscribe(
      data => {
        this.clearBldg()
        this.ngOnInit()
      }
    )
  }






















  ngOnInit(): void {
    this.roomList$ = this.roominfoService.bldgRoominfo$(this.roominfoService.entities$)
    this.roomList$.subscribe(
      (d: any) => {
        this.data = d;
        console.log(d)
      }
    )

  }

}
