// src/app/interceptors/auth.interceptor.ts
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  @Output() logoutRequest = new EventEmitter<void>();

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(`AuthInterceptor: Intercepting request to ${request.url}`); // Log the URL

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(`AuthInterceptor: Error response received for ${request.url}`, error); // Log the error

        if (error.status === 401 &&
          !request.url.endsWith('/login') &&
          !request.url.endsWith('/logout') &&
          !request.url.endsWith('/check')) {
          console.warn(`AuthInterceptor: 401 error detected for URL: ${request.url}`);
          console.warn('AuthInterceptor: Emitting logoutRequest event');
          this.logoutRequest.emit();
        } else if (error.status === 401) {
          console.warn(`AuthInterceptor: 401 error, but URL is excluded from logout: ${request.url}`);
        }
        return throwError(() => error);
      })
    );
  }
}