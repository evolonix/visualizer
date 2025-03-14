import { Component, Input } from '@angular/core';

import { twMerge } from '../../../../utils';
import { LayoutNavigationItem } from '../../layout.model';

@Component({
  selector: 'da-nav-icon',
  template: `
    <ng-container *ngIf="item.icon">
      <da-icon [icon]="item.icon" [className]="className" />
    </ng-container>
    <ng-container *ngIf="item.image">
      <img
        [src]="item.image"
        alt=""
        [class]="twMerge('tw-rounded-full', active ? 'tw-ring-2 tw-ring-[var(--apollo-layout-highlight)] tw-ring-offset-2' : '', className)"
        aria-hidden="true"
      />
    </ng-container>
  `,
})
export class NavIconComponent {
  @Input() item!: LayoutNavigationItem;
  @Input() active?: boolean;
  @Input() className = '';

  twMerge = twMerge;
}
