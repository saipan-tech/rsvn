import {createAction, props} from '@ngrx/store';
import {IStaff} from '@app/_interface/staff';


export const login = createAction(
    "[Login Page] User Login",
    props<{user: IStaff}>()
);



export const logout = createAction(
  "[Top Menu] Logout"
);
