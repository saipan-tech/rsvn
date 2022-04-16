import { Component, OnInit } from '@angular/core';
import { IRoominfo } from '@app/_interface/roominfo';
import { EChartsOption } from 'echarts';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { SystemService } from '@app/_services/system.service';
import { concatMap, map, tap } from 'rxjs/operators';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { Observable, of } from 'rxjs';
import { GenericService } from '@app/_services/generic.service';

@Component({
  selector: 'app-current-ctrl',
  templateUrl: './current-ctrl.component.html',
  styleUrls: ['./current-ctrl.component.scss']
})
export class CurrentCtrlComponent implements OnInit {

  currRoominfo: IRoominfo = {} as IRoominfo

  constructor(
  ) { }

  //========================================

  ngOnInit(): void {
 
  }


}
