import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';
import { TourPageComponent } from './features/tour/tour-page.component';
import { AdminLoginPageComponent } from './features/admin/admin-login-page.component';
import { AdminDashboardPageComponent } from './features/admin/admin-dashboard-page.component';
import { adminAuthGuard } from './shared/auth/admin-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'CityHistoryWalks'
  },
  {
    path: 'tour/:id',
    component: TourPageComponent,
    title: 'Tour · CityHistoryWalks'
  },
  {
    path: 'admin/login',
    component: AdminLoginPageComponent,
    title: 'Admin Login · CityHistoryWalks'
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardPageComponent,
    title: 'Admin · CityHistoryWalks',
    canActivate: [adminAuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
