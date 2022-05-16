import 'dotenv/config'

import { Injectable } from '@angular/core';

Injectable()
export class AppEnv {
  public API_URL = process.env.API_URL || '';
  public WEB_API = process.env.WEB_API || '';
}
