import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppConstants } from '@app/app.constants';
import { AppEnv } from '@app/_helpers/appenv';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { BldgListComponent } from '@app/config/bldg-list/bldg-list.component';
import { RoomListComponent } from '@app/config/room-list/room-list.component';
import { AmenityListComponent } from '@app/config/amenity-list/amenity-list.component';
import { ConfigComponent } from '@app/config/config.component';

import { ToursComponent } from './tours/tours.component';
import { DropdownComponent } from './config/dropdown/dropdown.component';
import { FrontdeskModule } from '@app/frontdesk/frontdesk.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GuestListComponent } from './config/guest-list/guest-list.component';
import { AdminModule } from '@app/admin/admin.module';
import { HeaderComponent } from './header/header.component';
import { RatemgrModule } from './ratemgr/ratemgr.module';
import { SharedModule } from '@app/shared/shared.module';
import { RoomListItemComponent } from './config/room-list/room-list-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule} from '@angular/material/autocomplete'
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule} from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../environments/environment';


import { AuthModule } from '@app/auth/auth.module'
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { EntityDataModule } from '@ngrx/data';
import { RouterStateSnapshot } from '@angular/router';
import { metaReducers,reducers } from './reducers';
import { AuthGuard } from './auth/auth.guard';
import { RoomsModule } from './rooms/rooms.module';
import { entityConfig } from './entity-metadata';



@NgModule({
  declarations: [
    AppComponent,

    DashboardComponent,
    BldgListComponent,
    RoomListComponent,
    AmenityListComponent,
    ConfigComponent,
    ToursComponent,
    DropdownComponent,
    GuestListComponent,
    HeaderComponent,
    RoomListItemComponent,
    
    
    
  

  ],
  
  imports: [
    SharedModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule.forRoot(),
    
    FrontdeskModule,
    AdminModule,
    RatemgrModule,
    AuthModule,
    RoomsModule,
    
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatFormFieldModule,
    
    
    
    
    StoreModule.forRoot(reducers,{
      metaReducers,

      runtimeChecks : {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictStateSerializability:true
    }

    } ),
    EffectsModule.forRoot([]),

    //EntityDataModule.forRoot({}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal
    }),
    EntityDataModule.forRoot(entityConfig),
  //  StoreModule.forRoot({}, {}),
  //  StoreRouterConnectingModule.forRoot(),
  //  StoreRouterConnectingModule.forRoot(),

  
  ],
  
  providers: [authInterceptorProviders,AppEnv,AppConstants,AuthGuard],
  bootstrap: [AppComponent]

})
export class AppModule { }
