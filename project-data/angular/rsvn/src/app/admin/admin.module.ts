import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffComponent } from './staff/staff.component';
import { HouseComponent } from './house/house.component';
import { MaintComponent } from './maint/maint.component';



@NgModule({
  declarations: [
    StaffComponent,
    HouseComponent,
    MaintComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AdminModule { }
