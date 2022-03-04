import { Injectable } from "@angular/core";
import { IRsvn } from "@app/_interface/rsvn";
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";
import { map } from "rxjs/operators";

@Injectable()
export class RsvnEntityService extends EntityCollectionServiceBase<IRsvn> {
    constructor(
        serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Rsvn', serviceElementsFactory)
    }

    activeRsvn$(dateIn: string, dateOut: string) {
        return this.entities$
            .pipe(
                map(rsvn => rsvn.filter(rsvn =>
                    (rsvn.dateIn <= dateIn && rsvn.dateOut > dateIn) ||
                    (rsvn.dateIn <= dateOut && rsvn.dateOut > dateIn) ||
                    (rsvn.dateIn <= dateOut && rsvn.dateOut > dateOut)
                ))
            )
    }

}