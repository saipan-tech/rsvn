import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule} from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { AppConstants } from '@app/app.constants';
import { AppEnv } from '@app/_helpers/appenv';
import { ClockComponent } from '@app/system/clock/clock.component';
import { LoginComponent } from './login/login.component';
import { GridSelectComponent } from './grid-select/grid-select.component';
import { ActionItemsComponent } from './action-items/action-items.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CurrGridComponent } from './curr-grid/curr-grid.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    CurrGridComponent,
    HeaderComponent,
    DashboardComponent,
    ClockComponent,
    LoginComponent,
    GridSelectComponent,
    ActionItemsComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatDialogModule,
    MatMenuModule,
    AppRoutingModule,

  ],
  providers: [authInterceptorProviders,AppEnv,AppConstants],
  bootstrap: [AppComponent]
})
export class AppModule { }
