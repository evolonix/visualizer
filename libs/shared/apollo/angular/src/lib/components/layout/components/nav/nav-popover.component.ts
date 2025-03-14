import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { twMerge } from '../../../../utils';
import { LayoutNavigationItem } from '../../layout.model';
import { isActive } from '../../layout.utils';

@Component({
  selector: 'da-nav-popover',
  template: `
    <button
      type="button"
      [class]="
        twMerge(
          'tw-relative tw-flex tw-w-full tw-items-center tw-py-3 tw-pr-3 tw-text-left tw-text-xs',
          'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.800))]',
          'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.800))] focus:tw-outline-none',
          'active:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.900))]',
          iconOnly ? 'tw-gap-1 tw-pl-7' : 'tw-gap-2 tw-pl-6',
          active ? 'tw-font-semibold tw-text-[var(--apollo-layout-highlight)]' : '',
          open ? 'tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)]' : ''
        )
      "
      [attr.data-dgat]="item.dgat"
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      (click)="open = !open"
    >
      <da-nav-icon [item]="item" [active]="active" className="tw-size-6 tw-shrink-0 tw-min-w-6" />
      <span [class]="iconOnly ? 'tw-sr-only' : 'tw-grow'">{{ item.text }}</span>
      <da-icon icon="chevron-right" type="solid" [solidSize]="16" className="tw-size-4 tw-shrink-0" />

      <div *ngIf="active" class="tw-absolute tw-inset-y-0 tw-right-0 tw-w-1 tw-rounded-l tw-bg-[var(--apollo-layout-highlight)]"></div>
    </button>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="open"
      [cdkConnectedOverlayPositions]="[
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ]"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayPanelClass="tw-reset"
      (detach)="open = false"
      (backdropClick)="open = false"
    >
      <div
        @PopoverTrigger
        class="tw-reset tw-ml-2 tw-min-w-60 tw-origin-left tw-rounded-lg tw-bg-white tw-py-2 tw-shadow-xl tw-ring-1 tw-ring-neutral-200 tw-transition"
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
      >
        <header class="tw-border-b tw-border-neutral-300 tw-px-4 tw-pb-4 tw-pt-2">
          <h4 class="tw-font-extrabold">{{ item.text }}</h4>
        </header>
        <ul class="tw-flex tw-flex-col">
          <li *ngFor="let subItem of item.subItems">
            <ng-container *ngIf="subItem.routerLink; else externalLink">
              <a
                [routerLink]="subItem.routerLink"
                [class]="
                  twMerge(
                    'tw-flex tw-items-center tw-px-4 tw-py-2 hover:tw-bg-neutral-100 focus:tw-bg-neutral-100 focus-visible:tw-outline-none',
                    isSubItemActive(subItem) ? 'tw-font-semibold' : ''
                  )
                "
                [attr.data-dgat]="subItem.dgat"
                (click)="open = false"
              >
                <span class="tw-grow">{{ subItem.text }}</span>

                <da-icon
                  *ngIf="isSubItemActive(subItem)"
                  icon="check-circle"
                  type="solid"
                  className="tw-ml-4 tw-text-green-600 tw-size-6 tw-shrink-0"
                />
              </a>
            </ng-container>

            <ng-template #externalLink>
              <a
                [href]="subItem.href"
                [attr.target]="subItem.target"
                [class]="
                  twMerge(
                    'tw-flex tw-items-center tw-px-4 tw-py-2 hover:tw-bg-neutral-100 focus:tw-bg-neutral-100 focus-visible:tw-outline-none',
                    isSubItemActive(subItem) ? 'tw-font-semibold' : ''
                  )
                "
                [attr.data-dgat]="subItem.dgat"
              >
                <span class="tw-grow">{{ subItem.text }}</span>

                <da-icon
                  *ngIf="isSubItemActive(subItem)"
                  icon="check-circle"
                  type="solid"
                  className="tw-ml-4 tw-text-green-600 tw-size-6 tw-shrink-0"
                />
              </a>
            </ng-template>
          </li>
        </ul>
      </div>
    </ng-template>
  `,
  animations: [
    trigger('PopoverTrigger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(95%)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(100%)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(100%)' }),
        animate('100ms ease-in', style({ opacity: 0, transform: 'scale(95%)' })),
      ]),
    ]),
  ],
})
export class NavPopoverComponent implements OnInit, OnDestroy {
  @Input() item!: LayoutNavigationItem;
  @Input() iconOnly?: boolean = false;

  open = false;
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

  updateActive(urlAfterRedirects?: string): void {
    const findItem = (subItem: LayoutNavigationItem) => this.isSubItemActive(subItem, urlAfterRedirects);
    this.active = this.item.subItems?.some(findItem) ?? false;
  }

  isSubItemActive(subItem: LayoutNavigationItem, pathname?: string) {
    if (!subItem.href && !subItem.routerLink) return false;

    pathname = pathname ?? this.router.url;
    return isActive(pathname, subItem.href || subItem.routerLink, subItem.end);
  }
}
