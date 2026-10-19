import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.RegisterPage),
  },
  {
    path: 'register',
    redirectTo: 'registro',
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then((m) => m.AdminDashboardPage),
      },
      {
        path: 'inventario',
        loadComponent: () => import('./features/admin/inventory/inventory-page').then((m) => m.InventoryPageComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
