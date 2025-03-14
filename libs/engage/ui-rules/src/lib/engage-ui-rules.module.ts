import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TinyMCEModule } from './_tiny-mce.module';

import { AuthenticatedGuard } from '@engage/data-access';
import { EngageUiCommonModule } from '@engage/ui-common';

import { BOOTSTRAP_SETTINGS, BootstrapSettingsService } from '@degreed/core-angular';
import { ROUTES } from './_routes';
import { RulesEmptyStateComponent, RulesErrorStateComponent, RulesListComponent, RulesSkeletonComponent } from './components';
import { RuleEditorComponent, RulesDashboardComponent } from './pages';

@NgModule({
  // prettier-ignore
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule, 
    DialogModule, 
    TinyMCEModule,
    EngageUiCommonModule, 
    RouterModule.forChild(ROUTES), 
  ],
  exports: [RouterModule, RulesDashboardComponent],
  providers: [
    AuthenticatedGuard,
    {
      provide: BootstrapSettingsService,
      useClass: BootstrapSettingsService,
      deps: [BOOTSTRAP_SETTINGS],
    },
  ],
  // prettier-ignore
  declarations: [
    RulesDashboardComponent, 
    RuleEditorComponent, 
    RulesListComponent, 
    RulesEmptyStateComponent,
    RulesErrorStateComponent, 
    RulesSkeletonComponent
  ],
})
export class EngageUiRulesModule {}
