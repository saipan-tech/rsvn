import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '@app/login/login.component';
import { DashboardComponent } from '@app/dashboard/dashboard.component';
import { ConfigComponent } from '@app/config/config.component';
import { FrontdeskComponent } from '@app/frontdesk/frontdesk.component';
import { ToursComponent } from '@app/tours/tours.component';
import { CafeComponent } from '@app/cafe/cafe.component';
import { GuestEditComponent } from '@app/frontdesk/guest-edit/guest-edit.component';
import { DropdownComponent } from '@app/config/dropdown/dropdown.component';
import { ActionComponent } from './admin/action/action.component';
import { StaffComponent } from './admin/staff/staff.component';
import { GridComponent } from './frontdesk/grid/grid.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RatemgrCtrlComponent } from './ratemgr/ratemgr-ctrl/ratemgr-ctrl.component';
import { SeasonService } from './_services/season.service';
import { SeasonCtrlComponent } from './ratemgr/season-ctrl/season-ctrl.component';
import { SeasonCalendarComponent } from './ratemgr/season-calendar/season-calendar.component';
import { RateListComponent } from './ratemgr/rate-list/rate-list.component';
const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'tours', component: ToursComponent },
  { path: 'cafe', component: CafeComponent },
  { path: 'frontdesk', component: FrontdeskComponent },
  { path: 'guest', component: GuestEditComponent },
  { path: 'dropdown', component: DropdownComponent },
  { path: 'action', component: ActionComponent },

  { path: 'staff', component: StaffComponent },
  { path: 'grid', component: GridComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'ratemgr', component: RatemgrCtrlComponent,
    children: [
      { path: 'season', component: SeasonCtrlComponent },
      { path: 'seasoncal', component: SeasonCalendarComponent },
      { path: 'ratelist', component: RateListComponent },

    ]
  }

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




