import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApolloAngularModule } from '@degreed/apollo-angular';
import { BOOTSTRAP_SETTINGS } from '@degreed/core-angular';
import { EventBus } from '@degreed/rsm';
import { EngageUiCommonModule } from '@engage/ui-common';

import { DialogModule } from '@angular/cdk/dialog';
import { SearchDialogComponent } from '../components/search-dialog/search-dialog.component';
import { AppComponent } from './app.component';
import { initApplication, initBootstrapSettings } from './app.initializer';
import { AppRoutingModule } from './routing.module';

@NgModule({
  declarations: [AppComponent, SearchDialogComponent],
  // prettier-ignore
  imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    AppRoutingModule, 
    EngageUiCommonModule,
    ApolloAngularModule,
    DialogModule,
  ],
  providers: [
    {
      provide: EventBus,
      useFactory: () => new EventBus({ enableLogs: true }),
    },
    {
      provide: BOOTSTRAP_SETTINGS,
      useValue: initBootstrapSettings(),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initApplication,
      deps: [BOOTSTRAP_SETTINGS],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
