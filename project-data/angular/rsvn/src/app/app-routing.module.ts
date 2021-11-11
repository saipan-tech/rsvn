import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '@app/login/login.component';
import { DashboardComponent } from '@app/dashboard/dashboard.component';
import { ConfigComponent } from '@app/config/config.component';
import { FrontdeskComponent } from '@app/frontdesk/frontdesk.component';
import { ToursComponent } from '@app/tours/tours.component';
import { CafeComponent } from '@app/cafe/cafe.component';
import { AdminComponent } from '@app/admin/admin.component';
import { GuestEditComponent } from '@app/frontdesk/guest-edit/guest-edit.component';
import { DropdownComponent } from '@app/config/dropdown/dropdown.component';
import { HouseComponent } from './admin/house/house.component';
import { MaintComponent } from './admin/maint/maint.component';
import { StaffComponent } from './admin/staff/staff.component';
import { GridComponent } from './frontdesk/grid/grid.component';
const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'tours', component: ToursComponent },
  { path: 'cafe', component: CafeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'frontdesk', component:  FrontdeskComponent },
  { path: 'guest', component:  GuestEditComponent },
  { path: 'dropdown', component:  DropdownComponent },
  { path: 'house', component:  HouseComponent },
  { path: 'maint', component:  MaintComponent },
  { path: 'staff', component:  StaffComponent },
  { path: 'grid', component:  GridComponent }
  
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes,
      { onSameUrlNavigation:'reload'}),

 
  ],
  exports: [
    RouterModule
  ]

})
export class AppRoutingModule { }




