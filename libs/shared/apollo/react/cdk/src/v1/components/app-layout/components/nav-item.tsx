import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import { NavigationItem, WithRequired } from '../nav.model';
import { isActive } from '../nav.utils';
import { NavIcon } from './nav-icon';
import { NavMenu } from './nav-menu';

export interface NavItemProps {
  item: NavigationItem;
  navLocation?: 'top' | 'bottom';
  open?: boolean;
  onClick?: (item: NavigationItem) => void;
}

export function NavItem({ item, navLocation }: NavItemProps) {
  const { pathname } = useLocation();
  const itemWithHref = item as WithRequired<NavigationItem, 'href'>;
  const itemWithChildren = item as WithRequired<NavigationItem, 'subItems'>;
  const active = isActive(pathname, itemWithHref.href, item.end);

  return item.subItems?.length ? (
    <NavMenu item={itemWithChildren} navLocation={navLocation} />
  ) : (
    <>
      <NavLink
        to={itemWithHref.href}
        end={item.end}
        className={clsx(
          active
            ? 'font-semibold text-[var(--apollo-app-layout-highlight-text)]'
            : 'text-[var(--apollo-app-layout-text)] hover:text-[var(--apollo-app-layout-highlight-text)] focus:text-[var(--apollo-app-layout-highlight-text)]',
          'hover:bg-[var(--apollo-app-layout-highlight-background)] focus:bg-[var(--apollo-app-layout-highlight-background)]',
          'group flex w-full items-center gap-1 overflow-hidden py-3 pl-7 pr-3 text-xs transition-[padding] focus:outline-none [.expanded_&]:gap-2 [.expanded_&]:pl-6'
        )}
        title={item.text}
      >
        <NavIcon item={item} type="outline" active={active} className="size-6 shrink-0" aria-hidden="true" />
        <span className="sr-only flex-1 overflow-hidden whitespace-nowrap [.expanded_&]:not-sr-only">{item.text}</span>
      </NavLink>

      {active ? (
        <div className={clsx('absolute inset-y-0 right-0 w-1 rounded-l', 'bg-[var(--apollo-app-layout-highlight-text)]')}></div>
      ) : null}
    </>
  );
}
