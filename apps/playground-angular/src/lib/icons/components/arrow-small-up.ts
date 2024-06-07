import { Component } from '@angular/core';

import { BaseIconComponent } from './_base';

@Component({
  selector: 'app-arrow-small-up-icon',
  template: ` <ng-container *ngIf="type === 'solid' && solidSize === 20">
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
          d="M10 15a.75.75 0 0 1-.75-.75V7.612L7.29 9.77a.75.75 0 0 1-1.08-1.04l3.25-3.5a.75.75 0 0 1 1.08 0l3.25 3.5a.75.75 0 1 1-1.08 1.04l-1.96-2.158v6.638A.75.75 0 0 1 10 15Z"
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
          d="M12 19.5v-15m0 0-6.75 6.75M12 4.5l6.75 6.75"
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
          d="M12 20.25a.75.75 0 0 1-.75-.75V6.31l-5.47 5.47a.75.75 0 0 1-1.06-1.06l6.75-6.75a.75.75 0 0 1 1.06 0l6.75 6.75a.75.75 0 1 1-1.06 1.06l-5.47-5.47V19.5a.75.75 0 0 1-.75.75Z"
          clip-rule="evenodd"
        />
      </svg>
    </ng-container>

    <ng-container *ngIf="!isValidIcon()"> Unknown icon </ng-container>`,
})
export class ArrowSmallUpIconComponent extends BaseIconComponent {}
