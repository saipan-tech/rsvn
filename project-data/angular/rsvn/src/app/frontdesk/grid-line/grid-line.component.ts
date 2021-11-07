import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IRoom }from '@app/_interface/room';
import { IRsvn } from '@app/_interface/rsvn'
import { SystemService } from '@app/_services/system.service';

@Component({
  selector: 'app-grid-line',
  templateUrl: './grid-line.component.html',
  styleUrls: ['./grid-line.component.css']
})
export class GridLineComponent implements OnInit{

  @Input() room:any
  @Input() days = 0
  @Input() currDateStart = ''
  @Input() currRsvn = {} as IRsvn
  
  @Output() selected = new EventEmitter<any>();


  gridwidth = 0
  dayList: any
  
  constructor(
      private systemService:SystemService 
    ) { }
  
  
  selectCell(cell:any) {
    this.selected.emit(cell)
  }

  ngOnInit(): void {
    this.gridwidth = 100 / ( Number(this.days) + 1)
    this.dayList = this.systemService.daylister(this.currDateStart,this.days)
  }

}
