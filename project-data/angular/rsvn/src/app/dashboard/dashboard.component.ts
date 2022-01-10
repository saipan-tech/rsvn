import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericService } from '@app/_services/generic.service';
import { RoomService } from '@app/_services/room.service';
import { catchError, tap, map, mergeMap, concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private genericService : GenericService,
    private roomService: RoomService

  ) { }
  rsvnList:any;
  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)

  
  ngOnInit(): void {
    
    let roomList:any;
    let rsvnList:any;
    let checkin:any;
    let checkout:any;
    let inhouse:any;
    let roominfoList:any;
    let bldgList:any;
    this.genericService.getItemQueryList('rsvn',`active=${this.Today}`)
    .pipe(
      tap((data:any) => rsvnList = data),
      concatMap(()=>this.genericService.getItemQueryList("room","active=1")),
      tap(d => roomList = d),
      concatMap(()=>this.genericService.getItemList("roominfo")),
      tap(d => roominfoList = d),
      concatMap(()=>this.genericService.getItemList("bldg")),
      tap(d => bldgList = d),

    ).subscribe(data=> {
      roominfoList.map((rin:any)=>rin.bldg = bldgList.find((b:any)=> b.id == rin.bldg))
      roomList.map((rml:any)=>rml.roominfo = roominfoList.find((r:any)=> r.id == rml.roominfo))
      rsvnList.map((rvn:any) => rvn.rooms = roomList.filter((rl:any) => rl.rsvn == rvn.id ))
      checkin = rsvnList.filter((d:any)=> d.dateIn == this.Today)
      checkout = rsvnList.filter((d:any)=> d.dateOut == this.Today)
      inhouse = rsvnList.filter((d:any)=> d.dateIn != this.Today && d.dateOut != this.Today)
      this.rsvnList= {checkin,checkout,inhouse}
      console.log(this.rsvnList)
    })

    } 
}



