import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericService } from '@app/_services/generic.service';
import { RoomService } from '@app/_services/room.service';
import { SystemService } from '@app/_services/system.service';
import { catchError, tap, map, mergeMap, concatMap, startWith } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControl, EmailValidator } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { ICity } from '@app/_interface/city';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  constructor(
    private systemService: SystemService
  ) { }

  units = ['Metric', 'Imperial']
  

    
  searchEditForm = new FormGroup({
    myControl : new FormControl()
  })
  currCity: ICity = {} as ICity

  weatherUnits = 'Metric'
  PortlandIID = "5746545"

  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)
  weatherStats: any;
  weather: any;

  locationResults: any = [];
  //==============================
  makeWeather(data: any) {
    
   
    let d: any = {}
    this.weatherStats = data;
    d['sunrise'] = new Date(data.sys.sunrise * 1000)
    d['sunset'] = new Date(data.sys.sunset * 1000)
    d['icon'] = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    d['main'] = data.main
    d['wind'] = data.wind
    d['weather'] = data.weather
 
    this.weather = d
  }
  //==============================
  refreshWeather(weatherUnits: string) {
    if (this.currCity) {
      this.systemService.getWeather(`id=${this.currCity.iid}&units=${weatherUnits}`)
        .subscribe(data => this.makeWeather(data))
    }
  }
  //==============================
  initWeather() {
    this.systemService.getCity(this.PortlandIID)
    .subscribe(data => {
      this.currCity = data;
      this.searchEditForm.controls.myControl.patchValue(data)
      this.refreshWeather(this.weatherUnits)

    })
  }
  //==============================
  locationSearch(query: string) {
    this.systemService.getCities(query)
      .subscribe(data => {
        this.locationResults = data
      })
  }

marker(t:string) {
  console.log(t)
}

  //==============================
  clearForm() {
    this.searchEditForm.reset()
  }
  //==============================
  displayFn(obj: any): string {
    return obj && obj.name ? `${obj.name}, ${obj.state} ${obj.country}` : '';
  }
  //==============================
  cityChange(event: any) {
    this.currCity = event.option.value
    this.refreshWeather(this.weatherUnits)
  }
  //==============================
  ngOnInit(): void {
  //==============================

    this.initWeather()

    this.searchEditForm.valueChanges
      .subscribe(val => {
        console.log("Changes",val)
        if (val.myControl.length > 2) {
          return this.locationSearch(val.myControl)
        }
      })
  }
}