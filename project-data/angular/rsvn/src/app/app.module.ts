import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppConstants } from '@app/app.constants';
import { AppEnv } from '@app/_helpers/appenv';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BldgListComponent } from '@app/config/bldg-list/bldg-list.component';
import { RoomListComponent } from '@app/config/room-list/room-list.component';
import { AmenityListComponent } from '@app/config/amenity-list/amenity-list.component';
import { ConfigComponent } from '@app/config/config.component';
import { HeadingComponent } from './heading.component';
import { FrontdeskComponent } from './frontdesk/frontdesk.component';
import { CafeComponent } from './cafe/cafe.component';
import { ToursComponent } from './tours/tours.component';
import { RsvnEditComponent } from './frontdesk/rsvn-edit/rsvn-edit.component';
import { RsvnListComponent } from './frontdesk/rsvn-list/rsvn-list.component';
import { GuestEditComponent } from './frontdesk/guest-edit/guest-edit.component';
import { ClockComponent } from '@app/system/clock/clock.component';
import { GridComponent } from './frontdesk/grid/grid.component';
import { CalendarComponent } from './frontdesk/calendar/calendar.component';
import { DropdownComponent } from './config/dropdown/dropdown.component';
import { RoomCtrlComponent } from './frontdesk/room-ctrl/room-ctrl.component';
import { SearchCtrlComponent } from './frontdesk/search-ctrl/search-ctrl.component';
import { FileinputComponent } from './system/fileinput/fileinput.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { GridLineComponent } from './frontdesk/grid-line/grid-line.component';
import { CurrGridComponent } from './frontdesk/curr-grid/curr-grid.component';
import { MatSliderModule } from '@angular/material/slider';
import {MatRadioModule} from '@angular/material/radio';
import { RsvnCtrlComponent } from './frontdesk/rsvn-ctrl/rsvn-ctrl.component';

@NgModule({
  declarations: [
    ClockComponent,
    AppComponent,
    LoginComponent,
    AdminComponent,
    DashboardComponent,
    BldgListComponent,
    RoomListComponent,
    AmenityListComponent,
    ConfigComponent,
    HeadingComponent,
    FrontdeskComponent,
    CafeComponent,
    ToursComponent,
    RsvnEditComponent,
    RsvnListComponent,
    GuestEditComponent,
    GridComponent,
    CalendarComponent,
    DropdownComponent,
    RoomCtrlComponent,
    SearchCtrlComponent,
    FileinputComponent,
    GridLineComponent,
    CurrGridComponent,
    RsvnCtrlComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatRadioModule






  ],
  providers: [authInterceptorProviders,AppEnv,AppConstants],
  bootstrap: [AppComponent]
})
export class AppModule { }
