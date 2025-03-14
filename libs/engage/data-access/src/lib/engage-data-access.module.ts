import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { AnalyticsService, getXsrfTokenName, XSRF_PROVIDER } from '@degreed/core-angular';

import { AuthDataService, AuthFacade, AuthInterceptor, AuthStore } from './auth';
import { FeatureFlagsService } from './feature-flags';
import { RulesDataService, RulesFacade, RulesStore, RulesUrlSync } from './rules';

@NgModule({
  imports: [CommonModule],
  providers: [
    provideHttpClient(
      withInterceptorsFromDi(),
      withXsrfConfiguration({
        // send antiforgery tokens in XHR requests
        cookieName: getXsrfTokenName(window.location.hostname),
      })
    ),
  ],
})
export class EngageDataAccessModule {
  public static forRoot(): ModuleWithProviders<EngageDataAccessModule> {
    return {
      ngModule: EngageDataAccessModule,
      providers: [
        AnalyticsService,
        FeatureFlagsService,
        AuthDataService,
        AuthStore,
        AuthFacade,
        RulesDataService,
        RulesUrlSync,
        RulesFacade,
        RulesStore,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        XSRF_PROVIDER,
      ],
    };
  }
}
