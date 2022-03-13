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


import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';


import { environment } from '../environments/environment';
import { AuthModule } from '@app/auth/auth.module'
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { DefaultDataServiceConfig, EntityDataModule } from '@ngrx/data';
import { RouterStateSnapshot } from '@angular/router';
import { metaReducers, reducers } from './reducers';
import { AuthGuard } from './auth/auth.guard';
import { entityConfig } from './entity-metadata';

import { EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { RouterModule, Routes } from '@angular/router';

import { RoominfoEntityService } from '@app/_ngrxServices/roominfo-entity.service';
import { RoominfoDataService } from '@app/_ngrxServices/roominfo-data.service';
import { RoominfoResolver } from '@app/_ngrxServices/roominfo-resolver';

import { RoomEntityService } from '@app/_ngrxServices/room-entity.service';
import { RoomResolver } from '@app/_ngrxServices/room-resolver';
import { RoomDataService } from '@app/_ngrxServices/room-data.service';
import { RsvnEntityService } from '@app/_ngrxServices/rsvn-entity.service';
import { RsvnResolver } from '@app/_ngrxServices/rsvn-resolver';
import { RsvnDataService } from '@app/_ngrxServices/rsvn-data.service';


import { GuestEntityService } from '@app/_ngrxServices/guest-entity.service';
import { GuestResolver } from '@app/_ngrxServices/guest-resolver';
import { GuestDataService } from '@app/_ngrxServices/guest-data.service';

import { BldgEntityService } from './_ngrxServices/bldg-entity.service';
import { BldgResolver } from './_ngrxServices/bldg-resolver';
import { BldgDataService } from './_ngrxServices/bldg-data.service';

import { ActionEntityService } from './_ngrxServices/action-entity.service';
import { ActionResolver } from './_ngrxServices/action-resolver';
import { ActionDataService } from './_ngrxServices/action-data.service';


import { MatrixComponent } from './matrix/matrix.component';
import { MatrixLineComponent } from './matrix/matrix-line/matrix-line.component';
import { MatrixViewComponent } from './matrix/matrix-view/matrix-view.component';

const entityMetadata: EntityMetadataMap = {
  Roominfo: {},
  Room : {},
  Rsvn : {},
  Guest : {},
  Bldg : {},
  Action: {}
};





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
    MatrixComponent,
    MatrixLineComponent,
    MatrixViewComponent,





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
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatFormFieldModule,




    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionSerializability: false,
        strictStateSerializability: true
      }
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    //    StoreRouterConnectingModule.forRoot({
    //      stateKey: 'router',
    //      routerState: RouterState.Minimal
    //    }),
    EntityDataModule.forRoot(entityConfig),
  ],

  providers: [
    authInterceptorProviders, 
    AppEnv, 
    AppConstants, 
    AuthGuard,
    RoominfoEntityService,
    RoominfoResolver,
    RoominfoDataService,

    RoomEntityService,
    RoomResolver,
    RoomDataService,
    
    RsvnEntityService,
    RsvnResolver,
    RsvnDataService,

  
    GuestEntityService,
    GuestResolver,
    GuestDataService,

    BldgEntityService,
    BldgResolver,
    BldgDataService,

    ActionEntityService,
    ActionResolver,
    ActionDataService


  ],
  bootstrap: [AppComponent]

})
export class AppModule { 

  constructor(
    private eds: EntityDefinitionService,

    private entityDataService: EntityDataService,
    
    private roomDataService: RoomDataService,
    private roominfoDataService: RoominfoDataService,
    private rsvnDataService: RsvnDataService,
    private guestDataService: GuestDataService,
    private bldgDataService: BldgDataService,
    private actionDataService: ActionDataService,
    
    private appEnv: AppEnv 
    ) {
    
    eds.registerMetadataMap(entityMetadata);
    entityDataService.registerService('Roominfo', roominfoDataService);
    entityDataService.registerService('Rsvn', rsvnDataService);
    entityDataService.registerService('Room', roomDataService);
    entityDataService.registerService('Guest', guestDataService);
    entityDataService.registerService('Bldg', bldgDataService);
    entityDataService.registerService('Action', actionDataService);
  
}



}
