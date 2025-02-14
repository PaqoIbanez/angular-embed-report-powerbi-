import { Component, inject, OnDestroy, OnInit } from '@angular/core'; // Import OnDestroy and inject
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs'; // Import Subject and takeUntil
import { AuthService } from '../../services/auth.service';

@Component( {
  selector: 'app-root-redirect',
  standalone: true,
  template: `<div class="loading">Cargando...</div>`,
} )
export class RootRedirectComponent implements OnInit, OnDestroy { // Implement OnDestroy
  private authService = inject( AuthService );
  private router = inject( Router );
  private destroy$ = new Subject<void>(); // Subject for unsubscription

  ngOnInit(): void {
    this.authService.checkAuthStatus().pipe( takeUntil( this.destroy$ ) ).subscribe( isAuthenticated => { // Subscribe to checkAuthStatus
      if ( isAuthenticated ) {
        console.log( 'RootRedirect: User is authenticated, navigating to /report' );
        this.router.navigate( [ '/report' ] );
      } else {
        console.log( 'RootRedirect: User is not authenticated, navigating to /login' );
        this.router.navigate( [ '/login' ] );
      }
    } );
  }

  ngOnDestroy(): void { // Implement OnDestroy
    this.destroy$.next();
    this.destroy$.complete();
  }
}