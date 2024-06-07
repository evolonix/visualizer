import { animate, style, transition, trigger } from '@angular/animations';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { twMerge } from 'tailwind-merge';
import { IconsModule } from '../../../lib/icons';
import { LayoutTheme } from '../layout.model';

@Component({
  selector: 'app-theme-popover',
  template: `
    <div>
      <button
        type="button"
        [class]="
          twMerge(
            'hidden rounded-md px-2.5 py-1.5 text-sm font-semibold text-neutral-900 ring-inset focus:outline-none lg:block',
            'hover:bg-neutral-50 hover:text-neutral-900 hover:shadow-md hover:ring-1 hover:ring-neutral-300',
            'focus:bg-neutral-50 focus:text-neutral-900 focus:shadow-md focus:ring-1 focus:ring-neutral-300',
            'active:bg-neutral-100 active:text-neutral-900 active:shadow-md active:ring-1 active:ring-neutral-300',
            this.className
          )
        "
        (click)="open = !open"
        cdkOverlayOrigin
        #trigger="cdkOverlayOrigin"
      >
        Theme
      </button>

      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="open"
        cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
        [cdkConnectedOverlayHasBackdrop]="true"
        (detach)="open = false"
        (backdropClick)="open = false"
      >
        <div
          @PopoverTrigger
          class="mt-2 min-w-48 origin-top rounded-lg bg-white py-2 shadow-xl ring-1 ring-neutral-200 transition"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
        >
          <ul class="flex flex-col">
            <li *ngFor="let theme of themes">
              <button
                type="button"
                (click)="selectTheme(theme)"
                class="flex w-full items-center gap-2 px-7 py-2 text-left hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none active:bg-neutral-200 [&_*]:pointer-events-none"
              >
                {{ theme.name }}
              </button>
            </li>
          </ul>
        </div>
      </ng-template>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, OverlayModule, A11yModule, IconsModule],
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
export class ThemePopoverComponent {
  @Input() themes!: (LayoutTheme & { name: string })[];
  @Input() className = '';
  @Output() themeChange = new EventEmitter<LayoutTheme>();

  open = false;
  twMerge = twMerge;

  selectTheme(theme: LayoutTheme): void {
    this.themeChange.emit(theme);
    this.open = false;
  }
}
