import { Routes } from '@angular/router';
import { AuthenticatedGuard } from '@engage/data-access';

import { RuleEditorComponent, RulesDashboardComponent } from './pages';

/**
 * Note: '/rules' is a component-less route
 * It purpose is to consume URL segments, provide some data to its children, and do it without instantiating any components.
 */
export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthenticatedGuard],
    children: [
      {
        path: '',
        component: RulesDashboardComponent,
      },
      {
        path: 'add',
        component: RuleEditorComponent,
      },
      {
        path: ':id/edit',
        component: RuleEditorComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
