// src/app/pages/login/login.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component( {
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ] // Corregido
} )
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor( private authService: AuthService, private router: Router ) { }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login( this.email, this.password ).subscribe( {
      next: () => {
        this.router.navigate( [ '/report' ] );
      },
      error: ( error ) => {
        this.errorMessage = 'Usuario o contraseña incorrectos.';
        console.error( 'Login error:', error );
      },
      complete: () => {
        this.isLoading = false;
      }
    } );
  }
}
