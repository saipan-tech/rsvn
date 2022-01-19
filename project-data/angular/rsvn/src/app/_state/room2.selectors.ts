import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IRoom2 } from '@app/_interface/room2';

export const selectRoom2s = createFeatureSelector<ReadonlyArray<IRoom2>>('room2s');

export const selectCollectionState = createFeatureSelector<
  ReadonlyArray<string>
>('collection');

export const selectBookCollection = createSelector(
  selectRoom2s,
  selectCollectionState,
  (room2s, collection) => {
    return collection.map((id) => room2s.find((room2:any) => room2.id === id));
  }
);