import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '@app/auth/login/login.component';
import { DashboardComponent } from '@app/dashboard/dashboard.component';
import { ConfigComponent } from '@app/config/config.component';
import { FrontdeskComponent } from '@app/frontdesk/frontdesk.component';
import { ToursComponent } from '@app/tours/tours.component';
import { GuestEditComponent } from '@app/frontdesk/guest-edit/guest-edit.component';
import { DropdownComponent } from '@app/config/dropdown/dropdown.component';
import { StaffComponent } from './admin/staff/staff.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RatemgrCtrlComponent } from './ratemgr/ratemgr-ctrl/ratemgr-ctrl.component';
import { SeasonService } from './_services/season.service';
import { SeasonCtrlComponent } from './ratemgr/season-ctrl/season-ctrl.component';
import { SeasonCalendarComponent } from './ratemgr/season-calendar/season-calendar.component';
import { RateListComponent } from './ratemgr/rate-list/rate-list.component';
import { ActionItemsComponent } from './admin/action/action-items/action-items.component';
import { ActionMatrixComponent } from './admin/action/action-matrix/action-matrix.component';
import { ActionStaffComponent } from './admin/action/action-staff/action-staff.component';
import { ActionManagerComponent } from './admin/action/action-manager/action-manager.component';
import { AuthGuard } from './auth/auth.guard';

import { RoominfoResolver } from '@app/_ngrxServices/roominfo-resolver';
import { RoomResolver } from '@app/_ngrxServices/room-resolver';
import { RsvnResolver } from '@app/_ngrxServices/rsvn-resolver';
import { GuestResolver } from './_ngrxServices/guest-resolver';
import { BldgResolver } from './_ngrxServices/bldg-resolver';
import { ActionResolver } from './_ngrxServices/action-resolver';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  
  { path: 'dashboard', component: DashboardComponent, resolve: { 
    roominfo: RoominfoResolver, room: RoomResolver, 
    rsvn: RsvnResolver, bldg: BldgResolver, 
    guest: GuestResolver } },

  { path: 'frontdesk', component: FrontdeskComponent, resolve: { roominfo: RoominfoResolver, room: RoomResolver, 
    rsvn: RsvnResolver, bldg: BldgResolver, guest: GuestResolver }, canActivate: [AuthGuard] },
  { path: 'frontdesk/:rsvnId', component: FrontdeskComponent, 
    resolve: { roominfo: RoominfoResolver, room: RoomResolver, rsvn: RsvnResolver, bldg: BldgResolver, 
    guest: GuestResolver }, canActivate: [AuthGuard] },
  
  { path: 'currentroom', component: ActionMatrixComponent, canActivate: [AuthGuard] },
  
  { path: 'config', component: ConfigComponent, canActivate: [AuthGuard] },
  { path: 'guest', component: GuestEditComponent, canActivate: [AuthGuard] },
  { path: 'dropdown', component: DropdownComponent, canActivate: [AuthGuard] },

  { path: 'actionstaff', component: ActionStaffComponent, resolve: { roominfo: RoominfoResolver, room: RoomResolver, 
    rsvn: RsvnResolver, bldg: BldgResolver, guest: GuestResolver, action:ActionResolver }, canActivate: [AuthGuard] },

  { path: 'actionmanager', component: ActionManagerComponent, resolve: { 
    roominfo: RoominfoResolver,  bldg: BldgResolver, action:ActionResolver }, canActivate: [AuthGuard] },
  { path: 'staff', component: StaffComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'ratemgr', component: RatemgrCtrlComponent, canActivate: [AuthGuard] },


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes,
      { onSameUrlNavigation: 'reload' }),


  ],
  exports: [
    RouterModule
  ]

})
export class AppRoutingModule { }




