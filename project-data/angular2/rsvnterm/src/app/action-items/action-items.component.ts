import { Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { SystemService } from '@app/_services/system.service';
import { AuthService } from '@app/_services/auth.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { IAction } from '@app/_interface/action';
import { IRoominfo } from '@app/_interface/roominfo';
import { IDropdown } from '@app/_interface/dropdown';
import { catchError, tap, map, concatMap,mergeMap } from 'rxjs/operators';
import { IStaff } from '@app/_interface/staff';
import { RoomService } from '@app/_services/room.service';

@Component({
  selector: 'app-action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.scss']
})
export class ActionItemsComponent implements OnInit {

  constructor(
    private genericService: GenericService,
    private systemService: SystemService,
    private roomService: RoomService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  @Input() currUsername : any
  actionRec: any
  today = new Date().toISOString().slice(0,10)
  roominfos: IRoominfo[] = []
  actionList: IAction[] = []
  currRoominfos:any[] = []
  bldgList:any[] = []
  todayAction : any[] = []
  dispList:any[] = []  
  
  
 
  //================================================
 
  buildDisplay():void {
   let _dispList:any[] = []
   this.dispList = []
   let _bldg = new Set()
   this.todayAction.forEach(
      ta => {
         ta.roominfos.forEach(
         (ri:any) => {
           _bldg.add(ri.bldg.name) 
           _dispList.push({ item:ta.item, descr:ta.descr, started:ta.started, completed:ta.completed,  
                              actionid:ta.id, continuous:ta.continuous,assigned:ta.assignedBy,
                              info:ri,date:ta.date })     
         })
      }

   )
   _dispList = this.sortList(_dispList)
   _bldg.forEach(
      bldg => {
         let rec = { bldg:bldg,items:_dispList.filter(d => d.info.bldg.name == bldg) }
         this.dispList.push(rec)
      
      }   
   )
   console.log(this.dispList)
  }

  //================================================
  sortList(rlist: any) {
    rlist.sort(function (a: any, b: any) {
      var A = a.info.number; 
      var B = b.info.number;
      if (A < B) { return -1; }
      if (A > B) { return 1; }
      return 0;
    });
    return rlist
  }

  //================================================
statusMark(roominfoid:number,status:string){
   console.log(roominfoid,status)
   let _ri:any
   this.genericService.getItem( 'roominfo',roominfoid ).
      pipe(
         tap( ri => {
         _ri = ri
         ri.status = status
    }),
   concatMap(ri => this.genericService.updateItem('roominfo',ri) ),
   tap( nri => console.log(nri) )
   
   ).subscribe(
   nri2 => {
     console.log(nri2)
     this.ngOnInit()
   }
   ) 
}

  //================================================
  ngOnInit(): void {
    console.log(this.today)
    this.actionList=[]
    this.todayAction = []
    this.genericService.getItemQueryList("action",`username=${this.currUsername}&all`)
      .pipe(
        tap(data => {
          this.actionList = data
          data.forEach(x => {
            if(x.date == this.today || x.continuous) this.todayAction.push(x)
          })
          this.buildDisplay()
        }
          ),

      ).subscribe()
    }
}

