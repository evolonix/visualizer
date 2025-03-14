import { ForwardedRef, forwardRef } from 'react';

export const MappingSkeleton = forwardRef((_, forwardedRef: ForwardedRef<HTMLTableElement>) => (
  <table ref={forwardedRef} className="tw-w-full tw-min-w-max tw-table-auto tw-animate-pulse">
    {/* Target scale source */}
    <thead>
      <tr>
        <td className="tw-w-0 tw-max-w-[12rem] tw-whitespace-nowrap tw-pb-8 tw-pr-8 tw-pt-[3px]">
          <div className="tw-my-1 tw-h-4 tw-w-40 tw-truncate tw-rounded-full tw-bg-neutral-200 tw-font-extrabold"></div>
          <p className="tw-my-0.5 tw-h-3 tw-w-24 tw-rounded-full tw-bg-neutral-200 tw-text-xs"></p>
        </td>
        <td className="tw-pb-8 tw-pt-[3px]">
          <div className="tw-grid tw-grid-cols-4 tw-place-content-center tw-gap-3">
            <div className="tw-col-span-1 tw-flex tw-h-8 tw-items-center tw-overflow-hidden tw-rounded-full tw-bg-neutral-200 tw-px-3 tw-text-xs"></div>
            <div className="tw-col-span-1 tw-flex tw-h-8 tw-items-center tw-overflow-hidden tw-rounded-full tw-bg-neutral-200 tw-px-3 tw-text-xs"></div>
            <div className="tw-col-span-1 tw-flex tw-h-8 tw-items-center tw-overflow-hidden tw-rounded-full tw-bg-neutral-200 tw-px-3 tw-text-xs"></div>
            <div className="tw-col-span-1 tw-flex tw-h-8 tw-items-center tw-overflow-hidden tw-rounded-full tw-bg-neutral-200 tw-px-3 tw-text-xs"></div>
          </div>
        </td>
      </tr>
    </thead>

    {/* Mapped scale sources */}
    <tbody>
      {Array.from({ length: 4 }).map((_, index) => (
        <tr key={index}>
          <td className="tw-w-0 tw-max-w-[12rem] tw-whitespace-nowrap tw-pb-8 tw-pr-8 tw-pt-[3px]">
            <div className="tw-my-1 tw-h-4 tw-w-40 tw-truncate tw-rounded-full tw-bg-neutral-200 tw-font-extrabold"></div>
            <p className="tw-my-0.5 tw-h-3 tw-w-24 tw-rounded-full tw-bg-neutral-200 tw-text-xs"></p>
          </td>
          <td className="tw-pb-8 tw-pt-[3px]">
            <div className="tw-grid tw-grid-cols-4 tw-place-content-center tw-gap-3">
              <div className="tw-col-span-1 tw-flex tw-h-8 tw-items-center tw-overflow-hidden tw-rounded-full tw-bg-neutral-200 tw-px-3 tw-text-xs"></div>
              <div className="tw-col-span-1 tw-flex tw-h-8 tw-items-center tw-overflow-hidden tw-rounded-full tw-bg-neutral-200 tw-px-3 tw-text-xs"></div>
              <div className="tw-col-span-1 tw-flex tw-h-8 tw-items-center tw-overflow-hidden tw-rounded-full tw-bg-neutral-200 tw-px-3 tw-text-xs"></div>
              <div className="tw-col-span-1 tw-flex tw-h-8 tw-items-center tw-overflow-hidden tw-rounded-full tw-bg-neutral-200 tw-px-3 tw-text-xs"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
));
