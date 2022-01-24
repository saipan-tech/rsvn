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
<<<<<<< HEAD
=======
    public getSession(): Observable<IUser> {
        return this.http.get<IUser>(`${this.WEB_API}/session/`, httpOptions)
    }
    getToken() {
        return localStorage.getItem("token");
    }
>>>>>>> dee79de4cc55a42032f59f56edd1857d6f529cfc

    public Login(username: string, password: string): Observable<any> {
        let usr: U = { username, password }
        let token = ""
        console.log(usr,this.makeAuthHeader(usr))
        return this.http.post<any>(`${this.AUTH_API}/api/token/auth/`, usr, this.makeAuthHeader(usr))
            .pipe(
                tap(res => {
                    localStorage.setItem('token', res.token);
                    token = res.token
                }),
                concatMap(res => this.genericService.getItemQueryList('staff', `username=${username}`)),
                map( d => d[0]),
<<<<<<< HEAD
                map(staff =>   { staff.token = token
                    return staff
=======
                map(staff => {  staff.token = token;
                    return staff     
>>>>>>> dee79de4cc55a42032f59f56edd1857d6f529cfc
                })
            )
    }
}

