import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-danger-dialog',
  templateUrl: './danger-dialog.component.html',
  styleUrls: ['./danger-dialog.component.scss']
})
export class DangerDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string,
      content: string,
      cancelAction?: string,
      confirmAction?: string,
    },
  ) {}
}
