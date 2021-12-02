import { Component, OnInit } from '@angular/core';
import { IStaff } from '@app/_interface/staff';
@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  currStaff : IStaff = {} as IStaff 

  constructor() { }
  ngOnInit(): void {
  }

}
