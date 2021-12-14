import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

 @Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('arrivals', {static: false})
  arrivals!: ElementRef;

  constructor(private router: Router) { }
  
  ngOnInit(): void {
  } 
}



