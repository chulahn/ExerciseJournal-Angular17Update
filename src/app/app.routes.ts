import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/list/list.component').then(m => m.ListComponent) },
  { path: 'edit/:id', loadComponent: () => import('./pages/edit/edit.component').then(m => m.EditComponent) },
  { path: '**', redirectTo: '' }
];
