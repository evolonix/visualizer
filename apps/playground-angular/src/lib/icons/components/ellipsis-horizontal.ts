import { Component } from '@angular/core';

import { BaseIconComponent } from './_base';

@Component({
  selector: 'app-ellipsis-horizontal-icon',
  template: ` <ng-container *ngIf="type === 'solid' && solidSize === 16">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        data-slot="icon"
        [class]="className"
      >
        <path
          d="M2 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12.5 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
        />
      </svg>
    </ng-container>

    <ng-container *ngIf="type === 'solid' && solidSize === 20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        data-slot="icon"
        [class]="className"
      >
        <path
          d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
        />
      </svg>
    </ng-container>

    <ng-container *ngIf="type === 'outline'">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        aria-hidden="true"
        data-slot="icon"
        [class]="className"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
    </ng-container>

    <ng-container *ngIf="type === 'solid' && solidSize === 24">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        data-slot="icon"
        [class]="className"
      >
        <path
          fill-rule="evenodd"
          d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
          clip-rule="evenodd"
        />
      </svg>
    </ng-container>

    <ng-container *ngIf="!isValidIcon()"> Unknown icon </ng-container>`,
})
export class EllipsisHorizontalIconComponent extends BaseIconComponent {}
