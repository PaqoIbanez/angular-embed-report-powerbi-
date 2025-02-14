// src/app/services/api.service.ts
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface EmbedInfoResponse {
  accessToken: string;
  embedUrl: string;
  expiry: string;
}

@Injectable( {
  providedIn: 'root'
} )
export class ApiService {
  private baseUrl = environment.BASE_URL;

  constructor( private http: HttpClient ) { }

  /**
   * Método existente (opcional)
   */
  getEmbedInfo(): Observable<EmbedInfoResponse> {
    return this.http.get<EmbedInfoResponse>( `${ this.baseUrl }/Embed/getEmbedToken`, { withCredentials: true } )
      .pipe( catchError( this.handleError ) );
  }

  /**
   * Nuevo método que envía el token en los headers.
   */
  getEmbedInfoWithToken( token: string ): Observable<EmbedInfoResponse> {
    const headers = new HttpHeaders( {
      'Authorization': `Bearer ${ token }` // Ajusta el formato según lo requiera tu backend
    } );
    return this.http.get<EmbedInfoResponse>( `${ this.baseUrl }/Embed/getEmbedToken`, {
      withCredentials: true,
      headers
    } ).pipe( catchError( this.handleError ) );
  }

  private handleError( error: HttpErrorResponse ) {
    console.error( 'API Error:', error );
    let errorMessage = 'Ocurrió un error al obtener los datos. Por favor, inténtelo de nuevo más tarde.';
    if ( error.error instanceof ErrorEvent ) {
      errorMessage = `Error: ${ error.error.message }`;
    } else {
      if ( error.status === 404 ) {
        errorMessage = 'Recurso no encontrado en el servidor.';
      } else if ( error.status >= 500 ) {
        errorMessage = 'Error del servidor. Por favor, contacte al administrador.';
      } else if ( error.status === 401 ) {
        errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
      } else {
        errorMessage = `Error del servidor: ${ error.status }.`;
      }
    }
    return throwError( () => new Error( errorMessage ) );
  }
}
