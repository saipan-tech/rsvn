import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
 
  constructor() { }
  status: boolean = false;
  mode:string = "room"
  
  clickEvent(){
      this.status = !this.status;       
  }
  
  currBldg : any;
 
  ngOnInit(): void {
  }

}
