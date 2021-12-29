import { Component, OnInit } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { IRoominfo } from '@app/_interface/roominfo';
import { AuthService } from '@app/_services/auth.service';
import { SystemService } from '@app/_services/system.service';
import { RoomService } from '@app/_services/room.service';
import { AppConstants } from '@app/app.constants';
@Component({
  selector: 'app-action-matrix',
  templateUrl: './action-matrix.component.html',
  styleUrls: ['./action-matrix.component.scss']
})
export class ActionMatrixComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private roomService: RoomService,
    private authService: AuthService,

    private appCons: AppConstants,


  ) { }

  user:any
  roomList:any;

  ngOnInit(): void {
    this.authService.getSession().subscribe(
      data => this.user = data
    )

    this.genericService.getItemQueryList('roominfo',`all=1`)
      .subscribe(data => {
        this.roomList = data
        console.log(data)
      })
    }
}
