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
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import { Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DynamicIcon } from './dynamic-icon';

export interface SearchProps {
  query?: string;
  open: boolean;
  onClose: () => void;
}

export const Search = ({ query, open, onClose }: SearchProps) => {
  const searchRef = useRef<HTMLInputElement>(null);
  // const { pathname } = useLocation();
  // const submit = useSubmit();
  // const navigation = useNavigation();

  // Perform search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const isFirstSearch = query === null;
    const formData = new FormData(e.target.form ?? undefined);

    if (formData.get('search') === '') formData.delete('search');

    // submit(formData, { replace: !isFirstSearch, action: pathname });
  };

  // Debounce search
  const debounceSearchChange = debounce(handleSearchChange, 300);

  // Reset search
  const resetSearch = () => {
    // submit(null, { action: pathname });
  };

  // Check if actively searching
  const isSearching = false;
  // navigation.location &&
  // new URLSearchParams(navigation.location.search).has('search');

  return (
    <>
      <div className="pointer-events-none absolute left-4 top-3.5 size-5 text-neutral-400"></div>

      {/* <style>{`
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
      `}</style> */}

      <Transition
        show={open}
        as={Fragment}
        afterLeave={resetSearch}
        appear
        afterEnter={() => {
          // Set the search input value to the query, if it exists, after the search dialog is displayed
          if (searchRef.current) searchRef.current.value = query ?? '';
        }}
      >
        <Dialog
          as="div"
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClose={onClose}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-900/80 transition-opacity" />
          </TransitionChild>

          <div className="relative z-50 w-full -translate-y-4 overflow-y-auto sm:-translate-y-6 md:-translate-y-48">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="mx-auto w-full max-w-xl transform divide-y divide-neutral-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                {/* <Form role="search"> */}
                <Combobox>
                  <div className="relative border-b border-neutral-200">
                    <DynamicIcon
                      icon="magnifying-glass"
                      className={clsx(
                        isSearching ? 'hidden' : '',
                        'pointer-events-none absolute left-4 top-3.5 size-5 text-neutral-400',
                      )}
                    />
                    <ComboboxInput
                      ref={searchRef}
                      name="search"
                      id="search"
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0 sm:text-sm"
                      placeholder="Search..."
                      defaultValue={query ?? ''}
                      onChange={debounceSearchChange}
                      autoFocus
                    />
                    <div
                      className="search-spinner pointer-events-none absolute left-4 top-3.5 size-5 text-neutral-400"
                      aria-hidden
                      hidden={!isSearching}
                    />
                  </div>

                  <ComboboxOptions
                    static
                    className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-neutral-800"
                  >
                    <ComboboxOption value="" className="py-0.5">
                      <Link
                        to="/"
                        className="flex w-full items-center gap-2 px-4 py-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:bg-neutral-50 focus:outline-none"
                        onClick={onClose}
                      >
                        <span className="flex items-center px-2 font-extrabold">
                          Home
                        </span>
                      </Link>
                    </ComboboxOption>
                  </ComboboxOptions>
                </Combobox>
                {/* </Form> */}
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
