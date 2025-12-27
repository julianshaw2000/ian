import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';
import { TourPageComponent } from './features/tour/tour-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Vivid History'
  },
  {
    path: 'tour/:id',
    component: TourPageComponent,
    title: 'Tour · Vivid History'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
