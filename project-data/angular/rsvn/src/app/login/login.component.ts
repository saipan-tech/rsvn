import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/_services/auth.service';
import {  FormGroup, FormControl,Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  
  formdata = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)

  });

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {
    localStorage.setItem('token','');
  }

  onSubmit(formdata:any) {
    this.authService.Login(formdata)
      .subscribe(
        data => {
          this.router.navigate(['dashboard']);
        }
      )
    }
  } 
  


  

