import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/_services/auth.service';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }
  user: any
  security:any
  activeLink = 'dashboard'
  currRsvn : any;
  
  logOff() {
    this.authService.Logout()
   }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(
      token => {
        if (!token) {
          this.router.navigate(['login']);
        }
      
      }
    )
    this.authService.isUsername.subscribe(
      username => {
        this.user = username
      }
    )
    this.authService.isSecurity.subscribe(
      security => {
        this.security = security
      }
    )
    

  }




}


