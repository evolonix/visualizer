import { ForwardedRef, forwardRef } from 'react';

export interface SkillDashboardSkeletonProps {
  numberOfRows: number;
}

export const SkillDashboardSkeleton = forwardRef(
  ({ numberOfRows }: SkillDashboardSkeletonProps, forwardedRef: ForwardedRef<HTMLTableElement>) => (
    <table className="tw-mt-2 tw-w-full tw-overflow-hidden tw-rounded-lg tw-text-xs" ref={forwardedRef}>
      <thead>
        <tr className="tw-border-b tw-border-neutral-200 tw-bg-white">
          <th className="tw-animate-pulse tw-px-4 tw-py-6 tw-text-left sm:tw-w-[448px] md:tw-w-[224px] xl:tw-w-[240px]">
            <div className="tw-my-1 tw-h-4 tw-w-24 tw-rounded-full tw-bg-neutral-200"></div>
          </th>
          <th className="tw-hidden tw-w-[400px] tw-animate-pulse tw-px-4 tw-py-6 tw-text-left md:tw-table-cell lg:tw-w-[600px] xl:tw-w-[720px]">
            <div className="tw-my-1 tw-h-4 tw-w-32 tw-rounded-full tw-bg-neutral-200"></div>
          </th>
          <th className="tw-hidden tw-w-[140px] tw-animate-pulse tw-px-4 tw-py-6 tw-text-center lg:tw-table-cell" align="center">
            <div className="tw-flex tw-justify-center">
              <div className="tw-my-1 tw-h-4 tw-w-24 tw-rounded-full tw-bg-neutral-200"></div>
            </div>
          </th>
          <th className="tw-hidden tw-animate-pulse tw-px-4 tw-py-6 tw-text-left sm:tw-table-cell">
            <div className="tw-my-1 tw-h-4 tw-w-24 tw-rounded-full tw-bg-neutral-200"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: numberOfRows || 25 }).map((_, index) => (
          <tr key={index} className={index % 2 ? 'tw-bg-neutral-50' : 'tw-bg-neutral-100'}>
            <td className="tw-h-20 tw-animate-pulse tw-px-4 md:tw-h-16">
              <span className="tw-my-1 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200 tw-font-semibold"></span>
              <div className="tw-my-1 tw-mt-4 tw-line-clamp-2 tw-h-4 tw-rounded-full tw-bg-neutral-200 md:tw-hidden"></div>
            </td>
            <td className="tw-hidden tw-h-20 tw-animate-pulse tw-px-4 tw-text-neutral-800 md:tw-table-cell md:tw-h-16">
              <div className="tw-my-1 tw-line-clamp-2 tw-h-4 tw-rounded-full tw-bg-neutral-200"></div>
            </td>
            <td className="tw-hidden tw-h-20 tw-animate-pulse tw-px-4 tw-text-neutral-800 md:tw-h-16 lg:tw-table-cell" align="center">
              <div className="tw-my-1 tw-h-4 tw-w-4 tw-rounded-full tw-bg-neutral-200"></div>
            </td>
            <td className="tw-hidden tw-h-20 tw-animate-pulse tw-px-4 tw-text-neutral-800 sm:tw-table-cell md:tw-h-16">
              <div className="tw-my-1 tw-h-4 tw-rounded-full tw-bg-neutral-200"></div>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="tw-border-t tw-border-neutral-200">
          <td colSpan={4} className="tw-bg-white">
            <div className="tw-flex tw-h-16 tw-animate-pulse tw-items-center">
              <div className="tw-hidden tw-flex-1 tw-px-6 sm:tw-block">
                <div className="tw-my-1 tw-h-4 tw-w-64 tw-rounded-full tw-bg-neutral-200"></div>
              </div>
              <div className="tw-flex tw-flex-1 tw-items-center tw-justify-center tw-gap-1 tw-px-6">
                <div className="tw-my-1 tw-h-4 tw-w-full tw-rounded-full tw-bg-neutral-200"></div>
              </div>
              <div className="tw-hidden tw-flex-1 lg:tw-block"></div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  )
);
