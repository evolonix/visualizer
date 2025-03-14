import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';

import { Pagination } from '@degreed/rsm';
import { ALLOWED_PAGESIZES } from '@engage/data-access';

import { calculatePaginatorButtons } from './paginator.utils';

@UntilDestroy()
@Component({
  selector: 'dgs-paginator',
  templateUrl: './paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() pagination: Pagination = {} as Pagination;

  pages: number[] = [];
  allowedSizes: number[] = ALLOWED_PAGESIZES.map((s) => parseInt(s));
  isLargeLayout?: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.enableResponsiveLayout();
  }

  enableResponsiveLayout(): void {
    const breakpoints = ['(min-width: 905px)'];
    const cacheStateMatches = (state: BreakpointState) => (this.isLargeLayout = state.matches);
    const layout$ = this.breakpointObserver.observe(breakpoints).pipe(untilDestroyed(this), tap(cacheStateMatches));

    layout$.subscribe((state: BreakpointState) => {
      this.populatePages(state.matches);
    });
  }

  /**
   * Rebuild page lookups
   */
  ngOnChanges() {
    this.populatePages(this.isLargeLayout);
  }

  populatePages(isLargeLayout = false): void {
    const { total, perPage } = this.pagination;
    const numPages = perPage ? Math.ceil(total / perPage) : 0;
    this.pages = calculatePaginatorButtons(this.pagination.currentPage, numPages, isLargeLayout);
    this.cdr.detectChanges();
  }

  getValue(event: Event): number {
    return parseInt((event.target as HTMLInputElement).value);
  }

  /**
   * For the specified gotoToPage button, build a style
   */
  stylePageLink(page?: number): string {
    const isSelected = this.pagination.currentPage === page;
    const buttonStyle = 'relative inline-flex items-center px-3 py-2 text-sm font-medium';
    const selectionStyle = isSelected
      ? 'text-blue-dark bg-blue-light z-10 px-2 h-6 rounded-md font-bold'
      : 'text-ebony-61 dark:text-neutral-400';

    return `${selectionStyle} ${buttonStyle}`;
  }
}
