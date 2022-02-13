import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BldgEntityService } from './bldg-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';


@Injectable()
export class BldgResolver implements Resolve<boolean> {

    constructor(private bldgService: BldgEntityService) {

    }

    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {

        return this.bldgService.loaded$
            .pipe(
                tap(
                    loaded => {
                        if (!loaded) {
                            this.bldgService.getAll();
                        }
                    }),
                filter(loaded => !!loaded),
                first()
            );

    }

}
