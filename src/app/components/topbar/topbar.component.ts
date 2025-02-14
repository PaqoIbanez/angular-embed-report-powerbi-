// src/app/components/topbar/topbar.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BmbTopBarComponent } from '@ti-tecnologico-de-monterrey-oficial/ds-ng';
import { AuthService } from '../../services/auth.service';

@Component( {
  selector: 'app-top-bar',
  standalone: true,
  imports: [ RouterModule, BmbTopBarComponent ],
  templateUrl: './topbar.component.html',
  styleUrls: [ './topbar.component.css' ] // Corregido
} )
export class TopBarComponent {
  @Output() logoutClicked = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logOut( event: Event ): void {
    this.authService.logout();
    this.logoutClicked.emit();
  }

  onLangChange( event: string ): void {
    // TODO: Implementar la lógica de cambio de idioma
  }

  userProfileClick( event: void ): void {
    // TODO: Implementar la lógica para el clic en el perfil del usuario
  }
}