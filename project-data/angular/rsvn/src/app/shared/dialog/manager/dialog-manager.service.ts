import {Injectable, TemplateRef} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ComponentType} from "@angular/cdk/overlay";

@Injectable({
  providedIn: 'root'
})
export class DialogManagerService {
  constructor(public dialog: MatDialog) {}

  openDialog<T>(dialogComponent: ComponentType<T> | TemplateRef<T>, config: MatDialogConfig = {}) {
    return this.dialog.open(dialogComponent, config);
  }
}
