import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppConstants } from '@app/app.constants';
import { AppEnv } from '@app/_helpers/appenv';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BldgListComponent } from '@app/config/bldg-list/bldg-list.component';
import { RoomListComponent } from '@app/config/room-list/room-list.component';
import { AmenityListComponent } from '@app/config/amenity-list/amenity-list.component';
import { ConfigComponent } from '@app/config/config.component';
import { CafeComponent } from './cafe/cafe.component';
import { ToursComponent } from './tours/tours.component';
import { DropdownComponent } from './config/dropdown/dropdown.component';
import { FileinputComponent } from './system/fileinput/fileinput.component';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule} from '@angular/material/radio';

import { FrontdeskModule } from '@app/frontdesk/frontdesk.module';
import { RateListComponent } from '@app/config/rate-list/rate-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SeasonCtrlComponent } from './config/season-ctrl/season-ctrl.component';
import { GuestListComponent } from './config/guest-list/guest-list.component';
import { MatTabsModule } from '@angular/material/tabs';

import { AdminModule } from '@app/admin/admin.module';
import { HeaderComponent } from './header/header.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { RateCalendarComponent } from './config/rate-calendar/rate-calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    BldgListComponent,
    RoomListComponent,
    AmenityListComponent,
    ConfigComponent,
    CafeComponent,
    ToursComponent,
    DropdownComponent,
    FileinputComponent,
    RateListComponent,
    SeasonCtrlComponent,
    GuestListComponent,
    HeaderComponent,
    RateCalendarComponent
  

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatRadioModule,
    MatTabsModule,
    AppRoutingModule,
    FrontdeskModule,
    AdminModule,
    AccordionModule.forRoot(),
    CarouselModule.forRoot()
  ],
  
exports: [
  HeaderComponent
],

  
  providers: [authInterceptorProviders,AppEnv,AppConstants],
  bootstrap: [AppComponent]
})
export class AppModule { }
