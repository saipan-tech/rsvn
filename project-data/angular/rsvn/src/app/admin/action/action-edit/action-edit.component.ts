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
import { ActionEntityService } from '@app/_ngrxServices/action-entity.service';

import { Inject } from '@angular/core';
import { IUser } from '@app/_interface/user';
import { catchError, tap, map, mergeMap, concatMap } from 'rxjs/operators';
import { DangerDialogComponent, DialogManagerService } from "@app/shared/dialog";
import { PostalService } from '@app/_services/postal.service';
import { IAction } from '@app/_interface/action';
import { RoomService } from '@app/_services/room.service';
import { currUser, isLoggedIn, isLoggedOut } from '@app/auth/store/auth.selectors';
import { select, Store } from '@ngrx/store';
import { AppState } from "@app/reducers"
import { Observable } from 'rxjs';
let days = ['mon', 'tue', 'wed', 'thr', 'fri', 'sat', 'sun']


@Component({
  selector: 'app-action-edit',
  templateUrl: './action-edit.component.html',
  styleUrls: ['./action-edit.component.scss']
})


export class ActionEditComponent implements OnInit,OnChanges {

  deptList: any[] = []
  titleList: any[] = []
  staffList: any[] = []
  itemList: any[] = []
  roominfos: Number[] = []
  currUser: any;
  @Input() actionRec: IAction = {} as IAction
  @Output() actionRecChange = new EventEmitter<IAction>()

  
  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private actionService: ActionEntityService,

    private roomService: RoomService,
    private authService: AuthService,
    private dialogManagerService: DialogManagerService,
    private postalService: PostalService,
    private store: Store<AppState>

  ) { }

  blankActionRecord():IAction {
    let newRec = {} as IAction
    newRec.department=''
    newRec.staff=0 
    newRec.item=''
    newRec.descr=''
    newRec.result=''
    return newRec

    }
  
   
  actionEditForm = new FormGroup({
    id: new FormControl(''),
    department: new FormControl('', Validators.required),
    staff: new FormControl('', Validators.required),
    item: new FormControl('', Validators.required),
    descr: new FormControl(''),
    result: new FormControl(''),
    date: new FormControl('', Validators.required),
    mon: new FormControl(false),
    tue: new FormControl(false),
    wed: new FormControl(false),
    thr: new FormControl(false),
    fri: new FormControl(false),
    sat: new FormControl(false),
    sun: new FormControl(false),
    continuous: new FormControl(false),
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
        this.actionService.delete(this.actionRec.id)
          .subscribe(data => {
            this.actionRecChange.emit(this.blankActionRecord())
          })
      }
  
    })
  }
  //--------------------------
  updateAction$():Observable<any> {

    let  actionRec = this.actionEditForm.value
    actionRec.days = ""
    for (let d of days) {
      if (this.actionEditForm.value[d] == true) {
         actionRec.days +=  d + ','
      }
    }
    if(actionRec.id) 
    {
      return this.actionService.update(actionRec).pipe(
        map(action=> {
          this.actionRec = action
          this.actionRecChange.emit(action)
        })
      )
  
    }
    else {
      actionRec.roominfos =""
      actionRec.assignedBy = this.currUser.username

      return this.actionService.add(actionRec).pipe(
        map(action=> {
       
          this.actionRec = action
          this.actionRecChange.emit(action)
        })
      )

    }
  }
  //--------------------------
  updateAction() {
    this.updateAction$().subscribe()
  }

  //---------------------------------
  newAction() {
    
    this.actionEditForm.reset()
    this.actionRec =  this.blankActionRecord()
    this.actionRecChange.emit(this.actionRec)
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
  //  if (this.actionRec && !this.actionRec.id) {
  //    this.actionRec.assignedBy = this.currUser.username
  //  }
    if (this.actionRec && this.actionRec.id) {
      this.makeStaffList(this.actionRec.department)
    }
    this.actionEditForm.patchValue(this.actionRec)
    // split out the days and load the checkboxes
    let dayList:any  = []
    if(this.actionRec.days) {
      dayList = this.actionRec.days.split(',')
    }  
    for (let d of days) {
      if (dayList.find((dl:any) => dl == d)) {
        this.actionEditForm.controls[d].patchValue(true)
      } else {
        this.actionEditForm.controls[d].patchValue(false)
      }
    }
  }
  //---------------------------------
  ngOnChanges(changes: SimpleChanges): void {
    if(this.actionRec)  
    {
    this.rec2form()
    this.actionRecChange.emit(this.actionRec)
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
   
    this.store.pipe(select(currUser))
      .subscribe(u => {
        this.currUser = u
      })

   
  }
}
