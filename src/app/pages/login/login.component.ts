import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BmbButtonDirective, BmbInputComponent } from '@ti-tecnologico-de-monterrey-oficial/ds-ng';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component( {
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    BmbButtonDirective,
    BmbInputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
} )
export class LoginComponent {
  errorMessage = '';
  isLoading = false;

  // Formulario reactivo con validaciones
  userForm: FormGroup = new FormGroup( {
    email: new FormControl( { value: '', disabled: false }, [ Validators.required, Validators.email ] ),
    password: new FormControl( { value: '', disabled: false }, [ Validators.required, Validators.minLength( 6 ) ] ),
  } );


  showErrors: { [ key: string ]: boolean; } = {};

  constructor( private authService: AuthService, private router: Router ) { }

  onSubmit(): void {
    this.userForm.markAllAsTouched();
    this.updateErrorState();

    if ( !this.userForm.valid ) {
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    this.userForm.disable(); // Deshabilita los controles a través del FormGroup

    this.authService.login(
      this.userForm.get( 'email' )?.value,
      this.userForm.get( 'password' )?.value
    )
      .pipe(
        finalize( () => {
          this.isLoading = false;
          this.userForm.enable();
        } )
      )
      .subscribe( {
        next: () => {
          this.router.navigate( [ '/report' ] );
        },
        error: ( error ) => {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
          console.error( 'Login error:', error );
        }
      } );
  }

  updateErrorState(): void {
    Object.keys( this.userForm.controls ).forEach( ( field ) => {
      const control = this.userForm.get( field );
      if ( control instanceof FormControl ) {
        this.showErrors[ field ] = control.invalid && ( control.touched || control.dirty );
      }
    } );
  }

  getFormControl( name: string ): FormControl {
    return this.userForm.get( name ) as FormControl;
  }
}
