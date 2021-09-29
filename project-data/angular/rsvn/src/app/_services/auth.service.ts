import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { throwError, from } from 'rxjs';
import { AppEnv } from '@app/_helpers/appenv';
import { Router } from '@angular/router';
import { IUser } from '@app/_interface/user';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _isLoggedIn = new BehaviorSubject(!!this.getToken());

    isLoggedIn = this._isLoggedIn.asObservable();

    //==================================
    constructor(private router: Router,
        private http: HttpClient,
        private env: AppEnv) { }

    private AUTH_API = this.env.API_URL
    private WEB_API = this.env.WEB_API


    //==================================
    public getSession(): Observable<IUser> {
        return this.http.get<IUser>(`${this.WEB_API}/session/`, httpOptions)
    }
    //==================================
    getToken() {
        return localStorage.getItem("token");
    }
    //==================================
    changeLoggedIn(token: boolean) {
        this._isLoggedIn.next(token);
    }
    //==================================
    private makeAuthHeader(usr: IUser) {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                "Authorization": "Basic " + btoa(`${usr.username}:${usr.password}`)
            })
        }
    }
    //==================================
    public login(usr: any): Observable<any> {
        return this.http.post<any>(`${this.AUTH_API}/api/token/auth/`, usr, this.makeAuthHeader(usr))
    }
    //==================================
    public logout() {
        localStorage.removeItem("token");
        this.changeLoggedIn(false)
        this.router.navigate(['login']);
    }
}