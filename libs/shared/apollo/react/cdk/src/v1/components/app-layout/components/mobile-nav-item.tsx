import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import { DisclosureButton } from '@headlessui/react';
import { NavigationItem, WithRequired } from '../nav.model';
import { isActive } from '../nav.utils';
import { MobileNavMenu } from './mobile-nav-menu';
import { NavIcon } from './nav-icon';

export interface MobileNavItemProps {
  item: NavigationItem;
  open?: boolean;
  onClick?: (item: NavigationItem) => void;
  onSubItemSelect?: (item: NavigationItem) => void;
}

export function MobileNavItem({ item, open, onClick, onSubItemSelect }: MobileNavItemProps) {
  const { pathname } = useLocation();
  const itemWithHref = item as WithRequired<NavigationItem, 'href'>;
  const itemWithChildren = item as WithRequired<NavigationItem, 'subItems'>;
  const active = isActive(pathname, itemWithHref.href, item.end);

  return item.subItems?.length ? (
    <MobileNavMenu item={itemWithChildren} open={open} onClick={onClick} onSubItemSelect={onSubItemSelect} />
  ) : (
    <DisclosureButton
      as={NavLink}
      to={itemWithHref.href}
      end={item.end}
      className={clsx(
        active
          ? 'font-semibold text-[var(--apollo-app-layout-highlight-text)]'
          : 'text-[var(--apollo-app-layout-text)] hover:text-[var(--apollo-app-layout-highlight-text)] focus:text-[var(--apollo-app-layout-highlight-text)]',
        'hover:bg-[var(--apollo-app-layout-highlight-background)] focus:bg-[var(--apollo-app-layout-highlight-background)]',
        'group flex items-center gap-2 overflow-hidden py-2 pl-5 pr-4 text-xs focus:outline-none'
      )}
      title={item.text}
    >
      <NavIcon item={item} active={active} className="size-6 shrink-0" aria-hidden="true" />
      <span className="flex-1 overflow-hidden whitespace-nowrap">{item.text}</span>
    </DisclosureButton>
  );
}
