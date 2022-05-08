import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogManagerService } from './dialog-manager/dialog-manager.service';
import { MatDialogModule } from "@angular/material/dialog";
import {DangerDialogComponent} from "@app/shared/dialog/danger-dialog/danger-dialog.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    DangerDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  exports: [
    MatDialogModule,
  ],
  providers: [
    DialogManagerService,
  ]
})
export class SharedDialogModule { }
