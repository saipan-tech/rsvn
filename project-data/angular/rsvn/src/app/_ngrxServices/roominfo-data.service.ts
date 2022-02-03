import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IRoominfo } from "@app/_interface/roominfo";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators';

import { AppEnv } from '@app/_helpers/appenv';
import { Update } from "@ngrx/entity";


@Injectable()
export class RoominfoDataService extends DefaultDataService<IRoominfo> {

    constructor(
        http:HttpClient, 
        httpUrlGenerator: HttpUrlGenerator,
        env: AppEnv ) { 
            httpUrlGenerator.entityResource('Roominfo',env.WEB_API );
            super('Roominfo', http, httpUrlGenerator);
        }

        override update(update: Update<IRoominfo>): Observable<IRoominfo> {
            console.log(update,"Update Roominfo Payload")
            return this.http.put<IRoominfo>(`${this.entityUrl}${update.id}/`,update.changes)
        }

}

