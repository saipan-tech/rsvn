import { Injectable } from "@angular/core";
import { IRoom } from "@app/_interface/room";
import { 
    EntityCollectionServiceBase, 
    EntityCollectionServiceElementsFactory 
} from "@ngrx/data";
import { filter, map } from "rxjs/operators";

@Injectable()
export class RoomEntityService extends EntityCollectionServiceBase<IRoom> {
    constructor(
        serviceElementsFactory:EntityCollectionServiceElementsFactory) {
        super('Room', serviceElementsFactory)
    }

    //=============================================
    activeRoom$(dateIn:string,dateOut:string) { 
    return this.entities$
    .pipe(
      map(room => room.filter(room =>
        (room.dateIn <= dateIn && room.dateOut > dateIn) ||
        (room.dateIn <= dateOut && room.dateOut > dateIn) ||
        (room.dateIn <= dateOut && room.dateOut > dateOut)
      )
      ))
      }
    //=============================================
    rsvnRooms$(rsvnid:number) {
        return this.entities$
        .pipe(
            map( rooms=> rooms.filter( rm => rm.rsvn == rsvnid))
        )
    }


}


