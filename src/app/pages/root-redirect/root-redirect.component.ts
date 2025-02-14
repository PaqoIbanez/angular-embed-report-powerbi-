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
    console.log( 'TOKEN VALUE: ', token );

    if ( token && token !== null ) {
      // Si existe el token, realiza la petición a /Embed/getEmbedToken
      this.apiService.getEmbedInfoWithToken( token ).subscribe( {
        next: () => {
          // Petición exitosa: redirige a /report
          this.router.navigate( [ '/report' ] );
        },
        error: ( error ) => {
          console.error( 'Error al obtener embed info:', error );
          // Si hay error en la petición, redirige a /login
          this.router.navigate( [ '/login' ] );
        },
      } );
    } else {
      // Si no existe token, redirige de inmediato a /login
      this.router.navigate( [ '/login' ] );
    }
  }

  private getCookie( name: string ): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split( ';' );
    for ( let c of ca ) {
      c = c.trim();
      if ( c.indexOf( nameEQ ) === 0 ) {
        return c.substring( nameEQ.length );
      }
    }
    return null;
  }
}
