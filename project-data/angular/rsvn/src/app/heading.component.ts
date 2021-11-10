import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/_services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-heading',
  template:
    `
  <style>
  .rowlook {
    padding:1em;
    background-color:white;
  }
  </style>
  <div class="row rowlook" >
    <div class="col-5">
      <a href="/dashboard"><img src="/assets/img/rsvn.png" style="border:none;width:100px"></a>
      
    </div>
    <div class="col-2">
     <app-clock></app-clock>
    </div>
    <div class="col-3" style="text-align:right">
    <a href="/config" style="">Configuration</a>
    </div>
    <div class="col-2" style="text-align:right" >
        <button class="btn btn-outline-success" (click)="logOff()">Log Off</button>
        </div>
    </div>
`
})
export class HeadingComponent implements OnInit {

  constructor(

    private authService: AuthService,

    private router: Router,
  ) { }

  logOff() {
    this.authService.Logout()
    .subscribe(
      data => {
        this.router.navigate(['login']);

      }
    )

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
        
      }
    )
    this.authService.getSession().subscribe(
      data => console.log(data)
    )
      
  }


}
