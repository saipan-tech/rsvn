import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule} from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '@app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';

import { ChargeCtrlComponent } from './charge-ctrl/charge-ctrl.component';
import { ChargeLineComponent } from './charge-room-list/charge-line/charge-line.component';
import { ChargePmtEditComponent } from './charge-pmt-edit/charge-pmt-edit.component';
import { ChargeChgEditComponent } from './charge-chg-edit/charge-chg-edit.component';
import { ChargePmtListComponent } from './charge-pmt-list/charge-pmt-list.component';
import { ChargeChgListComponent } from './charge-chg-list/charge-chg-list.component';
import { ChargeRoomListComponent } from './charge-room-list/charge-room-list.component';

@NgModule({
  declarations: [
    ChargeCtrlComponent,
    ChargeLineComponent,
    ChargePmtEditComponent,
    ChargeChgEditComponent,
    ChargePmtListComponent,
    ChargeChgListComponent,
    ChargeRoomListComponent
  ],
  imports: [
   

    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatRadioModule,
    AppRoutingModule,
    MatExpansionModule,
  ],
  exports: [
    ChargeCtrlComponent
  ]
})
export class ChargesModule { }
