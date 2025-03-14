import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { ReactElement } from 'react';
import { Link, NavLink, useLocation, useMatches } from 'react-router-dom';
import { Preview } from '../data';
import { KeyboardEventModifierKey, useActionKey } from '../lib';

interface NavigationHandle {
  navigation: (data: unknown) => ReactElement;
}

interface NavigationData {
  preview?: Preview;
  navigation: { name: string; to: string }[];
}

export function Header() {
  const { pathname } = useLocation();
  const matches = useMatches();

  // First, get rid of any matches that don't have handle and navigation
  // Next, find the element for the current pathname, passing the loader data to it
  const { handle } = (matches
    .filter((match) => Boolean((match.handle as NavigationHandle | undefined)?.navigation))
    .find((match) => match.pathname === pathname || match.pathname === `${pathname}/`) ?? { handle: undefined }) as {
    handle?: NavigationHandle;
  };

  // First, get rid of any matches that don't have data and navigation
  // Next, find the element for the current pathname, passing the loader data to it
  const { data } = (matches
    .filter((match) => Boolean((match.data as NavigationData | undefined)?.navigation))
    .find((match) => match.pathname === pathname || match.pathname === `${pathname}/`) ?? { data: undefined }) as { data?: NavigationData };

  const navigation = handle?.navigation(data);
  const mobileNavigation = data
    ? {
        ...(data.preview
          ? {
              header: {
                name: data.preview.category?.name,
                to: `/dashboard/${data.preview.category?.id}`,
              },
            }
          : {}),
        items: data.navigation,
      }
    : undefined;

  const actionKey = useActionKey();

  const handleSearchClick = () => {
    if (actionKey) {
      const e = new KeyboardEvent('keydown', {
        key: 'k',
        ...(actionKey[2] as KeyboardEventModifierKey),
      });
      document.dispatchEvent(e);
    }
  };

  return (
    <Disclosure as="header" className="sticky top-0 z-20 bg-white shadow dark:bg-slate-950">
      {({ open, close }) => (
        <>
          <div className="px-4 sm:px-6 lg:divide-y lg:divide-slate-200 lg:px-8 dark:lg:divide-slate-700">
            <div className="relative flex h-16 justify-between">
              <div className="relative z-10 flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/">
                    <svg xmlns="http://www.w3.org/2000/svg" className="auto h-6" fill="none" viewBox="0 0 65 65">
                      <path
                        fill="#fff"
                        d="M39.445 25.555 37 17.163 65 0 47.821 28l-8.376-2.445Zm-13.89 0L28 17.163 0 0l17.179 28 8.376-2.445Zm13.89 13.89L37 47.837 65 65 47.821 37l-8.376 2.445Zm-13.89 0L28 47.837 0 65l17.179-28 8.376 2.445Z"
                      ></path>
                    </svg>
                  </Link>
                </div>
                <nav className="ml-4 hidden lg:flex lg:space-x-4" aria-label="Global">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      clsx(
                        isActive
                          ? 'border-sky-500 text-slate-900 dark:border-sky-400 dark:text-slate-50'
                          : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200',
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                      )
                    }
                  >
                    Dashboard
                  </NavLink>
                </nav>
              </div>
              <div className="absolute inset-0 z-0 flex flex-1 items-center justify-center px-2">
                <div className="lg:w-full lg:max-w-xs">
                  <button
                    type="button"
                    className="flex w-full items-center gap-x-2 rounded-md bg-white px-3 py-1.5 text-sm leading-6 text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-100 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:bg-slate-950 dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-800 dark:focus:ring-sky-300"
                    onClick={handleSearchClick}
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="flex-1 text-left">Search...</span>
                    {actionKey ? (
                      <kbd className="font-sans font-semibold text-slate-400 dark:text-slate-500">
                        <abbr title={actionKey[1] as string} className="no-underline">
                          {actionKey[0] as string}
                        </abbr>{' '}
                        K
                      </kbd>
                    ) : null}
                  </button>
                </div>
              </div>
              <div className="relative z-10 flex items-center lg:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-400 dark:focus:ring-sky-400">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
            </div>

            {navigation}
          </div>

          <DisclosurePanel as="nav" className="bg-white shadow lg:hidden dark:bg-slate-950" aria-label="Local">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }: { isActive: boolean }) =>
                  clsx(
                    isActive
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50'
                      : 'text-slate-900 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-50 dark:hover:bg-slate-900 dark:hover:text-slate-50',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )
                }
                onClick={() => close()}
              >
                Dashboard
              </NavLink>
            </div>

            {mobileNavigation ? (
              <div className="space-y-1 border-t border-slate-200 px-2 pb-3 pt-2 dark:border-slate-700">
                {mobileNavigation.header ? (
                  <NavLink
                    to={mobileNavigation.header.to}
                    end
                    className="block rounded-md px-3 py-2 text-base font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    onClick={() => close()}
                  >
                    {mobileNavigation.header.name}
                  </NavLink>
                ) : null}

                {mobileNavigation.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }: { isActive: boolean }) =>
                      clsx(
                        isActive
                          ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50'
                          : 'text-slate-900 hover:bg-slate-50 dark:text-slate-50 dark:hover:bg-slate-900',
                        mobileNavigation.header ? 'pl-6 pr-3' : ' px-3',
                        'block rounded-md py-2 text-sm font-medium'
                      )
                    }
                    onClick={() => close()}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            ) : null}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
