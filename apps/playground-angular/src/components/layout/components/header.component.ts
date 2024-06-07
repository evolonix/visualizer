import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { animate, style, transition, trigger } from '@angular/animations';
import { IconsModule, useActionKey } from '../../../lib';
import {
  LayoutFeatures,
  LayoutLogos,
  LayoutNavigation,
  LayoutTheme,
} from '../layout.model';
import { NavDisclosureComponent } from './nav-disclosure.component';
import { NavItemComponent } from './nav-item.component';
import { ThemeDisclosureComponent } from './theme-disclosure.component';
import { ThemePopoverComponent } from './theme-popover.component';

const themes: (LayoutTheme & { name: string })[] = [
  {
    name: 'Light',
    colors: { background: 'white', highlight: 'var(--tw-color-blue-500)' },
    text: 'dark',
  },
  {
    name: 'Dark',
    colors: {
      background: 'var(--tw-color-neutral-900)',
      highlight: 'var(--tw-color-green-300)',
    },
    text: 'light',
  },
];

@Component({
  selector: 'app-header',
  template: `
    <!-- Header -->
    <div
      [ngStyle]="{
        '--layout-background': theme?.colors?.background,
        '--layout-text':
          theme?.text === 'light' ? 'white' : 'var(--tw-color-neutral-800)'
      }"
    >
      <header class="fixed inset-x-0 top-0" [ngClass]="className">
        <div
          class="relative z-20 flex h-16 items-center gap-4 px-4 transition-shadow duration-200 lg:px-8"
          [ngClass]="{
            'bg-[var(--layout-background,white)] text-[var(--layout-text,theme(colors.neutral.800))]': true,
            'lg:shadow-sm': open,
            'shadow-sm': !open
          }"
        >
          <!-- Header Navigation Button -->
          <div class="lg:hidden">
            <button
              id="header-navigation-button"
              class="hover:bg-neutral-5 rounded-md bg-white p-1.5 text-sm font-semibold text-neutral-900 shadow-md ring-1 ring-inset ring-neutral-300 focus:bg-neutral-50 focus:outline-none active:bg-neutral-100"
              (click)="toggleOpen()"
            >
              <app-dynamic-icon
                *ngIf="open"
                icon="x-mark"
                type="solid"
                [solidSize]="16"
                className="size-4"
              />
              <app-dynamic-icon
                *ngIf="!open"
                icon="bars-3"
                type="solid"
                [solidSize]="16"
                className="size-4"
              />
              <span class="sr-only">{{
                open ? 'Close Navigation' : 'Open Navigation'
              }}</span>
            </button>
          </div>

          <!-- Header Title -->
          <div class="flex-1 text-center lg:text-left">Header</div>

          <!-- Search Button -->
          <div
            *ngIf="features?.search"
            class="hidden flex-1 justify-center lg:flex"
          >
            <button
              #searchButtonRef
              type="button"
              class="flex w-72 items-center gap-2 rounded-lg bg-white px-2 py-1 text-left text-neutral-800 ring-1 ring-neutral-200 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none active:bg-neutral-200"
              (click)="search.emit($event)"
            >
              <app-dynamic-icon
                icon="magnifying-glass"
                className="size-5"
              ></app-dynamic-icon>
              <span class="grow">Search</span>
              <kbd *ngIf="actionKey" class="font-sans text-xs font-semibold">
                <abbr title="{{ actionKey[1] }}" class="no-underline">{{
                  actionKey[0]
                }}</abbr>
                K
              </kbd>
            </button>
          </div>

          <!-- Theme Button -->
          <div class="flex w-7 justify-end lg:w-auto lg:flex-1">
            <app-theme-popover
              [themes]="themes"
              className="text-[var(--layout-text)]"
              (themeChange)="themeChange.emit($event)"
            ></app-theme-popover>
          </div>
        </div>

        <ng-container *ngIf="open">
          <div
            @OverlayTrigger
            class="fixed inset-0 bg-neutral-500/75 transition-opacity lg:hidden"
          ></div>

          <div
            @DisclosureTrigger
            class="fixed inset-0 transform overflow-y-auto pt-16 transition lg:hidden"
          >
            <div
              class="relative origin-top bg-[var(--layout-background,white)] pb-4 text-[var(--layout-text,theme(colors.neutral.800))] shadow-lg transition"
            >
              <app-theme-disclosure
                [themes]="themes"
                [logos]="logos"
                (themeChange)="handleThemeChange($event)"
              ></app-theme-disclosure>

              <!-- Header Navigation -->
              <nav *ngIf="navigation">
                <ul class="flex flex-col">
                  <li *ngFor="let item of navigation.top">
                    <ng-container *ngIf="item.path">
                      <app-nav-item
                        [label]="item.label"
                        [icon]="item.icon"
                        [path]="item.path"
                        className="px-4"
                        (itemSelect)="handleItemSelect()"
                      ></app-nav-item>
                    </ng-container>
                    <ng-container *ngIf="item.subItems?.length">
                      <app-nav-disclosure
                        [label]="item.label"
                        [icon]="item.icon"
                        [subItems]="item.subItems"
                        (itemSelect)="handleItemSelect()"
                      ></app-nav-disclosure>
                    </ng-container>
                  </li>
                  <li *ngFor="let item of navigation.bottom">
                    <ng-container *ngIf="item.path">
                      <app-nav-item
                        [label]="item.label"
                        [icon]="item.icon"
                        [path]="item.path"
                        className="px-4"
                        (itemSelect)="handleItemSelect()"
                      ></app-nav-item>
                    </ng-container>
                    <ng-container *ngIf="item.subItems?.length">
                      <app-nav-disclosure
                        [label]="item.label"
                        [icon]="item.icon"
                        [subItems]="item.subItems"
                        (itemSelect)="handleItemSelect()"
                      ></app-nav-disclosure>
                    </ng-container>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </ng-container>
      </header>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavDisclosureComponent,
    NavItemComponent,
    ThemeDisclosureComponent,
    ThemePopoverComponent,
    IconsModule,
  ],
  animations: [
    trigger('OverlayTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease-in-out', style({ opacity: 0 })),
      ]),
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
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() features?: LayoutFeatures;
  @Input() navigation?: LayoutNavigation;
  @Input() logos?: LayoutLogos;
  @Input() className = '';
  @Output() search = new EventEmitter<MouseEvent>();
  @Output() themeChange = new EventEmitter<LayoutTheme>();

  @ViewChild('searchButtonRef', { static: false })
  searchButtonRef!: ElementRef<HTMLButtonElement>;

  actionKey = useActionKey();
  open = false;
  themes = themes;
  theme: LayoutTheme | undefined;

  ngOnInit(): void {
    if (this.features?.search) {
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  ngAfterViewInit(): void {
    if (this.features?.search) {
      this.handleKeyDown = this.handleKeyDown.bind(this);
    }
  }

  ngOnDestroy(): void {
    if (this.features?.search) {
      document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.search.emit({
        currentTarget: this.searchButtonRef.nativeElement,
      } as unknown as MouseEvent);
    }
  }

  toggleOpen(): void {
    this.open = !this.open;
  }

  handleItemSelect(): void {
    this.open = false;
  }

  handleThemeChange(theme: LayoutTheme): void {
    this.open = false;
    this.theme = theme;
    this.themeChange.emit(theme);
  }
}
