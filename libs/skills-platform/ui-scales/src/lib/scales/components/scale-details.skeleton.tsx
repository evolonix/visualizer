export const ScaleDetailsSkeleton = () => (
  <>
    {/* <!-- Scale title, level count and description --> */}
    <div className="tw-grid-apollo tw-relative tw-overflow-hidden tw-py-8 sm:tw-py-10 md:tw-py-12">
      <div className="tw-z-10 tw-col-span-full tw-animate-pulse tw-space-y-4 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
        <div className="tw-my-0.5 tw-h-9 tw-w-64 tw-rounded-full tw-bg-neutral-200 tw-text-4xl tw-font-bold"></div>
        <div className="tw-my-0.5 tw-block tw-h-3 tw-w-32 tw-rounded-full tw-bg-neutral-200 tw-text-xs tw-font-semibold tw-text-neutral-500"></div>
        <p className="tw-mt-1 tw-text-neutral-700">
          <span className="tw-mb-2 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200"></span>
          <span className="tw-mb-2 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200"></span>
          <span className="tw-mb-1 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200 md:tw-w-96"></span>
        </p>
      </div>
    </div>

    <div className="tw-grid-apollo tw-flex-1 tw-pt-10 sm:tw-pt-12">
      <div className="tw-col-span-full tw-animate-pulse tw-space-y-12 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
        {/* <!-- Levels --> */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="tw-flex tw-flex-col tw-gap-5">
            <div className="tw-my-[3px] tw-h-[30px] tw-w-64 tw-rounded-full tw-bg-neutral-200 tw-text-3xl tw-font-bold"></div>
            <p className="tw-mt-1 tw-text-neutral-700">
              <span className="tw-mb-2 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200"></span>
              <span className="tw-mb-1 tw-block tw-h-4 tw-rounded-full tw-bg-neutral-200 md:tw-w-96"></span>
            </p>
          </div>
        ))}
      </div>
    </div>
  </>
);
