import { inject } from '@degreed/core-react';
import { EventBus } from '@degreed/rsm';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import { useEffect, useRef, useState } from 'react';
import { Form, Link, useLocation, useNavigation, useSubmit } from 'react-router-dom';

export const AppSearch = ({ query }: { query?: string }) => {
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { pathname } = useLocation();
  const submit = useSubmit();
  const navigation = useNavigation();
  const eventBus = inject<EventBus>(EventBus);

  // Perform search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isFirstSearch = query === null;
    const formData = new FormData(e.target.form ?? undefined);

    if (formData.get('search') === '') formData.delete('search');

    submit(formData, { replace: !isFirstSearch, action: pathname });
  };

  // Debounce search
  const debounceSearchChange = debounce(handleSearchChange, 300);

  // Reset search
  const resetSearch = () => {
    submit(null, { action: pathname });
  };

  // Check if actively searching
  const isSearching = navigation.location && new URLSearchParams(navigation.location.search).has('search');

  useEffect(() => {
    const unsubscribeShowAppSearch = eventBus.on('showAppSearch', () => setOpen(true));
    const unsubscribeCloseAppSearch = eventBus.on('closeAppSearch', () => setOpen(false));

    return () => {
      unsubscribeShowAppSearch();
      unsubscribeCloseAppSearch();
    };
  }, [eventBus]);

  return (
    <>
      <div className="tw-pointer-events-none tw-absolute tw-left-4 tw-top-3.5 tw-h-5 tw-w-5 tw-text-neutral-400"></div>
      <style>{`
        .search-spinner {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23000' strokeLinecap ='round' strokeLinejoin='round' strokeWidth='2' d='M20 4v5h-.582m0 0a8.001 8.001 0 00-15.356 2m15.356-2H15M4 20v-5h.581m0 0a8.003 8.003 0 0015.357-2M4.581 15H9' /%3E%3C/svg%3E");
          animation: spin 1s infinite linear;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <Transition
        show={open}
        afterLeave={resetSearch}
        appear
        afterEnter={() => {
          // Set the search input value to the query, if it exists, after the search dialog is displayed
          if (searchRef.current) searchRef.current.value = query ?? '';
        }}
      >
        <Dialog as="div" className="tw-relative tw-z-50" onClose={setOpen}>
          <TransitionChild
            enter="tw-ease-out tw-duration-300"
            enterFrom="tw-opacity-0"
            enterTo="tw-opacity-100"
            leave="tw-ease-in tw-duration-200"
            leaveFrom="tw-opacity-100"
            leaveTo="tw-opacity-0"
          >
            <div className="tw-fixed tw-inset-0 tw-bg-neutral-900/80 tw-transition-opacity" />
          </TransitionChild>

          <div className="tw-fixed tw-inset-0 tw-z-50 tw-w-screen tw-overflow-y-auto tw-p-4 sm:tw-p-6 md:tw-p-48">
            <TransitionChild
              enter="tw-ease-out tw-duration-300"
              enterFrom="tw-opacity-0 tw-scale-95"
              enterTo="tw-opacity-100 tw-scale-100"
              leave="tw-ease-in tw-duration-200"
              leaveFrom="tw-opacity-100 tw-scale-100"
              leaveTo="tw-opacity-0 tw-scale-95"
            >
              <DialogPanel className="tw-mx-auto tw-max-w-xl tw-transform tw-divide-y tw-divide-neutral-100 tw-overflow-hidden tw-rounded-xl tw-bg-white tw-shadow-2xl tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-transition-all">
                <Form role="search">
                  <Combobox>
                    <div className="tw-relative tw-border-b tw-border-neutral-200">
                      <MagnifyingGlassIcon
                        className={clsx(
                          isSearching ? 'tw-hidden' : '',
                          'tw-pointer-events-none tw-absolute tw-left-4 tw-top-3.5 tw-h-5 tw-w-5 tw-text-neutral-400'
                        )}
                        aria-hidden="true"
                      />
                      <ComboboxInput
                        ref={searchRef}
                        name="search"
                        id="search"
                        className="tw-h-12 tw-w-full tw-border-0 tw-bg-transparent tw-pl-11 tw-pr-4 tw-text-neutral-900 placeholder:tw-text-neutral-400 focus:tw-ring-0 sm:tw-text-sm"
                        placeholder="Search..."
                        defaultValue={query ?? ''}
                        onChange={debounceSearchChange}
                        autoFocus
                      />
                      <div
                        className="tw-search-spinner tw-pointer-events-none tw-absolute tw-left-4 tw-top-3.5 tw-h-5 tw-w-5 tw-text-neutral-400"
                        aria-hidden
                        hidden={!isSearching}
                      />
                    </div>

                    <ComboboxOptions
                      static
                      className="tw-max-h-72 tw-scroll-py-2 tw-overflow-y-auto tw-py-2 tw-text-sm tw-text-neutral-800"
                    >
                      <ComboboxOption value="" className="tw-py-0.5">
                        <Link
                          to={`/scales`}
                          className="tw-flex tw-w-full tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-neutral-500 hover:tw-bg-neutral-100 hover:tw-text-neutral-700 focus:tw-bg-neutral-50 focus:tw-outline-none"
                          onClick={() => setOpen(false)}
                        >
                          <span className="tw-flex tw-items-center tw-px-2 tw-font-extrabold">Home</span>
                        </Link>
                      </ComboboxOption>
                    </ComboboxOptions>
                  </Combobox>
                </Form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
