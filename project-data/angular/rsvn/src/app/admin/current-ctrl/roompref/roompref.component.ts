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
  roominfoList: IRoominfo[] = []
  riList: IRoominfo[] = []
  displayedColumns = ['number', 'floor', 'style', 'rateAlias', 'name', 'beds', 'descr', 'size', 'status', 'phone', 'ipaddr']
  currBldg: IBldg = {} as IBldg
  currRoominfo: IRoominfo = {} as IRoominfo
  currRoominfoCount: any
  bldgList: IBldg[] = []


  constructor(
    private roominfoService: RoominfoEntityService,
    private bldgService: BldgEntityService,
    private dialog: MatDialog
  ) {

  }

  openDialog(roominfo: IRoominfo, bldg: IBldg) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = [];
    dialogConfig.width = '50%';
    dialogConfig.maxHeight = '700px';

    dialogConfig.data = {
      currRoominfo: roominfo,
      currBldg: bldg
    }

    const dialogRef = this.dialog.open(RoomprefEditComponent, dialogConfig)
    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.ngOnInit()

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

  //=====================================
  clearBldg() {
    this.bldgEditForm.reset()
    this.currBldg = {} as IBldg;
    this.currBldg.id = 0

  }
  //=====================================
  roominfoCount(bldg: IBldg) {
    let bb: any = this.roominfoList.find((d: any) => d.bldg.id == bldg.id)
    return bb.roominfo.length
  }

  //=====================================
  editBldg(bldg: IBldg) {
    this.bldgEditForm.patchValue(bldg)
    this.currBldg = bldg
    this.currRoominfoCount = this.roominfoCount(this.currBldg)
  }
  //=====================================
  deleteBldg(bldg: IBldg) {
    this.bldgService.delete(bldg.id).subscribe()
    this.clearBldg()
  }
  //=====================================


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

  //=====================================
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

  //=====================================
  synchRoominfoDatabase(loaded: any) {
    console.log(loaded)
    loaded.forEach((l:any)=> {
      if(l.id) {
        this.roominfoService.update(l).subscribe()
      } else if(l.bldg) {
        this.roominfoService.add(l).subscribe()
      }
    })
  }
  //=====================================
  setResults(list: IRoominfo[]) {
    console.log(this.roominfoList)
    list.map((l: any) => {
      let bldg = this.bldgList.find(b => b.name == l.bldgname)
      let roominfo = this.riList.find(r => r.number == l.number && bldg && r.bldg == bldg.id)
      if(roominfo) l.id = roominfo.id
      if(bldg) l.bldg = bldg.id
    })
    this.synchRoominfoDatabase(list)
  }
  //=====================================
  ngOnInit(): void {
    this.bldgService.entities$.subscribe(data => this.bldgList = data)
    this.roominfoService.entities$.subscribe(data => this.riList = data)

    this.roomList$ = this.roominfoService.bldgRoominfo$(this.roominfoService.entities$)
    this.roomList$.subscribe(
      (d: any) => {
        this.roominfoList = d;
        console.log(d)
      }
    )

  }

}
