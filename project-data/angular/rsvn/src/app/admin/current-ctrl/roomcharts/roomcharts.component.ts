import { Component, Input, OnInit } from '@angular/core';
import { IRoominfo } from '@app/_interface/roominfo';
import { EChartsOption } from 'echarts';
import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { SystemService } from '@app/_services/system.service';
import { concatMap, map, tap } from 'rxjs/operators';
import { BldgEntityService } from '@app/_ngrxServices/bldg-entity.service';
import { from, Observable, of } from 'rxjs';
import { GenericService } from '@app/_services/generic.service';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { ISeasonCal } from '@app/_interface/seasoncal';
import { IRate } from '@app/_interface/rate';
import { ICharge } from '@app/_interface/charge';

@Component({
  selector: 'app-roomcharts',
  templateUrl: './roomcharts.component.html',
  styleUrls: ['./roomcharts.component.scss']
})
export class RoomchartsComponent implements OnInit {


  @Input() currRoominfo: IRoominfo = {} as IRoominfo
  dataSet$: any
  graphType: any = []
  dateStart: string = ''
  dateEnd: string = ''
  daystack: any = []
  roomsSum: any
  stats: any

  constructor(
    private roomService: RoomEntityService,
    private roominfoService: RoominfoEntityService,
    private systemService: SystemService,
    private bldgService: BldgEntityService,
    private genericService: GenericService

  ) { }


  chartCtrlForm = new FormGroup({
    chartSpan: new FormControl('all'),
    dateStart: new FormControl(''),
    dateEnd: new FormControl('')

  })

  chartData: any = []
  //========================================

