import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ratemgr-ctrl',
  templateUrl: './ratemgr-ctrl.component.html',
  styleUrls: ['./ratemgr-ctrl.component.scss']
})
export class RatemgrCtrlComponent implements OnInit {

  constructor(
    private router: Router,

  ) { }
  activeLink = 'seasoncal'
  user = ''
  ngOnInit(): void {
  }

}
