import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@app/login/login.component';
import { DashboardComponent } from '@app/dashboard/dashboard.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },

];


@NgModule({
  declarations: [],
  imports: [
    
    RouterModule.forRoot(appRoutes,
      { onSameUrlNavigation: 'reload' }),


  ],
  exports: [
    RouterModule
  ]

})
export class AppRoutingModule { }

