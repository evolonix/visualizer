import { Fragment } from 'react';

export const ScaleEditorSkeleton = () => {
  return (
    <div className="tw-grid-apollo tw-bg-neutral-50 tw-pt-10 sm:tw-pt-12">
      {/* <!-- Scale Title --> */}
      <div className="tw-col-span-full tw-animate-pulse md:tw-col-span-7 md:tw-col-start-2 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
        <label className="tw-my-0.5 tw-block tw-h-3 tw-w-32 tw-rounded-full tw-bg-neutral-200"></label>
        <div className="tw-mb-[25px] tw-mt-[3px] tw-h-[30px] tw-w-64 tw-rounded-full tw-bg-neutral-200"></div>
      </div>
      {/* <!-- Scale Description --> */}
      <div className="tw-col-span-full tw-animate-pulse md:tw-col-span-7 md:tw-col-start-2 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
        <label className="tw-my-0.5 tw-block tw-h-3 tw-w-32 tw-rounded-full tw-bg-neutral-200"></label>
        <p className="tw-mt-1 tw-pb-5 tw-text-neutral-700">
          <span className="tw-mb-2 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200"></span>
          <span className="tw-mb-2 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200"></span>
          <span className="tw-mb-1 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200 md:tw-w-96"></span>
        </p>
      </div>
      {/* <!-- Levels --> */}
      <div className="tw-col-span-full tw-animate-pulse md:tw-col-span-7 md:tw-col-start-2 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
        <label className="tw-my-0.5 tw-block tw-h-3 tw-w-32 tw-rounded-full tw-bg-neutral-200"></label>
        <div className="tw-mb-[25px] tw-mt-[3px] tw-h-[30px] tw-w-64 tw-rounded-full tw-bg-neutral-200"></div>
      </div>

      {/* Level Information */}
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <Fragment key={index}>
            {/* <!-- Level Title --> */}
            <div className="tw-col-span-full tw-animate-pulse md:tw-col-span-7 md:tw-col-start-2 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
              <label className="tw-my-0.5 tw-block tw-h-3 tw-w-32 tw-rounded-full tw-bg-neutral-200"></label>
              <div className="tw-mb-[25px] tw-mt-[3px] tw-h-[30px] tw-w-64 tw-rounded-full tw-bg-neutral-200"></div>
            </div>
            {/* <!-- Level Description --> */}
            <div className="tw-col-span-full tw-animate-pulse md:tw-col-span-7 md:tw-col-start-2 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
              <label className="tw-my-0.5 tw-block tw-h-3 tw-w-32 tw-rounded-full tw-bg-neutral-200"></label>
              <p className="tw-mt-1 tw-pb-5 tw-text-neutral-700">
                <span className="tw-mb-2 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200"></span>
                <span className="tw-mb-2 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200"></span>
                <span className="tw-mb-1 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200 md:tw-w-96"></span>
              </p>
            </div>
          </Fragment>
        ))}

      <span role="status" className="tw-sr-only">
        Loading...
      </span>
    </div>
  );
};