  makeChart(dataSet: any) {

    let chart =
    {
      xAxis: {
        type: 'category',
        data: dataSet.xdata,
      },
      yAxis: [
        {
          type: 'value',
          name: 'Days',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: 'blue'
            }
          },
          axisLabel: {
            formatter: '{value} days'
          }
        },
        {
          type: 'value',
          name: 'Revenue',
          position: 'right',
          alignTicks: true,
          offset: 80,
          axisLine: {
            show: true,
            lineStyle: {
              color: 'green'
            }
          },
          axisLabel: {
            formatter: '$ {value}'
          }
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      series: [
        { name: "Days", data: dataSet.series1, type: 'bar' },
        { name: "Revenue", yAxisIndex: 1, data: dataSet.series2, type: 'line' }

      ]
    }
    return chart
  }
  //========================================
  reload() {

    let total_daily = 0
    this.daystack = this.systemService.daySpanSeq(this.dateStart, this.dateEnd)

    let roomStack$ = this.roominfoService.entities$.pipe(
      concatMap(roominfo => this.roomService.activeRoom$(this.dateStart, this.dateEnd).pipe(
        concatMap(rooms => this.genericService.getItemList("roomcharge").pipe(
          map(charges => {
            let result: any = []
            roominfo.forEach(ri => {
             let rms: any = []
              let total_days = 0
              let total_charge = 0
              rooms.filter((r: any) => r.roominfo == ri.id).map((rm: any) => {
                let days = this.systemService.daySpan(rm.dateIn, rm.dateOut)
                let chrg = charges.filter((c: any) => c.room == rm.id)
                let record = { ...rm, days, chrg }
                total_days += days
                rms.push(record)
              })
            })

            return result
          })
        )))))





    let roomStats$ = this.roominfoService.entities$.pipe(
      concatMap(roominfo => this.roomService.activeRoom$(this.dateStart, this.dateEnd).pipe(
        concatMap(rooms => this.genericService.getItemList("roomcharge").pipe(
          map(charges => {
            let result: any = []
            roominfo.forEach(ri => {

              let rms: any = []
              let total_days = 0
              let total_charge = 0
              rooms.filter((r: any) => r.roominfo == ri.id).map((rm: any) => {
                let days = this.systemService.daySpan(rm.dateIn, rm.dateOut)
                let chrg = charges.filter((c: any) => c.room == rm.id).reduce((prev, curr) => {
                  return Number(prev) + Number(curr.amount)
                }, 0)
                total_charge += chrg
                let record = { ...rm, days, chrg }
                total_days += days
                rms.push(record)
              })

              result.push({
                ...ri,
                rooms: rms,
                total_days,
                total_charge,
                total_rsvns: rms.length
              })
            })
            console.log(result)
            return result
          })
        )))))




    let dataSet$ = this.roominfoService.bldgRoominfo$(roomStats$).pipe(
      map(bld => {
        bld.forEach(
          (b: any) => {
            b.xdata = []
            b.series1 = []
            b.series2 = []
            b.roominfo.forEach((bri: any) => {
              b.xdata.push(bri.number)
              b.series1.push(bri.total_days)
              b.series2.push(bri.total_charge)

            })
            b.graph = this.makeChart(b)
            b.total_days = b.roominfo.reduce((prev: any, curr: any) => {
              return Number(prev) + Number(curr.total_days)
            }, 0)
            b.total_charges = b.roominfo.reduce((prev: any, curr: any) => {
              return Number(prev) + Number(curr.total_charge)
            }, 0)
            b.day_span = this.systemService.daySpan(this.dateStart, this.dateEnd)
            b.occupancy = b.total_days / (b.day_span * b.roominfo.length)
          }

        )
        return bld

      })
    )




    // this gives us a daily room value    
    this.roominfoService.bldgRoominfo$(this.roominfoService.entities$).pipe(
      concatMap((bldg) => this.genericService.getItemList('rate').pipe(
        concatMap((rate) => this.genericService.getItemQueryList('seasoncal',`dateStart=${this.dateStart}&dateEnd=${this.dateEnd}`).pipe(
          concatMap((cal) => this.genericService.getItemList('season').pipe(
            concatMap((season) => this.roomService.activeRoom$(this.dateStart, this.dateEnd).pipe(
              concatMap((rooms) => this.genericService.getItemList("roomcharge").pipe(
                map((charges) => {
                  bldg.map((bld: any) => {
                    let result: any = []
                    // grab all rooms and charges
                    bld.roominfo.forEach((ri: any) => {
                      let rms: any = []
                      let rs = rooms.filter((r: any) => r.roominfo == ri.id)
                      ri.rooms = rs
                      rs.map((rm: any) => {
                        charges.filter((c: any) => c.room == rm.id)
                          .map((chg:any) => {
                            let xx = cal.find(c => c.date == chg.date)
                            if(xx && xx.season)
                            rms.push({
                              season: xx.season,
                              amount: chg.amount, date: chg.date
                            })
                          })
                      })
                      ri.roomDates = rms
                      // from here let's create a roomSeason breakdown for stacked bar graph
                      ri.roomSeasons = {}
                      season.map(seas => {
                          ri.roomSeasons[seas.name] = {}
                          ri.roomSeasons[seas.name].list = ri.roomDates.filter((rd:any) => rd.season == seas.name ) 
                      })

                    })
                    // Rate alias List  counts the  rates perbldg Deluxe1 Presidential etc
                    
 
                  })


                  return bldg
                })
              ))))))))))).subscribe(data => {
                this.stats = data
                console.log(data)
              })





    this.dataSet$ = dataSet$



  }

  manualDate() {
    this.dateStart = this.systemService.fromHTMLDate(this.chartCtrlForm.value.dateStart)
    this.dateEnd = this.systemService.fromHTMLDate(this.chartCtrlForm.value.dateEnd)
    this.chartCtrlForm.patchValue({ chartSpan: "custom" })

  }
  //========================================
  setDates(x: string) {
    let _today = new Date()
    let Today = _today.toISOString().slice(0, 10)
    let year = new Date().getFullYear()
    switch (x) {
      case 'all':
        this.dateStart = "2019-01-01"
        this.dateEnd = Today
        break;
      case 'curr30days':
        this.dateEnd = Today
        this.dateStart = new Date(this.systemService.dayDelta(Today, -30)).toISOString().slice(0, 10)
        break;
      case 'curryear':
        this.dateStart = `${year}-01-01`
        this.dateEnd = Today
        break;
      case 'lastyear':
        this.dateStart = `${year - 1}-01-01`
        this.dateEnd = `${year - 1}-12-31`
        break;
    }
    //    this.systemService.toHTMLDate(new Date(this.dateEnd))    
    this.chartCtrlForm.patchValue({ dateStart: this.dateStart, dateEnd: this.dateEnd })

  }


