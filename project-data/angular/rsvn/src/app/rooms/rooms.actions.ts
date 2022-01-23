import {createAction, props} from '@ngrx/store';
import {IRoominfo} from '@app/_interface/roominfo';


export const loadRoominfo = createAction(
    "[Load Roominfo] Manual Click"
  );



export const allRoomsLoaded = createAction(
  "[Load Roominfo Effect] All Loaded",
  props<{roominfos:IRoominfo[]}>()
);
