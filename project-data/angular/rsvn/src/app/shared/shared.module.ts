import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileinputComponent } from '@app/system/fileinput/fileinput.component';
import { CalendarComponent } from '@app/calendar/calendar.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    FileinputComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports : [
    FileinputComponent,
    CalendarComponent

  ]
})
export class SharedModule { }
