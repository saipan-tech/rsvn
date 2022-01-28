import { Injectable } from "@angular/core";
import { IRoominfo } from "@app/_interface/roominfo";
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";

@Injectable()
export class RoominfoEntityService extends EntityCollectionServiceBase<IRoominfo> {
    constructor(
        serviceElementsFactory:EntityCollectionServiceElementsFactory) {
        super('Roominfo', serviceElementsFactory)
    }
}