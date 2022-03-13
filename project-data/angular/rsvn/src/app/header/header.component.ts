import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { currUser, isLoggedIn, isLoggedOut } from '@app/auth/store/auth.selectors';
import { ThemePalette } from '@angular/material/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'
import { AppState } from "@app/reducers"
import { logout, login } from '@app/auth/store/auth.actions';
import { IStaff } from '@app/_interface/staff';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  currUser: IStaff = {} as IStaff
  isLoggedIn$: Observable<boolean> = of(false)

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) { }
  user: any
  security: any
  activeLink = 'dashboard'

  logOff() {
    this.store.dispatch(logout())
  }

  ngOnInit(): void {
    const userProfile = localStorage.getItem("user");

    if (userProfile) {
      this.store.dispatch(login({ user: JSON.parse(userProfile) }));
    }

    this.store.pipe(select(currUser))
      .subscribe(u => this.currUser = u)

    this.isLoggedIn$ = this.store
      .pipe(
        select(isLoggedIn)
      );




  }




}


