import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject } from '@angular/core';
import { BOOTSTRAP_SETTINGS, BootstrapSettings, OrgInfoShort } from '@degreed/core-angular';

@Component({
  selector: 'dgs-product-switcher',
  templateUrl: './product-switcher.component.html',
  animations: [
    trigger('ProductSwitcherMenuTrigger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.95)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('75ms ease-in', style({ opacity: 0, transform: 'scale(.95)' })),
      ]),
    ]),
  ],
})
export class ProductSwitcherComponent {
  isMenuOpen = false;
  hasChannel: boolean;
  hasSkillAnalytics: boolean;
  orgsToManage: OrgInfoShort[];

  constructor(@Inject(BOOTSTRAP_SETTINGS) private bootstrap: BootstrapSettings) {
    const { hasChannel, orgsToManage, hasSkillAnalytics } = bootstrap;
    this.hasChannel = hasChannel;
    this.orgsToManage = orgsToManage;
    this.hasSkillAnalytics = hasSkillAnalytics;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
