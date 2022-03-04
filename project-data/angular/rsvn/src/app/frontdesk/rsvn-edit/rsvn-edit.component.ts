import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { IRsvn } from '@app/_interface/rsvn';
import { IGuest } from '@app/_interface/guest';
import { IRoom } from '@app/_interface/room';
import { RsvnService } from '@app/_services/rsvn.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { DangerDialogComponent, DialogManagerService } from "@app/shared/dialog";
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { resultMemoize } from '@ngrx/store';

@Component({
  selector: 'app-rsvn-edit',
  templateUrl: './rsvn-edit.component.html',
  styleUrls: ['./rsvn-edit.component.scss']
})
export class RsvnEditComponent implements OnInit, OnChanges {


  constructor(
    private systemService: SystemService,
    private authService: AuthService,
    private oldRsvnService : RsvnService,
    private rsvnService: RsvnEntityService,
    private roomService: RoomEntityService,
    private dialogManagerService: DialogManagerService,
  ) { }


  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  @Input() currGuest: any
  @Output() currGuestChange = new EventEmitter<IGuest>();

  user: any
  sourceList: any = []
  colorList: any = []
  statusList: any = [];
  form_error: any;
  rsvnList: IRsvn[] | unknown
  currNumRooms = 0
  currRooms: IRoom[] = []

  //---------------------------------
  rsvnEditForm = new FormGroup({
    id: new FormControl(''),
    status: new FormControl(''),
    confirm: new FormControl({ value: '', disabled: true }),
    source: new FormControl(''),
    dateIn: new FormControl('', Validators.required),
    dateOut: new FormControl('', Validators.required),
    numrooms: new FormControl(1, Validators.required),
    adult: new FormControl(1, Validators.required),
    child: new FormControl(0),
    infant: new FormControl(0),
    notes: new FormControl(''),
    color: new FormControl('', Validators.required),
    clerk: new FormControl({ value: '', disabled: true }),
    created: new FormControl({ value: '', disabled: true }),
    modified: new FormControl({ value: '', disabled: true })
  })
  //---------------------------------
  rsvnEditFormInit() {
    this.rsvnEditForm.reset()
    this.form_error = {}

    this.rsvnEditForm.patchValue({
      numrooms: 1,
      dateIn: '',
      dateOut: '',
      status: '',
      id: '',
      confirm: '',
      notes: '',
      adult: 1,
      child: 0,
      infant: 0,
      clerk: ''
    })
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
  newRsvn() {
    this.currRsvn = {} as IRsvn
    this.currRsvn.id = 0
    this.currRsvnChange.emit(this.currRsvn)
    this.rsvnEditFormInit()
  }
  //---------------------------------
  loadRsvn(rsvn: any) {
    if (rsvn && rsvn.id) {
      this.rsvnService.getByKey(rsvn.id).subscribe(
        data => {
          this.rsvnEditForm.patchValue(data)
          this.currRsvn = data
          this.roomService.getWithQuery(`rsvn=${data.id}`).subscribe(
            rooms => {
              this.currNumRooms = rooms.length
              this.currRooms = rooms
            }
          )
        },
        err => {
          console.log("ERROR in rsvn Loading", err)
        }
      )
    }
  }

  //---------------------------------
  createRsvn(rsvn: any) {
    if (this.currGuest.id) {
      this.form_error = {}
      rsvn.primary = Number(this.currGuest.id)
      rsvn.dateIn = this.fromHTMLDate(rsvn.dateIn)
      rsvn.dateOut = this.fromHTMLDate(rsvn.dateOut)
      if (rsvn && !rsvn.clerk) {
        rsvn.clerk = this.user.username
      }
      this.rsvnService.add(rsvn).subscribe(
        data => {
          this.currRsvn = data
          this.loadRsvn(data)
          this.currRsvnChange.emit(data)
        }
      )
    }
  }
  //---------------------------------
  updateRsvn(rsvn: any) {
    if (!rsvn.id) {
      this.createRsvn(rsvn)
    } else {
      // Before updating - let's run a validity check on the dates and the rooms
      if (this.currGuest.id) {
        this.form_error = {}
        rsvn.primary = Number(this.currGuest.id)
        rsvn.dateIn = this.fromHTMLDate(rsvn.dateIn)
        rsvn.dateOut = this.fromHTMLDate(rsvn.dateOut)
        if (rsvn && !rsvn.clerk) {
          rsvn.clerk = this.user.username
        }
        // Here we test if there would be a room collision with this save
        // This has to be updated to also change dates in rooms assigned
        
 

        this.oldRsvnService.rsvnTest(rsvn.id, rsvn.dateIn, rsvn.dateOut).subscribe(
          dd => {
            if (!dd.result.length) {
              this.rsvnService.update(rsvn).subscribe(
                data => {
                  this.currRsvn = data
                  this.loadRsvn(data)
                  this.currRsvnChange.emit(data)
                }
              )

            }
          },
          err => {
            this.form_error = err.error
          }
        )
      }
    }
  }
  //---------------------------------
  rsvnLocked() {
    if (this.currRsvn && this.currRsvn.id && this.currNumRooms == 0) {
      return false
    }
    return true
  }

  //---------------------------------
  deleteRsvn(rsvn: any) {
    this.dialogManagerService.openDialog<DangerDialogComponent>(DangerDialogComponent, {
      data: {
        title: 'Delete reservation?',
        content: 'You cannot undue this action',
        confirmAction: 'Delete',
      }
    }).afterClosed().subscribe(deleteConfirmed => {
      if (deleteConfirmed && !this.rsvnLocked()) {
        this.rsvnService.delete(rsvn.id).subscribe(
          data => {
            this.currRsvn = null
            this.currRsvnChange.emit(this.currRsvn)
            this.rsvnEditFormInit()
          },
          err => {
            console.log("ERROR in rsvn Delete", err)
          }
        )
      }
    });
  }
  //---------------------------------
  ngOnChanges(changes: SimpleChanges) {
    this.rsvnEditForm.reset()
    //    if (this.currRsvn && this.currRsvn.id == 0) {

    this.rsvnEditFormInit()
    //    }
    this.loadRsvn(this.currRsvn)
  }
  //---------------------------------
  ngOnInit(): void {

    this.systemService.getDropdownList('status').subscribe(
      data => this.statusList = data
    )
    this.systemService.getDropdownList('source').subscribe(
      data => this.sourceList = data
    )
    this.systemService.getDropdownList('vcolor').subscribe(
      data => this.colorList = data
    )
    this.authService.getSession().subscribe(
      data => {
        this.user = data
        if (this.currRsvn && this.currRsvn.id) {
          this.loadRsvn(this.currRsvn)
        } else {
          this.newRsvn()
        }
      }
    )

  }
}
