import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { twMerge } from 'tailwind-merge';
import { IconsModule } from '../../../lib/icons';

@Component({
  selector: 'app-nav-item',
  template: `
    <a [routerLink]="path" [ngClass]="mergedClasses" (click)="handleClick()">
      <ng-container *ngIf="icon">
        <app-dynamic-icon
          [icon]="icon"
          type="solid"
          className="size-6 shrink-0"
        ></app-dynamic-icon>
      </ng-container>
      <span [ngClass]="{ 'sr-only': iconOnly, grow: !iconOnly }">{{
        label
      }}</span>
    </a>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, IconsModule],
})
export class NavItemComponent {
  @Input() label!: string;
  @Input() icon?: string;
  @Input() path!: string;
  @Input() iconOnly?: boolean = false;
  @Input() className = '';
  @Output() itemSelect = new EventEmitter<void>();

  get mergedClasses(): string {
    return twMerge(
      'flex items-center gap-2 px-7 py-2 focus:outline-none',
      'hover:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] hover:text-[var(--layout-highlight,theme(colors.neutral.800))]',
      'focus:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] focus:text-[var(--layout-highlight,theme(colors.neutral.800))]',
      'active:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)] active:text-[var(--layout-highlight,theme(colors.neutral.900))]',
      this.className,
    );
  }

  handleClick() {
    this.itemSelect.emit();
  }
}
