import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IAction } from '@app/_interface/action';
@Component({
  selector: 'app-action-manager',
  templateUrl: './action-manager.component.html',
  styleUrls: ['./action-manager.component.scss']
})
export class ActionManagerComponent implements OnInit {
  
  
  @Input() actionRec: IAction = {} as IAction

  constructor() { }



  ngOnInit(): void {
  }

}
