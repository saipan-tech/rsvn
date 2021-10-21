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
import { ChargeListComponent } from './charge-list/charge-list.component';
import { ChargeLineComponent } from './charge-line/charge-line.component';
import { ChargeEditComponent } from './charge-edit/charge-edit.component';
import { ChargePmtComponent } from './charge-pmt/charge-pmt.component';
import { ChargeEditPmtComponent } from './charge-edit-pmt/charge-edit-pmt.component';
import { ChargeEditChgComponent } from './charge-edit-chg/charge-edit-chg.component';
import { ChargeChgComponent } from './charge-chg/charge-chg.component';

@NgModule({
  declarations: [
    ChargeCtrlComponent,
    ChargeListComponent,
    ChargeLineComponent,
    ChargeEditComponent,
    ChargePmtComponent,
    ChargeEditPmtComponent,
    ChargeEditChgComponent,
    ChargeChgComponent
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
