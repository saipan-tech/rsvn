import { Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { IStaff } from '@app/_interface/staff';
import { IUser } from '@app/_interface/user';
import { catchError, tap, map, concatMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { StaffEditComponent } from '@app/admin/staff/staff-edit/staff-edit.component';



interface xRec {
  staff: IStaff;
  user : IUser;
}

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit, OnChanges {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private authService: AuthService,
    private dialog: MatDialog

  ) { }
  currStaff: IStaff = {} as IStaff
  @Output() currStaffChange = new EventEmitter<IStaff>()
  staffList: IStaff[] = []
  userList: IUser[] = []
  dispList: xRec[] = []
  currxRec:xRec = {} as xRec

  //--------------------------
  openDialog(currxRec: xRec) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = [];
    dialogConfig.data = {
      currxRec: currxRec
    }
    const dialogRef = this.dialog.open(StaffEditComponent, dialogConfig)
    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.currxRec = data;
          this.ngOnInit()
        }
      )
  }

  //--------------------------
  make_dispList() {
    this.dispList = []
    let _user:IUser = {} as IUser 


    this.staffList.forEach(sl => {
      let u = this.userList.find(rec => rec.email == sl.email)
      if(!u) u = _user
      this.dispList.push({ staff: sl, user : u })
    })

  }
  //--------------------------
  selectStaff(xRec: xRec) {
    this.currxRec = xRec
    this.openDialog(this.currxRec)
  }
  //---------------------------------
  blankStaff(staff: any) {
    for (const field in staff) {
      if (staff[field] == null) {
        staff[field] = ''
      }
    }
    return staff
  }
  //--------------------------
  newStaff() {

    this.currxRec = {staff:{} as IStaff,user:{} as IUser} as xRec
    this.openDialog(this.currxRec)
  }
  //--------------------------
  ngOnChanges(changes: SimpleChanges) {
    if (!changes.currStaff.firstChange) {
      this.ngOnInit()
    }
  }

  //--------------------------
  ngOnInit(): void {

    let staff$ = this.genericService.getItemList("staff")
    let users$ = this.genericService.getItemList("user")
    combineLatest([staff$, users$])
      .subscribe(data => {
        this.staffList = data[0];
        this.userList = data[1];
      },
        err => { },
        () => this.make_dispList())
  }

}
