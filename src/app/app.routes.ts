import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { SwipeComponent } from '../swipe/swipe.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'swipe', component: SwipeComponent },
  { path: '**', redirectTo: '/login' }
];
