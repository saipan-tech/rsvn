import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AuthState} from '../reducers';


export const selectAuthState =
    createFeatureSelector<AuthState>("auth");


export const isLoggedIn = createSelector(
    selectAuthState,
    auth =>  !!auth.user.token

);


export const isLoggedOut = createSelector(
    isLoggedIn,
    loggedIn => !loggedIn
);

export const currUser = createSelector(
    selectAuthState,
    auth =>  auth.user
);

