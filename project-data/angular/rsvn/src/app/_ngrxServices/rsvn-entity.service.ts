import { Injectable } from "@angular/core";
import { IRsvn } from "@app/_interface/rsvn";
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";

@Injectable()
export class RsvnEntityService extends EntityCollectionServiceBase<IRsvn> {
    constructor(
        serviceElementsFactory:EntityCollectionServiceElementsFactory) {
        super('Rsvn', serviceElementsFactory)
    }
}