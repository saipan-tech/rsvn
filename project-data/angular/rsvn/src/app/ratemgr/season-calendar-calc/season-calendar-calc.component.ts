import { Component, Input, OnChanges, OnInit,  SimpleChanges } from '@angular/core';
import { SystemService } from '@app/_services/system.service';
import { IDropdown } from '@app/_interface/dropdown';
import { SeasonService } from '@app/_services/season.service';
import { ISeasonCal } from '@app/_interface/seasoncal';
import { GenericService } from '@app/_services/generic.service';
import { ISeason } from '@app/_interface/season';
import { catchError, tap, map, mergeMap, concatMap } from 'rxjs/operators';
import { ICalendar } from '@app/_interface/calendar';

@Component({
  selector: 'app-season-calendar-calc',
  templateUrl: './season-calendar-calc.component.html',
  styleUrls: ['./season-calendar-calc.component.scss']
})
export class SeasonCalendarCalcComponent implements OnInit, OnChanges {

  constructor(
    private systemService: SystemService,
    private seasonService: SeasonService,
    private genericService: GenericService

  ) { }
  rackAccum: any = {}
  seasonCount: any = {}
  seasonList: any[] = []
  rateList: any[] = []
  tallySheet: any[] = []
  tallyTotal:number =  0
  @Input() currCal:any



  //===========================================================
  seasonTally(accum:any) {
    let tallySheet:any = []
    let seasonCount:any = {}
    this.tallyTotal =  0
    this.currCal.forEach((cc:any) => {
      if (!seasonCount[cc.season]) seasonCount[cc.season] = 0
      seasonCount[cc.season] += 1
    })
    this.seasonCount = seasonCount
    this.seasonList.forEach(
      (sl:any) => {
         
        let total = accum.total*seasonCount[sl.name]*sl.discount
        //      let total = Number(accum[sl.name]) * Number(seasonCount[sl.name])
       tallySheet.push({name:sl.name, count:seasonCount[sl.name], accum:total  }) 
       if(total) {
        this.tallyTotal += Number(total)
       } 
      }
    )
      this.tallySheet =tallySheet
  }
 
  //===========================================================
  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit()
  }
  //===========================================================
  ngOnInit(): void {
   
    let rackAccum: any = { total: 0 }

    this.genericService.getItemList("season")
      .pipe(
        tap(r => this.seasonList = r),
        concatMap(() => this.genericService.getItemList('rate')),
        tap(rate => this.rateList = rate),
        concatMap(() => this.genericService.getItemList("roominfo")),
        map(data => {
          data.forEach((d: any) => {
            let rate = this.rateList.find((rl: any) => rl.alias == d.rateAlias)
            if (!rackAccum[d.rateAlias]) {
              rackAccum[d.rateAlias] = 0
            }
            rackAccum[d.rateAlias] += Number(rate.rack)
            rackAccum.total += Number(rate.rack)
          })
          return rackAccum
        }))
      .subscribe(d => {
// This gives us one day rack rate  split among rate types
        this.seasonTally(d)
        

      }
      )
  }




}
