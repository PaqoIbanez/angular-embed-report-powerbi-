// src/app/pages/root-redirect/root-redirect.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component( {
  selector: 'app-root-redirect',
  standalone: true,
  template: `<div class="loading">Cargando...</div>`,
} )
export class RootRedirectComponent implements OnInit {
  constructor( private router: Router, private apiService: ApiService ) { }

  ngOnInit(): void {
    const token = this.getCookie( 'token' );
    if ( token ) {
      // Si existe el token, se hace la petición a /Embed/getEmbedToken enviando el token
      this.apiService.getEmbedInfo().subscribe( {
        next: ( response ) => {
          // Si la petición responde con 200, redirige a /report
          this.router.navigate( [ '/report' ] );
        },
        error: ( error ) => {
          // Si ocurre cualquier error, redirige a /login
          console.error( 'Error al obtener embed info:', error );
          this.router.navigate( [ '/login' ] );
        },
      } );
    } else {
      // Si no existe el token, redirige directamente a /login
      this.router.navigate( [ '/login' ] );
    }
  }

  /**
   * Función auxiliar para obtener el valor de una cookie por su nombre.
   */
  private getCookie( name: string ): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split( ';' );
    for ( let i = 0; i < ca.length; i++ ) {
      let c = ca[ i ].trim();
      if ( c.indexOf( nameEQ ) === 0 ) {
        return c.substring( nameEQ.length, c.length );
      }
    }
    return null;
  }
}
