// src/app/pages/report/report.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { models, Report } from 'powerbi-client';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface EmbedInfo {
  accessToken: string;
  embedUrl: string;
  expiry: string;
}

@Component( {
  selector: 'app-report',
  standalone: true,
  imports: [ CommonModule, PowerBIEmbedModule ],
  templateUrl: './report.component.html',
  styleUrls: [ './report.component.css' ] // Corregido
} )
export class ReportComponent implements OnInit, OnDestroy {
  embedInfo: EmbedInfo | null = null;
  error = '';
  reportConfig: any;
  isLoadingReport = false;
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchEmbedInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchEmbedInfo(): void {
    this.isLoadingReport = true;
    this.error = '';
    this.apiService.getEmbedInfo().pipe( takeUntil( this.destroy$ ) ).subscribe( {
      next: ( response ) => {
        this.isLoadingReport = false;
        if ( response.accessToken && response.embedUrl ) {
          this.embedInfo = response;
          this.reportConfig = {
            type: 'report',
            embedUrl: this.embedInfo.embedUrl,
            accessToken: this.embedInfo.accessToken,
            tokenType: models.TokenType.Embed,
            settings: {
              panes: {
                pageNavigation: { position: models.PageNavigationPosition.Left },
                filters: { expanded: false, visible: false }
              }
            }
          };
        } else {
          this.error = 'Error al obtener información del informe de Power BI.';
        }
      },
      error: ( e ) => {
        this.isLoadingReport = false;
        if (
          e?.status === 401 ||
          ( e?.message && e.message.includes( 'Error al solicitar el token de incrustación' ) )
        ) {
          this.authService.logout();
        } else {
          this.error = 'Error al solicitar el token de incrustación. Por favor, inténtelo de nuevo más tarde.';
          console.error( 'Error fetching embed info:', e );
        }
      }
    } );
  }

  onEmbedded( report: Report ): void {
    console.log( 'Report embedded:', report );
  }

  onLoadFailed( errorEvent: any ): void {
    console.error( 'Report load failed:', errorEvent );
    this.error = 'Error al cargar el informe de Power BI. Por favor, inténtelo de nuevo más tarde.';
  }
}