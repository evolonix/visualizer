import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

import { twMerge } from '../../../../utils';
import { LayoutSwitcherNavigation, ProductKey } from '../../layout.model';

@Component({
  selector: 'da-switcher-popover',
  template: `
    <div class="tw-relative" [class]="className">
      <div>
        <button
          type="button"
          [class]="
            twMerge(
              'tw-btn-medium tw-btn-tertiary tw-text-[var(--apollo-layout-highlight)]',
              'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.800))]',
              'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.800))]',
              'active:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.900))]'
            )
          "
          data-dgat="product-switcher-7a2"
          title="Switch Apps"
          [attr.aria-expanded]="open"
          aria-haspopup="true"
          cdkOverlayOrigin
          #trigger="cdkOverlayOrigin"
          (click)="open = !open"
        >
          <span class="tw-sr-only">Open product switcher</span>
          <span class="tw-flex tw-items-center">
            <span>{{ selectedItemTitle() }}</span>
            <da-icon icon="chevron-down" type="solid" [solidSize]="16" className="tw-ml-1 tw-size-4 tw-shrink-0" />
          </span>
        </button>
      </div>

      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="open"
        cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
        [cdkConnectedOverlayHasBackdrop]="true"
        cdkConnectedOverlayPanelClass="tw-reset"
        (detach)="open = false"
        (backdropClick)="open = false"
      >
        <div
          @PopoverTrigger
          class="tw-reset tw-mt-2 tw-w-80 tw-origin-top tw-rounded-lg tw-bg-white tw-py-2 tw-shadow-xl tw-ring-1 tw-ring-neutral-200 tw-transition"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
        >
          <div class="tw-px-8 tw-text-sm tw-font-semibold tw-uppercase tw-text-neutral-600">
            {{ navigation.text }}
          </div>
          <div class="tw-overflow-hidden">
            <ng-container *ngFor="let item of navigation.items; let i = index">
              <da-switcher-item
                [item]="item"
                [open]="openedProduct === item.productKey"
                [collapsible]="collapsible"
                [className]="i === 0 ? '' : 'tw-border-t tw-border-neutral-300'"
                (itemSelect)="toggleOpenedProduct($event.productKey)"
              ></da-switcher-item>
            </ng-container>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  animations: [
    trigger('PopoverTrigger', [
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
export class SwitcherPopoverComponent implements OnInit {
  @Input() navigation!: LayoutSwitcherNavigation;
  @Input() className = '';

  open = false;
  openedProduct?: string;
  collapsible = false;
  twMerge = twMerge;

  ngOnInit() {
    const selectedItem = this.navigation.items.find((item) => item.selected);
    if (selectedItem) {
      this.openedProduct = selectedItem.productKey;
    }

    this.collapsible = this.navigation.items.length > 1;
  }

  toggleOpenedProduct(product?: ProductKey) {
    this.openedProduct = this.openedProduct === product ? undefined : product;
  }

  selectedItemTitle() {
    const selectedItem = this.navigation.items.find((item) => item.selected);
    return selectedItem?.buttonText || '';
  }
}
