import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import { NavigationItem, WithRequired } from '../nav.model';
import { getActiveChild } from '../nav.utils';
import { NavIcon } from './nav-icon';

export interface MobileNavMenuProps {
  item: WithRequired<NavigationItem, 'subItems'>;
  open?: boolean;
  onClick?: (item: NavigationItem) => void;
  onSubItemSelect?: (item: NavigationItem) => void;
}

export function MobileNavMenu({ item, open, onClick, onSubItemSelect }: MobileNavMenuProps) {
  const { pathname } = useLocation();
  const activeChild = getActiveChild(pathname, item.subItems);

  return (
    <Disclosure as="div" className="overflow-hidden">
      <>
        <div>
          <DisclosureButton
            className={clsx(
              'text-[var(--apollo-app-layout-text)] hover:text-[var(--apollo-app-layout-highlight-text)] focus:text-[var(--apollo-app-layout-highlight-text)]',
              'hover:bg-[var(--apollo-app-layout-highlight-background)] focus:bg-[var(--apollo-app-layout-highlight-background)]',
              'group flex w-full items-center gap-2 overflow-hidden py-2 pl-5 pr-4 text-xs transition-[padding] focus:outline-none',
              'text-left'
            )}
            title={item.text}
            onClick={() => onClick?.(item)}
          >
            <NavIcon item={item} type="outline" active={activeChild !== null} className="size-6 shrink-0" aria-hidden="true" />
            <span className="flex-1 overflow-hidden whitespace-nowrap">{item.text}</span>
            <ChevronRightIcon className={clsx(open ? 'rotate-90' : '', 'size-3 shrink-0')} aria-hidden="true" />
          </DisclosureButton>
        </div>

        <DisclosurePanel as="ul" static hidden={!open}>
          {item.subItems.map((subItem) => (
            <li key={subItem.text} className="relative">
              <NavLink
                to={subItem.href}
                end={subItem.end}
                className={({ isActive }: { isActive: boolean }) =>
                  clsx(
                    isActive
                      ? 'font-semibold text-[var(--apollo-app-layout-highlight-text)]'
                      : 'text-[var(--apollo-app-layout-text)] hover:text-[var(--apollo-app-layout-highlight-text)] focus:text-[var(--apollo-app-layout-highlight-text)]',
                    'hover:bg-[var(--apollo-app-layout-highlight-background)] focus:bg-[var(--apollo-app-layout-highlight-background)]',
                    'group flex items-center overflow-hidden py-2 pl-6 pr-4 text-xs focus:outline-none'
                  )
                }
                onClick={() => onSubItemSelect?.(subItem)}
              >
                <span className="flex-1 overflow-hidden whitespace-nowrap pl-7">{subItem.text}</span>
              </NavLink>
            </li>
          ))}
        </DisclosurePanel>

        {activeChild && !open ? (
          <ul>
            <li className="relative">
              <NavLink
                to={activeChild.href}
                end={activeChild.end}
                className="group flex items-center overflow-hidden py-2 pl-6 pr-4 text-xs font-semibold text-[var(--apollo-app-layout-highlight-text)] hover:bg-[var(--apollo-app-layout-highlight-background)] hover:text-[var(--apollo-app-layout-highlight-text)] focus:bg-[var(--apollo-app-layout-highlight-background)] focus:text-[var(--apollo-app-layout-highlight-text)] focus:outline-none"
                onClick={() => onSubItemSelect?.(activeChild)}
              >
                <span className="flex-1 overflow-hidden whitespace-nowrap pl-7">{activeChild.text}</span>
              </NavLink>

              {/* <div className="absolute right-0 top-0 h-10 w-1 rounded-l bg-[var(--apollo-app-layout-highlight-text)]"></div> */}
            </li>
          </ul>
        ) : null}
      </>
    </Disclosure>
  );
}
