import { Injectable } from "@angular/core";
import { IBldg } from "@app/_interface/bldg";
import { IAction } from "@app/_interface/action";
import { 
    EntityCollectionServiceBase, 
    EntityCollectionServiceElementsFactory 
} from "@ngrx/data";

@Injectable()
export class ActionEntityService extends EntityCollectionServiceBase<IAction> {
    constructor(
        serviceElementsFactory:EntityCollectionServiceElementsFactory) {
        super('Action', serviceElementsFactory)
    }
}