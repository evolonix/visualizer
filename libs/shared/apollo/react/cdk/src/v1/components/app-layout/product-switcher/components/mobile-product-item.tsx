import { DisclosureButton } from '@headlessui/react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { NavigationItem, WithRequired } from '../../nav.model';
import { ProductSwitcherNavigationItem } from '../product-switcher.model';
import { MobileProductMenu } from './mobile-product-menu';

export interface MobileProductItemProps {
  item: ProductSwitcherNavigationItem;
  open?: boolean;
  collapsible?: boolean;
  onClick?: (item: ProductSwitcherNavigationItem) => void;
}

export function MobileProductItem({ item, open, collapsible, onClick }: MobileProductItemProps) {
  // If item only has one child, use that child as the item
  const itemWithHref =
    item.subItems?.length === 1
      ? { ...item, ...item.subItems[0] }
      : (item as ProductSwitcherNavigationItem & WithRequired<NavigationItem, 'href'>);
  const itemWithChildren = item as WithRequired<ProductSwitcherNavigationItem, 'subItems'>;

  // Render as a menu if there are children, otherwise render as a link
  return item.subItems && item.subItems.length > 1 ? (
    <MobileProductMenu item={itemWithChildren} open={open} collapsible={collapsible} onClick={onClick} />
  ) : (
    <div>
      <div>
        {/* <!-- Selected: "text-neutral-900 font-extrabold", Default: "text-neutral-600 font-semibold group-hover:text-neutral-900 group-focus:text-neutral-900" --> */}
        <DisclosureButton
          as={item.selected ? NavLink : 'a'}
          {...(item.selected ? { to: itemWithHref.href } : { href: itemWithHref.href })}
          className={clsx(
            item.selected
              ? 'font-extrabold text-[var(--apollo-app-layout-highlight-text)]'
              : 'font-semibold text-[var(--apollo-app-layout-text)] hover:text-[var(--apollo-app-layout-highlight-text)] focus:text-[var(--apollo-app-layout-highlight-text)]',
            'hover:bg-[var(--apollo-app-layout-highlight-background)] focus:bg-[var(--apollo-app-layout-highlight-background)]',
            'group flex w-full items-center gap-2 py-2 pl-12 pr-4 text-left text-xs focus:outline-none'
          )}
        >
          {/* <!-- Selected: "text-blue-800", Default: "text-blue-300 group-hover:text-blue-800 group-focus:text-blue-800" --> */}
          <div
            className={clsx(
              item.selected ? 'text-blue-800' : 'text-blue-300 group-hover:text-blue-800 group-focus:text-blue-800',
              'grid size-6 flex-shrink-0 place-items-center'
            )}
          >
            {item.selected ? (
              <svg className="size-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="currentColor" />
                <path
                  d="M20.9451 12.4599L21.0413 12.5596C21.4991 13.0592 21.4991 13.8301 21.0413 14.3297L15.4323 20.4502C15.2311 20.6697 14.9654 20.793 14.6919 20.8179L14.5743 20.8225C14.2997 20.8192 14.0253 20.7171 13.8078 20.5141L13.7445 20.4502L11.3434 17.8301C10.8855 17.3305 10.8855 16.5596 11.3434 16.06L11.3762 16.0242C11.8073 15.5538 12.5345 15.5252 13.0006 15.9603L13.064 16.0242L14.5875 17.687L19.3206 12.5238C19.7517 12.0534 20.479 12.0248 20.9451 12.4599Z"
                  fill="white"
                />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="8" fill="currentColor" />
              </svg>
            )}
          </div>
          <span className="line-clamp-2 flex-1">{item.text}</span>
        </DisclosureButton>
      </div>
    </div>
  );
}
