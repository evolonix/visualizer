import { ForwardedRef, forwardRef } from 'react';

export const ScaleDashboardSkeleton = forwardRef((_, forwardedRef: ForwardedRef<HTMLUListElement>) => (
  <ul className="tw-space-y-14 tw-divide-y tw-divide-neutral-200 lg:tw-space-y-12" ref={forwardedRef}>
    {[1, 2, 3].map((i) => (
      <li key={i} className="tw-pt-14 first-of-type:tw-pt-0 lg:tw-pt-12">
        <div className="tw-flex tw-flex-col tw-gap-4">
          <div className="tw-my-1 tw-flex tw-h-6 tw-animate-pulse tw-items-center tw-gap-x-3 tw-rounded-full tw-bg-neutral-200 tw-text-2xl tw-font-bold tw-text-neutral-900 sm:tw-w-64"></div>
          <div className="tw-flex tw-items-center">
            <div className="tw-my-0.5 tw-h-3 tw-w-32 tw-animate-pulse tw-rounded-full tw-bg-neutral-200 tw-text-xs tw-font-extrabold tw-text-neutral-500"></div>
          </div>
          <p className="tw-mt-1 tw-animate-pulse tw-text-neutral-700">
            <span className="tw-mb-2 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200"></span>
            <span className="tw-mb-2 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200"></span>
            <span className="tw-mb-1 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200 md:tw-w-96"></span>
          </p>
        </div>
      </li>
    ))}
  </ul>
));
