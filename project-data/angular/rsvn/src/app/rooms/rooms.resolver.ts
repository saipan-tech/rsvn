import { Injectable } from "@angular/core";
import { select, Store } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { filter, finalize, first, Observable, tap } from "rxjs";
import { allRoomsLoaded, loadRoominfo } from "./rooms.actions";
import { areRoomsLoaded } from "./rooms.selectors";








@Injectable()
export class RoomsResolver implements Resolve<any> {

    loading = false;

    constructor(private store: Store<AppState>) {

    }

    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<any> {

        return this.store
            .pipe(
                select(areRoomsLoaded),
                tap((roomsLoaded) => {
                    if (!this.loading && !roomsLoaded) {
                        this.loading = true
                        this.store.dispatch(loadRoominfo())
                    }
                }),
                filter(roomsLoaded=>roomsLoaded),
                first(),
                finalize(() => this.loading = false)
            );
    }
}
