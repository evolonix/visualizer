import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { twJoin } from '../../../../utils';
import { Icon } from '../../../icon';
import { LayoutFeature, LayoutNavigationItem } from '../../layout.model';
import { getActiveChild } from '../../layout.utils';
import { NavIcon } from './nav-icon';
import { NavItem } from './nav-item';

export interface NavDisclosureProps {
  item: LayoutNavigationItem;
  beta?: LayoutFeature;
  onItemSelect: (item: LayoutNavigationItem) => void;
}

export const NavDisclosure = ({ item, beta, onItemSelect }: NavDisclosureProps) => {
  const [open, setOpen] = useState(false);
  const [activeChild, setActiveChild] = useState<LayoutNavigationItem | null>(null);
  const { pathname } = useLocation();

  const handleItemSelect = useCallback(
    (item: LayoutNavigationItem) => {
      setOpen(false);
      item.trackEvent?.();
      onItemSelect(item);
    },
    [onItemSelect]
  );
  const visibleChildren = useCallback(() => {
    const isChildVisible = (child: LayoutNavigationItem) => child.visible;
    return item.children?.filter(isChildVisible) || [];
  }, [item]);

  useEffect(() => {
    const updateActiveChild = (url: string) => {
      setActiveChild(item.children ? getActiveChild(url, item.children) : null);
    };

    updateActiveChild(pathname);
  }, [pathname, item.children]);

  return (
    <div>
      <button
        type="button"
        className={twJoin(
          'tw-flex tw-w-full tw-items-center tw-px-4 tw-py-2 tw-text-left rtl:tw-text-right',
          'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight)]',
          'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight)] focus:tw-outline-none',
          'active:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight)]'
        )}
        data-dgat={item.dgat}
        hidden={visibleChildren().length === 0}
        onClick={() => setOpen((open) => !open)}
      >
        <NavIcon item={item} active={activeChild !== null} className="tw-size-6 tw-shrink-0 tw-mr-2 rtl:tw-mr-0 rtl:tw-ml-2" />

        <span className={twJoin(beta?.enabled && item.isBeta ? '' : 'tw-grow')}>{item.text}</span>

        {beta?.enabled && item.isBeta ? (
          <div className={twJoin('tw--mt-2 tw-flex tw-grow tw-self-start')}>
            <div
              className={twJoin(
                'tw-rounded-2xl tw-border tw-border-purple-300 tw-bg-purple-100 tw-px-1 tw-py-0.5 tw-text-[8px] tw-font-extrabold tw-uppercase tw-leading-3 tw-text-purple-800'
              )}
            >
              {beta.text}
            </div>
          </div>
        ) : null}

        <Icon
          icon="chevron-right"
          type="solid"
          solidSize="16"
          className={twJoin('tw-size-4 tw-ml-2 rtl:tw-ml-0 rtl:tw-mr-2', open ? 'tw-rotate-90' : 'rtl:tw-rotate-180')}
        />
      </button>

      {open ? (
        <div>
          <ul className="tw-flex tw-flex-col">
            {visibleChildren()
              ?.filter((child) => child.href || child.routerLink)
              .map((child) => (
                <li key={child.dgat}>
                  <NavItem
                    item={child}
                    active={child === activeChild}
                    onItemSelect={() => handleItemSelect(child)}
                    className="tw-px-12 tw-text-base"
                  ></NavItem>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {!open && activeChild && (activeChild.href || activeChild.routerLink) ? (
        <ul>
          <li>
            <NavItem
              item={activeChild}
              active
              onItemSelect={() => handleItemSelect(activeChild)}
              className="tw-px-12 tw-text-base"
            ></NavItem>
          </li>
        </ul>
      ) : null}
    </div>
  );
};
