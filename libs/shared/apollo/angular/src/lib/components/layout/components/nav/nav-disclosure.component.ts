import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Router } from '@angular/router';
import { LayoutNavigationItem } from '../../layout.model';
import { getActiveSubItem } from '../../layout.utils';

@Component({
  selector: 'da-nav-disclosure',
  template: `
    <div>
      <button
        type="button"
        [class]="
          [
            'tw-flex tw-w-full tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-left',
            'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.800))]',
            'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.800))] focus:tw-outline-none',
            'active:tw-bg-[rgb(from_var(--apollo-layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight,theme(colors.neutral.900))]',
          ].join(' ')
        "
        [attr.data-dgat]="item.dgat"
        (click)="open = !open"
      >
        <da-nav-icon [item]="item" [active]="!!activeChild" className="tw-size-6 tw-shrink-0" />
        <span class="tw-grow">{{ item.text }}</span>
        <da-icon icon="chevron-right" type="solid" [solidSize]="16" [className]="['tw-size-4', open ? 'tw-rotate-90' : ''].join(' ')" />
      </button>

      <div *ngIf="open">
        <ul class="tw-flex tw-flex-col">
          <li *ngFor="let subItem of item.subItems">
            <ng-container *ngIf="subItem.href || subItem.routerLink">
              <da-nav-item [item]="subItem" (itemSelect)="handleItemSelect()" className="tw-px-12 tw-text-base"></da-nav-item>
            </ng-container>
          </li>
        </ul>
      </div>

      <ul *ngIf="!open && activeChild && (activeChild.href || activeChild.routerLink)">
        <li>
          <da-nav-item [item]="activeChild" (itemSelect)="handleItemSelect()" className="tw-px-12 tw-text-base"></da-nav-item>
        </li>
      </ul>
    </div>
  `,
})
export class NavDisclosureComponent implements OnInit {
  @Input() item!: LayoutNavigationItem;
  @Output() itemSelect = new EventEmitter<void>();

  open = false;
  activeChild: LayoutNavigationItem | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setActiveChild(this.router.url);
  }

  handleItemSelect() {
    this.open = false;
    this.itemSelect.emit();
  }

  private setActiveChild(pathname: string) {
    if (this.item.subItems) {
      this.activeChild = getActiveSubItem(pathname, this.item.subItems);
    }
  }
}
