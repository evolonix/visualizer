import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngageDataAccessModule } from '@engage/data-access';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'rules' },
  {
    path: 'rules',
    loadChildren: () => import('@engage/ui-rules').then((m) => m.EngageUiRulesModule),
  },
  {
    path: '**',
    redirectTo: 'rules',
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes, { enableTracing: false }), EngageDataAccessModule.forRoot()],
  exports: [RouterModule],
})
export class AppRoutingModule {}
