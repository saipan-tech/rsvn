import { createReducer, on } from '@ngrx/store';
import { addRoom2, removeRoom2 } from './room2.actions';

export const initialState: ReadonlyArray<string> = [];

export const collectionReducer = createReducer(
  initialState,
  on(removeRoom2, (state, { room2Id }) => state.filter((id) => id !== room2Id)),
  on(addRoom2, (state, { room2Id }) => {
    if (state.indexOf(room2Id) > -1) return state;

    return [...state, room2Id];
  })
);