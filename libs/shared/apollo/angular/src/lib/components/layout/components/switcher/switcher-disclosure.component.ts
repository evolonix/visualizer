import { Component, Input, OnInit } from '@angular/core';

import { LayoutBrand, LayoutSwitcherNavigation, ProductKey } from '../../layout.model';

@Component({
  selector: 'da-switcher-disclosure',
  template: `
    <div [class]="className">
      <button
        type="button"
        [class]="
          [
            'tw-flex tw-w-full tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-left',
            'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.800))]',
            'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.800))] focus:tw-outline-none',
            'active:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.900))]',
          ].join(' ')
        "
        data-dgat="product-switcher-7a2"
        (click)="open = !open"
      >
        <ng-container *ngIf="brand">
          <img [src]="brand.mark.url" alt="" class="tw-size-6 tw-shrink-0" />
        </ng-container>
        <span class="tw-grow">{{ selectedItemTitle() }}</span>
        <da-icon icon="chevron-right" type="solid" [solidSize]="16" [className]="['tw-size-4', open ? 'tw-rotate-90' : ''].join(' ')" />
      </button>

      <div *ngIf="open">
        <ul class="tw-flex tw-flex-col">
          <li *ngFor="let item of navigation.items; let i = index">
            <da-switcher-item
              [item]="item"
              [open]="openedProduct === item.productKey"
              [collapsible]="collapsible"
              [className]="i === 0 ? '' : 'tw-border-t tw-border-neutral-300'"
              buttonClassName="tw-px-4"
              subItemClassName="tw-px-4"
              (itemSelect)="toggleOpenedProduct($event.productKey)"
            ></da-switcher-item>
          </li>
        </ul>
      </div>
    </div>
  `,
})
export class SwitcherDisclosureComponent implements OnInit {
  @Input() navigation!: LayoutSwitcherNavigation;
  @Input() brand?: LayoutBrand;
  @Input() className = '';

  open = false;
  openedProduct?: ProductKey;
  collapsible = false;

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
