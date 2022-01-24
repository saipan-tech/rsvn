import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RoomsState } from "./reducers/rooms.reducers";

import * as fromRooms from './reducers/rooms.reducers';


export const selectRoomsState =
    createFeatureSelector<RoomsState>("roominfo");


    export const selectAllRooms = createSelector(
        selectRoomsState,
        fromRooms.selectAll
    );

    export const areRoomsLoaded = createSelector(
        selectRoomsState,
        state => state.allRoomsLoaded
    )