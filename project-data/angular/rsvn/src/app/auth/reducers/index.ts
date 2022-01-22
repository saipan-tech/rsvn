import {
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector, createReducer,
    createSelector,
    MetaReducer, on
} from '@ngrx/store';

import {IStaff} from '@app/_interface/staff';
import {AuthActions} from '../store/action-types';



export interface AuthState {
    user: IStaff
}

export const initialAuthState: AuthState = {
    user: {} as IStaff
};

export const authReducer = createReducer(

    initialAuthState,

    on(AuthActions.login, (state, action) => {
        return {
            user: action.user
        }
    }),

    on(AuthActions.logout, (state, action) => {
        return {
            user: {} as IStaff
        }
    })



);

