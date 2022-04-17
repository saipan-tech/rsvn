import { Component, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { SystemService } from '@app/_services/system.service';
import { IDropdown } from '@app/_interface/dropdown';
import { ISvcRsvn } from '@app/_interface/svcrsvn';
import { RoomService } from '@app/_services/room.service';
import { GenericService } from '@app/_services/generic.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-svcrsvn-edit',
  templateUrl: './svcrsvn-edit.component.html',
  styleUrls: ['./svcrsvn-edit.component.scss']
})
export class SvcrsvnEditComponent implements OnInit {

  constructor(
    private systemService: SystemService,
    private dialogRef: MatDialogRef<SvcrsvnEditComponent>,
    private xroomService: RoomService,
    private genericService: GenericService,
    @Inject(MAT_DIALOG_DATA) data: any,

  ) {
    this.currSvcRsvn = data.currSvcRsvn 

   }

  currSvcRsvn:ISvcRsvn
  roomStatus: IDropdown[] = [];
  colorList: IDropdown[] = [];

  svcrsvnEditForm = new FormGroup({
    id:new FormControl(''),
    status: new FormControl(''),
    dateIn: new FormControl('', Validators.required),
    dateOut: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required),
    notes: new FormControl('', Validators.required),
    clerk: new FormControl({ value: '', disabled: true }),
    created: new FormControl({ value: '', disabled: true }),
    modified: new FormControl({ value: '', disabled: true })


  })

  
  updateSvcRsvn() {
    let csr = this.svcrsvnEditForm.value
    this.xroomService.availableRooms(csr.dateIn,csr.dateOut).pipe(
      map(rmlist => {
        
      })
    )

    csr.dateIn = this.fromHTMLDate(csr.dateIn)
    csr.dateOut = this.fromHTMLDate(csr.dateOut)
    if(!csr.id) {
    }
  }

  deleteSvcRsvn() {

  }
  close() {
    this.dialogRef.close()
  }
  //---------------------------------
  toHTMLDate(d: Date) {
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = String(d.getFullYear())
    return `${year}-${month}-${day}`
  }
  //---------------------------------
  fromHTMLDate(date: string) {
    let ndate = new Date(`${date}`).toISOString().slice(0, 10)
    return ndate
  }
  ngOnInit(): void {
    this.systemService.getDropdownList('roomstatus').subscribe(
      data => this.roomStatus = data
    )
    this.systemService.getDropdownList('color').subscribe(
      data => this.colorList = data
    )
    this.svcrsvnEditForm.patchValue(this.currSvcRsvn)

  }

}
