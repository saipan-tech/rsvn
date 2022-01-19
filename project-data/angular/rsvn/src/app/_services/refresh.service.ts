import { Injectable } from '@angular/core';
import { BehaviorSubject, concat, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map, concatMap } from 'rxjs/operators';
import { throwError, from } from 'rxjs';
import { AppEnv } from '@app/_helpers/appenv';
import { Router } from '@angular/router';
import { IUser } from '@app/_interface/user';
import { GenericService } from './generic.service';


@Injectable({
    providedIn: 'root'
})
export class RefreshService {

}