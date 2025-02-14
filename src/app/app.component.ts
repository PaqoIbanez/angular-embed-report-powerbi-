import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core'; // Import OnInit
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  BmbThemeComponent,
  IBmbLoginOnboarding,
  IBmbUserInfo
} from '@ti-tecnologico-de-monterrey-oficial/ds-ng';
import { TopBarComponent } from './components/topbar/topbar.component';
import { AuthService } from './services/auth.service'; // Import AuthService

import { AuthInterceptor } from './interceptors/auth.interceptor'; // Import AuthInterceptor


@Component( {
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    BmbThemeComponent,
    ReactiveFormsModule,
    TopBarComponent,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
} )
export class AppComponent implements OnInit {
  public router = inject( Router );
  private authService = inject( AuthService );
  private authInterceptor = inject( AuthInterceptor ); // Inject AuthInterceptor

  userForm: FormGroup = new FormGroup( {
    name: new FormControl<string>( '', Validators.required ),
  } );
  showErrors: { [ key: string ]: boolean; } = {};

  // constructor(public router: Router, private authService: AuthService) {} // Inyecta AuthService

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe( isAuthenticated => {
      if ( isAuthenticated ) {
        this.router.navigate( [ '/report' ] );
      }
    } );

    this.authInterceptor.logoutRequest.subscribe( () => { // Subscribe to logoutRequest event
      console.log( 'AppComponent: Received logoutRequest event from AuthInterceptor' );
      this.authService.logout(); // Now call logout here
    } );
  }

  onSubmit() {
    if ( this.userForm.valid ) {
      return;
    }
    this.userForm.markAllAsTouched();
    this.updateErrorState();
  }

  updateErrorState() {
    Object.keys( this.userForm.controls ).forEach( ( field ) => {
      const control = this.userForm.get( field );
      if ( control instanceof FormControl ) {
        this.showErrors[ field ] =
          control.invalid && ( control.touched || control.dirty );
      }
    } );
  }

  getFormControl( name: string ): FormControl {
    return this.userForm.get( name ) as FormControl;
  }

  auth( data: unknown ): boolean {
    data;
    return true;
  }

  toTPCode( data: unknown ): boolean {
    return data === '123456';
  }

  biometricData(): boolean {
    return true;
  }

  activate(): boolean {
    return true;
  }

  getUserInfo( data: unknown ): IBmbUserInfo {
    data;
    return {
      id: 'A00123456',
      fullName: 'Borrego Perez',
      profilePicture: 'https://studio-assets.supernova.io/design-systems/74407/16b3da66-1d17-46fe-be94-a01dea059580.svg',
    };
  }

  init(): void {
    console.log( 'init' );
  }

  handleRequest( event: IBmbLoginOnboarding ) {
    const { data, action, callback } = event;

    switch ( action ) {
      case 'auth':
        setTimeout( () => {
          callback( this.auth( data ) );
        }, 1000 );
        break;
      case 'toTP':
        callback( this.toTPCode( data ) );
        break;
      case 'biometric':
        callback( this.biometricData() );
        break;
      case 'activate':
        callback( this.activate() );
        break;
      case 'getUserInfo':
        callback( this.getUserInfo( data ) );
        break;
      case 'init':
        setTimeout( () => {
          callback( this.init() );
        }, 1000 );
        break;
      default:
        console.log( 'Invalid action' );
    }
  }
}