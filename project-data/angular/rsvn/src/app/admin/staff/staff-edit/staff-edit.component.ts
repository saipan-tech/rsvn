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
import { MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Inject } from '@angular/core';
import { IUser } from '@app/_interface/user';

interface xRec {
  staff: IStaff;
  user : IUser;
}

@Component({
  selector: 'app-staff-edit',
  templateUrl: './staff-edit.component.html',
  styleUrls: ['./staff-edit.component.scss']
})


export class StaffEditComponent implements OnInit {
  currxRec : xRec = {} as xRec;

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<StaffEditComponent>,    
    @Inject(MAT_DIALOG_DATA) data:any
    )
   { 

    this.currxRec = data.currxRec

  }
 
  @Output() currStaffChange = new EventEmitter<IStaff>()

  form_error: any
  user: any
  numDays = 0

  staffEditForm = new FormGroup({
    id: new FormControl(''),
    user: new FormControl(''),
    username: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    middlename: new FormControl(''),
    phone1: new FormControl('', Validators.required),
    phone2: new FormControl(''),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipcode: new FormControl('', Validators.required),
    country: new FormControl(''),
    title: new FormControl(''),
    email: new FormControl('', Validators.required),
    is_staff:new FormControl(''),
    is_active:new FormControl(''),
    is_superuser:new FormControl(''),
    date_joined: new FormControl(''),
    last_login: new FormControl('')
  })

  
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
  deleteStaff(staff: IStaff) {
    this.genericService.deleteItem('staff', staff)
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
  updateStaff(staff: IStaff) {
    console.log("Staff",staff)

    this.genericService.updateItem('staff', staff).subscribe(
      data => {
        this.dialogRef.close(data)
      },
      err => console.log("Error", err)
    )
  }
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
  //--------------------------
  ngOnInit(): void {
    this.authService.getSession().subscribe(
      data => this.user = data
    )
    console.log(this.currxRec)
    this.staffEditForm.patchValue(this.currxRec.staff)
    this.staffEditForm.patchValue(this.currxRec.user)
  }

}
