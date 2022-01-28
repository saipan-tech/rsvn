import { Injectable } from "@angular/core";
import { IRoom } from "@app/_interface/room";
import { 
    EntityCollectionServiceBase, 
    EntityCollectionServiceElementsFactory 
} from "@ngrx/data";

@Injectable()
export class RoomEntityService extends EntityCollectionServiceBase<IRoom> {
    constructor(
        serviceElementsFactory:EntityCollectionServiceElementsFactory) {
        super('Room', serviceElementsFactory)
    }
}