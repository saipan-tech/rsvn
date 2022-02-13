import { Injectable } from "@angular/core";
import { IBldg } from "@app/_interface/bldg";
import { 
    EntityCollectionServiceBase, 
    EntityCollectionServiceElementsFactory 
} from "@ngrx/data";

@Injectable()
export class BldgEntityService extends EntityCollectionServiceBase<IBldg> {
    constructor(
        serviceElementsFactory:EntityCollectionServiceElementsFactory) {
        super('Bldg', serviceElementsFactory)
    }
}