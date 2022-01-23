import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { AuthService } from '@app/auth/service/auth.service';
import { Observable, of } from 'rxjs';
import { tap,map, catchError } from 'rxjs/operators';

const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

// =======================================
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.getToken()) {
      request = this.addToken(request, this.authService.getToken());
    } 
    else { console.log("No Token",request)}
    return next.handle(request)
  }
  // =======================================
  private addToken(authReq: HttpRequest<any>, token:any) {
    return authReq.clone({
      setHeaders: {
        'Authorization': `Token ${token}`
      }
    });
  }
}
// =======================================
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];