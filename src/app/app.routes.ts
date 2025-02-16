import { Routes } from '@angular/router';
import { RouteFormComponent } from './components/route-form/route-form.component';
import { HomeComponent } from './components/home/home.component';
import { HistoricalRoutesComponent } from './components/historical-routes/historical-routes.component';
import { HistoricalCategoriesComponent } from './components/historical-categories/historical-categories.component';
import { RouteResultComponent } from './components/route-result/route-result.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'route-form',
    component: RouteFormComponent
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'historical-categories',
    component: HistoricalCategoriesComponent
  },
  {
    path: 'historical-routes',
    component: HistoricalRoutesComponent
  },
  {
    path: 'route-result',
    component: RouteResultComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

console.log('Routes configured:', routes);
