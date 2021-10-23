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

import { ChargeCtrlComponent } from './charge-ctrl/charge-ctrl.component';
import { ChargeLineComponent } from './charge-line/charge-line.component';
import { ChargeEditComponent } from './charge-edit/charge-edit.component';
import { ChargePmtComponent } from './charge-pmt/charge-pmt.component';
import { ChargePmtEditComponent } from './charge-pmt-edit/charge-pmt-edit.component';
import { ChargeChgEditComponent } from './charge-chg-edit/charge-chg-edit.component';
import { ChargePmtListComponent } from './charge-pmt-list/charge-pmt-list.component';
import { ChargeChgListComponent } from './charge-chg-list/charge-chg-list.component';

@NgModule({
  declarations: [
    ChargeCtrlComponent,
    ChargeLineComponent,
    ChargeEditComponent,
    ChargePmtComponent,
    ChargePmtEditComponent,
    ChargeChgEditComponent,
    ChargePmtListComponent,
    ChargeChgListComponent
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
    AppRoutingModule
  ],
  exports: [
    ChargeCtrlComponent
  ]
})
export class ChargesModule { }
