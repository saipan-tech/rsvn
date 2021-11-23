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
import { StaffListComponent } from './staff/staff-list/staff-list.component';
import { StaffEditComponent } from './staff/staff-edit/staff-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    StaffComponent,
    HouseComponent,
    MaintComponent,
    AdminComponent,
    StaffListComponent,
    StaffEditComponent
    
  ],
  imports: [
   
    CommonModule,    
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatRadioModule,
    FrontdeskModule

  ],
  exports : [
    StaffComponent,
    HouseComponent,
    MaintComponent,

  ]

})
export class AdminModule { }
