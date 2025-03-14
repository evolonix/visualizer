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
    <div className="tw-flex tw-h-16 tw-items-center">
      <div className="tw-hidden tw-flex-1 tw-px-6 sm:tw-block">{`Showing ${start} to ${end} of ${pagination.total} results`}</div>
      <div className="tw-flex tw-flex-1 tw-items-center tw-justify-center tw-gap-1 tw-px-6">
        <button
          type="button"
          onClick={() => pagination.showPage(1)}
          className="tw-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-lg active:tw-bg-neutral-200 enabled:hover:tw-bg-neutral-100 disabled:tw-cursor-not-allowed"
          // disabled={pagination.currentPage === 1}
        >
          <span className="tw-sr-only">Previous</span>
          <ChevronDoubleLeftIcon className="tw-h-4 tw-w-4 tw-text-neutral-800" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => pagination.showPage(pagination.currentPage - 1)}
          className="tw-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-lg active:tw-bg-neutral-200 enabled:hover:tw-bg-neutral-100 disabled:tw-cursor-not-allowed"
          // disabled={pagination.currentPage === 1}
        >
          <ChevronLeftIcon className="tw-h-4 tw-w-4 tw-text-neutral-800" aria-hidden="true" />
        </button>

        {pages.map((page) => (
          <Fragment key={page}>
            {page !== -1 ? (
              // Selected: "bg-neutral-200 font-semibold", Default: "hover:bg-neutral-100"
              <button
                type="button"
                onClick={() => pagination.showPage(page)}
                className={clsx(
                  'tw-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-lg active:tw-bg-neutral-200',
                  isPageActive(page)
                )}
              >
                {page}
              </button>
            ) : (
              <span className="tw-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-lg">
                <EllipsisHorizontalIcon className="tw-h-4 tw-w-4 tw-text-neutral-800" aria-hidden="true" />
              </span>
            )}
          </Fragment>
        ))}

        <button
          type="button"
          onClick={() => pagination.showPage(pagination.currentPage + 1)}
          className="tw-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-lg active:tw-bg-neutral-200 enabled:hover:tw-bg-neutral-100 disabled:tw-cursor-not-allowed"
          // disabled={pagination.currentPage === pagination.lastPage}
        >
          <ChevronRightIcon className="tw-h-4 tw-w-4 tw-text-neutral-800" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => pagination.showPage(pagination.lastPage)}
          className="tw-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-lg active:tw-bg-neutral-200 enabled:hover:tw-bg-neutral-100 disabled:tw-cursor-not-allowed"
          // disabled={pagination.currentPage === pagination.lastPage}
        >
          <ChevronDoubleRightIcon className="tw-h-4 tw-w-4 tw-text-neutral-800" aria-hidden="true" />
        </button>
      </div>
      <div className="tw-hidden tw-flex-1 lg:tw-block"></div>
    </div>
  ) : null;
}
