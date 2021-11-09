import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ThemePalette} from '@angular/material/core';

 @Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  links = ['Front Desk', 'Housekeeping', 'Maintenance','Administration'];
  activeLink = this.links[0];
  background = '#232323'

  constructor(
    private router: Router,

  ) { }
  

  
  ngOnInit(): void {
    } 
}



