
// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { first, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) => {
  const authService = inject( AuthService );
  const router = inject( Router );

  console.log( 'authGuard: Checking authentication for route:', state.url );

  return authService.isAuthenticated$.pipe(
    first(), // Finaliza después de la primera emisión
    tap( isAuthenticated => {
      console.log( 'authGuard: isAuthenticated$', isAuthenticated );
      if ( !isAuthenticated ) {
        console.log( 'authGuard: Not authenticated, navigating to /login' );
        router.navigate( [ '/login' ], { queryParams: { returnUrl: state.url } } );
      }
    } )
  );
};
