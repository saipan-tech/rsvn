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
  myControl = new FormControl();
  currCity : ICity = {} as ICity
  weatherUnits = 'Metric'

    PortlandIID = "5746545"


  Today = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10)

  weatherStats: any;


  weather: any;

  locationResults: any = [];

  //==============================
  makeWeather(data: any) {
    console.log("MAKING WEATHER",data)
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
    if(this.currCity) {
      console.log(this.currCity)
    this.systemService.getWeather(this.currCity.iid, weatherUnits)
      .subscribe(data => this.makeWeather(data))
    }
  }

  //==============================
  locationSearch(query: string) {
    this.systemService.getCities(query)
      .subscribe(data => {
        this.locationResults = data
        console.log(data)
      })
  }
clearForm(){
this.myControl.reset()
}
  //==============================
  displayFn(obj: any): string {
    return obj && obj.name ? `${obj.name}, ${obj.state} ${obj.country}` : '';
  }

  //==============================
  cityChange(event:any) {
    console.log("Changed Event",event)
    this.currCity = event.option.value
    this.refreshWeather(this.weatherUnits)

  }
 
  //==============================
  ngOnInit(): void {
    //==============================
    this.refreshWeather(this.weatherUnits)

    this.myControl.valueChanges
      .subscribe(val => {
        if (val.length > 2) {
          return this.locationSearch(val)
        }

      })

  }
}