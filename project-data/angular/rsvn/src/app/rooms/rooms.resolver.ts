import { Injectable } from "@angular/core";
import { select, Store } from '@ngrx/store';
import { AppState } from '@app/reducers';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { finalize, first, Observable, tap } from "rxjs";
import { allRoomsLoaded, loadRoominfo } from "./rooms.actions";








@Injectable()
export class RoomsResolver implements Resolve<any> {

    loading = false;

    constructor(private store: Store<AppState>) {

    }

    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<any> {

        return this.store
            .pipe(
                tap(() => {
                    if (!this.loading) {
                        this.loading = true
                        this.store.dispatch(loadRoominfo())
                    }
                }),
                first(),
                finalize(() => this.loading = false)
            );
    }
}
