import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AnalyticsService } from '@degreed/core-angular';
import { RuleActions, RulesFacade, RulesUrlSync, RulesViewModel } from '@engage/data-access';

@Component({
  selector: 'dgs-rules-dashboard',
  templateUrl: './rules-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesDashboardComponent {
  vm$: Observable<RulesViewModel>;

  constructor(
    facade: RulesFacade,
    private urlSync: RulesUrlSync,
    private analytics: AnalyticsService
  ) {
    this.vm$ = facade.vm$.pipe(urlSync.updateUrl);
    this.urlSync.updateState();

    this.analytics.report(RuleActions.rulesDashboardOpened());
  }
}
