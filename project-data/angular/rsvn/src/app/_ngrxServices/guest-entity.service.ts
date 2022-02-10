import { Injectable } from "@angular/core";
import { IGuest } from "@app/_interface/guest";
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";

@Injectable()
export class GuestEntityService extends EntityCollectionServiceBase<IGuest> {
    constructor(
        serviceElementsFactory:EntityCollectionServiceElementsFactory) {
        super('Guest', serviceElementsFactory)
    }
}