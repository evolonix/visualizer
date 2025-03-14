import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import { NavigationItem, WithRequired } from '../nav.model';
import { getActiveChild } from '../nav.utils';
import { NavIcon } from './nav-icon';

export interface NavMenuProps {
  item: WithRequired<NavigationItem, 'subItems'>;
  navLocation?: 'top' | 'bottom';
}

export function NavMenu({ item, navLocation = 'top' }: NavMenuProps) {
  const { pathname } = useLocation();
  const activeChild = getActiveChild(pathname, item.subItems);

  return (
    <Popover className="relative">
      <div>
        <PopoverButton
          className={clsx(
            activeChild
              ? 'font-semibold text-[var(--apollo-app-layout-highlight-text)]'
              : 'text-[var(--apollo-app-layout-text)] hover:text-[var(--apollo-app-layout-highlight-text)] focus:text-[var(--apollo-app-layout-highlight-text)]',
            'hover:bg-[var(--apollo-app-layout-highlight-background)] focus:bg-[var(--apollo-app-layout-highlight-background)]',
            'group flex w-full items-center gap-1 overflow-hidden py-3 pl-7 pr-3 text-xs transition-[padding] focus:outline-none [.expanded_&]:gap-2 [.expanded_&]:pl-6',
            'text-left'
          )}
          title={item.text}
        >
          <NavIcon item={item} type="outline" active={activeChild !== null} className="size-6 shrink-0" aria-hidden="true" />
          <span className="sr-only flex-1 overflow-hidden whitespace-nowrap [.expanded_&]:not-sr-only">{item.text}</span>
          <ChevronRightIcon className="size-3 shrink-0" aria-hidden="true" />
        </PopoverButton>

        {activeChild ? (
          <div className={clsx('absolute inset-y-0 right-0 w-1 rounded-l', 'bg-[var(--apollo-app-layout-highlight-text)]')} />
        ) : null}
      </div>

      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-x-1"
        enterTo="opacity-100 translate-x-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-x-0"
        leaveTo="opacity-0 -translate-x-1"
      >
        <PopoverPanel
          className={clsx(
            navLocation === 'top' ? 'top-0' : '-bottom-4', // Bottom offset for shadow
            'absolute z-10 ml-20 w-screen max-w-max -translate-y-2 px-2 [.expanded_&]:ml-[200px]'
          )}
        >
          {({ close }) => (
            <div className="w-screen max-w-60 flex-auto overflow-hidden rounded-xl bg-white text-neutral-800 shadow-xl ring-1 ring-neutral-200">
              <div className="py-2">
                <h4 className="mb-2 px-4 py-2 font-extrabold">{item.text}</h4>
                <ul className="border-t border-neutral-300">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.text}>
                      <NavLink
                        to={subItem.href}
                        end={subItem.end}
                        className={({ isActive }) =>
                          clsx(
                            isActive ? 'font-semibold' : '',
                            'flex items-center justify-between px-4 py-2 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none'
                          )
                        }
                        onClick={() => close()}
                      >
                        {subItem.text}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
