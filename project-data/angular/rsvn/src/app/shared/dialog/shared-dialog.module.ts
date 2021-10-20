import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerService } from './manager/manager.service';
import { MatDialogModule } from "@angular/material/dialog";
import {DangerDialogComponent} from "@app/shared/dialog/danger-dialog/danger-dialog.component";

@NgModule({
  declarations: [
    DangerDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  providers: [
    ManagerService,
  ]
})
export class SharedDialogModule { }
