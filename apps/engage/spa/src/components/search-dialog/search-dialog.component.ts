import { animate, style, transition, trigger } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { twMerge } from '@degreed/apollo-angular';
import { Subject, Subscription, debounceTime } from 'rxjs';

export interface DialogData {
  query?: string;
  className?: string;
}

@Component({
  selector: 'dgs-search',
  template: `
    <div class="tw-reset">
      <div class="tw-relative tw-z-50 tw-w-full">
        <div
          @PanelTrigger
          [class]="
            twMerge(
              'tw-mx-auto tw-w-full tw-divide-y tw-divide-neutral-100 tw-overflow-hidden tw-rounded-xl tw-bg-white tw-shadow-2xl tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-transition-all',
              data.className ?? ''
            )
          "
        >
          <div class="tw-relative tw-border-b tw-border-neutral-200">
            <da-icon
              *ngIf="!isSearching"
              icon="magnifying-glass"
              className="tw-pointer-events-none tw-absolute tw-left-4 tw-top-3.5 tw-size-5 tw-text-neutral-400"
            />
            <input
              #searchInput
              name="search"
              id="search"
              class="tw-h-12 tw-w-full tw-border-0 tw-bg-transparent tw-pl-11 tw-pr-4 tw-text-neutral-900 placeholder:tw-text-neutral-400 focus:tw-outline-none focus:tw-ring-0 sm:tw-text-sm"
              placeholder="Search..."
              [value]="data.query ?? ''"
              (input)="debounceSearchChange($event)"
              autofocus
            />
            <!-- <div
            class="search-spinner tw-pointer-events-none tw-absolute tw-left-4 tw-top-3.5 tw-size-5 tw-text-neutral-400"
            aria-hidden="true"
            [hidden]="!isSearching"
          ></div> -->
          </div>

          <div class="tw-max-h-72 tw-scroll-py-2 tw-overflow-y-auto tw-py-2 tw-text-sm tw-text-neutral-800">
            <a
              routerLink="/"
              class="tw-flex tw-w-full tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-neutral-500 hover:tw-bg-neutral-100 hover:tw-text-neutral-700 focus:tw-bg-neutral-50 focus:tw-outline-none"
              (click)="dialogRef.close()"
            >
              <span class="tw-flex tw-items-center tw-px-2 tw-font-extrabold">Home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  // styles: `
  //   .search-dialog-panel {
  //     @apply tw-self-start tw-mt-4 sm:tw-mt-6 md:tw-mt-48;
  //   }
  // `,
  animations: [
    trigger('PanelTrigger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(95%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(100%)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(100%)' }),
        animate('200ms ease-in-out', style({ opacity: 0, transform: 'scale(95%)' })),
      ]),
    ]),
  ],
})
export class SearchDialogComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchRef!: ElementRef<HTMLInputElement>;

  searchSubscription!: Subscription;
  searchSubject = new Subject<Event>();
  isSearching = false;
  twMerge = twMerge;

  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.dialogRef.addPanelClass('search-dialog-panel');

    this.searchSubscription = this.searchSubject.pipe(debounceTime(300)).subscribe((event) => this.handleSearchChange(event as InputEvent));

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
