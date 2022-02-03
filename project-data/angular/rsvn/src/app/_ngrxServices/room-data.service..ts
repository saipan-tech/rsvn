import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IRoom } from "@app/_interface/room";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import {map} from 'rxjs/operators';

import { AppEnv } from '@app/_helpers/appenv';
import { ObserveOnSubscriber } from "rxjs/internal/operators/observeOn";
import { Update } from "@ngrx/entity";


@Injectable()
export class RoomDataService extends DefaultDataService<IRoom> {
    
    
    constructor(
        http:HttpClient, 
        httpUrlGenerator: HttpUrlGenerator,
        env: AppEnv
        ) { 
            httpUrlGenerator.entityResource('Room',`${env.WEB_API}` ); 
            super('Room', http, httpUrlGenerator);
        }
    
        override update(update: Update<IRoom>): Observable<IRoom> {
            console.log(update,"Update Payload")
            return this.http.put<IRoom>(`${this.entityUrl}${update.id}/`,update.changes)
        }
}

