import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatemgrCtrlComponent } from './ratemgr-ctrl/ratemgr-ctrl.component';
import { RateListComponent } from '@app/ratemgr/rate-list/rate-list.component';
import { SeasonCtrlComponent } from '@app/ratemgr/season-ctrl/season-ctrl.component';
import { SeasonCalendarComponent } from '@app/ratemgr/season-calendar/season-calendar.component';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule} from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '@app/app-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { RateListLineComponent } from './rate-list/rate-list-line.component';
import { SeasonCalendarCalcComponent } from './season-calendar-calc/season-calendar-calc.component';
@NgModule({
  declarations: [
    RatemgrCtrlComponent,
    RateListComponent,
    SeasonCalendarComponent,
    SeasonCtrlComponent,
    RateListLineComponent,
    SeasonCalendarCalcComponent
  ],
  imports: [
  
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    
  ]
})
export class RatemgrModule { }
