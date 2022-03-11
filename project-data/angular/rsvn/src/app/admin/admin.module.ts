import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffComponent } from './staff/staff.component';
import { BrowserModule } from '@angular/platform-browser';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { ActionComponent } from './action/action.component';
import { ActionStaffComponent } from './action/action-staff/action-staff.component';
import { ActionItemsComponent } from './action/action-items/action-items.component';
import { ActionEditComponent } from './action/action-edit/action-edit.component';
import { GridSelectComponent } from './grid-select/grid-select.component';
import { MatMenuModule } from '@angular/material/menu';
import { ActionMatrixComponent } from './action/action-matrix/action-matrix.component';
import { ActionMatrixSidebarComponent } from './action/action-matrix-sidebar/action-matrix-sidebar.component';
import { ActionManagerComponent } from './action/action-manager/action-manager.component';


@NgModule({
  declarations: [
    StaffComponent,

    StaffListComponent,
    StaffEditComponent,
    ActionComponent,
    ActionStaffComponent,
    ActionItemsComponent,
    ActionEditComponent,
    GridSelectComponent,
    ActionMatrixComponent,
    ActionMatrixSidebarComponent,
    ActionManagerComponent,
   
    
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
    MatCheckboxModule,
    MatMenuModule,
    MatCardModule,
    FrontdeskModule,
  
  ],
  exports : [
    StaffComponent,
    ActionComponent
  ],
 
})
export class AdminModule { }
