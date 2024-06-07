import { animate, style, transition, trigger } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { twMerge } from 'tailwind-merge';
import { IconsModule } from '../lib';

export interface DialogData {
  query?: string;
  className?: string;
}

@Component({
  selector: 'app-search',
  template: `
    <div
      class="relative z-50 w-full -translate-y-4 sm:-translate-y-6 md:-translate-y-48"
    >
      <div
        @PanelTrigger
        [class]="
          twMerge(
            'mx-auto w-full transform divide-y divide-neutral-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all',
            data.className ?? ''
          )
        "
      >
        <div class="relative border-b border-neutral-200">
          <app-dynamic-icon
            *ngIf="!isSearching"
            icon="magnifying-glass"
            className="pointer-events-none absolute left-4 top-3.5 size-5 text-neutral-400"
          />
          <input
            #searchInput
            name="search"
            id="search"
            class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0 sm:text-sm"
            placeholder="Search..."
            [value]="data.query ?? ''"
            (input)="debounceSearchChange($event)"
            autofocus
          />
          <div
            class="search-spinner pointer-events-none absolute left-4 top-3.5 size-5 text-neutral-400"
            aria-hidden="true"
            [hidden]="!isSearching"
          ></div>
        </div>

        <div
          class="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-neutral-800"
        >
          <a
            routerLink="/"
            class="flex w-full items-center gap-2 px-4 py-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:bg-neutral-50 focus:outline-none"
            (click)="dialogRef.close()"
          >
            <span class="flex items-center px-2 font-extrabold">Home</span>
          </a>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, IconsModule],
  animations: [
    trigger('PanelTrigger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(95%)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'scale(100%)' }),
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(100%)' }),
        animate(
          '200ms ease-in-out',
          style({ opacity: 0, transform: 'scale(95%)' }),
        ),
      ]),
    ]),
  ],
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchRef!: ElementRef<HTMLInputElement>;

  searchSubscription!: Subscription;
  searchSubject = new Subject<Event>();
  isSearching = false;
  twMerge = twMerge;

  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((event) => this.handleSearchChange(event as InputEvent));

    if (this.searchRef && this.data.query) {
      this.searchRef.nativeElement.value = this.data.query;
    }
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  debounceSearchChange(event: Event): void {
    this.searchSubject.next(event);
  }

  handleSearchChange(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    const formData = new FormData();

    if (input.value === '') formData.delete('search');
    else formData.append('search', input.value);

    // Perform search
    console.log('Form data:', formData);
    this.isSearching = true;
    setTimeout(() => (this.isSearching = false), 1000); // Simulating a search delay
  }

  resetSearch(): void {
    // Reset search logic
    console.log('Resetting search');
  }
}
