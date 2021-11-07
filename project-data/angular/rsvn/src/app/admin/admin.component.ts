import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor() { }
  links = ['Housekeeping', 'Maintenance', 'Deliveries'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;
  cellMenu = ["dirty","cleaning","done"]

  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }

  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }

  ngOnInit(): void {
  }

}
