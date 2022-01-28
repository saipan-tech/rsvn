import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IRoom } from "@app/_interface/room";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators';

import { AppEnv } from '@app/_helpers/appenv';


@Injectable()
export class RoomDataService extends DefaultDataService<IRoom> {


      
    constructor(
        http:HttpClient, 
        httpUrlGenerator: HttpUrlGenerator,
        private env: AppEnv   ) 
        {
            super('Room', http, httpUrlGenerator);
        }
            override getAll(): Observable<IRoom[]> {
                return this.http.get<IRoom[]>(`${this.env.WEB_API}/room/?current=1`)
                }


}

