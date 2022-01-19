import { IRoom2 } from '@app/_interface/room2';

export interface AppState {
  room2s: ReadonlyArray<IRoom2>;
  collection: ReadonlyArray<string>;
}