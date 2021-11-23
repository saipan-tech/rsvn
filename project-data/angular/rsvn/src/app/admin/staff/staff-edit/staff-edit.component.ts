import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IBldg } from '@app/_interface/bldg';
import { IRoom } from '@app/_interface/room'
import { IRoominfo } from '@app/_interface/roominfo'
import { IStaff } from '@app/_interface/staff'
import { IDropdown} from '@app/_interface/dropdown'
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';

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
  ) { }

  @Input() currRsvn: any
  @Input() currStaff: IStaff = {} as IStaff
  @Output() currStaffChange = new EventEmitter<IStaff>()

  form_error: any
  user: any
  numDays = 0

  staffEditForm = new FormGroup({
    id: new FormControl(''),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    middlename: new FormControl(''),
    phone1: new FormControl('', Validators.required),
    phone2: new FormControl(''),
    address1: new FormControl('', Validators.required),
    address2: new FormControl(''),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    country: new FormControl(''),
    title: new FormControl(''),
    email: new FormControl('', Validators.required),
  })

  roomList: IRoom[] = []
  roominfoList: IRoominfo[] = []
  staffList: IStaff[] = []
  bldgList: IBldg[] = []
  fullRoomList :any[] = []
  selectedValue =0
  roomTotal = 0
  grandTotal = 0
  transTotal = 0
  chgtypeList :IDropdown[] = []
  //---------------------------------
  deleteStaff(staff:IStaff) {
    this.genericService.deleteItem('staff',staff)
      .subscribe(data => {
        this.newStaff()
        this.currStaffChange.emit(data)
      })
  }
//---------------------------------
  selectStaff(staff:IStaff) {
    this.genericService.getItem('staff',staff.id)
      .subscribe(data => {
        this.currStaff= data
        this.currStaffChange.emit(data)
        this.staffEditForm.patchValue(this.currStaff)
      })
  }
//--------------------------
  updateStaff(staff: IStaff) {
    if (this.currRsvn.id) {
      this.genericService.updateItem('staff', staff).subscribe(
        data => {
          


          this.currStaffChange.emit(data)
          this.newStaff()
          this.ngOnInit()
        },
        err => console.log("Error",err)
      )
    }
  }
 //---------------------------------
 blankStaff(staff: any) {
  for (const field in staff) {
    if (staff[field] == null) {
    staff [field] = ''
    }
  }
  return staff
}
  //--------------------------
  newStaff() {
    this.staffEditForm.reset()
    this.currStaff = {} as IStaff
    this.currStaffChange.emit(this.currStaff)
  }
  //--------------------------
  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit()
    
    if (this.currStaff && this.currStaff.id) {
      this.staffEditForm.patchValue(this.currStaff)

    } else {
      this.newStaff()
    }

  }
  //--------------------------
  ngOnInit(): void {
    this.authService.getSession().subscribe(
      data => this.user = data
    )

  }

}
