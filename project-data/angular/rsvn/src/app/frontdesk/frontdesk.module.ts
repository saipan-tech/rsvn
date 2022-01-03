import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontdeskComponent } from './frontdesk.component';
import { RsvnEditComponent } from './rsvn-edit/rsvn-edit.component';
import { GuestEditComponent } from './guest-edit/guest-edit.component';
import { GridComponent } from './grid/grid.component';
import { RoomCtrlComponent } from './room-ctrl/room-ctrl.component';
import { SearchCtrlComponent } from './search-ctrl/search-ctrl.component';
import { GridLineComponent } from './grid-line/grid-line.component';
import { RsvnCtrlComponent } from './rsvn-ctrl/rsvn-ctrl.component';
import { ClockComponent } from '@app/system/clock/clock.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule} from '@angular/material/radio';
import { MatMenuModule} from '@angular/material/menu';
import { AppRoutingModule } from '@app/app-routing.module';
import { ChargesModule } from '@app/charges/charges.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatDialogModule } from "@angular/material/dialog";
import {SharedDialogModule} from "@app/shared/dialog/shared-dialog.module";
import { RoomListComponent } from './room-list/room-list.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { SearchListComponent } from './search-list/search-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SearcherCtrlComponent } from './searcher-ctrl/searcher-ctrl.component';
import { SearcherListComponent } from './searcher-list/searcher-list.component';


@NgModule({
  declarations: [
    ClockComponent,
    FrontdeskComponent,
    RsvnEditComponent,
    GuestEditComponent,
    GridComponent,
    RoomCtrlComponent,
    SearchCtrlComponent,
    GridLineComponent,
    RsvnCtrlComponent,
    RoomListComponent,
    SearchListComponent,
    SearcherCtrlComponent,
    SearcherListComponent
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
    SharedDialogModule,
    ChargesModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot()
  ],
  exports: [
    ClockComponent,
    GridComponent,
    FrontdeskComponent
  ]
})
export class FrontdeskModule { }
