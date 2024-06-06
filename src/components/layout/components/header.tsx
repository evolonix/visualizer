import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from '@headlessui/react';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { useActionKey } from '../hooks';
import { LayoutFeatures, LayoutNavigation, LayoutTheme } from '../layout.model';
import { NavDisclosure } from './nav-disclosure';
import { NavItem } from './nav-item';
import { ThemeDisclosure } from './theme-disclosure';
import { ThemePopover } from './theme-popover';

const themes: (LayoutTheme & { name: string })[] = [
  {
    name: 'Light',
    colors: { background: 'white', highlight: 'var(--tw-color-blue-500)' },
    text: 'dark',
  },
  {
    name: 'Dark',
    colors: {
      background: 'var(--tw-color-neutral-900)',
      highlight: 'var(--tw-color-green-300)',
    },
    text: 'light',
  },
];

export interface HeaderProps {
  features?: LayoutFeatures;
  navigation?: LayoutNavigation;
  className?: string;
  onSearch?: React.MouseEventHandler<HTMLButtonElement>;
  onThemeChange?: (theme: LayoutTheme) => void;
}

export const Header = ({
  features,
  navigation,
  className,
  onSearch,
  onThemeChange,
}: HeaderProps) => {
  const actionKey = useActionKey();
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!features?.search) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle the menu when ⌘ K or Ctrl K is pressed
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onSearch?.({
          currentTarget: searchButtonRef.current,
        } as React.MouseEvent<HTMLButtonElement, MouseEvent>);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [features?.search, onSearch]);

  return (
    <>
      {/* Header */}
      <Disclosure
        as="header"
        className={twMerge(
          'fixed inset-x-0 top-0 transition-[margin]',
          className,
        )}
      >
        {({ open, close }) => (
          <>
            <div
              className={clsx(
                'relative z-20 flex h-16 items-center gap-4 px-4 transition-shadow duration-200 lg:px-8',
                'bg-[var(--layout-background)] text-[var(--layout-text)]',
                open ? 'lg:shadow-sm' : 'shadow-sm',
              )}
            >
              {/* Header Navigation Button */}
              <div className="lg:hidden">
                <DisclosureButton
                  id="header-navigation-button"
                  className={clsx(
                    'rounded-md bg-white p-1.5 text-sm font-semibold text-neutral-900 shadow-md ring-1 ring-inset ring-neutral-300',
                    'hover:bg-neutral-5 focus:bg-neutral-50 focus:outline-none active:bg-neutral-100',
                  )}
                >
                  {open ? (
                    <XMarkIcon className="size-4" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="size-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {open ? 'Close Navigation' : 'Open Navigation'}
                  </span>
                </DisclosureButton>
              </div>

              {/* Header Title */}
              <div className="flex-[1] text-center lg:text-left">Header</div>

              {/* Search Button */}
              {features?.search ? (
                <div className="hidden flex-[1] justify-center lg:flex">
                  <button
                    ref={searchButtonRef}
                    type="button"
                    className="flex w-72 items-center gap-2 rounded-lg bg-white px-2 py-1 text-left text-neutral-800 ring-1 ring-neutral-200 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none active:bg-neutral-200"
                    onClick={onSearch}
                  >
                    <MagnifyingGlassIcon
                      className="size-5"
                      aria-hidden="true"
                    />
                    <span className="grow">Search</span>
                    {actionKey ? (
                      <kbd className="font-sans text-xs font-semibold">
                        <abbr
                          title={actionKey[1] as string}
                          className="no-underline"
                        >
                          {actionKey[0] as string}
                        </abbr>{' '}
                        K
                      </kbd>
                    ) : null}
                  </button>
                </div>
              ) : null}

              {/* Theme Button */}
              <div className="flex w-7 justify-end lg:w-auto lg:flex-[1]">
                <ThemePopover
                  themes={themes}
                  className="text-[var(--layout-text)]"
                  onThemeChange={(theme) => onThemeChange?.(theme)}
                />
              </div>
            </div>

            <Transition
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-neutral-500/75 transition-opacity lg:hidden" />
            </Transition>

            <Transition
              enter="transform transition ease-in-out duration-500"
              enterFrom="-translate-y-full"
              enterTo="translate-y-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-y-0"
              leaveTo="-translate-y-full"
            >
              <div className="fixed inset-0 overflow-y-auto pt-16 lg:hidden">
                <DisclosurePanel
                  className={clsx(
                    'relative origin-top pb-4 shadow-lg transition',
                    'bg-[var(--layout-background)] text-[var(--layout-text)]',
                  )}
                >
                  <ThemeDisclosure
                    themes={themes}
                    className={clsx(
                      'text-[var(--layout-text)]',
                      'hover:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] hover:text-[var(--layout-highlight)]',
                      'focus:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] focus:text-[var(--layout-highlight)]',
                      'active:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_30%)] active:text-[var(--layout-highlight)]',
                    )}
                    onThemeChange={(theme) => {
                      onThemeChange?.(theme);
                      close();
                    }}
                  />

                  {/* Header Navigation */}
                  {navigation ? (
                    <nav>
                      <ul className="flex flex-col">
                        {navigation.top.map((item, index) => (
                          <li key={index}>
                            {item.path ? (
                              <NavItem
                                {...item}
                                path={item.path}
                                onClick={close}
                                className={clsx(
                                  'px-4',
                                  'text-[var(--layout-text)]',
                                  'hover:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] hover:text-[var(--layout-highlight)]',
                                  'focus:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] focus:text-[var(--layout-highlight)]',
                                  'active:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_30%)] active:text-[var(--layout-highlight)]',
                                )}
                              />
                            ) : item.subItems?.length ? (
                              <NavDisclosure
                                {...item}
                                subItems={item.subItems}
                                className={clsx(
                                  'text-[var(--layout-text)]',
                                  'hover:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] hover:text-[var(--layout-highlight)]',
                                  'focus:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] focus:text-[var(--layout-highlight)]',
                                  'active:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_30%)] active:text-[var(--layout-highlight)]',
                                )}
                                close={close}
                              />
                            ) : null}
                          </li>
                        ))}
                        {navigation.bottom?.map((item, index) => (
                          <li key={index}>
                            {item.path ? (
                              <NavItem
                                {...item}
                                path={item.path}
                                onClick={close}
                                className={clsx(
                                  'px-4',
                                  'text-[var(--layout-text)]',
                                  'hover:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] hover:text-[var(--layout-highlight)]',
                                  'focus:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] focus:text-[var(--layout-highlight)]',
                                  'active:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_30%)] active:text-[var(--layout-highlight)]',
                                )}
                              />
                            ) : item.subItems?.length ? (
                              <NavDisclosure
                                {...item}
                                subItems={item.subItems}
                                className={clsx(
                                  'text-[var(--layout-text)]',
                                  'hover:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] hover:text-[var(--layout-highlight)]',
                                  'focus:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] focus:text-[var(--layout-highlight)]',
                                  'active:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_30%)] active:text-[var(--layout-highlight)]',
                                )}
                                close={close}
                              />
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </nav>
                  ) : null}

                  {/* <Lipsum /> */}
                </DisclosurePanel>
              </div>
            </Transition>
          </>
        )}
      </Disclosure>
    </>
  );
};