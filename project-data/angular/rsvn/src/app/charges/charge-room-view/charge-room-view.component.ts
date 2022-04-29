import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";


  
@Component({
  selector: 'app-charge-room-view',
  templateUrl: './charge-room-view.component.html',
  styleUrls: ['./charge-room-view.component.scss']
})
export class ChargeRoomViewComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ChargeRoomViewComponent>,

    @Inject(MAT_DIALOG_DATA) data: any,

  ) { 
    this.record = data

  }


  record:any 

  close() {
    this.dialogRef.close()
  }
  ngOnInit(): void {
  }

}
