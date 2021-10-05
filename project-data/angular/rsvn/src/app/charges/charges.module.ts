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

import { ChargesComponent } from './charges.component';
import { ChargeCtrlComponent } from './charge-ctrl/charge-ctrl.component';
import { ChargeListComponent } from './charge-list/charge-list.component';
import { ChargeLineComponent } from './charge-line/charge-line.component';


@NgModule({
  declarations: [
    ChargesComponent,
    ChargeCtrlComponent,
    ChargeListComponent,
    ChargeLineComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatRadioModule,
    AppRoutingModule
  ],
  exports: [
    ChargesComponent,
    ChargeCtrlComponent
  ]
})
export class ChargesModule { }
