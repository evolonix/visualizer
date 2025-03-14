import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import { Fragment } from 'react';
import { calculatePaginatorButtons } from './paginator.utils';

/**
 * Expected ViewModel for data + api
 */
export interface PaginatorViewModel {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;

  showPage: (page: number) => Promise<boolean>;
}

export interface PaginatorProps {
  pagination: PaginatorViewModel;
}

/**
 * Apollo Paginator UI Component
 */
export function Paginator({ pagination }: PaginatorProps) {
  const start = (pagination.currentPage - 1) * pagination.perPage + 1;
  const end = Math.min(pagination.total, start + pagination.perPage - 1);
  const isPageActive = (page: number) => (page === pagination.currentPage ? 'bg-neutral-200 font-semibold' : 'hover:bg-neutral-100');

  const isLargeLayout = window?.matchMedia('(min-width: 1024px)').matches ?? false;
  const numPages = pagination.perPage ? Math.ceil(pagination.total / pagination.perPage) : 0;
  const pages = calculatePaginatorButtons(pagination.currentPage, numPages, isLargeLayout);

  return numPages > 1 ? (
    <div className="flex h-16 items-center">
      <div className="hidden flex-1 px-6 sm:block">{`Showing ${start} to ${end} of ${pagination.total} results`}</div>
      <div className="flex flex-1 items-center justify-center gap-1 px-6">
        <button
          type="button"
          onClick={() => pagination.showPage(1)}
          className="flex h-6 w-6 items-center justify-center rounded-lg active:bg-neutral-200 enabled:hover:bg-neutral-100 disabled:cursor-not-allowed"
          // disabled={pagination.currentPage === 1}
        >
          <span className="sr-only">Previous</span>
          <ChevronDoubleLeftIcon className="h-4 w-4 text-neutral-800" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => pagination.showPage(pagination.currentPage - 1)}
          className="flex h-6 w-6 items-center justify-center rounded-lg active:bg-neutral-200 enabled:hover:bg-neutral-100 disabled:cursor-not-allowed"
          // disabled={pagination.currentPage === 1}
        >
          <ChevronLeftIcon className="h-4 w-4 text-neutral-800" aria-hidden="true" />
        </button>

        {pages.map((page) => (
          <Fragment key={page}>
            {page !== -1 ? (
              // Selected: "bg-neutral-200 font-semibold", Default: "hover:bg-neutral-100"
              <button
                type="button"
                onClick={() => pagination.showPage(page)}
                className={clsx('flex h-6 w-6 items-center justify-center rounded-lg active:bg-neutral-200', isPageActive(page))}
              >
                {page}
              </button>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-lg">
                <EllipsisHorizontalIcon className="h-4 w-4 text-neutral-800" aria-hidden="true" />
              </span>
            )}
          </Fragment>
        ))}

        <button
          type="button"
          onClick={() => pagination.showPage(pagination.currentPage + 1)}
          className="flex h-6 w-6 items-center justify-center rounded-lg active:bg-neutral-200 enabled:hover:bg-neutral-100 disabled:cursor-not-allowed"
          // disabled={pagination.currentPage === pagination.lastPage}
        >
          <ChevronRightIcon className="h-4 w-4 text-neutral-800" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => pagination.showPage(pagination.lastPage)}
          className="flex h-6 w-6 items-center justify-center rounded-lg active:bg-neutral-200 enabled:hover:bg-neutral-100 disabled:cursor-not-allowed"
          // disabled={pagination.currentPage === pagination.lastPage}
        >
          <ChevronDoubleRightIcon className="h-4 w-4 text-neutral-800" aria-hidden="true" />
        </button>
      </div>
      <div className="hidden flex-1 lg:block"></div>
    </div>
  ) : null;
}
