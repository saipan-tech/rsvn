import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

Injectable()
export class AppEnv {
  public API_URL = environment.API_URL;
  public WEB_API = environment.WEB_API;
}
