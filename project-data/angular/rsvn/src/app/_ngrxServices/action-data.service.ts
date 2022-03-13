import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IAction } from "@app/_interface/action";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators';

import { AppEnv } from '@app/_helpers/appenv';
import { Update } from "@ngrx/entity";


@Injectable()
export class ActionDataService extends DefaultDataService<IAction> {

    constructor(
        http:HttpClient, 
        httpUrlGenerator: HttpUrlGenerator,
        env: AppEnv ) { 
            httpUrlGenerator.entityResource('Action',env.WEB_API );
            super('Action', http, httpUrlGenerator);
        }
        override update(update:Update<IAction>): Observable<IAction> {
            return this.http.put<IAction>(`${this.entityUrl}${update.id}/`,update.changes)
        }


}

