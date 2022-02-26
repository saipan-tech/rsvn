import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGuest } from '@app/_interface/guest';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { GuestEntityService } from '@app/_ngrxServices/guest-entity.service';
import { concatMap, tap } from 'rxjs/operators';
import { IRsvn } from '@app/_interface/rsvn';

@Component({
  selector: 'app-frontdesk',
  templateUrl: './frontdesk.component.html',
  styleUrls: ['./frontdesk.component.scss']
})

export class FrontdeskComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private rsvnService: RsvnEntityService,
    private guestService: GuestEntityService
  ) { }
  currRsvn: IRsvn = {} as IRsvn;
  currGuest: IGuest = {} as IGuest;

  //-------------------------------

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      if (data.rsvnId) {
        this.rsvnService.getByKey(data.rsvnId).pipe(
          tap(rsvn => this.currRsvn = rsvn),
          concatMap(rsvn => this.guestService.getByKey(rsvn.primary)),
          tap(guest => this.currGuest = guest)
        ).subscribe()
      }
    })
  }
}
