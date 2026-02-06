<<<<<<< HEAD
import { Routes } from '@angular/router';

export const routes: Routes = [];
=======
import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { SwipeComponent } from '../swipe/swipe.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'swipe', component: SwipeComponent },
  { path: '**', redirectTo: '/login' }
];
>>>>>>> 98c37a8a21de07ba905ba143b9758621d237748b
