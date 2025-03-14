import { NavLink } from 'react-router-dom';
import { twJoin, twMerge } from '../../../../utils';
import { LayoutFeature, LayoutNavigationItem } from '../../layout.model';
import { NavIcon } from './nav-icon';

export interface NavItemProps {
  item: LayoutNavigationItem;
  iconOnly?: boolean;
  beta?: LayoutFeature;
  className?: string;
  active: boolean;
  onItemSelect?: (item: LayoutNavigationItem) => void;
}

export const NavItem = ({ item, iconOnly, beta, className, active, onItemSelect }: NavItemProps) => {
  /**
   * User clicked (or keyboard event) to navigate
   * Notify parent component and report the event
   */
  const handleClick = (item: LayoutNavigationItem) => {
    item.trackEvent?.();
    onItemSelect?.(item);
  };

  return item.routerLink ? (
    <NavLink
      to={item.routerLink}
      className={twMerge(
        'tw-relative tw-flex tw-items-center tw-px-7 tw-py-3 tw-text-xs',
        'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight)]',
        'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight)] focus:tw-outline-none',
        'active:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight)]',
        active ? 'tw-font-semibold tw-text-[var(--apollo-layout-highlight)]' : '',
        className
      )}
      title={item.text}
      data-dgat={item.dgat}
      onClick={() => handleClick(item)}
    >
      <NavItemContent item={item} active={active} iconOnly={iconOnly} beta={beta} />
    </NavLink>
  ) : item.visible && item.href ? (
    <a
      href={item.href}
      target={item.target}
      className={twMerge(
        'tw-relative tw-flex tw-items-center tw-pl-7 tw-pr-3 rtl:tw-pl-3 rtl:tw-pr-7 tw-py-3 tw-text-xs',
        'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight)]',
        'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight)] focus:tw-outline-none',
        'active:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight)]',
        active ? 'tw-font-semibold tw-text-[var(--apollo-layout-highlight)]' : '',
        className
      )}
      title={item.text}
      data-dgat={item.dgat}
      onClick={() => handleClick(item)}
    >
      <NavItemContent item={item} active={active} iconOnly={iconOnly} beta={beta} />
    </a>
  ) : null;
};

export interface NavItemContentProps {
  item: LayoutNavigationItem;
  active: boolean;
  iconOnly?: boolean;
  beta?: LayoutFeature;
}

export const NavItemContent = ({ item, active, iconOnly, beta }: NavItemContentProps) => {
  return (
    <>
      <NavIcon
        item={item}
        active={active}
        className={twJoin(
          'tw-size-6 tw-shrink-0 tw-min-w-6',
          iconOnly ? '' : 'tw-mr-2 rtl:tw-mr-0 rtl:tw-ml-2',
          item.rtlMirrorIcon ? 'rtl:tw-scale-x-[-1]' : ''
        )}
      />

      <span className={twJoin(iconOnly ? 'tw-sr-only' : 'tw-truncate', beta?.enabled && item.isBeta ? '' : 'tw-grow')}>{item.text}</span>

      {beta?.enabled && item.isBeta ? (
        <div
          className={twJoin(
            'tw-grow',
            iconOnly ? 'tw-absolute tw-right-2 tw-top-1 rtl:tw-left-2 rtl:tw-right-auto' : 'tw--mt-2 tw-flex tw-self-start'
          )}
        >
          <div
            className={twJoin(
              'tw-rounded-2xl tw-border tw-border-purple-300 tw-bg-purple-100 tw-px-1 tw-py-0.5 tw-text-[8px] tw-font-extrabold tw-uppercase tw-leading-3 tw-text-purple-800'
            )}
          >
            {beta.text}
          </div>
        </div>
      ) : null}

      {active ? (
        <div
          className={twJoin(
            'tw-absolute tw-inset-y-0 tw-right-0 tw-w-1 tw-rounded-l tw-bg-[var(--apollo-layout-highlight)] rtl:tw-left-0 rtl:tw-right-auto rtl:tw-rounded-l-none rtl:tw-rounded-r'
          )}
        ></div>
      ) : null}
    </>
  );
};
