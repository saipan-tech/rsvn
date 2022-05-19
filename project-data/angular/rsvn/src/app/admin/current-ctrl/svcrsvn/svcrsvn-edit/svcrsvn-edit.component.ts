import { Component, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { SystemService } from '@app/_services/system.service';
import { IDropdown } from '@app/_interface/dropdown';
import { ISvcRsvn } from '@app/_interface/svcrsvn';
import { RoomService } from '@app/_services/room.service';
import { GenericService } from '@app/_services/generic.service';
import { concatMap, map } from 'rxjs/operators';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-svcrsvn-edit',
  templateUrl: './svcrsvn-edit.component.html',
  styleUrls: ['./svcrsvn-edit.component.scss']
})
export class SvcrsvnEditComponent implements OnInit {

  constructor(
    private systemService: SystemService,
    private dialogRef: MatDialogRef<SvcrsvnEditComponent>,
    private roomService: RoomEntityService,
    private genericService: GenericService,
    private roominfoService: RoominfoEntityService,
    @Inject(MAT_DIALOG_DATA) data: any,

  ) {
    this.currSvcRsvn = data.currSvcRsvn


  }
  currRoomstring: string = ""
  currSvcRsvn: ISvcRsvn
  roomStatus: IDropdown[] = [];
  colorList: IDropdown[] = [];
  collisionClear: boolean = false
  dateSet: boolean = false
  currRoominfos: string = ""
  colCheck$:Observable<any> = of()

  svcrsvnEditForm = new FormGroup({
    id: new FormControl(''),
    status: new FormControl(''),
    dateIn: new FormControl('', Validators.required),
    dateOut: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required),
    notes: new FormControl('', Validators.required),
    clerk: new FormControl({ value: '', disabled: true }),
    created: new FormControl({ value: '', disabled: true }),
    modified: new FormControl({ value: '', disabled: true })


  })
//---------------------------------
changeString(newString:string) {
console.log(newString)
this.currRoominfos = newString
this.currSvcRsvn.roominfos = newString
}
//---------------------------------
collisionCheck(dateIn: string, dateOut: string) {
  console.log("boom")  
  this.colCheck$ =  this.roomService.activeRoom$(dateIn, dateOut).pipe(
      map(rooms => {
        let rmSet: any = {}
        rooms.map(rm => {
          if (!rmSet.hasOwnProperty(rm.roominfo))
            rmSet[rm.roominfo] = []
          rmSet[rm.roominfo].push(rm)
        })
        return rmSet
      })
    )
  }

  //---------------------------------
  updateSvcRsvn() {
    this.genericService.updateItem('svcrsvn',this.currSvcRsvn).subscribe()
  }

  //---------------------------------
  deleteSvcRsvn() {

  }
  //---------------------------------
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
    this.systemService.getDropdownList('svcstatus').subscribe(
      data => this.roomStatus = data
    )
    this.systemService.getDropdownList('color').subscribe(
      data => this.colorList = data
    )
    this.svcrsvnEditForm.patchValue(this.currSvcRsvn)
    if(this.currSvcRsvn && this.currSvcRsvn.id) {
      this.dateSet = true
      this.currRoomstring = this.currSvcRsvn.roominfos
    }

    this.svcrsvnEditForm.valueChanges.subscribe(
      data => {
        if (data.dateIn && data.dateOut) { 
          this.dateSet = true
          data.roominfos = this.currRoominfos
          this.currSvcRsvn = data
        }
        else this.dateSet = false
      }
    )

  }

}
