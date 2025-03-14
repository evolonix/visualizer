import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { twMerge } from '../../../utils/tw-merge';
import { useActionKey } from '../../../utils/use-action-key';
import { LayoutBrand, LayoutFeatures, LayoutNavigation, LayoutSwitcherNavigation } from '../layout.model';
import { findActiveWithTitle } from '../layout.utils';

@Component({
  selector: 'da-header',
  template: `
    <!-- Header -->
    <header class="tw-fixed tw-inset-x-0 tw-top-0" [class]="className">
      <div
        [class]="
          twMerge(
            'tw-relative tw-z-20 tw-flex tw-h-16 tw-items-center tw-gap-4 tw-px-4 tw-transition-shadow tw-duration-200 lg:tw-pl-10 lg:tw-pr-6',
            'tw-bg-[var(--apollo-layout-background,white)] tw-text-[var(--apollo-layout-text,theme(colors.neutral.800))]',
            open ? 'lg:tw-shadow-sm' : 'tw-shadow-sm'
          )
        "
      >
        <!-- Header Navigation Button -->
        <div class="lg:tw-hidden">
          <button
            type="button"
            id="header-navigation-button"
            class="tw-btn-medium tw-btn-icon tw-btn-secondary-filled"
            [attr.aria-expanded]="open"
            (click)="open = !open"
          >
            <da-icon *ngIf="open" icon="x-mark" type="solid" [solidSize]="16" className="tw-size-4" />
            <da-icon *ngIf="!open" icon="bars-3" type="solid" [solidSize]="16" className="tw-size-4" />
            <span class="tw-sr-only">{{ open ? 'Close Navigation' : 'Open Navigation' }}</span>
          </button>
        </div>

        <!-- Header Title -->
        <div class="tw-flex-1 tw-text-center lg:tw-text-left">
          <h3 class="tw-text-2xl tw-font-bold">{{ title }}</h3>
        </div>

        <!-- Search Button -->
        <div *ngIf="features?.search?.enabled" class="tw-hidden tw-flex-1 tw-justify-center lg:tw-flex">
          <button
            #searchButtonRef
            type="button"
            [class]="
              twMerge(
                'tw-flex tw-h-10 tw-w-80 tw-items-center tw-justify-center tw-gap-2 tw-rounded-lg tw-bg-white tw-px-3 tw-text-left tw-text-neutral-600 tw-ring-1 tw-ring-neutral-300',
                'hover:tw-bg-neutral-100 focus:tw-bg-neutral-100 focus:tw-outline-none active:tw-bg-neutral-200',
                '[&_*]:pointer-events-none'
              )
            "
            (click)="search.emit($event)"
          >
            <da-icon icon="magnifying-glass" type="solid" [solidSize]="20" className="tw-size-4 tw-shrink-0" />
            <span class="tw-grow">{{ features?.search?.text }}</span>
            <kbd *ngIf="actionKey" class="tw-font-sans tw-text-xs tw-font-semibold">
              <abbr [title]="actionKey[1]" class="tw-text-xs tw-no-underline">{{ actionKey[0] }}</abbr>
              K
            </kbd>
          </button>
        </div>

        <!-- Switcher Popover -->
        <div class="tw-flex tw-w-8 tw-justify-end lg:tw-w-auto lg:tw-flex-1">
          <da-switcher-popover
            *ngIf="switcherNavigation"
            [navigation]="switcherNavigation"
            className="tw-hidden lg:tw-block"
          ></da-switcher-popover>
        </div>
      </div>

      <!-- Header Menu -->
      <ng-container *ngIf="open">
        <div @OverlayTrigger class="tw-fixed tw-inset-0 tw-bg-neutral-500/75 tw-transition-opacity lg:tw-hidden"></div>

        <div @DisclosureTrigger class="tw-fixed tw-inset-0 tw-transform tw-overflow-y-auto tw-pt-16 tw-transition lg:tw-hidden">
          <div
            class="tw-relative tw-origin-top tw-bg-[var(--apollo-layout-background,white)] tw-text-[var(--apollo-layout-text,theme(colors.neutral.800))] tw-shadow-lg tw-transition"
          >
            <!-- Switcher Disclosure -->
            <da-switcher-disclosure
              *ngIf="switcherNavigation"
              [navigation]="switcherNavigation"
              [brand]="brand"
              className="tw-pb-2"
            ></da-switcher-disclosure>

            <!-- Header Navigation -->
            <nav *ngIf="navigation">
              <ul class="tw-flex tw-flex-col tw-border-t tw-border-neutral-300 tw-pb-4 tw-pt-2">
                <li *ngFor="let item of navigation.top.concat(navigation.bottom ?? [])">
                  <!-- Nav Item -->
                  <ng-container *ngIf="item.href || item.routerLink">
                    <da-nav-item [item]="item" className="tw-px-4 tw-text-base" (itemSelect)="handleItemSelect()"></da-nav-item>
                  </ng-container>

                  <!-- Nav Disclosure -->
                  <ng-container *ngIf="item.subItems?.length">
                    <da-nav-disclosure [item]="item" (itemSelect)="handleItemSelect()"></da-nav-disclosure>
                  </ng-container>
                </li>
              </ul>
            </nav>

            <div *ngIf="features?.addContent?.enabled" class="tw-border-t tw-border-neutral-300 tw-py-4 tw-text-center">
              <button type="button" class="tw-btn-medium tw-btn-secondary-filled" dgat="utilityBar-fab" (click)="handleAddContent($event)">
                <da-icon icon="plus" type="solid" [solidSize]="16" className="tw-size-4" />
                <span class="tw-whitespace-nowrap">{{ features?.addContent?.text }}</span>
              </button>
            </div>
          </div>
        </div>
      </ng-container>
    </header>
  `,
  animations: [
    trigger('OverlayTrigger', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms ease-in-out', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('500ms ease-in-out', style({ opacity: 0 }))]),
    ]),
    trigger('DisclosureTrigger', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('500ms ease-in-out', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)' }),
        animate('500ms ease-in-out', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() brand?: LayoutBrand;
  @Input() features?: LayoutFeatures;
  @Input() navigation?: LayoutNavigation;
  @Input() switcherNavigation?: LayoutSwitcherNavigation;
  @Input() className = '';

  @Output() search = new EventEmitter<MouseEvent>();
  @Output() addContent = new EventEmitter<MouseEvent>();

  @ViewChild('searchButtonRef', { static: false })
  searchButtonRef!: ElementRef<HTMLButtonElement>;

  open = false;
  title = '';
  actionKey = useActionKey();
  twMerge = twMerge;

  private subscription: Subscription;

  constructor(private router: Router) {
    // Needed for future add/removeEventListeners
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.subscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => (event as NavigationEnd).urlAfterRedirects)
      )
      .subscribe(this.setTitle.bind(this));
  }

  ngOnInit(): void {
    this.setTitle();
    this.activateKeydown(this.features?.search?.enabled ?? false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['navigation']?.currentValue) {
      this.setTitle();
    }

    if (changes['features']?.currentValue) {
      this.activateKeydown(changes['features']?.currentValue.search.enabled);
    }
  }

  ngOnDestroy(): void {
    this.activateKeydown(false);
    this.subscription.unsubscribe();
  }

  private activateKeydown(active: boolean): void {
    if (active) document.addEventListener('keydown', this.handleKeyDown);
    else document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Translate Cmd-K keydown to search button clicks.
   */
  handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();

      this.searchButtonRef.nativeElement.click();
    }
  }

  handleItemSelect(): void {
    this.open = false;
  }

  handleAddContent(event: MouseEvent) {
    this.addContent.emit(event);
  }

  private setTitle(pathname?: string) {
    if (!this.navigation) return;

    pathname = pathname ?? this.router.url;
    const items = this.navigation.top.concat(this.navigation.bottom ?? []);
    const item = findActiveWithTitle(pathname, items);

    this.title = item?.headerTitle || '';
  }
}
