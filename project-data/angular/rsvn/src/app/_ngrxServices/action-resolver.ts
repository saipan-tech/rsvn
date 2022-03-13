import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ActionEntityService } from './action-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';


@Injectable()
export class ActionResolver implements Resolve<boolean> {

    constructor(private actionService: ActionEntityService) {

    }

    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {

        return this.actionService.loaded$
            .pipe(
                tap(
                    loaded => {
                        if (!loaded) {
                            this.actionService.getAll();
                        }
                    }),
                filter(loaded => !!loaded),
                first()
            );

    }

}
