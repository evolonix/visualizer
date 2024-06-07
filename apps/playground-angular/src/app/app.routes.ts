import { Route } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { SettingsDashboardComponent } from './settings/settings-dashboard.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'settings',
    children: [
      {
        path: 'dashboard',
        component: SettingsDashboardComponent,
      },
    ],
  },
];
