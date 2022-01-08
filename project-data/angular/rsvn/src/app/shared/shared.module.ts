import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileinputComponent } from '@app/system/fileinput/fileinput.component';
import { CalendarComponent } from '@app/calendar/calendar.component';
import { MatIconModule } from '@angular/material/icon';
import { InfoComponent } from '@app/info/info.component';

@NgModule({
  declarations: [
    FileinputComponent,
    CalendarComponent,
    InfoComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports : [
    FileinputComponent,
    CalendarComponent,
    InfoComponent

  ]
})
export class SharedModule { }
