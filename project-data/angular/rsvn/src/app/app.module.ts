import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppConstants } from '@app/app.constants';
import { AppEnv } from '@app/_helpers/appenv';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { BldgListComponent } from '@app/config/bldg-list/bldg-list.component';
import { RoomListComponent } from '@app/config/room-list/room-list.component';
import { AmenityListComponent } from '@app/config/amenity-list/amenity-list.component';
import { ConfigComponent } from '@app/config/config.component';
import { CafeComponent } from './cafe/cafe.component';
import { ToursComponent } from './tours/tours.component';
import { DropdownComponent } from './config/dropdown/dropdown.component';
import { FrontdeskModule } from '@app/frontdesk/frontdesk.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GuestListComponent } from './config/guest-list/guest-list.component';
import { AdminModule } from '@app/admin/admin.module';
import { HeaderComponent } from './header/header.component';
//import { CarouselModule } from 'ngx-bootstrap/carousel';
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
 
import { room2sReducer } from '@app/_state/room2.reducer';
import { collectionReducer } from '@app/_state/collection.reducer';
import { StoreModule } from '@ngrx/store';
import { Room2ListComponent } from './room2-list/room2-list.component';
import { Room2CollectionComponent } from './room2-collection/room2-collection.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    BldgListComponent,
    RoomListComponent,
    AmenityListComponent,
    ConfigComponent,
    CafeComponent,
    ToursComponent,
    DropdownComponent,
    GuestListComponent,
    HeaderComponent,
    RoomListItemComponent,
    Room2ListComponent,
    Room2CollectionComponent
    
  

  ],
  
  imports: [
    StoreModule.forRoot({ room2s: room2sReducer, collection: collectionReducer}),
    SharedModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FrontdeskModule,
    AdminModule,
    RatemgrModule,
    
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatFormFieldModule,
  
  ],
  
  providers: [authInterceptorProviders,AppEnv,AppConstants],
  bootstrap: [AppComponent]

})
export class AppModule { }
