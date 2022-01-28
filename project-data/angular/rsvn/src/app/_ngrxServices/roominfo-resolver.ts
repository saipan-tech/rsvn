import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {RoominfoEntityService} from './roominfo-entity.service';
import {filter, first, map, tap} from 'rxjs/operators';


@Injectable()
export class RoominfoResolver implements Resolve<boolean> {

    constructor(private roominfoService: RoominfoEntityService) {

    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<boolean> {
                return this.roominfoService.loaded$
                .pipe(
                    tap(
                        loaded => {
                            if (!loaded) {
                                this.roominfoService.getAll();
                            }
                        }),
                    filter(loaded => !!loaded),
                    first()
                );
    

    }

}
