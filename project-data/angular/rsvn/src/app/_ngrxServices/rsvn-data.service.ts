import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IRsvn } from "@app/_interface/rsvn";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators';

import { AppEnv } from '@app/_helpers/appenv';
import { Update } from "@ngrx/entity";


@Injectable()
export class RsvnDataService extends DefaultDataService<IRsvn> {

    constructor(
        http:HttpClient, 
        httpUrlGenerator: HttpUrlGenerator,
        env: AppEnv ) { 
            httpUrlGenerator.entityResource('Rsvn',env.WEB_API );
            super('Rsvn', http, httpUrlGenerator);
        }
        override update(update:Update<IRsvn>): Observable<IRsvn> {
            return this.http.put<IRsvn>(`${this.entityUrl}${update.id}/`,update)
        }


}

