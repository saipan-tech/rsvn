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
import { MatExpansionModule } from '@angular/material/expansion';
import { ActionStaffComponent } from './action/action-staff/action-staff.component';
import { ActionItemsComponent } from './action/action-items/action-items.component';
import { ActionEditComponent } from './action/action-edit/action-edit.component';
import { GridSelectComponent } from './grid-select/grid-select.component';
import { MatMenuModule } from '@angular/material/menu';
import { ActionManagerComponent } from './action/action-manager/action-manager.component';
import { CurrentCtrlComponent } from './current-ctrl/current-ctrl.component';
import { SvcrsvnEditComponent } from './current-ctrl/svcrsvn-edit/svcrsvn-edit.component';
import { SvcrsvnListComponent } from './current-ctrl/svcrsvn-list/svcrsvn-list.component';
import { CurrentMatrixComponent } from './current-ctrl/current-matrix/current-matrix.component';


@NgModule({
  declarations: [
    StaffComponent,

    StaffListComponent,
    StaffEditComponent,

    ActionStaffComponent,
    ActionItemsComponent,
    ActionEditComponent,
    ActionManagerComponent,
    GridSelectComponent,
    CurrentCtrlComponent,
    SvcrsvnEditComponent,
    SvcrsvnListComponent,
    CurrentMatrixComponent
   
    
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
    MatExpansionModule,
    FrontdeskModule,
  
  ],
  exports : [
    StaffComponent,
  ],
 
})
export class AdminModule { }
