import { Injectable } from "@angular/core";
import { GenericService } from "@app/_services/generic.service";
import { Actions, createEffect,ofType } from "@ngrx/effects";
import { concatMap,map,tap } from "rxjs/operators";
import { RoomsActions } from "./action-types";
import { allRoomsLoaded } from "./rooms.actions";


@Injectable()
export class RoomsEffects {




    loadRooms$ = createEffect(
        () => this.actions$ 
            .pipe(
                ofType(RoomsActions.loadRoominfo),
                concatMap(action =>
                    this.genericService.getItemList('roominfo')),
                    map(roominfos => allRoomsLoaded({roominfos}))
            )
        );


    constructor(
        private actions$: Actions,
        private genericService:GenericService
         ) {

    }
}