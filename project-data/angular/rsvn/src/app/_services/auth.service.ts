import { Injectable } from '@angular/core';
import { BehaviorSubject, concat, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map, concatMap } from 'rxjs/operators';
import { throwError, from } from 'rxjs';
import { AppEnv } from '@app/_helpers/appenv';
import { Router } from '@angular/router';
import { IUser } from '@app/_interface/user';
import { GenericService } from './generic.service';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    //==================================
    private _isLoggedIn = new BehaviorSubject(!!this.getToken());
    private _isUsername = new BehaviorSubject(this.getUser());
    private _isSecurity = new BehaviorSubject(this.getSecurity());


    isLoggedIn = this._isLoggedIn.asObservable();
    isUsername = this._isUsername.asObservable();
    isSecurity = this._isSecurity.asObservable();

    //==================================
    constructor(private router: Router,
        private http: HttpClient,
        private env: AppEnv,
        private genericService: GenericService
        ) { }
        

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
    getUser() {
        return localStorage.getItem("username");
    }
    //==================================
    getSecurity() {
        return localStorage.getItem("security");
    }

    //==================================
    changeLoggedIn(token: boolean) {
        this._isLoggedIn.next(token);
    }
    //==================================
    changeUsername(username: string) {
        this._isUsername.next(username);
    }
    //==================================
    changeSecurity(level: string) {
        this._isSecurity.next(level);
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
    public Login(usr: any): Observable<any> {
        return this.http.post<any>(`${this.AUTH_API}/api/token/auth/`, usr, this.makeAuthHeader(usr))
            .pipe(
                tap(res => {
                    localStorage.setItem('token', res.token);
                    this.changeLoggedIn(true);
                }),
                concatMap(res => this.http.get<IUser>(`${this.WEB_API}/session/`, httpOptions)),
                tap(res => {
                    localStorage.setItem('username', res.username)
                    this.changeUsername(res.username);
                }),
                concatMap(res => this.genericService.getItemQueryList('staff',`username=${res.username}`)),
                tap(data => {
                 localStorage.setItem('security',data[0].level)
                 this.changeSecurity(data[0].level)
                })
                
            )
    }

    public Logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("security");
        
        this.changeLoggedIn(false)
        this.changeUsername('')
        this.changeSecurity('')
    }


    
}