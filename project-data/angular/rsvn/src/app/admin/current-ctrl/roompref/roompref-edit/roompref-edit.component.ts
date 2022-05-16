import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { IRoominfo } from '@app/_interface/roominfo';
import { DangerDialogComponent, DialogManagerService } from "@app/shared/dialog";
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { SystemService } from '@app/_services/system.service';
import { GenericService } from '@app/_services/generic.service';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IRoom } from '@app/_interface/room';
import { IBldg } from '@app/_interface/bldg';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-roompref-edit',
  templateUrl: './roompref-edit.component.html',
  styleUrls: ['./roompref-edit.component.scss']
})
export class RoomprefEditComponent implements OnInit {


  statusList: any
  rateList: any
  currBldg = {} as IBldg
  currRoominfo = {} as IRoominfo
  deleteFlag$:Observable<any> = of()

  constructor(
    private roominfoService: RoominfoEntityService,
    private roomService: RoomEntityService,
    private dialogManagerService: DialogManagerService,
    @Inject(MAT_DIALOG_DATA) data: any,
    private systemService: SystemService,
    private genericService: GenericService,
    private dialogRef: MatDialogRef<RoomprefEditComponent>,

  ) {
    this.currBldg = data.currBldg
    this.currRoominfo = data.currRoominfo

    console.log(data)
  }


  roomEditForm = new FormGroup({
    id: new FormControl(''),
    number: new FormControl('', Validators.required),
    floor: new FormControl(''),
    rateAlias: new FormControl(''),
    beds: new FormControl(''),
    style: new FormControl(''),
    color: new FormControl(''),    
    size: new FormControl(''),
    status: new FormControl(''),
    rsvn: new FormControl(''),
    bldg: new FormControl(''),
    name: new FormControl(''),
    descr: new FormControl(''),
    ipaddr: new FormControl(''),
    phone: new FormControl('')
  })


  updateRoom(roominfo: any) {
    for (const field in roominfo) {
      if (roominfo[field] == null) {
        roominfo[field] = ''
      }
      if (field == 'id' && roominfo[field] == '')
        roominfo[field] = 0
    }
    if (roominfo.id)
      this.roominfoService.update(roominfo).subscribe(
        data => {
          console.log(data, "update")
          this.dialogRef.close()
        }

      )
    else {
      roominfo.bldg = this.currBldg.id
      roominfo.status = 'unknown'
      this.roominfoService.add(roominfo).subscribe(
        data => {
          console.log(data, "create")
          this.dialogRef.close()
        }
      );
    

    }

  }
  deleteRoom(roominfo: any) {
    this.roomService.entities$.pipe(
      map(rooms => {
        let found = rooms.filter(r => r.roominfo == roominfo.id)
        if (found.length==0) {
          this._deleteRoom(roominfo)
        }
      })
    ).subscribe()
  }


  _deleteRoom(roominfo: any) {
    this.dialogManagerService.openDialog<DangerDialogComponent>(DangerDialogComponent, {
      data: {
        title: `Delete Room (${roominfo.number}) ?`,
        content: 'You cannot undue this action',
        confirmAction: 'Delete',
      }
    }).afterClosed().subscribe(deleteConfirmed => {
      if (deleteConfirmed) {
        this.roominfoService.delete(roominfo).subscribe(
          data => {
            this.dialogRef.close()
          })
      }
    })
  }
  ngOnInit(): void {

    this.deleteFlag$ = this.roomService.entities$.pipe(
      map(rooms => {
        let found = rooms.filter(r => r.roominfo == this.currRoominfo.id)
        return  found.length==0
      })
    )
    this.roomEditForm.patchValue(this.currRoominfo)

    this.systemService.getDropdownList('roomstatus').subscribe(
      data => this.statusList = data
    )

    this.genericService.getItemList("rate")
      .subscribe(data => {
        this.rateList = data
      })
  }

}
