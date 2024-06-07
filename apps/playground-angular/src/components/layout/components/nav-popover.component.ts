import { animate, style, transition, trigger } from '@angular/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { twMerge } from 'tailwind-merge';

import { A11yModule } from '@angular/cdk/a11y';
import { IconsModule } from '../../../lib/icons';
import { NavigationSubItem } from '../layout.model';
import { NavItemComponent } from './nav-item.component';

@Component({
  selector: 'app-nav-popover',
  template: `
    <div class="relative">
      <button
        type="button"
        [class]="
          twMerge(
            'flex w-full items-center gap-2 py-2 pl-7 pr-1 text-left focus:outline-none',
            'hover:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] hover:text-[var(--layout-highlight,theme(colors.neutral.800))]',
            'focus:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] focus:text-[var(--layout-highlight,theme(colors.neutral.800))]',
            'active:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)] active:text-[var(--layout-highlight,theme(colors.neutral.900))]',
            iconOnly ? 'pr-1' : 'pr-7'
          )
        "
        (click)="open = !open"
        cdkOverlayOrigin
        #trigger="cdkOverlayOrigin"
      >
        <ng-container *ngIf="icon">
          <app-dynamic-icon
            [icon]="icon"
            type="solid"
            className="size-6 shrink-0"
          ></app-dynamic-icon>
        </ng-container>
        <span class="{{ iconOnly ? 'sr-only' : 'grow' }}">{{ label }}</span>
        <app-dynamic-icon
          icon="chevron-right"
          type="solid"
          [solidSize]="16"
          className="size-4 shrink-0"
        ></app-dynamic-icon>
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
            overlayY: 'top'
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'bottom'
          }
        ]"
        cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
        [cdkConnectedOverlayHasBackdrop]="true"
        (detach)="open = false"
        (backdropClick)="open = false"
      >
        <div
          @PopoverTrigger
          class="ml-2 min-w-48 origin-left rounded-lg bg-white py-2 shadow-xl ring-1 ring-neutral-200 transition"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
        >
          <ul class="flex flex-col">
            <li *ngFor="let subItem of subItems">
              <app-nav-item
                [label]="subItem.label"
                [path]="subItem.path"
                (onClick)="closePanel()"
              ></app-nav-item>
            </li>
          </ul>
        </div>
      </ng-template>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    OverlayModule,
    A11yModule,
    NavItemComponent,
    IconsModule,
  ],
  animations: [
    trigger('PopoverTrigger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(95%)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'scale(100%)' }),
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(100%)' }),
        animate(
          '100ms ease-in',
          style({ opacity: 0, transform: 'scale(95%)' }),
        ),
      ]),
    ]),
  ],
})
export class NavPopoverComponent {
  @Input() label!: string;
  @Input() icon?: string;
  @Input() subItems?: NavigationSubItem[];
  @Input() iconOnly?: boolean = false;

  open = false;
  twMerge = twMerge;

  closePanel() {
    this.open = false;
  }
}
