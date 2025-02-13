import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RouteFormComponent } from './components/route-form/route-form.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Главная - Планировщик маршрутов'
  },
  {
    path: 'route',
    component: RouteFormComponent,
    title: 'Создание маршрута'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

console.log('Routes configured:', routes);
