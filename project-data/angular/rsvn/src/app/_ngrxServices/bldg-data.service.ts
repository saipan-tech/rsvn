import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IBldg } from "@app/_interface/bldg"
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators';

import { AppEnv } from '@app/_helpers/appenv';
import { Update } from "@ngrx/entity";


@Injectable()
export class BldgDataService extends DefaultDataService<IBldg> {

    constructor(
        http:HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        env: AppEnv ) {
            httpUrlGenerator.entityResource('Bldg',env.WEB_API, true);
            super('Bldg', http, httpUrlGenerator);
        }
        override update(update:Update<IBldg>): Observable<IBldg> {
            return this.http.put<IBldg>(`${this.entityUrl}${update.id}/`,update.changes)
        }


}

