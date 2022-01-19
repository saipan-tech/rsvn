import { createReducer, on } from '@ngrx/store';
import { retrievedRoom2List } from './room2.actions';
import { IRoom2 } from '@app/_interface/room2'

export const initialState: ReadonlyArray<IRoom2> = [];

export const room2sReducer = createReducer(
  initialState,
  on(retrievedRoom2List, (state, { room2s }) => room2s)
);