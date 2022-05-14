import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { GenericService } from '@app/_services/generic.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { concatMap, map } from 'rxjs/operators';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';  
@Component({
  selector: 'app-charge-room-view',
  templateUrl: './charge-room-view.component.html',
  styleUrls: ['./charge-room-view.component.scss']
})

export class ChargeRoomViewComponent implements OnInit {
 
  constructor(
    private dialogRef: MatDialogRef<ChargeRoomViewComponent>,
    private genericService : GenericService,
    private roominfoService : RoominfoEntityService,
    private roomService : RoomEntityService,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) { 
    this.roomid = data.roomid,
    this.currRsvn = data.currRsvn
  }
  roomid:any 
  roomCharge$: any
  currRoomCharge : any
  editOn:boolean = false
  currRsvn:any
//------------------------------------
  rchargeEditForm = new FormGroup({
    id: new FormControl({ value: '', disabled: true }),
    date: new FormControl({ value: '', disabled: true }),
    amount: new FormControl('', Validators.required),
    created: new FormControl({ value: '', disabled: true }),

  })
//------------------------------------
editDate(rec:any) {
  this.editOn = true
  this.rchargeEditForm.patchValue(rec)
  this.currRoomCharge = rec
}
//------------------------------------
 
updateRec() {

  this.currRoomCharge.amount = this.rchargeEditForm.value.amount
  this.genericService.updateItem("roomcharge",this.currRoomCharge)
    .subscribe()
}
//------------------------------------

close() {
    this.dialogRef.close()
  }
//------------------------------------
ngOnInit(): void {
    this.roomCharge$ = this.genericService.getItemQueryList("roomcharge",`room=${this.roomid}`).pipe(
      concatMap(roomcharges => this.genericService.getItemQueryList("seasoncal",`dateStart=${this.currRsvn.dateIn}&dateEnd=${this.currRsvn.dateOut}`).pipe(
          map(seasoncal => {
          roomcharges.map(rc => {
            rc.season = seasoncal.find(sc => sc.date == rc.date).season
          })

          return roomcharges
        })
      )
     ))
  }
}
