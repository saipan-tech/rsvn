import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from './dialog.service';
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  providers: [
    DialogService,
  ]
})
export class DialogModule { }
