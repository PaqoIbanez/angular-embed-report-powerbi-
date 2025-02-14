import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter( routes ),
    importProvidersFrom( BrowserAnimationsModule ),
    importProvidersFrom( MatDialogModule ),
    AuthInterceptor, // <-- Add AuthInterceptor here as a provider
    provideHttpClient( withInterceptors( [
      ( req, next ) => inject( AuthInterceptor ).intercept( req, { handle: next } )
    ] ) ),
  ]
};