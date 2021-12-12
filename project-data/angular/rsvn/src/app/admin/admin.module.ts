import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffComponent } from './staff/staff.component';
import { BrowserModule } from '@angular/platform-browser';
import { AdminComponent } from './admin.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { FrontdeskModule } from '@app/frontdesk/frontdesk.module';
import { StaffListComponent } from './staff/staff-list/staff-list.component';
import { StaffEditComponent } from './staff/staff-edit/staff-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { ActionComponent } from './action/action.component';
import { ActionStaffComponent } from './action/action-staff/action-staff.component';
import { ActionItemsComponent } from './action/action-items/action-items.component';


@NgModule({
  declarations: [
    StaffComponent,
    AdminComponent,
    StaffListComponent,
    StaffEditComponent,
    ActionComponent,
    ActionStaffComponent,
    ActionItemsComponent,
   
    
  ],
  imports: [
   
    CommonModule,    
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSliderModule,
    MatRadioModule,
    FrontdeskModule

  ],
  exports : [
    StaffComponent,
    ActionComponent
  ],
 
})
export class AdminModule { }
