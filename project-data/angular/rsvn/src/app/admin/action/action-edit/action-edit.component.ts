import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { IStaff } from '@app/_interface/staff'
import { IDropdown } from '@app/_interface/dropdown'
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Inject } from '@angular/core';
import { IUser } from '@app/_interface/user';
import { catchError, tap, map, mergeMap } from 'rxjs/operators';
import { DangerDialogComponent, DialogManagerService } from "@app/shared/dialog";
import { PostalService } from '@app/_services/postal.service';
import { IAction } from '@app/_interface/action';
import { RoomService } from '@app/_services/room.service';


let days = [ 'mon','tue','wed','thr','fri','sat','sun']


@Component({
  selector: 'app-action-edit',
  templateUrl: './action-edit.component.html',
  styleUrls: ['./action-edit.component.scss']
})


export class ActionEditComponent implements OnInit {

  deptList: any[] = []
  titleList: any[] = []
  staffList: any[] = []
  itemList: any[] = []
  roominfos: Number[] = []
  user: any;
  actionRec: IAction

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private roomService: RoomService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ActionEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogManagerService: DialogManagerService,
    private postalService: PostalService

  ) {

    this.actionRec = data.actionRec;
    if(this.actionRec.id) 
      this.roomService.getActionRoominfo(this.actionRec.id)
      .subscribe(data=> {
        this.roominfos = []
        data.forEach(d => this.roominfos.push(d.id))
      })
        


  }
    
    actionEditForm = new FormGroup({
      id: new FormControl(''),
      department: new FormControl('', Validators.required),
      staff: new FormControl('', Validators.required),
      item: new FormControl('', Validators.required),
      descr: new FormControl(''),
      result: new FormControl(''),
      date: new FormControl('', Validators.required),
      mon:new FormControl(false),
      tue:new FormControl(false),
      wed:new FormControl(false),
      thr:new FormControl(false),
      fri:new FormControl(false),
      sat:new FormControl(false),
      sun:new FormControl(false),
      continuous:new FormControl(false),
      assignedBy: new FormControl(''),
      created: new FormControl('')
    })

  //---------------------------------
  deleteAction() {

    this.dialogManagerService.openDialog<DangerDialogComponent>(DangerDialogComponent, {
      data: {
        title: `Delete Action Item}`,
        content: 'You cannot undue this action',
        confirmAction: 'Delete',
      }
    }).afterClosed().subscribe(deleteConfirmed => {
      if (deleteConfirmed) {
        this.genericService.deleteItem('action', this.actionRec)
          .subscribe(data => {
          })
      }
      this.close()
    })
  }
  //--------------------------
  updateAction() {

    this.actionRec = this.actionEditForm.value
    this.actionRec.days = ""
    for( let d of days) {
      if(this.actionEditForm.value[d] == true) {
        this.actionRec.days = this.actionRec.days + d + ',' 
       
      }
    }

    this.genericService.updateItem('action', this.actionRec)
      .subscribe(
        data => {
          if(this.actionRec.id) this.close()
          this.actionRec = data
        },
        err => console.log("Error", err)
      )
  }

  //---------------------------------
  close() {
    this.dialogRef.close(this.actionRec)
  }
  
  //---------------------------------
  makeStaffList(department: string) {
    this.genericService.getItemQueryList("staff", `department=${department}`)
      .subscribe(data => {
        this.staffList = data;
    
      })
  }
  //---------------------------------
  rec2form() {
    if (this.actionRec && !this.actionRec.id) {
      this.actionRec.assignedBy = this.user.username

    }
    if (this.actionRec && this.actionRec.id) {
      this.makeStaffList(this.actionRec.department)
    }
    
    this.actionEditForm.patchValue(this.actionRec)
    // split out the days and load the checkboxes
    let dayList = this.actionRec.days.split(',')
  
    for( let d of days) {
      if(dayList.find(dl => dl == d)) {
        this.actionEditForm.controls[d].patchValue(true)
      } else {
        this.actionEditForm.controls[d].patchValue(false)
      }
    }
   
  }

  //---------------------------------
  ngOnInit(): void {

    this.systemService.getDropdownList('dept').subscribe(
      data => this.deptList = data
    )

    this.systemService.getDropdownList('title').subscribe(
      data => this.titleList = data
    )

    this.systemService.getDropdownList('actionitem').subscribe(
      data => this.itemList = data
    )

    this.authService.getSession().subscribe(
      data => {
        this.user = data;
        this.rec2form()

      })



  }


}
