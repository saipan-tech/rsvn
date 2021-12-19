import { Component, OnInit } from '@angular/core';
import { catchError, tap, map, mergeMap,concatMap } from 'rxjs/operators';

import { GenericService } from '@app/_services/generic.service';
import { RoomService } from '@app/_services/room.service';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private roomService: RoomService,
    private genericService: GenericService,
    private authService: AuthService
  ) { }

currUsername:any

  ngOnInit(): void {
    this.authService.isUsername
    .subscribe(data => {
      this.currUsername = data
      console.log(data)
    })
  }
    
  

}
