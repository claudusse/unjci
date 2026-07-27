import { Routes } from '@angular/router';
import { ApplicationComponent } from './pages/application/application.component';
import { CardComponent } from './pages/card/card.component';
import { VerifyComponent } from './pages/verify/verify.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MemberDashboardComponent } from './pages/member-dashboard/member-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { roleGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'application', component: ApplicationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'espace-membre', component: MemberDashboardComponent, canActivate: [roleGuard('member')] },
  { path: 'administration', component: AdminDashboardComponent, canActivate: [roleGuard('admin')] },
  { path: 'carte', component: CardComponent },
  { path: 'verification', component: VerifyComponent },
  { path: 'verification/:token', component: VerifyComponent },
  { path: '**', redirectTo: '' }
];
