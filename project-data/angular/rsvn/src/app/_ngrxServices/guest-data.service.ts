import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IGuest } from "@app/_interface/guest";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators';

import { AppEnv } from '@app/_helpers/appenv';
import { Update } from "@ngrx/entity";


@Injectable()
export class GuestDataService extends DefaultDataService<IGuest> {

    constructor(
        http:HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        env: AppEnv ) {
            httpUrlGenerator.entityResource('Guest',env.WEB_API, true);
            super('Guest', http, httpUrlGenerator);
        }
        override update(update:Update<IGuest>): Observable<IGuest> {
            return this.http.put<IGuest>(`${this.entityUrl}${update.id}/`,update.changes)
        }


}

