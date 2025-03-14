import { Component, EventEmitter, Input, Output } from '@angular/core';

import { twMerge } from '../../../utils/tw-merge';
import { LayoutBrand, LayoutFeatures, LayoutNavigation } from '../layout.model';

@Component({
  selector: 'da-sidebar',
  template: `
    <!-- Sidebar -->
    <div
      [class]="
        twMerge(
          'tw-fixed tw-inset-y-0 tw-left-0 tw-shadow-lg',
          'tw-bg-[var(--apollo-layout-background,white)] tw-text-[var(--apollo-layout-text,theme(colors.neutral.800))]',
          className
        )
      "
    >
      <!-- Sidebar Expand Button -->
      <div class="tw-reset">
        <button
          type="button"
          class="tw-btn-icon tw-btn-secondary-outline tw-absolute -tw-right-3 tw-top-6 tw-shadow-lg"
          [title]="sidebarExpanded ? 'Collapse Menu' : 'Expand Menu'"
          (click)="handleToggleExpanded()"
        >
          <da-icon
            icon="chevron-right"
            type="solid"
            [solidSize]="16"
            [className]="twMerge('tw-size-4', sidebarExpanded ? 'tw-rotate-180' : '')"
          />
        </button>
      </div>

      <!-- Logos -->
      <a
        *ngIf="brand"
        [routerLink]="brand.homeUrl"
        data-dgat="product-header-5f2"
        class="tw-grid tw-h-20 tw-place-content-center tw-overflow-hidden focus-visible:tw-outline-none"
      >
        <ng-container *ngIf="sidebarExpanded; else markLogo">
          <img [src]="brand.logo.url" alt="Logo" class="tw-h-full tw-max-h-8 tw-max-w-[152px]" />
        </ng-container>
        <ng-template #markLogo>
          <img [src]="brand.mark.url" alt="Logo" class="tw-size-8" />
        </ng-template>
        <span class="tw-sr-only">Logo</span>
      </a>

      <div
        [class]="
          twMerge(
            'tw-fixed tw-bottom-0 tw-left-0 tw-top-20 tw-overflow-y-auto tw-overflow-x-hidden tw-pb-6 tw-transition-[width]',
            sidebarExpanded ? 'tw-w-[200px]' : 'tw-w-20'
          )
        "
      >
        <!-- Sidebar Navigation -->
        <nav *ngIf="navigation" class="tw-flex tw-h-full tw-flex-col">
          <ul class="tw-flex tw-flex-col">
            <li *ngFor="let item of navigation.top">
              <!-- Nav Item -->
              <ng-container *ngIf="item.href || item.routerLink">
                <da-nav-item [item]="item" [iconOnly]="!sidebarExpanded"></da-nav-item>
              </ng-container>

              <!-- Nav Popover -->
              <ng-container *ngIf="item.subItems?.length">
                <da-nav-popover [item]="item" [iconOnly]="!sidebarExpanded"></da-nav-popover>
              </ng-container>
            </li>
          </ul>

          <ul class="tw-flex tw-grow tw-flex-col tw-justify-end">
            <li *ngIf="features?.addContent?.enabled" class="tw-py-2 tw-text-center">
              <button
                type="button"
                [class]="twMerge('tw-btn-medium tw-btn-secondary-filled', sidebarExpanded ? '' : 'tw-btn-icon')"
                dgat="utilityBar-fab"
                (click)="handleAddContent($event)"
              >
                <da-icon icon="plus" type="solid" [solidSize]="16" className="tw-size-4" />
                <span [class]="sidebarExpanded ? 'tw-whitespace-nowrap' : 'tw-sr-only'">{{ features?.addContent?.text }}</span>
              </button>
            </li>
            <li *ngFor="let item of navigation.bottom">
              <!-- Nav Item -->
              <ng-container *ngIf="item.href || item.routerLink">
                <da-nav-item [item]="item" [iconOnly]="!sidebarExpanded"></da-nav-item>
              </ng-container>

              <!-- Nav Popover -->
              <ng-container *ngIf="item.subItems?.length">
                <da-nav-popover [item]="item" [iconOnly]="!sidebarExpanded"></da-nav-popover>
              </ng-container>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `,
})
export class SidebarComponent {
  @Input() brand?: LayoutBrand;
  @Input() features?: LayoutFeatures;
  @Input() navigation?: LayoutNavigation;
  @Input() sidebarExpanded = false;
  @Input() className = '';
  @Output() toggleExpanded = new EventEmitter<void>();
  @Output() addContent = new EventEmitter<MouseEvent>();

  twMerge = twMerge;

  handleToggleExpanded() {
    this.toggleExpanded.emit();
  }

  handleAddContent(event: MouseEvent) {
    this.addContent.emit(event);
  }
}
