import { Combobox, Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Form, Link, useLocation, useNavigation, useSubmit } from 'react-router-dom';
import { Category } from '../data';

export const AppSearch = ({ query, filteredCategories }: { query: string | null; filteredCategories?: Category[] }) => {
  const [open, setOpen] = useState(query !== null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { pathname } = useLocation();
  const submit = useSubmit();
  const navigation = useNavigation();

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
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle the menu when ⌘ K or Ctrl K is pressed
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      // Close the menu when Escape is pressed
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500"></div>
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
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-500/25 transition-opacity dark:bg-slate-400/25" />
          </TransitionChild>

          <div className="fixed inset-0 z-50 w-screen overflow-y-auto p-4 sm:p-6 md:p-48">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="mx-auto max-w-xl transform divide-y divide-slate-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all dark:divide-slate-800 dark:bg-slate-950">
                <Form role="search">
                  <Combobox>
                    <div className="relative">
                      <MagnifyingGlassIcon
                        className={clsx(
                          isSearching ? 'hidden' : '',
                          'pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500'
                        )}
                        aria-hidden="true"
                      />
                      <Combobox.Input
                        ref={searchRef}
                        name="search"
                        id="search"
                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm dark:text-slate-50 dark:placeholder:text-slate-500"
                        placeholder="Search..."
                        defaultValue={query ?? ''}
                        onChange={debounceSearchChange}
                      />
                      <div
                        className="search-spinner pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500"
                        aria-hidden
                        hidden={!isSearching}
                      />
                    </div>
                    <div className="bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:bg-slate-900 dark:text-slate-50">
                      Search for a category or preview
                    </div>

                    {!!filteredCategories?.length && (
                      <Combobox.Options
                        static
                        className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-slate-800 dark:text-slate-100"
                      >
                        {filteredCategories.map((category) => (
                          <Fragment key={category.id}>
                            <Combobox.Option value={category} className="py-0.5">
                              <Link
                                to={`/dashboard/${category.id}`}
                                className="flex w-full items-center gap-2 px-4 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:bg-slate-50 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:focus:bg-slate-900"
                                onClick={() => setOpen(false)}
                              >
                                <span className="flex items-center px-2 font-extrabold">{category.name}</span>
                              </Link>
                            </Combobox.Option>

                            {category.previews.map((preview) => (
                              <Combobox.Option key={`${preview.category?.id}-${preview.id}`} value={preview} className="py-0.5">
                                <Link
                                  to={`/dashboard/${preview.category?.id}/${preview.id}`}
                                  className="flex w-full items-center gap-2 py-2 pl-8 pr-4 text-sm text-slate-900 hover:bg-slate-100 focus:bg-slate-50 focus:outline-none dark:text-slate-50 dark:hover:bg-slate-800 dark:focus:bg-slate-900"
                                  onClick={() => setOpen(false)}
                                >
                                  <span className="flex items-center px-2 font-bold">{preview.name}</span>
                                </Link>
                              </Combobox.Option>
                            ))}
                          </Fragment>
                        ))}
                      </Combobox.Options>
                    )}

                    {query !== null && filteredCategories?.length === 0 && (
                      <p className="p-4 text-sm text-slate-500 dark:text-slate-400">No categories or previews found.</p>
                    )}
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