  //========================================

  ngOnInit(): void {
    this.setDates('all')
    this.reload()
    this.systemService.getDropdownList('graphType').subscribe(
      data => this.graphType = data
    )

    this.chartCtrlForm.get('chartSpan')?.valueChanges.subscribe(
      x => {
        this.setDates(x)
        this.reload()

      }
    )


  }


}



/*
    let roomsDaily$ = this.roominfoService.entities$.pipe(
      map(roominfos => {
        return roominfos.reduce((a: any, b: any) =>
          (a[b.rateAlias] = (a[b.rateAlias] || 0) + 1, a), {})
      }),
      concatMap((rateAliasList) => this.genericService.getItemList('rate').pipe(
        map(rate => {
          rate.map(r => r.total = r.rack * rateAliasList[r.alias])
          return rate.reduce((a, b) => a + (b.total ? b.total : 0), 0)

        }),
        concatMap((dailyRev => this.genericService.getItemQueryList('seasoncal',`dateStart=${this.dateStart}&dateEnd=${this.dateEnd}`).pipe(
         concatMap((cal => this.genericService.getItemList('season').pipe(
         map(season => {
           console.log(season,cal,dailyRev,rateAliasList)
         })
          )
         )
         )
        )))))).subscribe()







        // this gives us a daily room value    
        let roominfoTotals$ = this.roominfoService.entities$.pipe(
          map(roominfos => {
            return roominfos.reduce((a: any, b: any) =>
              (a[b.rateAlias] = (a[b.rateAlias] || 0) + 1, a), {})
          }),
          concatMap((rateAliasList) => this.genericService.getItemList('rate').pipe(
            map(rate => {
              rate.map(r => r.total = r.rack * rateAliasList[r.alias])
              total_daily = rate.reduce((a, b) => a + (b.total ? b.total : 0), 0)
              return rate
            }),
            concatMap((rate => this.genericService.getItemQueryList('seasoncal', `dateStart=${this.dateStart}&dateEnd=${this.dateEnd}`).pipe(
              
              concatMap((cal => this.genericService.getItemList('season').pipe(
                map(season => {
                  let result:any = []
                  this.daystack.map( (date:string) => {
                    let found = cal.find(c => c.date == date)
                    if(found) result.push({...found}
                    )})
                    let total_found = result.reduce((a:any, b:any) =>
                    (a[b.season] = (a[b.season] || 0) + 1, a), {})
                    season.map(s => {
                      s.count = total_found[s.name]
                      s.total =(s.count ? s.count : 0) * s.discount * total_daily 
                    })
                    return ({season,total:season.reduce((a, b) => a + (b.total ? b.total : 0), 0)})
                })
              )))
            ))))))




                               let rateAliasList:any


                    rateAliasList = bld.roominfo.reduce((a: any, b: any) =>
                      (a[b.rateAlias] = (a[b.rateAlias] || 0) + 1, a), {})
                    
                      // creates a clean copy of rates  
                    bld.rate = JSON.parse(JSON.stringify(rate))
                    // multiply rack rate times number of units - gives rate total or max 
                    bld.rate.map((r: any) => {
                      r.total = 0
                      if (rateAliasList.hasOwnProperty(r.alias)) r.total = Number(r.rack) * Number(rateAliasList[r.alias])
                      r.count = rateAliasList[r.alias]
                    })
                    // we scan through and get our total
                    bld.total_daily = bld.rate.reduce((a: any, b: any) => a + (b.total || 0), 0)
                    
                    // Look through and aggreggate on season name
                    bld.calTotal = cal.reduce((a: any, b: any) =>
                      (a[b.season] = (a[b.season] || 0) + 1, a), {})
                    
                    bld.total_max_revenue = 0
                    season.map(seas => {
                      seas.total = bld.calTotal[seas.name] || 0
                      seas.max_revenue = seas.total * seas.discount * bld.total_daily
                      bld.total_max_revenue += seas.max_revenue
                    })
                    bld.season = season

                    // we now have rack rate total for each room set
                    // now we pump in the calendar and execute the discounts and we have a good total

        */