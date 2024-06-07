import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IconsModule } from '../../../lib/icons';
import { LayoutFeatures, LayoutLogos, LayoutNavigation } from '../layout.model';
import { NavItemComponent } from './nav-item.component';
import { NavPopoverComponent } from './nav-popover.component';

@Component({
  selector: 'app-sidebar',
  template: `
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 hidden shadow lg:block"
      [class]="
        [
          'bg-[var(--layout-background,white)] text-[var(--layout-text,theme(colors.neutral.800))]',
          className
        ].join(' ')
      "
    >
      <!-- Sidebar Expand Button -->
      <button
        id="sidebar-expand-button"
        class="absolute -right-4 top-4 rounded-md bg-white p-1.5 text-sm font-semibold text-neutral-900 shadow-lg ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none active:bg-neutral-100"
        [title]="sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'"
        (click)="handleToggleExpanded()"
      >
        <app-dynamic-icon
          icon="chevron-right"
          type="solid"
          [solidSize]="16"
          [className]="
            ['size-4', sidebarExpanded ? 'rotate-180' : ''].join(' ')
          "
        ></app-dynamic-icon>
        <span class="sr-only">{{
          sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'
        }}</span>
      </button>

      <!-- Logos -->
      <div class="grid h-20 place-content-center overflow-hidden" *ngIf="logos">
        <ng-container *ngIf="sidebarExpanded; else markLogo">
          <div class="flex">
            <img [src]="logos.logo.url" alt="Logo" class="h-10" />
          </div>
        </ng-container>
        <ng-template #markLogo>
          <img [src]="logos.mark.url" alt="Logo" class="size-10" />
        </ng-template>
        <span class="sr-only">Logo</span>
      </div>

      <div
        class="fixed bottom-0 left-0 top-20 overflow-y-auto overflow-x-hidden pb-4"
        [ngClass]="sidebarExpanded ? 'w-52' : 'w-20'"
      >
        <!-- Sidebar Navigation -->
        <nav *ngIf="navigation" class="flex h-full flex-col">
          <ul class="flex flex-col">
            <li *ngFor="let item of navigation.top">
              <ng-container *ngIf="item.path; else subItems">
                <app-nav-item
                  [label]="item.label"
                  [icon]="item.icon"
                  [path]="item.path"
                  [iconOnly]="!sidebarExpanded"
                ></app-nav-item>
              </ng-container>
              <ng-template #subItems>
                <ng-container *ngIf="item.subItems?.length">
                  <app-nav-popover
                    [label]="item.label"
                    [icon]="item.icon"
                    [subItems]="item.subItems"
                    [iconOnly]="!sidebarExpanded"
                  ></app-nav-popover>
                </ng-container>
              </ng-template>
            </li>
          </ul>

          <ul class="flex grow flex-col justify-end">
            <li *ngIf="features?.add" class="py-2 text-center">
              <button
                type="button"
                class="inline-flex items-center gap-0.5 whitespace-nowrap rounded-md bg-white py-1.5 text-sm font-semibold text-neutral-900 shadow-lg ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none active:bg-neutral-100"
                [class]="sidebarExpanded ? 'px-2.5' : 'px-1.5'"
                (click)="handleAdd($event)"
              >
                <app-dynamic-icon
                  icon="plus"
                  type="solid"
                  [solidSize]="16"
                  className="size-4"
                ></app-dynamic-icon>
                <span [ngClass]="sidebarExpanded ? '' : 'sr-only'"> Add </span>
              </button>
            </li>
            <li *ngFor="let item of navigation.bottom">
              <ng-container *ngIf="item.path; else subItemsBottom">
                <app-nav-item
                  [label]="item.label"
                  [icon]="item.icon"
                  [path]="item.path"
                  [iconOnly]="!sidebarExpanded"
                ></app-nav-item>
              </ng-container>
              <ng-template #subItemsBottom>
                <ng-container *ngIf="item.subItems?.length">
                  <app-nav-popover
                    [label]="item.label"
                    [icon]="item.icon"
                    [subItems]="item.subItems"
                    [iconOnly]="!sidebarExpanded"
                  ></app-nav-popover>
                </ng-container>
              </ng-template>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  `,
  standalone: true,
  imports: [CommonModule, NavItemComponent, NavPopoverComponent, IconsModule],
})
export class SidebarComponent {
  @Input() logos?: LayoutLogos;
  @Input() features?: LayoutFeatures;
  @Input() navigation?: LayoutNavigation;
  @Input() sidebarExpanded = false;
  @Input() className = '';
  @Output() toggleExpanded = new EventEmitter<void>();
  @Output() add = new EventEmitter<MouseEvent>();

  handleToggleExpanded() {
    this.toggleExpanded.emit();
  }

  handleAdd(event: MouseEvent) {
    this.add.emit(event);
  }
}
