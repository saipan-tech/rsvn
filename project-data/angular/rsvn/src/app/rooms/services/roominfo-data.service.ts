import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IRoominfo } from "@app/_interface/roominfo";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators';

import { AppEnv } from '@app/_helpers/appenv';


@Injectable()
export class RoominfoDataService extends DefaultDataService<IRoominfo> {


    constructor(
        http:HttpClient, 
        httpUrlGenerator: HttpUrlGenerator,
        private env: AppEnv   ) 
        {
            super('Roominfo', http, httpUrlGenerator);
        }
            override getAll(): Observable<IRoominfo[]> {
                return this.http.get<IRoominfo[]>(`${this.env.WEB_API}/roominfo`)
                }


}

