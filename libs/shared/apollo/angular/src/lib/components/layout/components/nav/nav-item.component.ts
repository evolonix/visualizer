import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { Subscription } from 'rxjs';
import { twMerge } from '../../../../utils';
import { LayoutNavigationItem } from '../../layout.model';
import { isActive } from '../../layout.utils';

@Component({
  selector: 'da-nav-item',
  template: `
    <ng-container *ngIf="item.routerLink; else externalLink">
      <a
        [routerLink]="item.routerLink"
        [class]="
          twMerge(
            'tw-relative tw-flex tw-items-center tw-py-3 tw-text-xs',
            'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.800))]',
            'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.800))] focus:tw-outline-none',
            'active:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.900))]',
            iconOnly ? 'tw-px-7' : 'tw-px-6',
            active ? 'tw-font-semibold tw-text-[var(--apollo-layout-highlight)]' : '',
            className
          )
        "
        [title]="iconOnly ? item.text : ''"
        [attr.data-dgat]="item.dgat"
        (click)="handleClick()"
      >
        <da-nav-icon [item]="item" [active]="active" className="tw-size-6 tw-shrink-0 tw-mr-2" />
        <span [class]="iconOnly ? 'tw-sr-only' : 'tw-grow'">{{ item.text }}</span>

        <div
          *ngIf="active"
          class="tw-absolute tw-inset-y-0 tw-right-0 tw-ml-2 tw-w-1 tw-rounded-l tw-bg-[var(--apollo-layout-highlight)]"
        ></div>
      </a>
    </ng-container>

    <ng-template #externalLink>
      <a
        [href]="item.href"
        [attr.target]="item.target"
        [class]="
          twMerge(
            'tw-relative tw-flex tw-items-center tw-py-3 tw-text-xs',
            'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.800))]',
            'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.800))] focus:tw-outline-none',
            'active:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.900))]',
            iconOnly ? 'tw-px-7' : 'tw-px-6',
            active ? 'tw-font-semibold tw-text-[var(--apollo-layout-highlight)]' : '',
            className
          )
        "
        [title]="iconOnly ? item.text : ''"
        [attr.data-dgat]="item.dgat"
      >
        <da-nav-icon [item]="item" [active]="active" className="tw-size-6 tw-shrink-0 tw-mr-2" />
        <span [class]="iconOnly ? 'tw-sr-only' : 'tw-grow'">{{ item.text }}</span>

        <div
          *ngIf="active"
          class="tw-absolute tw-inset-y-0 tw-right-0 tw-ml-2 tw-w-1 tw-rounded-l tw-bg-[var(--apollo-layout-highlight)]"
        ></div>
      </a>
    </ng-template>
  `,
})
export class NavItemComponent implements OnInit, OnDestroy {
  @Input() item!: LayoutNavigationItem;
  @Input() iconOnly?: boolean = false;
  @Input() className = '';
  @Output() itemSelect = new EventEmitter<void>();

  active = false;
  twMerge = twMerge;

  private subscription: Subscription;

  constructor(private router: Router) {
    this.subscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => (event as NavigationEnd).urlAfterRedirects)
      )
      .subscribe(this.updateActive.bind(this));
  }

  ngOnInit(): void {
    this.updateActive();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleClick() {
    this.itemSelect.emit();
  }

  private updateActive(urlAfterRedirects?: string): void {
    this.active = this.isItemActive(this.item, urlAfterRedirects);
  }

  private isItemActive(item: LayoutNavigationItem, pathname?: string) {
    if (!item.href && !item.routerLink) return false;

    pathname = pathname ?? this.router.url;
    return isActive(pathname, item.href || item.routerLink, item.end);
  }
}
