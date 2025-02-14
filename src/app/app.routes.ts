// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { ReportComponent } from './pages/report/report.component';
import { RootRedirectComponent } from './pages/root-redirect/root-redirect.component';

export const routes: Routes = [
  { path: '', component: RootRedirectComponent },
  { path: 'login', component: LoginComponent },
  { path: 'report', component: ReportComponent, canActivate: [ authGuard ] },
  { path: '**', redirectTo: '/login' }
];
