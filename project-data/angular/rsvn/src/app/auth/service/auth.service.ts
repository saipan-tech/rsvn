import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppEnv } from '@app/_helpers/appenv';
import { GenericService } from '@app/_services/generic.service';
import { IStaff } from "@app/_interface/staff";
import { IUser } from "@app/_interface/user";
import { catchError, tap, map, concatMap } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
interface U {
    username: string;
    password: string
}

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private env: AppEnv,
        private genericService: GenericService
    ) {}
    
    private AUTH_API = this.env.API_URL
    private WEB_API = this.env.WEB_API

    private makeAuthHeader(usr: U) {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                "Authorization": "Basic " + btoa(`${usr.username}:${usr.password}`)
            })
        }
    }

    public Login(username: string, password: string): Observable<any> {
        let usr: U = { username, password }
        let token = ""
        console.log(usr)
        return this.http.post<any>(`${this.AUTH_API}/api/token/auth/`, usr, this.makeAuthHeader(usr))
            .pipe(
                tap(res => {
                    localStorage.setItem('token', res.token);
                    token = res.token
                }),
                concatMap(res => this.genericService.getItemQueryList('staff', `username=${username}`)),
                map( d => d[0]),
                map(staff =>   { staff.token = token
                    return staff
                })
            )
    }
}

