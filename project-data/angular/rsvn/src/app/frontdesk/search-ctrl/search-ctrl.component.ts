import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { catchError, tap, map, mergeMap, subscribeOn, filter } from 'rxjs/operators';
import { IRsvn } from '@app/_interface/rsvn';
import { IGuest } from '@app/_interface/guest';

import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { GuestService } from '@app/_services/guest.service';

import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { GuestEntityService } from '@app/_ngrxServices/guest-entity.service';
import { Observable, of, throwError } from 'rxjs';


@Component({
  selector: 'app-search-ctrl',
  templateUrl: './search-ctrl.component.html',
  styleUrls: ['./search-ctrl.component.scss']
})
export class SearchCtrlComponent implements OnInit {
  @Input() currRsvn: any
  @Output() currRsvnChange = new EventEmitter<IRsvn>();
  @Input() currGuest: any
  @Output() currGuestChange = new EventEmitter<IGuest>();
  @Output() viewControl = new EventEmitter<string>();
  @Input() query: any
  @Input() dquery: any

  constructor(
    private roomService: RoomEntityService,
    private rsvnService: RsvnEntityService,
    private guestService: GuestEntityService
    

  ) { }

  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)

  searchForm = new FormGroup({
    dquery: new FormControl(''),
    query: new FormControl(''),
    archive: new FormControl(''),
  });

  activeRsvn$: Observable<IRsvn[]> = of()
  //--------------------------------------
  selectRsvn(rsvn: any) {
    this.currRsvnChange.emit(rsvn)
    this.currGuestChange.emit(rsvn.primary)
  }
  //--------------------------------------
  activeRes(mode: string) {

    switch (mode) {
      case 'current':

        break;

      case 'active':
        break;

      case 'delay':
        break;

      case 'guests':
        break;

      case 'rsvns':
        break;

      case 'future':
        break;

      case 'noroom':
        break;
    }

  }

  ngOnInit(): void {

    this.activeRsvn$ = this.rsvnService.entities$.pipe(
      map(rsvn => rsvn.filter(r => r.dateIn <= this.Today && r.dateOut >= this.Today)))
   

    this.searchForm.valueChanges
      .subscribe(val => {
        if (val.dquery) {
          let date = new Date(val.dquery).toISOString().slice(0,10)
          let dateRsvn$ = this.rsvnService.entities$.pipe(
            map( rsvn => rsvn.filter(r =>  r.dateIn <= date && r.dateOut >= date  )),
            map( rsvn => rsvn.sort((a,b) => a.dateIn.localeCompare(b.dateIn)))
          )
        } else if (val.query && val.query.length > 1) {
          let rsvnList$ = this.rsvnService.getWithQuery(`query=${val.query}`)
          let guestList$  = this.guestService.getWithQuery(`query=${val.query}`)
          
        }
        //          this.runSearch(val.query)
        //          this.selectHead = "Query Result"


      })

  }

}
