import { Injectable } from "@angular/core";
import { IRoominfo } from "@app/_interface/roominfo";
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";
import { Observable } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { BldgEntityService } from "./bldg-entity.service";

@Injectable()
export class RoominfoEntityService extends EntityCollectionServiceBase<IRoominfo> {
    constructor(
        private bldgService: BldgEntityService,
        serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Roominfo', serviceElementsFactory)
    }


    bldgRoominfo$(entities$:Observable<any>) {
        return entities$.pipe(
            concatMap(result => this.bldgService.entities$.pipe(
                map(bldg => {
                    let roominfos:any = []
                    result.map((res:any) => {
                        roominfos.push({...res})
                    })
                    let final: any = []
                    bldg.map(bldg => final.push({
                        bldg,
                        roominfo: roominfos.filter((res: any) => res.bldg == bldg.id)
                    }))
                    return final
                })
            ))
        )
    }
}