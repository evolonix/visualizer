import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconsModule } from '../../../lib/icons';
import { LayoutLogos, LayoutTheme } from '../layout.model';
@Component({
  selector: 'app-theme-disclosure',
  template: `
    <div>
      <button
        type="button"
        [class]="
          [
            'flex w-full items-center gap-2 px-4 py-2 text-left text-[var(--layout-text,theme(colors.neutral.800))] focus:outline-none',
            'hover:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)]',
            'hover:text-[var(--layout-highlight,theme(colors.neutral.800))]',
            'focus:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)]',
            'focus:text-[var(--layout-highlight,theme(colors.neutral.800))]',
            'active:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)]',
            'active:text-[var(--layout-highlight,theme(colors.neutral.900))]'
          ].join(' ')
        "
        (click)="toggle()"
      >
        <ng-container *ngIf="logos">
          <img [src]="logos.mark.url" alt="" class="size-6 rounded-lg" />
        </ng-container>
        <span class="grow">Theme</span>
        <app-dynamic-icon
          icon="chevron-right"
          type="solid"
          [solidSize]="16"
          [className]="['size-4', open ? 'rotate-90' : ''].join(' ')"
        ></app-dynamic-icon>
      </button>

      <div *ngIf="open">
        <ul class="flex flex-col">
          <li *ngFor="let theme of themes">
            <button
              type="button"
              (click)="selectTheme(theme)"
              [class]="
                [
                  'flex w-full items-center gap-2 px-12 py-2 text-left',
                  'hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none active:bg-neutral-200',
                  '[&_*]:pointer-events-none'
                ].join(' ')
              "
            >
              {{ theme.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, IconsModule],
})
export class ThemeDisclosureComponent {
  @Input() themes!: (LayoutTheme & { name: string })[];
  @Input() logos?: LayoutLogos;
  @Output() themeChange = new EventEmitter<LayoutTheme>();

  open = false;

  toggle() {
    this.open = !this.open;
  }

  selectTheme(theme: LayoutTheme) {
    this.open = false;
    this.themeChange.emit(theme);
  }
}
