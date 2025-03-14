import { Transition } from '@headlessui/react';
import clsx from 'clsx';

export const PreviewSkeleton = ({ show, darkMode }: { show: boolean; darkMode: boolean }) => {
  return (
    <Transition show={show} leave="transition-opacity duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
      <div
        className={clsx(
          darkMode ? 'bg-slate-800' : 'bg-slate-100',
          'absolute inset-0 overflow-hidden rounded-lg px-4 py-8 text-4xl font-bold'
        )}
      >
        <div role="status" className="mx-auto w-full max-w-7xl animate-pulse">
          <div className="mb-8 space-y-8 md:flex md:items-center md:space-x-8 md:space-y-0">
            <div className="flex h-48 w-full items-center justify-center rounded bg-slate-300 sm:w-96 dark:bg-slate-600">
              <svg
                className="h-10 w-10 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
            <div className="w-full">
              <div className="mb-4 h-2.5 w-48 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 max-w-[480px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 max-w-[440px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 max-w-[460px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="h-2 max-w-[360px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-8">
            <div className="max-w-lg flex-1">
              <div className="mb-4 h-2.5 w-48 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 max-w-[330px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 max-w-[300px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 max-w-[330px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="mb-2.5 h-2 max-w-[300px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <div className="h-2 max-w-[360px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
            </div>

            <div className="max-w-full flex-1 space-y-4 divide-y divide-slate-300 rounded border border-slate-300 p-4 shadow md:p-6 dark:divide-slate-600 dark:border-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2.5 h-2.5 w-24 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                  <div className="h-2 w-32 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                </div>
                <div className="h-2.5 w-12 rounded-full bg-slate-400 dark:bg-slate-600"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="mb-2.5 h-2.5 w-24 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                  <div className="h-2 w-32 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                </div>
                <div className="h-2.5 w-12 rounded-full bg-slate-400 dark:bg-slate-600"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="mb-2.5 h-2.5 w-24 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                  <div className="h-2 w-32 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                </div>
                <div className="h-2.5 w-12 rounded-full bg-slate-400 dark:bg-slate-600"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="mb-2.5 h-2.5 w-24 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                  <div className="h-2 w-32 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                </div>
                <div className="h-2.5 w-12 rounded-full bg-slate-400 dark:bg-slate-600"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="mb-2.5 h-2.5 w-24 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                  <div className="h-2 w-32 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                </div>
                <div className="h-2.5 w-12 rounded-full bg-slate-400 dark:bg-slate-600"></div>
              </div>
            </div>
          </div>

          <div>
            <div className="mx-auto mb-2.5 h-2.5 max-w-[640px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
            <div className="mx-auto h-2.5 max-w-[540px] rounded-full bg-slate-300 dark:bg-slate-600"></div>
          </div>
        </div>

        <span className="sr-only">Loading...</span>
      </div>
    </Transition>
  );
};
