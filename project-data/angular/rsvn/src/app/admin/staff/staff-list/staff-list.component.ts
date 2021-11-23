import { Component, OnInit } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { IStaff } from '@app/_interface/staff';
import { IUser } from '@app/_interface/user';
@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private authService: AuthService,

  ) { }

    staffList : IStaff[] = []
    userList : IUser[] = []
  ngOnInit(): void {
    this.genericService.getItemList("staff")
      .subscribe( data => {
        this.staffList = data
      })
      this.genericService.getItemList("user")
      .subscribe( data => {
        this.userList = data
      })
  }

}
