import { Injectable } from '@angular/core';

Injectable()
export class AppConstants {


  public DAILYSECONDS = (1000 * 3600 * 24)

  public TODAY = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)



}
