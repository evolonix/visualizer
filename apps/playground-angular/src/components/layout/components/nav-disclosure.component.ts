import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconsModule } from '../../../lib/icons';
import { NavigationSubItem } from '../layout.model';
import { NavItemComponent } from './nav-item.component';

@Component({
  selector: 'app-nav-disclosure',
  template: `
    <div>
      <button
        [class]="
          [
            'flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)]',
            'hover:text-[var(--layout-highlight,theme(colors.neutral.800))]',
            'focus:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)]',
            'focus:text-[var(--layout-highlight,theme(colors.neutral.800))]',
            'focus:outline-none',
            'active:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)]',
            'active:text-[var(--layout-highlight,theme(colors.neutral.900))]'
          ].join(' ')
        "
        (click)="toggle()"
      >
        <ng-container *ngIf="icon">
          <app-dynamic-icon
            [icon]="icon"
            type="solid"
            className="size-6 shrink-0"
          ></app-dynamic-icon>
        </ng-container>
        <span class="grow">{{ label }}</span>
        <app-dynamic-icon
          icon="chevron-right"
          type="solid"
          [solidSize]="16"
          [className]="['size-4', open ? 'rotate-90' : ''].join(' ')"
        ></app-dynamic-icon>
      </button>

      <div *ngIf="open">
        <ul class="flex flex-col">
          <li *ngFor="let subItem of subItems">
            <app-nav-item
              [label]="subItem.label"
              [path]="subItem.path"
              (click)="selectItem()"
              className="px-12"
            ></app-nav-item>
          </li>
        </ul>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, NavItemComponent, IconsModule],
})
export class NavDisclosureComponent {
  @Input() label!: string;
  @Input() icon?: string;
  @Input() subItems?: NavigationSubItem[];
  @Output() itemSelect = new EventEmitter<void>();

  open = false;

  toggle() {
    this.open = !this.open;
  }

  selectItem() {
    this.open = false;
    this.itemSelect.emit();
  }
}
