import { Routes } from '@angular/router';
// import { renderMode } from '@angular/ssr';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/list/list.component').then(m => m.ListComponent) },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/edit/edit.component').then(m => m.EditComponent),
    data: { renderMode: 'client' } // ✅ don’t prerender this route
  },
  { path: '**', redirectTo: '' }
];
