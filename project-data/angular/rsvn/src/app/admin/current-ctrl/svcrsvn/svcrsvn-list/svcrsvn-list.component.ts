import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ICalendar } from '@app/_interface/calendar';
import { ISvcRsvn } from '@app/_interface/svcrsvn';
import { SvcrsvnEditComponent } from '@app/admin/current-ctrl/svcrsvn/svcrsvn-edit/svcrsvn-edit.component'
import { IRoominfo } from '@app/_interface/roominfo';
import { GenericService } from '@app/_services/generic.service';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { RoominfoDataService } from '@app/_ngrxServices/roominfo-data.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';


@Component({
  selector: 'app-svcrsvn-list',
  templateUrl: './svcrsvn-list.component.html',
  styleUrls: ['./svcrsvn-list.component.scss']
})
export class SvcrsvnListComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private genericService: GenericService,
    private roominfoService: RoominfoEntityService,
    private bldgService: BldgEntityService,
    private roomService: RoomEntityService

  ) { }

  currSvcRsvn: ISvcRsvn = {} as ISvcRsvn
  svcList$: Observable<any[]> = of([])
  warnSet$: Observable<any> = of()

  @Input() currRoominfo: IRoominfo = {} as IRoominfo

  //--------------------------
  openDialog(currSvcRsvn: ISvcRsvn) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = [];
    dialogConfig.minWidth = '25%';
    dialogConfig.width = '90%';
    dialogConfig.data = {
      currSvcRsvn: currSvcRsvn
    }
    const dialogRef = this.dialog.open(SvcrsvnEditComponent, dialogConfig)
    dialogRef.afterClosed()
      .subscribe(
        data => {
          this.currSvcRsvn = data;
          this.ngOnInit()
        }
      )
  }
  editSvcrsvn(svc: ISvcRsvn) {
    this.currSvcRsvn = svc
    this.openDialog(svc)
  }

  reload() {

    this.warnSet$ = this.roomService.activeRoom$(this.currSvcRsvn.dateIn, this.currSvcRsvn.dateOut).pipe(
      map(warn => {
        let warnSet = new Set()
        warn.forEach(w => warnSet.add(w.roominfo))
        return warnSet
      })
    )
    this.svcList$ =  this.genericService.getItemList('svcrsvn').pipe(
        concatMap(svclist => this.roominfoService.entities$.pipe(
          concatMap(roominfos => this.bldgService.entities$.pipe(
            map(bldg => {
              svclist.map(
                sl => {
                  sl.roomlist = []
                  sl.roominfos.split(",").forEach(
                    (ss: any) => {
                      let ri: any = roominfos.find(ro => ro.id == ss)
                      let bl: any = bldg.find(bb => bb.id == ri.bldg)
                      sl.roomlist.push({
                        id: ss,
                        number: ri.number,
                        bldg: bl.abbrev,
                   
                      })
                    }
                  )
                  sl.roomlist.sort((a: any, b: any) => (a.bldg.localeCompare(b.bldg) || a.number.localeCompare(b.number)));
                })
              console.log(svclist)
              return svclist
            }
        ))
      ))
    ))
  }







  ngOnInit(): void {
    this.reload()
  }

}
