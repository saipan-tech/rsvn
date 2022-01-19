import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileinputComponent } from '@app/system/fileinput/fileinput.component';
import { CalendarComponent } from '@app/calendar/calendar.component';
import { InfoComponent } from '@app/info/info.component';
import { WeatherComponent } from './weather/weather.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { AccordionModule } from 'ngx-bootstrap/accordion';

import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule} from '@angular/material/autocomplete'
import { MatInputModule } from '@angular/material/input';
import  {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule} from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule} from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    FileinputComponent,
    CalendarComponent,
    InfoComponent,
    WeatherComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
  //  AccordionModule,
    FormsModule,
    ReactiveFormsModule,

    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSliderModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule

  ],
  exports : [
    FileinputComponent,
    CalendarComponent,
    InfoComponent,
    WeatherComponent,

  ]
})
export class SharedModule { }
