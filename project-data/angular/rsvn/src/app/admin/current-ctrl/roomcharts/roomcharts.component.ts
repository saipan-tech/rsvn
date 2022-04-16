import { Component, Input, OnInit } from '@angular/core';
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
  selector: 'app-roomcharts',
  templateUrl: './roomcharts.component.html',
  styleUrls: ['./roomcharts.component.scss']
})
export class RoomchartsComponent implements OnInit {


  @Input() currRoominfo: IRoominfo = {} as IRoominfo
  dataSet$: Observable<any> = of()

  constructor(
    private roomService: RoomEntityService,
    private roominfoService: RoominfoEntityService,
    private systemService: SystemService,
    private bldgService: BldgEntityService,
    private genericService : GenericService

  ) { }




  chartData: any = []
  //========================================
  chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'bar',
      },
    ],

  };

  //========================================
  chartTemplate: EChartsOption = {
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [{ data: [], type: 'bar' }],

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    }
  }

  //========================================

  makeChart(dataSet:any) {

    let chart =   
    { xAxis: {
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
            color: 'green'
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
            color: 'blue'
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
    
    ]}
    return chart
  }
  //========================================
  reload() {

    let roomStats$ = this.roominfoService.entities$.pipe(
      concatMap(roominfo => this.roomService.entities$.pipe(
        concatMap( rooms => this.genericService.getItemList("roomcharge").pipe(
        map(charges  => {
          let result: any = []
          roominfo.forEach(ri => {
            
            let rms: any = []
            let total_days = 0
            let total_charge = 0
            rooms.filter(r => r.roominfo == ri.id).map((rm: any) => {
              let days = this.systemService.daySpan(rm.dateIn, rm.dateOut)
              let chrg = charges.filter((c:any) => c.room == rm.id ).reduce((prev,curr) => {
                return Number(prev) + Number(curr.amount)},0)
              total_charge += chrg
              let record = {...rm,days,chrg}
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

          return result
        })
      )))))


    this.dataSet$ = this.roominfoService.bldgRoominfo$(roomStats$).pipe(
      map(bld => {
        bld.forEach(
          (b:any) => {
            b.xdata = []
            b.series1 = []
            b.series2 = []
            b.roominfo.forEach((bri:any) =>{
               b.xdata.push(bri.number)
               b.series1.push(bri.total_days)
               b.series2.push(bri.total_charge)

            } )
            b.graph = this.makeChart(b)
          }
        
          )
          console.log(bld)
        return bld

      })
    )

  }
  //========================================

  ngOnInit(): void {
    this.reload()
 
  }


}



