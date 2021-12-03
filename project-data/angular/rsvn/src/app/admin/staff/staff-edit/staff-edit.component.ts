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

interface xRec {
  staff: IStaff;
  user: IUser;
}
let staffkey = [ "user","username","first_name","last_name","middle_name","phone1","phone2",
    "address","city","state","zipcode","country","title","email" ]


 let userkey = ["first_name",  "last_name",  "username",  "email",  "is_staff",  "is_active","is_superuser" ]

 @Component({
  selector: 'app-staff-edit',
  templateUrl: './staff-edit.component.html',
  styleUrls: ['./staff-edit.component.scss']
})


export class StaffEditComponent implements OnInit {
  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<StaffEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {

    this.currxRec = data.currxRec

  }

  @Output() currStaffChange = new EventEmitter<IStaff>()

  form_error: any
  user: any
  numDays = 0

  staffEditForm = new FormGroup({
    user: new FormControl(''),
    username: new FormControl('', Validators.required),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    middle_name: new FormControl(''),
    phone1: new FormControl('', Validators.required),
    phone2: new FormControl(''),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipcode: new FormControl('', Validators.required),
    country: new FormControl(''),
    title: new FormControl(''),
    email: new FormControl('', Validators.required),
    is_staff: new FormControl(''),
    is_active: new FormControl(''),
    is_superuser: new FormControl(''),
    date_joined: new FormControl(''),
    last_login: new FormControl('')
  })

  currxRec: xRec = {} as xRec;
  ackList = [true,false]

  roomList: IRoom[] = []
  roominfoList: IRoominfo[] = []
  staffList: IStaff[] = []
  bldgList: IBldg[] = []
  fullRoomList: any[] = []
  selectedValue = 0
  roomTotal = 0
  grandTotal = 0
  transTotal = 0
  chgtypeList: IDropdown[] = []
  //---------------------------------
  deleteStaff() {
    this.genericService.deleteItem('staff', this.currxRec.staff)
      .pipe(
        mergeMap(data => this.genericService.deleteItem('user', this.currxRec.user))
      )
      .subscribe(data => {
        this.currxRec = {} as xRec
        this.dialogRef.close(this.currxRec)
      })
  }
  //---------------------------------
  /*
  selectStaff(staff: IStaff) {
    this.genericService.getItem('staff', staff.id)
      .subscribe(data => {
        this.currStaff = data
        this.staffEditForm.patchValue(this.currStaff)
      })
  }
  */
  //--------------------------
  updateStaff() {
 
    this.form2rec()
    let staff$ = this.genericService.updateItem('staff', this.currxRec.staff)
    if (this.currxRec.staff.id && this.currxRec.user.id) {
      staff$ = staff$.pipe(
        mergeMap(data => this.genericService.updateItem('user', this.currxRec.user))
      )
    }

    staff$.subscribe(
        data => {
          this.close()
        },
        err => console.log("Error", err)
      )
  }
  /*
  
*/
  //---------------------------------
  close() {
    this.dialogRef.close(this.currxRec)
  }

  //--------------------------
  /*
    ngOnChanges(changes: SimpleChanges) {
      if (this.currStaff && this.currStaff.id) {
        this.staffEditForm.patchValue(this.currStaff)
  
      } else {
        this.newStaff()
      }
  
    }
    */
  form2rec() {
    if (!this.currxRec.staff.id) {
      this.currxRec.staff.id = 0
      this.currxRec.staff.clerk = ''
      this.currxRec.staff.temppass = ''
      
      
    }
    staffkey.forEach(sk =>  {
       Object.defineProperty(this.currxRec.staff, sk, 
        { value: this.staffEditForm.value[sk],
          writable: true,
          configurable:true,
          enumerable:true} )
    })
    userkey.forEach(sk =>  {
      Object.defineProperty(this.currxRec.user, sk, 
        { value: this.staffEditForm.value[sk] ,
          writable: true,
          configurable:true,
          enumerable:true} )
    })
  }
  //--------------------------
  ngOnInit(): void {
  
    
    this.authService.getSession().subscribe(
      data => this.user = data
    )
    this.staffEditForm.patchValue(this.currxRec.staff)
    this.staffEditForm.patchValue(this.currxRec.user)
  }

}
