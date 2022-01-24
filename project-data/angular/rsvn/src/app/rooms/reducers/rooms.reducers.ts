import { IRoominfo } from '@app/_interface/roominfo';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import { RoomsActions } from '../action-types';


export interface RoomsState extends EntityState<IRoominfo> {
    allRoomsLoaded : boolean
}

export const adapter = createEntityAdapter<IRoominfo>();

export const initialRoomsState = adapter.getInitialState({
    allRoomsLoaded:false
}
);



export const roomsReducer = createReducer(

    initialRoomsState,

    on(RoomsActions.allRoomsLoaded,
        (state, action) => adapter.setAll(
            action.roominfos,
            {...state,allRoomsLoaded:true}))

);

export const { selectAll } = adapter.getSelectors();
