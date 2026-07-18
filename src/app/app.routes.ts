import { Routes } from '@angular/router';
import { ApplicationComponent } from './pages/application/application.component';
import { CardComponent } from './pages/card/card.component';
import { VerifyComponent } from './pages/verify/verify.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
    { path: 'application', component: ApplicationComponent },
  { path: 'carte', component: CardComponent },
  { path: 'verification', component: VerifyComponent },
  { path: 'verification/:token', component: VerifyComponent },
  { path: '**', redirectTo: '' }
];
