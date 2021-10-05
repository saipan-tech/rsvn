import { Component, Input, OnInit } from '@angular/core';
import { IRsvn } from '@app/_interface/rsvn';

@Component({
  selector: 'app-charge-list',
  templateUrl: './charge-list.component.html',
  styleUrls: ['./charge-list.component.css']
})
export class ChargeListComponent implements OnInit {
  
  
  @Input() currRsvn : any



  constructor() { }
  
  ngOnInit(): void {
  }

}
