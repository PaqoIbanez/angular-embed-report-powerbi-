import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs'; // Import 'of' and 'switchMap'
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginResponse {
  isAuthenticated: boolean;
}

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>( false ); // Initialize as false
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private baseUrl = environment.BASE_URL;
  private router: Router;

  constructor( private http: HttpClient ) {
    this.router = inject( Router );
    console.log( 'AuthService: Constructor called' );
  }

  // Make checkAuthStatus synchronous-like using switchMap to ensure initial value is set
  checkAuthStatus(): Observable<boolean> {
    return of( null ).pipe( // Start with an observable that emits immediately
      switchMap( () => { // switchMap to chain the HTTP request
        return this.http.get<{ isAuthenticated: boolean; }>( `${ this.baseUrl }/Auth/check`, { withCredentials: true } ).pipe(
          map( response => response?.isAuthenticated === true ),
          tap( isAuthenticated => {
            this.isAuthenticatedSubject.next( isAuthenticated );
            console.log( 'AuthService: checkAuthStatus - isAuthenticated:', isAuthenticated ); // Add log
          } )
        );
      } ),
      catchError( () => { // Catch errors during initial check and default to false
        this.isAuthenticatedSubject.next( false );
        console.log( 'AuthService: checkAuthStatus - Error during initial check, defaulting to false' ); // Add log
        return of( false ); // Return observable of false to complete the chain
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