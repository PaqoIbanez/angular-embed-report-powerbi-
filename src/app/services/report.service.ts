import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface EmbedInfo {
  accessToken: string;
  embedUrl: string;
  expiry: string;
  datasetId?: string;
}

@Injectable( {
  providedIn: 'root'
} )
export class ReportService {
  constructor( private http: HttpClient ) { }

  getEmbedInfo(): Observable<EmbedInfo> {
    // No se utiliza token desde localStorage, se confía en la cookie HttpOnly.
    return this.http.get<EmbedInfo>( `${ environment.BASE_URL }/getEmbedToken`, {
      withCredentials: true
    } ).pipe(
      tap( resp => {
        console.log( resp );
      } ),
      catchError( this.handleError )
    );
  }

  private handleError( error: HttpErrorResponse ) {
    if ( error.error instanceof ErrorEvent ) {
      // Error de lado del cliente o de red.
      console.error( 'An error occurred:', error.error.message );
    } else {
      // El backend retornó un código de error.
      console.error(
        `Backend returned code ${ error.status }, ` +
        `body was: ${ error.error }` );
    }
    return throwError( () => new Error( 'Something bad happened; please try again later.' ) );
  }
}