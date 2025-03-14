import { A11yModule } from '@angular/cdk/a11y';
import { DialogModule } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  FooterComponent,
  HeaderComponent,
  LayoutComponent,
  NavDisclosureComponent,
  NavIconComponent,
  NavItemComponent,
  NavPopoverComponent,
  SidebarComponent,
  SwitcherDisclosureComponent,
  SwitcherItemComponent,
  SwitcherPopoverComponent,
} from './components';
import { IconsModule } from './icons';
import { DialogService } from './services';

@NgModule({
  imports: [A11yModule, CommonModule, DialogModule, IconsModule, OverlayModule, RouterModule],
  declarations: [
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    NavDisclosureComponent,
    NavIconComponent,
    NavItemComponent,
    NavPopoverComponent,
    SidebarComponent,
    SwitcherDisclosureComponent,
    SwitcherItemComponent,
    SwitcherPopoverComponent,
  ],
  exports: [DialogModule, IconsModule, LayoutComponent, OverlayModule],
  providers: [DialogService],
})
export class ApolloAngularModule {}
