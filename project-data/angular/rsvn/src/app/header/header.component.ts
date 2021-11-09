import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/_services/auth.service';
import { Router } from '@angular/router';

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

  logOff() {
    this.authService.logout()
    this.router.navigate(['login']);

  }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(
      token => {
        if (!token) {
          this.router.navigate(['login']);
        }
      }
    )
    this.authService.getSession().subscribe(
      data => this.user = data
    )

  }




}


