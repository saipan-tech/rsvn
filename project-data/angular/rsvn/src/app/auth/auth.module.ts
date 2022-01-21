import { ModuleWithProviders,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from "@angular/material/card";



import { NewLoginComponent } from './login/login.component';
import {RouterModule} from "@angular/router";
import { StoreModule } from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {AuthService} from "./service/auth.service";
import {authReducer} from './reducers';
import * as fromAuth from './reducers';

import {AuthEffects} from './store//auth.effects';


@NgModule({
  declarations: [NewLoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild([{path: 'newlogin', component: NewLoginComponent}]),
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects])

  ],
  exports: [NewLoginComponent]

})
export class AuthModule { 

  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
        ngModule: AuthModule,
        providers: [
          AuthService,
//            AuthGuard
        ]
    }
}


}
