
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  isAuthenticated: boolean;
}

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>( this.checkInitialAuthentication() );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private baseUrl = environment.BASE_URL;

  private router: Router;

  constructor( private http: HttpClient ) {
    this.router = inject( Router );
    console.log( 'AuthService: Constructor called' );
    // Se realiza una verificación inicial del estado de autenticación.
    this.checkAuthStatus().subscribe();
  }

  private checkInitialAuthentication(): boolean {
    // En lugar de leer del localStorage, se puede iniciar en false y actualizar luego.
    return false;
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http.get<{ isAuthenticated: boolean; }>( `${ this.baseUrl }/Auth/check`, { withCredentials: true } ).pipe(
      map( response => response?.isAuthenticated === true ),
      tap( isAuthenticated => {
        this.isAuthenticatedSubject.next( isAuthenticated );
      } )
    );
  }

  login( email: string, password: string ): Observable<LoginResponse> {
    return this.http.post<LoginResponse>( `${ this.baseUrl }/Auth/login`, { email, password }, { withCredentials: true } ).pipe(
      tap( () => {
        this.isAuthenticatedSubject.next( true );
      } )
    );
  }

  logout(): void {
    this.http.post( `${ this.baseUrl }/Auth/logout`, {}, { withCredentials: true } ).subscribe( () => {
      this.isAuthenticatedSubject.next( false );
      this.router.navigate( [ '/login' ] );
    } );
  }
}