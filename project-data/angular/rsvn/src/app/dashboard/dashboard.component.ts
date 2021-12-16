import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GenericService } from '@app/_services/generic.service';

 @Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('arrivals', {static: false})
  arrivals!: ElementRef;

  public today = new Date().toISOString().slice(0, 10)

  constructor(
    private router: Router,
    private genericService: GenericService
  ) { }
  
  ngOnInit(): void {
    this.genericService.getItemQueryList('rsvn', `future=${this.today}`).subscribe((response)=> {
      console.log('RESPONSE: ', response)
    });
  } 
}



