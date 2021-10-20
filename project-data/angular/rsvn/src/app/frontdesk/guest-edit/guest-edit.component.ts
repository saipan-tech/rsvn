import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { GenericService } from '@app/_services/generic.service';
import { RsvnService  } from '@app/_services/rsvn.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { IGuest } from '@app/_interface/guest';
import { IRsvn } from '@app/_interface/rsvn';
import {DangerDialogComponent, ManagerService} from "@app/shared/dialog";
@Component({
  selector: 'app-guest-edit',
  templateUrl: './guest-edit.component.html',
  styleUrls: ['./guest-edit.component.css']
})
export class GuestEditComponent implements OnInit, OnChanges {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private authService: AuthService,
    private rsvnService: RsvnService,
    private dialogManagerService: ManagerService,
  ) { }

  @Input() currGuest: IGuest = {} as IGuest;
  @Output() currGuestChange = new EventEmitter<IGuest>();

  @Input() currRsvn: IRsvn = {} as IRsvn;
  @Output() currRsvnChange = new EventEmitter<IRsvn>();

  @Output() viewControl = new EventEmitter<string>();

  // dropdowns

  idList: any;
  user: any;
  errmsg:any;

  rsvnList : IRsvn[] = []

  changeView(view: string) {
    this.viewControl.emit(view)
  }

  guestEditForm = new FormGroup({
    id: new FormControl(''),
    firstname: new FormControl('', Validators.required),
    middlename: new FormControl(''),
    lastname: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl(''),
    zipcode: new FormControl(''),
    country: new FormControl(''),
    email: new FormControl('', Validators.required),
    idtype: new FormControl('', Validators.required),
    idnum: new FormControl('', Validators.required),
    idexpire: new FormControl('', Validators.required),
    dob: new FormControl(''),
    notes: new FormControl(''),
    company: new FormControl(''),
    title:new FormControl(''),
    clerk: new FormControl({ value: '', disabled: true }),
    created: new FormControl({ value: '', disabled: true }),
    modified: new FormControl({ value: '', disabled: true })
  })

 //---------------------------------
  guest2form(guest: IGuest) {
    this.guestEditForm.reset()
    this.guestEditForm.patchValue(guest)
    this.currGuest = guest
  }
  //---------------------------------
  loadGuest(guest: any) {
    if (guest && guest.id) {
      this.genericService.getItem('guest', guest.id).subscribe(
        data => {
          this.rsvnService.getGuestRsvn(this.currGuest.id)
            .subscribe(d => this.rsvnList = d )
          this.guest2form(data)
        }
      )
    }
  }
  //---------------------------------
  updateGuest(guest: any) {
    this.errmsg = {}
    if (guest && !guest.id) {
      guest.clerk = this.user.username
    }
    for (const field in guest) {
      if (guest[field] == null) {
        guest[field] = ''
      }
    }
    this.genericService.updateItem('guest', guest).subscribe(
      data => {
        this.guest2form(data);
        this.selGuest(data);
      },
      err => {
        this.errmsg = err.error
      }
    )
  }
  noRsvn() {
    return !this.rsvnList.length
  }
  //---------------------------------
  deleteGuest(guest: any) {
    this.dialogManagerService.openDialog<DangerDialogComponent>(DangerDialogComponent, {
      data: {
        title: 'Delete guest?',
        content: 'You cannot undue this action',
        confirmAction: 'Delete',
        cancelAction: 'Cancel',
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        if (!this.rsvnList.length) {
          this.genericService.deleteItem('guest', guest).subscribe(
            data => {
              this.clearGuest()
            },
            err => {
              console.log("error", err)
            }
          )
        }
      }
    });
  }
  //---------------------------------
  blankGuest(guest: any) {
    guest = {} as IGuest;

    for (const field in guest) {
      if (guest[field] == null) {
        guest[field] = ''
      }
    }
    this.guestEditForm.reset()
  }
  //---------------------------------
  clearGuest() {
    this.blankGuest(this.currGuest)
  }
  //---------------------------------
  selGuest(guest: IGuest) {
    this.currGuestChange.emit(guest)
  }
  //---------------------------------
  selRsvn(rsvn: IRsvn) {
    this.currRsvnChange.emit(rsvn)
  }
  //---------------------------------
  newGuest() {
    this.currGuest = {} as IGuest
    this.currRsvn = {} as IRsvn
    this.currGuest.id = 0

    this.currGuestChange.emit(this.currGuest)
    this.currRsvnChange.emit(this.currRsvn)

    this.guestEditForm.reset()
  }
  //---------------------------------
  newReservation() {
    this.currRsvn = {} as IRsvn
    this.currRsvn.id = 0
    this.currRsvnChange.emit(this.currRsvn)
  }
  //---------------------------------

  ngOnChanges(changes: SimpleChanges) {
    this.loadGuest(this.currGuest)
   }
  //---------------------------------
  ngOnInit(): void {
    this.systemService.getDropdownList('idtype').subscribe(
      data => this.idList = data
    )
    if (this.currGuest && this.currGuest.id) {
      this.genericService.getItem('guest', this.currGuest.id).subscribe(
        data => {
          this.rsvnService.getGuestRsvn(this.currGuest.id)
          .subscribe(d => this.rsvnList = d )
          this.guest2form(data)
        }
      )
    }
    this.authService.getSession().subscribe(
      data => this.user = data
    )
  }
}
