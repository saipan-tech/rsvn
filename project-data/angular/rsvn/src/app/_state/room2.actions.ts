import { createAction, props } from '@ngrx/store';
import { IRoom2 } from '@app/_interface/room2';


export const addRoom2 = createAction(
  '[Room2 List] Add Room2',
  props<{ room2Id: string }>()
);

export const removeRoom2 = createAction(
  '[Room2 Collection] Remove Room2',
  props<{ room2Id: string }>()
);

export const retrievedRoom2List = createAction(
  '[Room2 List/API] Retrieve Room2 Success',
  props<{ room2s: ReadonlyArray<IRoom2> }>()
);