import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerService } from './manager/manager.service';
import { MatDialogModule } from "@angular/material/dialog";
import {DangerDialogComponent} from "@app/shared/dialog/danger-dialog/danger-dialog.component";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    DangerDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
  ],
  providers: [
    ManagerService,
  ]
})
export class SharedDialogModule { }
