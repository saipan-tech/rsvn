import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ThemePalette} from '@angular/material/core';
 @Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('arrivals', {static: false})
  arrivals: any;

  constructor(
    private router: Router,

  ) { }
  

  
  ngOnInit(): void {
    } 
}



