import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BootstrapSettingsService } from '@degreed/core-angular';

@Component({
  selector: 'dgs-rules-empty-state',
  templateUrl: './rules-empty-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesEmptyStateComponent {
  constructor(public settings: BootstrapSettingsService) {}
}
