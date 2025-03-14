import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { twMerge } from '../../../../utils';
import { LayoutNavigationItem, LayoutSwitcherItem } from '../../layout.model';
import { getActiveSubItem } from '../../layout.utils';

@Component({
  selector: 'da-switcher-item',
  template: `
    <div [class]="className">
      <button
        type="button"
        [class]="
          twMerge(
            'tw-group tw-flex tw-h-16 tw-w-full tw-items-center tw-gap-2 tw-px-6 tw-text-left focus:tw-outline-none',
            item.selected
              ? 'tw-font-extrabold tw-text-neutral-900'
              : 'tw-font-semibold tw-text-neutral-600 hover:tw-text-neutral-900 focus:tw-text-neutral-900',
            buttonClassName
          )
        "
        [attr.data-dgat]="item.dgat"
        [attr.aria-expanded]="open"
        [attr.aria-controls]="item.productKey + '-disclosure-panel'"
        [disabled]="!collapsible"
        (click)="handleClick()"
      >
        <div
          [class]="
            twMerge(
              'tw-mr-4 tw-grid tw-size-8 tw-flex-shrink-0 tw-place-items-center',
              item.selected ? 'tw-text-blue-800' : 'tw-text-blue-300 group-hover:tw-text-blue-800 group-focus:tw-text-blue-800'
            )
          "
          class="tw-mr-4 tw-grid tw-size-8 tw-flex-shrink-0 tw-place-items-center"
        >
          <ng-container *ngIf="item.selected; else defaultIcon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="currentColor" />
              <path
                d="M20.9451 12.4599L21.0413 12.5596C21.4991 13.0592 21.4991 13.8301 21.0413 14.3297L15.4323 20.4502C15.2311 20.6697 14.9654 20.793 14.6919 20.8179L14.5743 20.8225C14.2997 20.8192 14.0253 20.7171 13.8078 20.5141L13.7445 20.4502L11.3434 17.8301C10.8855 17.3305 10.8855 16.5596 11.3434 16.06L11.3762 16.0242C11.8073 15.5538 12.5345 15.5252 13.0006 15.9603L13.064 16.0242L14.5875 17.687L19.3206 12.5238C19.7517 12.0534 20.479 12.0248 20.9451 12.4599Z"
                fill="white"
              />
            </svg>
          </ng-container>
          <ng-template #defaultIcon>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="8" fill="currentColor" />
            </svg>
          </ng-template>
        </div>
        <span class="tw-line-clamp-2 tw-flex-1">{{ item.text }}</span>
        <ng-container *ngIf="collapsible">
          <da-icon
            icon="chevron-right"
            type="solid"
            [solidSize]="16"
            [className]="twMerge('tw-pointer-events-none tw-size-4', open ? 'tw-rotate-90' : '')"
          />
        </ng-container>
      </button>
    </div>

    <div *ngIf="open" id="{{ item.productKey + '-disclosure-panel' }}" class="tw-border-t tw-border-neutral-300">
      <ul>
        <li *ngFor="let subItem of item.subItems">
          <ng-container *ngIf="subItem.routerLink; else externalLink">
            <a
              [routerLink]="subItem.routerLink"
              [class]="
                twMerge(
                  'tw-flex tw-w-full tw-items-center tw-bg-neutral-100 tw-py-4 tw-pl-7 tw-pr-6 hover:tw-bg-neutral-200 hover:tw-text-neutral-800 focus:tw-bg-neutral-200 focus:tw-text-neutral-800 focus-visible:tw-outline-none active:tw-bg-neutral-200 active:tw-text-neutral-900',
                  subItem === this.activeChild ? 'tw-font-extrabold tw-text-neutral-800' : 'tw-font-semibold tw-text-neutral-600',
                  subItemClassName
                )
              "
              [attr.data-dgat]="subItem.dgat"
            >
              <da-icon *ngIf="subItem.icon" [icon]="subItem.icon" type="outline" className="tw-size-6 tw-shrink-0 tw-mr-7" />
              <span class="tw-grow tw-truncate">{{ subItem.text }}</span>
              <da-icon *ngIf="subItem === activeChild" icon="check" type="solid" className="tw-size-6 tw-shrink-0 tw-ml-2" />
            </a>
          </ng-container>

          <ng-template #externalLink>
            <a
              [href]="subItem.href"
              [class]="
                twMerge(
                  'tw-flex tw-w-full tw-items-center tw-bg-neutral-100 tw-py-4 tw-pl-7 tw-pr-6 hover:tw-bg-neutral-200 hover:tw-text-neutral-800 focus:tw-bg-neutral-200 focus:tw-text-neutral-800 focus-visible:tw-outline-none active:tw-bg-neutral-200 active:tw-text-neutral-900',
                  subItem === this.activeChild ? 'tw-font-extrabold tw-text-neutral-800' : 'tw-font-semibold tw-text-neutral-600',
                  subItemClassName
                )
              "
              [attr.data-dgat]="subItem.dgat"
            >
              <da-icon *ngIf="subItem.icon" [icon]="subItem.icon" type="outline" className="tw-size-6 tw-shrink-0 tw-mr-7" />
              <span class="tw-grow tw-truncate">{{ subItem.text }}</span>
              <da-icon *ngIf="subItem === activeChild" icon="check" type="solid" className="tw-size-6 tw-shrink-0 tw-ml-2" />
            </a>
          </ng-template>
        </li>
      </ul>
    </div>

    <div *ngIf="activeChild && !open" class="tw-border-t tw-border-neutral-300">
      <ul>
        <li>
          <ng-container *ngIf="activeChild.routerLink; else externalActiveChildLink">
            <a
              [routerLink]="activeChild.routerLink"
              [class]="
                twMerge(
                  'tw-flex tw-w-full tw-items-center tw-bg-neutral-100 tw-py-4 tw-pl-7 tw-pr-6 tw-font-extrabold tw-text-neutral-800 hover:tw-bg-neutral-200 hover:tw-text-neutral-800 focus:tw-bg-neutral-200 focus:tw-text-neutral-800 focus-visible:tw-outline-none active:tw-bg-neutral-200 active:tw-text-neutral-900',
                  subItemClassName
                )
              "
              [attr.data-dgat]="activeChild.dgat"
            >
              <da-icon *ngIf="activeChild.icon" [icon]="activeChild.icon" type="outline" className="tw-size-6 tw-shrink-0 tw-mr-7" />
              <span class="tw-grow tw-truncate">{{ activeChild.text }}</span>
              <da-icon *ngIf="activeChild === activeChild" icon="check" type="solid" className="tw-size-6 tw-shrink-0 tw-ml-2" />
            </a>
          </ng-container>

          <ng-template #externalActiveChildLink>
            <a
              [href]="activeChild.href"
              [class]="
                twMerge(
                  'tw-flex tw-w-full tw-items-center tw-bg-neutral-100 tw-py-4 tw-pl-7 tw-pr-6 tw-font-extrabold tw-text-neutral-800 hover:tw-bg-neutral-200 hover:tw-text-neutral-800 focus:tw-bg-neutral-200 focus:tw-text-neutral-800 focus-visible:tw-outline-none active:tw-bg-neutral-200 active:tw-text-neutral-900',
                  subItemClassName
                )
              "
              [attr.data-dgat]="activeChild.dgat"
            >
              <da-icon *ngIf="activeChild.icon" [icon]="activeChild.icon" type="outline" className="tw-size-6 tw-shrink-0 tw-mr-7" />
              <span class="tw-grow tw-truncate">{{ activeChild.text }}</span>
              <da-icon *ngIf="activeChild === activeChild" icon="check" type="solid" className="tw-size-6 tw-shrink-0 tw-ml-2" />
            </a>
          </ng-template>
        </li>
      </ul>
    </div>
  `,
})
export class SwitcherItemComponent implements OnInit, OnDestroy {
  @Input() item!: LayoutSwitcherItem;
  @Input() open?: boolean;
  @Input() collapsible?: boolean;
  @Input() className = '';
  @Input() buttonClassName = '';
  @Input() subItemClassName = '';
  @Output() itemSelect = new EventEmitter<LayoutSwitcherItem>();

  activeChild: LayoutNavigationItem | null = null;
  twMerge = twMerge;

  private subscription: Subscription;

  constructor(private router: Router) {
    this.subscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => (event as NavigationEnd).urlAfterRedirects)
      )
      .subscribe(this.updateActiveChild.bind(this));
  }

  ngOnInit(): void {
    this.updateActiveChild();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateActiveChild(): void {
    const pathname = this.router.url;
    if (this.item.selected && this.item.subItems) {
      this.activeChild = getActiveSubItem(pathname, this.item.subItems);
    }
  }

  handleClick(): void {
    this.itemSelect.emit(this.item);
  }
}
