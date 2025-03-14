import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BootstrapSettingsService } from '@degreed/core-angular';

@Component({
  selector: 'dgs-rules-error-state',
  templateUrl: './rules-error-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesErrorStateComponent {
  constructor(public settings: BootstrapSettingsService) {}

  reloadPage() {
    window.location.reload();
  }
}
