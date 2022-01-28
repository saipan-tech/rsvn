import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IRsvn } from "@app/_interface/rsvn";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators';

import { AppEnv } from '@app/_helpers/appenv';


@Injectable()
export class RsvnDataService extends DefaultDataService<IRsvn> {


    constructor(
        http:HttpClient, 
        httpUrlGenerator: HttpUrlGenerator,
        private env: AppEnv   ) 
        {
            super('Rsvn', http, httpUrlGenerator);
        }
            override getAll(): Observable<IRsvn[]> {
                return this.http.get<IRsvn[]>(`${this.env.WEB_API}/rsvn/?current=1`)
                }


}

