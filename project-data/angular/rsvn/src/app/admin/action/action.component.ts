import { Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  
  
  constructor() { }
  activeLink = 'actionmatrix'
  currRsvn:any

  
  selectedGuest(event:any) {
    
  }
  ngOnInit(): void {
  }

}
