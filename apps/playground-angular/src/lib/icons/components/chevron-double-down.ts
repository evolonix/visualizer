import { Component } from '@angular/core';

import { BaseIconComponent } from './_base';

@Component({
  selector: 'app-chevron-double-down-icon',
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
          fill-rule="evenodd"
          d="M7.47 12.78a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06L8 11.19 5.28 8.47a.75.75 0 0 0-1.06 1.06l3.25 3.25ZM4.22 4.53l3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06L8 6.19 5.28 3.47a.75.75 0 0 0-1.06 1.06Z"
          clip-rule="evenodd"
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
          fill-rule="evenodd"
          d="M9.47 15.28a.75.75 0 0 0 1.06 0l4.25-4.25a.75.75 0 1 0-1.06-1.06L10 13.69 6.28 9.97a.75.75 0 0 0-1.06 1.06l4.25 4.25ZM5.22 6.03l4.25 4.25a.75.75 0 0 0 1.06 0l4.25-4.25a.75.75 0 0 0-1.06-1.06L10 8.69 6.28 4.97a.75.75 0 0 0-1.06 1.06Z"
          clip-rule="evenodd"
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
          d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
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
          d="M11.47 13.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 0 0-1.06-1.06L12 11.69 5.03 4.72a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
          clip-rule="evenodd"
        />
        <path
          fill-rule="evenodd"
          d="M11.47 19.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 1 0-1.06-1.06L12 17.69l-6.97-6.97a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
          clip-rule="evenodd"
        />
      </svg>
    </ng-container>

    <ng-container *ngIf="!isValidIcon()"> Unknown icon </ng-container>`,
})
export class ChevronDoubleDownIconComponent extends BaseIconComponent {}
