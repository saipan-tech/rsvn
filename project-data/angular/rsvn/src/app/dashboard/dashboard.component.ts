import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericService } from '@app/_services/generic.service';
import { RoomService } from '@app/_services/room.service';
import { SystemService } from '@app/_services/system.service';
import { catchError, tap, map, mergeMap, concatMap, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    private genericService: GenericService,

  ) { }
  rsvnList: any;
  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
  
  ngOnInit(): void {
    let roominfoList: any;
    let roomList: any;
    let bldgList: any;
    let rsvnList: any;
    let checkin: any;
    let checkout: any;
    let inhouse: any;
    
    this.genericService.getItemQueryList('rsvn', `active=${this.Today}`)
      .pipe(
        tap((data: any) => rsvnList = data),
        concatMap(() => this.genericService.getItemQueryList("room", "active=1")),
        tap(d => roomList = d),
        concatMap(() => this.genericService.getItemList("roominfo")),
        tap(d => roominfoList = d),
        concatMap(() => this.genericService.getItemList("bldg")),
        tap(d => bldgList = d),
      ).subscribe(data => {
        // add building names to roominfo list
        roominfoList.map((rin: any) => rin.bldg = bldgList.find((b: any) => b.id == rin.bldg))
        // add roominfo to rooms
        roomList.map((rml: any) => rml.roominfo = roominfoList.find((r: any) => r.id == rml.roominfo))
        // add rooms to rsvn list
        rsvnList.map((rvn: any) => rvn.rooms = roomList.filter((rl: any) => rl.rsvn == rvn.id))
        // now split reservations into 3 catagories ready for display
        checkin = rsvnList.filter((d: any) => d.dateIn == this.Today)
        checkout = rsvnList.filter((d: any) => d.dateOut == this.Today)
        inhouse = rsvnList.filter((d: any) => d.dateIn != this.Today && d.dateOut != this.Today)
        this.rsvnList = { checkin, checkout, inhouse }
      })

  }
}

