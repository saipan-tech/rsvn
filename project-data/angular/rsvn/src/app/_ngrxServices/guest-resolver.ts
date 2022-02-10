import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {RsvnEntityService} from './rsvn-entity.service';
import {filter, first, map, tap} from 'rxjs/operators';
import { GuestEntityService } from './guest-entity.service';


@Injectable()
export class GuestResolver implements Resolve<boolean> {

    constructor(private guestService: GuestEntityService) {

    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<boolean> {
                return this.guestService.loaded$
                .pipe(
                    tap(
                        loaded => {
                            if (!loaded) {
                                this.guestService.getAll();
                            }
                        }),
                    filter(loaded => !!loaded),
                    first()
                );
    

    }

}
