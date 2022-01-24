import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {RsvnEntityService} from './rsvn-entity.service';
import {filter, first, map, tap} from 'rxjs/operators';


@Injectable()
export class RsvnResolver implements Resolve<boolean> {

    constructor(private rsvnService: RsvnEntityService) {

    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<boolean> {

        return this.rsvnService.getAll()
            .pipe(map( ri => !!ri),
            );

    }

}
