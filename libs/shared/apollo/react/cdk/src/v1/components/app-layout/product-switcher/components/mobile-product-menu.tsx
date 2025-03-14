import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import { NavIcon } from '../../components';
import { WithRequired } from '../../nav.model';
import { getActiveChild } from '../../nav.utils';
import { ProductSwitcherNavigationItem } from '../product-switcher.model';

export interface MobileProductMenuProps {
  item: WithRequired<ProductSwitcherNavigationItem, 'subItems'>;
  open?: boolean;
  collapsible?: boolean;
  onClick?: (item: ProductSwitcherNavigationItem) => void;
}

export function MobileProductMenu({ item, open, collapsible, onClick }: MobileProductMenuProps) {
  const { pathname } = useLocation();
  const activeChild = item.selected ? getActiveChild(pathname, item.subItems) : null;

  return (
    <Disclosure as="div">
      <>
        <div>
          {/* Selected: "text-neutral-900 font-extrabold", Default: "text-neutral-600 font-semibold group-hover:text-neutral-900 group-focus:text-neutral-900" disabled, Collapsible: enabled */}
          <button
            type="button"
            className={clsx(
              item.selected
                ? 'font-extrabold text-[var(--apollo-app-layout-highlight-text)]'
                : 'font-semibold text-[var(--apollo-app-layout-text)] hover:text-[var(--apollo-app-layout-highlight-text)] focus:text-[var(--apollo-app-layout-highlight-text)]',
              'hover:bg-[var(--apollo-app-layout-highlight-background)] focus:bg-[var(--apollo-app-layout-highlight-background)]',
              'group flex w-full items-center gap-2 py-2 pl-12 pr-4 text-left text-xs focus:outline-none'
            )}
            onClick={() => onClick?.(item)}
            aria-expanded={open}
            aria-controls={`${item.product}-disclosure-panel`}
            disabled={!collapsible}
          >
            {/* Selected: "text-blue-800", Default: "text-blue-300 group-hover:text-blue-800 group-focus:text-blue-800" */}
            <div
              className={clsx(
                item.selected ? 'text-blue-800' : 'text-blue-300 group-hover:text-blue-800 group-focus:text-blue-800',
                'grid size-6 flex-shrink-0 place-items-center'
              )}
            >
              {item.selected ? (
                // Selected: show, Default: hide
                <svg className="size-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="currentColor" />
                  <path
                    d="M20.9451 12.4599L21.0413 12.5596C21.4991 13.0592 21.4991 13.8301 21.0413 14.3297L15.4323 20.4502C15.2311 20.6697 14.9654 20.793 14.6919 20.8179L14.5743 20.8225C14.2997 20.8192 14.0253 20.7171 13.8078 20.5141L13.7445 20.4502L11.3434 17.8301C10.8855 17.3305 10.8855 16.5596 11.3434 16.06L11.3762 16.0242C11.8073 15.5538 12.5345 15.5252 13.0006 15.9603L13.064 16.0242L14.5875 17.687L19.3206 12.5238C19.7517 12.0534 20.479 12.0248 20.9451 12.4599Z"
                    fill="white"
                  />
                </svg>
              ) : (
                // Selected: hide, Default: show
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="8" fill="currentColor" />
                </svg>
              )}
            </div>
            <span className="line-clamp-2 flex-1">{item.text}</span>
            {collapsible ? (
              // Icon: chevron-right
              // Collapsible: show, Default: hide
              // Open: "rotate-90", Default: ""
              <ChevronRightIcon className={clsx(open ? 'rotate-90' : '', 'pointer-events-none size-3')} aria-hidden="true" />
            ) : null}
          </button>
        </div>

        <DisclosurePanel id={`${item.product}-disclosure-panel`} as="ul" static hidden={!open} className="pl-3">
          {item.subItems.map((subItem) => (
            <li key={subItem.text}>
              {/* Active: "text-neutral-900 font-extrabold", Default: "text-neutral-600 font-semibold" */}
              <DisclosureButton
                as={item.selected ? NavLink : 'a'}
                {...(item.selected ? { to: subItem.href } : { href: subItem.href })}
                className={clsx(
                  subItem === activeChild
                    ? 'font-semibold text-[var(--apollo-app-layout-highlight-text)]'
                    : 'text-[var(--apollo-app-layout-text)] hover:text-[var(--apollo-app-layout-highlight-text)] focus:text-[var(--apollo-app-layout-highlight-text)]',
                  'hover:bg-[var(--apollo-app-layout-highlight-background)] focus:bg-[var(--apollo-app-layout-highlight-background)]',
                  'group flex items-center overflow-hidden py-2 pl-16 pr-4 text-xs focus:outline-none'
                )}
              >
                <div className="grid size-8 flex-shrink-0 place-items-center">
                  <NavIcon item={subItem} type="outline" className="pointer-events-none mr-1 size-6 min-w-[24px]" aria-hidden="true" />
                </div>
                <span className="flex-1 truncate">{subItem.text}</span>
                {/* Active: show, Default: hide */}
                {subItem === activeChild ? <CheckIcon className="pointer-events-none size-4" aria-hidden="true" /> : null}
              </DisclosureButton>
            </li>
          ))}
        </DisclosurePanel>

        {activeChild && !open ? (
          <ul className="border-t border-neutral-300 pl-3">
            <li>
              <DisclosureButton
                as={item.selected ? NavLink : 'a'}
                {...(item.selected ? { to: activeChild.href } : { href: activeChild.href })}
                className="group flex items-center overflow-hidden py-2 pl-16 pr-4 text-xs font-semibold text-[var(--apollo-app-layout-highlight-text)] hover:bg-[var(--apollo-app-layout-highlight-background)] hover:text-[var(--apollo-app-layout-highlight-text)] focus:bg-[var(--apollo-app-layout-highlight-background)] focus:text-[var(--apollo-app-layout-highlight-text)] focus:outline-none"
              >
                <div className="grid size-8 flex-shrink-0 place-items-center">
                  <NavIcon item={activeChild} type="outline" className="pointer-events-none mr-1 size-6 min-w-[24px]" aria-hidden="true" />
                </div>
                <span className="flex-1 truncate">{activeChild.text}</span>
                <CheckIcon className="pointer-events-none size-4" aria-hidden="true" />
              </DisclosureButton>
            </li>
          </ul>
        ) : null}
      </>
    </Disclosure>
  );
}
