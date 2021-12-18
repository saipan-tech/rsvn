import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IUser } from '@app/_interface/user';
import { AppEnv } from '@app/_helpers/appenv';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  constructor(
    private env: AppEnv ,
    private http: HttpClient
  ) { }

  private urlRoot = `${this.env.WEB_API}` 
 //==================================================
 getUserList(): Observable<IUser[]> {
  return this.http
    .get<IUser[]>(`${this.urlRoot}/users/`)
}

}
