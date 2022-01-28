import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RoomEntityService } from './room-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';


@Injectable()
export class RoomResolver implements Resolve<boolean> {

    constructor(private roomService: RoomEntityService) {

    }

    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {

        return this.roomService.loaded$
            .pipe(
                tap(
                    loaded => {
                        if (!loaded) {
                            this.roomService.getAll();
                        }
                    }),
                filter(loaded => !!loaded),
                first()
            );

    }

}
