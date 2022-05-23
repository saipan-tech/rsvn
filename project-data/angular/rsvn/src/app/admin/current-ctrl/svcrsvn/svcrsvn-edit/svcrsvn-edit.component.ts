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
import { TransitionCheckState } from '@angular/material/checkbox';
import { DialogManagerService } from '@app/shared/dialog';
import { DangerDialogComponent } from '@app/shared/dialog';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';

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
    private rsvnService: RsvnEntityService,
    private genericService: GenericService,
    private roominfoService: RoominfoEntityService,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogManagerService: DialogManagerService


  ) {
    this.currSvcRsvn = data.currSvcRsvn
    if (this.currSvcRsvn && this.currSvcRsvn.roominfos)
      this.currRoominfos = data.currSvcRsvn.roominfos


  }
  currSvcRsvn: ISvcRsvn
  roomStatus: IDropdown[] = [];
  colorList: IDropdown[] = [];
  collisionClear: boolean = false
  dateSet: boolean = false
  currRoominfos: string = ""
  activeCheck$: Observable<any> = of()
  warnString$: Observable<any> = of()
  collRooms$: Observable<any> = of()
  collRsvns$: Observable<any> = of()



  svcrsvnEditForm = new FormGroup({
    id: new FormControl(''),
    status: new FormControl(''),
    dateIn: new FormControl('', Validators.required),
    dateOut: new FormControl('', Validators.required),
    notes: new FormControl('', Validators.required),
    clerk: new FormControl({ value: '', disabled: true }),
    created: new FormControl({ value: '', disabled: true }),
    modified: new FormControl({ value: '', disabled: true })


  })
  //---------------------------------
  changeString(newString: string) {
    this.currSvcRsvn.roominfos = newString
    this.currRoominfos = newString
    this.reload()
  }
  //---------------------------------
  reload() {
    if (this.dateSet) {
      //---------------------------------
      //---------------------------------
      this.collRooms$ = this.roomService.activeRoom$(this.currSvcRsvn.dateIn, this.currSvcRsvn.dateOut).pipe(
        concatMap(rooms => this.roominfoService.entities$.pipe(
          map(roominfos => {
            let selRoom: any[] = this.currRoominfos.split(',')
            let colls: any = {}
            selRoom.forEach(sr => {
              let sel = rooms.filter(rm => rm.roominfo == sr)
              if (sel.length)
                colls[sr] = sel
            })
              return colls
          })
        ))
      )

      this.warnString$ = this.collRooms$.pipe(
        map(warn => {
          return Object.keys(warn).join()
        })
      )

      let findRsvn$ = this.collRooms$.pipe(
        map(rooms => {
          let rsvnSet = new Set()

          Object.keys(rooms).forEach(
            kys => {
              rooms[kys].forEach((rms: any) => {
                rsvnSet.add(rms.rsvn)

              })

            })
          return rsvnSet
        })
      )
      // now we break down collision rooms 

      this.collRsvns$ = findRsvn$.pipe(
        concatMap(crsvns => this.roomService.entities$.pipe(
          concatMap(rooms => this.rsvnService.entities$.pipe(
            concatMap(rsvns => this.roominfoService.entities$.pipe(
              concatMap(roominfos => this.collRooms$.pipe(
                map(collRooms => {
                  let result: any = []
                  rsvns.forEach((rvn: any) => {
                    if (crsvns.has(rvn.id)) {
                  
                      let rms = rooms.filter(rf => rf.rsvn == rvn.id)
                      let rvObj: any = { rsvn: rvn, rooms: [] }
                      // rooms will have room and roominfo together per push 
                      rms.map(r => {
                        let robj = { room: r, roominfo: roominfos.find(rf => rf.id == r.roominfo), collision: false }
                        if (collRooms.hasOwnProperty(r.roominfo)) {
                          robj.collision = true
                        }

                        rvObj.rooms.push(robj)
                      })
                      result.push(rvObj)
                    }
                  })
                  console.log(result)
                  return result
                })
              ))
            ))
          ))
        ))
      )



      //---------------------------------
    }


  }


  //---------------------------------
  updateSvcRsvn() {
    this.genericService.updateItem('svcrsvn', this.currSvcRsvn).subscribe()
    this.close()
  }

  //---------------------------------
  deleteSvcRsvn() {
    this.dialogManagerService.openDialog<DangerDialogComponent>(DangerDialogComponent, {
      data: {
        title: `Delete Service Reservation ${this.currSvcRsvn.notes} ${this.currSvcRsvn.dateIn}-${this.currSvcRsvn.dateOut} `,
        content: 'You cannot undue this action',
        confirmAction: 'Delete',
      }
    }).afterClosed().subscribe(deleteConfirmed => {
      if (deleteConfirmed) {
        this.genericService.deleteItem('svcrsvn', this.currSvcRsvn).subscribe()
        this.close()
      }

    })
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
  //---------------------------------
  ngOnInit(): void {
    this.systemService.getDropdownList('svcstatus').subscribe(
      data => this.roomStatus = data
    )
    this.systemService.getDropdownList('color').subscribe(
      data => this.colorList = data
    )
    this.svcrsvnEditForm.patchValue(this.currSvcRsvn)


    if (this.currSvcRsvn && this.currSvcRsvn.id) {
      this.dateSet = true
    }
    this.reload()
    this.svcrsvnEditForm.valueChanges.subscribe(
      data => {
        if (data.dateIn && data.dateOut) {
          this.dateSet = true
          this.currSvcRsvn = data
          this.currSvcRsvn.roominfos = this.currRoominfos

          this.reload()
        }
        else this.dateSet = false
      }
    )

  }

}
