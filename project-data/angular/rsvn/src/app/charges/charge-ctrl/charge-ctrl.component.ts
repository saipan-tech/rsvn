import { Component, Input, Output, OnChanges, OnInit, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { IRsvn } from '@app/_interface/rsvn';
@Component({
  selector: 'app-charge-ctrl',
  templateUrl: './charge-ctrl.component.html',
  styleUrls: ['./charge-ctrl.component.css']
})
export class ChargeCtrlComponent implements OnInit,OnChanges {

  constructor(
    

  ) { }

  @Input() currRsvn:IRsvn = {} as IRsvn
  



  ngOnChanges(changes : SimpleChanges) {
    console.log("Changing RSVN")
    this.ngOnInit()
  }

  //--------------------------
  ngOnInit(): void {
    
  }
}

