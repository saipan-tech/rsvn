import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontdeskComponent } from './frontdesk.component';
import { RsvnEditComponent } from './rsvn-edit/rsvn-edit.component';
import { GuestEditComponent } from './guest-edit/guest-edit.component';
import { RoomCtrlComponent } from './room-ctrl/room-ctrl.component';
import { RsvnCtrlComponent } from './rsvn-ctrl/rsvn-ctrl.component';
import { ClockComponent } from '@app/system/clock/clock.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule} from '@angular/material/radio';
import { MatMenuModule} from '@angular/material/menu';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from "@angular/material/dialog";


import { AppRoutingModule } from '@app/app-routing.module';
import { ChargesModule } from '@app/charges/charges.module';
import {SharedDialogModule} from "@app/shared/dialog/shared-dialog.module";
import { RoomListComponent } from './room-list/room-list.component';

import { SharedModule } from '@app/shared/shared.module';
import { RoomAvailComponent } from './room-avail/room-avail.component';
import { RoomChecksComponent } from './room-checks/room-checks.component';
import { RoomChecksWidgetComponent } from './room-checks/room-checks-widget.component';
import { MatInputModule } from '@angular/material/input';
import { SearchCtrlComponent } from './search-ctrl/search-ctrl.component';
import { SearchListComponent } from './search-list/search-list.component';


@NgModule({
  declarations: [
    ClockComponent,
    FrontdeskComponent,
    RsvnEditComponent,
    GuestEditComponent,
    RoomCtrlComponent,
    RsvnCtrlComponent,
    RoomListComponent,
    RoomAvailComponent,
    RoomChecksComponent,
    RoomChecksWidgetComponent,
    SearchCtrlComponent,
    SearchListComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatRadioModule,
    MatMenuModule,
    MatExpansionModule,
    MatTabsModule,
    MatCardModule,
    MatInputModule,

    SharedDialogModule,
    ChargesModule,
    SharedModule
  ],
  exports: [
    ClockComponent,
    FrontdeskComponent
  ]
})
export class FrontdeskModule { }
