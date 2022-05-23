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
import { MatTableModule } from '@angular/material/table';

import { MatExpansionModule } from '@angular/material/expansion';
import { ActionStaffComponent } from './action/action-staff/action-staff.component';
import { ActionItemsComponent } from './action/action-items/action-items.component';
import { ActionEditComponent } from './action/action-edit/action-edit.component';
import { GridSelectComponent } from './grid-select/grid-select.component';
import { MatMenuModule } from '@angular/material/menu';
import { ActionManagerComponent } from './action/action-manager/action-manager.component';
import { CurrentCtrlComponent } from './current-ctrl/current-ctrl.component';
import { SvcrsvnEditComponent } from './current-ctrl/svcrsvn/svcrsvn-edit/svcrsvn-edit.component';
import { SvcrsvnListComponent } from './current-ctrl/svcrsvn/svcrsvn-list/svcrsvn-list.component';
import { CurrentMatrixComponent } from './current-ctrl/current-matrix/current-matrix.component';
import { RoomstatusComponent } from './current-ctrl/roomstatus/roomstatus.component';
import { MatSortModule } from '@angular/material/sort';
import { NgxEchartsModule } from 'ngx-echarts';
import { RoomchartsComponent } from './current-ctrl/roomcharts/roomcharts.component';
import { RoomprefComponent } from './current-ctrl/roompref/roompref.component';
import { RoomprefEditComponent } from './current-ctrl/roompref/roompref-edit/roompref-edit.component';
import { SvcrsvnComponent } from './current-ctrl/svcrsvn/svcrsvn.component';
import { SharedModule } from '@app/shared/shared.module';
import { RoomSelectorComponent } from './room-selector/room-selector.component';
import { RoomCollisionComponent } from './room-collision/room-collision.component';


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
    CurrentMatrixComponent,
    RoomstatusComponent,
    RoomchartsComponent,
    RoomprefComponent,
    RoomprefEditComponent,
    SvcrsvnComponent,
    RoomSelectorComponent,
    RoomCollisionComponent
   
    
  ],
  imports: [
    SharedModule,
    CommonModule,    
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,

    MatSortModule,
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
    MatTableModule,
    FrontdeskModule,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), 
    }),
  
  ],
  exports : [
    StaffComponent,
  ],
 
})
export class AdminModule { }
