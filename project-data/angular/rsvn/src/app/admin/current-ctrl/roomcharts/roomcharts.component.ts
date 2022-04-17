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
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-roomcharts',
  templateUrl: './roomcharts.component.html',
  styleUrls: ['./roomcharts.component.scss']
})
export class RoomchartsComponent implements OnInit {


  @Input() currRoominfo: IRoominfo = {} as IRoominfo
  dataSet$: any
  graphType:any = []
  dateStart :string =''
  dateEnd : string =''

  constructor(
    private roomService: RoomEntityService,
    private roominfoService: RoominfoEntityService,
    private systemService: SystemService,
    private bldgService: BldgEntityService,
    private genericService : GenericService

  ) { }


  chartCtrlForm = new FormGroup({
    chartSpan: new FormControl('all'),
    dateStart: new FormControl(''),
    dateEnd: new FormControl('')
  
  })

  chartData: any = []
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
    
    ]}
    return chart
  }
  //========================================
  reload() {

    let roomStats$ = this.roominfoService.entities$.pipe(
      concatMap(roominfo => this.roomService.activeRoom$(this.dateStart,this.dateEnd).pipe(
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


   let dataSet$ = this.roominfoService.bldgRoominfo$(roomStats$).pipe(
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
    dataSet$.subscribe(d=>this.dataSet$ =d) 
  }


  //========================================
  manualDate() {
    this.dateStart = this.systemService.fromHTMLDate(this.chartCtrlForm.value.dateStart)
    this.dateEnd = this.systemService.fromHTMLDate(this.chartCtrlForm.value.dateEnd)
    this.chartCtrlForm.patchValue({chartSpan:"custom"})
    
  }
  //========================================
setDates(x:string) {
  let _today = new Date()
  let Today = _today.toISOString().slice(0,10)
  let year = new Date().getFullYear()
  switch(x) {
    case 'all':
      this.dateStart = "2019-01-01"
      this.dateEnd = Today
      break;
    case 'curr30days':
      this.dateEnd = Today
      this.dateStart = new Date(this.systemService.dayDelta(Today,-30)).toISOString().slice(0,10)
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
    this.chartCtrlForm.patchValue({dateStart:this.dateStart,dateEnd:this.dateEnd}) 

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



