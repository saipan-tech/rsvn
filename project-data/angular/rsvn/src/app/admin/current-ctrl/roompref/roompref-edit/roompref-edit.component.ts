import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { IRoominfo } from '@app/_interface/roominfo';
import { DangerDialogComponent, DialogManagerService } from "@app/shared/dialog";
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { SystemService } from '@app/_services/system.service';
import { GenericService } from '@app/_services/generic.service';
@Component({
  selector: 'app-roompref-edit',
  templateUrl: './roompref-edit.component.html',
  styleUrls: ['./roompref-edit.component.scss']
})
export class RoomprefEditComponent implements OnInit {


  statusList:any
  rateList:any

  constructor(
    private roominfoService: RoominfoEntityService,
    private dialogManagerService: DialogManagerService,
    private systemService: SystemService,
    private genericService: GenericService

  ) { }
  
  
  roomEditForm = new FormGroup({
    id: new FormControl(''),
    number: new FormControl('', Validators.required),
    floor: new FormControl(''),
    rateAlias: new FormControl(''),
    beds: new FormControl('', Validators.required),
    style: new FormControl(''),
    color: new FormControl(''),
    size: new FormControl(''),
    status: new FormControl(''),
    rsvn: new FormControl(''),
    bldg: new FormControl(''),
    name: new FormControl(''),
    descr: new FormControl(''),
  })
  
  updateRoom(roominfo: any) {
    for (const field in roominfo) {
      if (roominfo[field] == null) {
        roominfo[field] = ''
      }
      if (field == 'id'  && roominfo[field]=='')
        roominfo[field] = 0 
    }
    
    this.roominfoService.update(roominfo).subscribe(
      data =>  console.log(data)  
      )
  }
  deleteRoom(roominfo: any) {
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
            
        })
      }
    }) 
  }
  ngOnInit(): void {
    this.systemService.getDropdownList('roomstatus').subscribe(
      data => this.statusList = data
    )

    this.genericService.getItemList("rate")
      .subscribe(data => {
        this.rateList = data
      })
  }

}
