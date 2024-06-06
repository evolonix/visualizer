import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronRightIcon, PlusIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { LayoutFeatures, LayoutLogos, LayoutNavigation } from '../layout.model';
import { NavItem } from './nav-item';
import { NavPopover } from './nav-popover';

export interface SidebarProps {
  logos?: LayoutLogos;
  features?: LayoutFeatures;
  navigation?: LayoutNavigation;
  sidebarExpanded: boolean;
  onToggleExpanded: () => void;
  onAdd?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Sidebar = ({
  logos,
  features,
  navigation,
  sidebarExpanded,
  onToggleExpanded,
  onAdd,
}: SidebarProps) => {
  return (
    <>
      {/* Sidebar */}
      <Disclosure
        as="aside"
        className={({ open }) =>
          clsx(
            'fixed inset-y-0 left-0 hidden shadow transition-[width] lg:block',
            'bg-[var(--layout-background)] text-[var(--layout-text)]',
            open ? 'w-52' : 'w-20',
          )
        }
        defaultOpen={sidebarExpanded}
      >
        {/* Sidebar Expand Button */}
        <DisclosureButton
          id="sidebar-expand-button"
          className={clsx(
            'absolute -right-4 top-4',
            'rounded-md bg-white p-1.5 text-sm font-semibold text-neutral-900 shadow-lg ring-1 ring-inset ring-neutral-300',
            'hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none active:bg-neutral-100',
          )}
          title={sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          onClick={onToggleExpanded}
        >
          <ChevronRightIcon
            className={clsx('size-4', sidebarExpanded ? 'rotate-180' : '')}
            aria-hidden="true"
          />
          <span className="sr-only">
            {sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          </span>
        </DisclosureButton>

        <DisclosurePanel static>
          {({ open }) => (
            <>
              {/* Logos */}
              {logos ? (
                <div className="grid h-20 place-content-center overflow-hidden">
                  {sidebarExpanded ? (
                    <div className="flex">
                      <img
                        src={logos.large.url}
                        alt="Logo"
                        className="h-10 w-10"
                      />
                      {/* <PlayIcon
                      className="size-10 shrink-0 -rotate-90"
                      aria-hidden="true"
                    />
                    <PlayIcon
                      className="size-10 shrink-0 rotate-45"
                      aria-hidden="true"
                    />
                    <PlayIcon
                      className="size-10 shrink-0 -rotate-12"
                      aria-hidden="true"
                    /> */}
                    </div>
                  ) : (
                    <img
                      src={logos.small.url}
                      alt="Logo"
                      className="h-10 w-10"
                    />
                    // <PlayIcon className="size-10 shrink-0 -rotate-90" />
                  )}
                  <span className="sr-only">Logo</span>
                </div>
              ) : null}

              <div
                className={clsx(
                  'fixed bottom-0 left-0 top-20 overflow-y-auto overflow-x-hidden pb-4 transition-[width]',
                  open ? 'w-52' : 'w-20',
                )}
              >
                {/* Sidebar Navigation */}
                {navigation ? (
                  <nav className="flex h-full flex-col">
                    <ul className="flex flex-col">
                      {navigation.top.map((item, index) => (
                        <li key={index}>
                          {item.path ? (
                            <NavItem
                              {...item}
                              path={item.path}
                              iconOnly={!sidebarExpanded}
                              className={clsx(
                                'hover:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] hover:text-[var(--layout-highlight)]',
                                'focus:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] focus:text-[var(--layout-highlight)]',
                                'active:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_30%)] active:text-[var(--layout-highlight)]',
                              )}
                            />
                          ) : item.subItems?.length ? (
                            <NavPopover
                              {...item}
                              subItems={item.subItems}
                              iconOnly={!sidebarExpanded}
                              className={clsx(
                                'hover:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] hover:text-[var(--layout-highlight)]',
                                'focus:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] focus:text-[var(--layout-highlight)]',
                                'active:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_30%)] active:text-[var(--layout-highlight)]',
                              )}
                            />
                          ) : null}
                        </li>
                      ))}
                    </ul>

                    {/* <Lipsum className="px-4" /> */}

                    <ul className="flex grow flex-col justify-end">
                      {features?.add ? (
                        <li className="py-2 text-center">
                          <button
                            type="button"
                            className={clsx(
                              'inline-flex items-center gap-0.5 whitespace-nowrap',
                              'rounded-md bg-white py-1.5 text-sm font-semibold text-neutral-900 shadow-lg ring-1 ring-inset ring-neutral-300',
                              'hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none active:bg-neutral-100',
                              sidebarExpanded ? 'px-2.5' : 'px-1.5',
                            )}
                            onClick={onAdd}
                          >
                            <PlusIcon className="size-4" aria-hidden="true" />
                            <span className={sidebarExpanded ? '' : 'sr-only'}>
                              Add
                            </span>
                          </button>
                        </li>
                      ) : null}
                      {navigation.bottom?.map((item, index) => (
                        <li key={index}>
                          {item.path ? (
                            <NavItem
                              {...item}
                              path={item.path}
                              iconOnly={!sidebarExpanded}
                              className={clsx(
                                'text-[var(--layout-text)]',
                                'hover:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] hover:text-[var(--layout-highlight)]',
                                'focus:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] focus:text-[var(--layout-highlight)]',
                                'active:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_30%)] active:text-[var(--layout-highlight)]',
                              )}
                            />
                          ) : item.subItems?.length ? (
                            <NavPopover
                              {...item}
                              subItems={item.subItems}
                              iconOnly={!sidebarExpanded}
                              className={clsx(
                                'text-[var(--layout-text)]',
                                'hover:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] hover:text-[var(--layout-highlight)]',
                                'focus:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_15%)] focus:text-[var(--layout-highlight)]',
                                'active:bg-[rgb(from_var(--layout-highlight)_r_g_b_/_30%)] active:text-[var(--layout-highlight)]',
                              )}
                            />
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </nav>
                ) : null}
              </div>
            </>
          )}
        </DisclosurePanel>
      </Disclosure>
    </>
  );
};
