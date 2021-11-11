import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';

import { IGuest } from '@app/_interface/guest';
import { IRsvn } from '@app/_interface/rsvn';
import { AuthService } from '@app/_services/auth.service';
import { GenericService } from '@app/_services/generic.service';
@Component({
  selector: 'app-frontdesk',
  templateUrl: './frontdesk.component.html',
  styleUrls: ['./frontdesk.component.scss']
})
export class FrontdeskComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private genericService: GenericService,

  ) {

  }
  status: boolean = false;
  screen = "search"
  user: any = {}
  currRsvn: any;
  currGuest: IGuest = {} as IGuest;
  gridOn = false
  @Output() viewControl = new EventEmitter<string>();

  days = 0

//-------------------------------
  selectedGuest(guest: any) {
    // makes grid selection available
    this.genericService.getItem('rsvn', guest.rsvnid).subscribe(
      data => {
        this.currRsvn = data
        this.currGuest = data.primary
      }
    )

  }

  currRsvnEvent(event:any) {
    this.ngOnInit()

  }

//-------------------------------
changeView(view: string) {
    this.viewControl.emit(view)
  }

  ngOnInit(): void {

    this.authService.getSession().subscribe(
      data => this.user = data
    )

  }

}
