import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffComponent } from './staff/staff.component';
import { HouseComponent } from './house/house.component';
import { MaintComponent } from './maint/maint.component';
import { BrowserModule } from '@angular/platform-browser';
import { AdminComponent } from './admin.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { FrontdeskModule } from '@app/frontdesk/frontdesk.module';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    StaffComponent,
    HouseComponent,
    MaintComponent,
    AdminComponent
    
  ],
  imports: [
   
    CommonModule,    
    AppRoutingModule,
    BrowserModule,
    FrontdeskModule,
    MatTabsModule,
  

  ],
  exports : [
    StaffComponent,
    HouseComponent,
    MaintComponent,

  ]

})
export class AdminModule { }
