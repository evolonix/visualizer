import { FocusTrap, Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useCallback, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { twJoin, twMerge } from '../../../../utils';
import { Icon } from '../../../icon';
import { LayoutFeature, LayoutNavigationItem } from '../../layout.model';
import { isItemActive as isActive } from '../../layout.utils';
import { NavIcon } from './nav-icon';

export interface NavPopoverProps {
  item: LayoutNavigationItem;
  iconOnly?: boolean;
  beta?: LayoutFeature;
  active: boolean;
}

/**
 * Is the target (mouse event) inside the popover
 */
const isInside = (target: any | null, popover: HTMLElement | null) => {
  return popover === target || target instanceof Window || popover?.contains(target as Node) || false;
};

export const NavPopover = ({ item, iconOnly, beta, active }: NavPopoverProps) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleTriggerHover = (item: LayoutNavigationItem, open: boolean, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    item.trackEvent?.();

    if (open) {
      setOpen(true);
    } else {
      // If the mouse is leaving the trigger, check if it's entering the popover
      // If so, keep the popover open, otherwise close it
      const popover = popoverRef.current;
      const open = popover ? isInside(event.relatedTarget, popover) : false;
      setOpen(open);
    }
  };

  const handleTriggerBlur = (event: React.FocusEvent<HTMLButtonElement, Element>) => {
    // If the focus is leaving the trigger, check if it's entering the popover
    // If so, keep the popover open, otherwise close it
    const popover = popoverRef.current;
    const open = popover ? isInside(event.relatedTarget, popover) : false;
    setOpen(open);
  };

  const handleTriggerClick = (item: LayoutNavigationItem, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    item.trackEvent?.();

    setOpen((open) => !open);
  };

  const handleTriggerKeyDown = (item: LayoutNavigationItem, event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      item.trackEvent?.();

      setOpen((open) => {
        if (!open) {
          // Wait for the popover to animate in before focusing the first tabbable element
          setTimeout(() => {
            const popover = popoverRef.current;
            const firstTabbable = popover?.querySelector<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]'
            );
            firstTabbable?.focus();
          }, 250);
        }
        return !open;
      });
    }
  };

  const handlePopoverMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // If the mouse is leaving the popover, check if it's entering the trigger
    // If so, keep the popover open, otherwise close it
    const trigger = triggerRef.current;
    const open = event.relatedTarget === trigger || trigger?.contains(event.relatedTarget as Node) || false;
    setOpen(open);
  };

  const handlePopoverKeydown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);

      setTimeout(() => {
        // Focus the trigger button when the popover is closed by pressing Escape
        const trigger = triggerRef.current;
        trigger?.focus();
      }, 10);
    }
  };

  const handleClick = (child: LayoutNavigationItem) => {
    child.trackEvent?.();
    setOpen(false);
  };

  // watchPathname: When route changes, update pathname and trigger re-renders to recalculate which item is active
  const isItemActive = useCallback((item: LayoutNavigationItem) => isActive(pathname)(item), [pathname]);
  const visibleChildren = useCallback(() => {
    const isChildVisible = (child: LayoutNavigationItem) => child.visible;
    return item.children?.filter(isChildVisible) || [];
  }, [item]);

  return (
    <Popover className="group">
      <PopoverButton
        ref={triggerRef}
        className={twJoin(
          'tw-relative tw-flex tw-w-full tw-items-center tw-py-3 tw-pl-7 tw-pr-3 tw-text-left tw-text-xs rtl:tw-pl-3 rtl:tw-pr-7 rtl:tw-text-right',
          'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight)]',
          'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight)] focus:tw-outline-none',
          'active:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight)]',
          active ? 'tw-font-semibold tw-text-[var(--apollo-layout-highlight)]' : '',
          'group-data-[open]:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)]'
        )}
        title={item.text}
        data-dgat={item.dgat}
        hidden={visibleChildren().length === 0}
        onClick={(e) => handleTriggerClick(item, e)}
        onBlur={(e) => handleTriggerBlur(e)}
        onMouseEnter={(e) => handleTriggerHover(item, true, e)}
        onMouseLeave={(e) => handleTriggerHover(item, false, e)}
        onKeyDown={(e) => handleTriggerKeyDown(item, e)}
      >
        <NavIcon
          item={item}
          active={active}
          className={twJoin(
            'tw-size-6 tw-min-w-6 tw-shrink-0',
            iconOnly ? 'tw-mr-1 rtl:tw-ml-1 rtl:tw-mr-0' : 'tw-mr-2 rtl:tw-ml-2 rtl:tw-mr-0',
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

        <Icon icon="chevron-right" className={twJoin('tw-size-3 rtl:tw-rotate-180', iconOnly ? '' : 'tw-ml-2 rtl:tw-ml-0 rtl:tw-mr-2')} />

        {active ? (
          <div
            className={twJoin(
              'tw-absolute tw-inset-y-0 tw-right-0 tw-w-1 tw-rounded-l tw-bg-[var(--apollo-layout-highlight)] rtl:tw-left-0 rtl:tw-right-auto rtl:tw-rounded-l-none rtl:tw-rounded-r'
            )}
          ></div>
        ) : null}
      </PopoverButton>

      <PopoverPanel
        ref={popoverRef}
        className={twJoin(
          'tw-pl-2 rtl:tw-pl-0 rtl:tw-pr-2',
          'tw-duration-200 tw-ease-out data-[closed]:tw-scale-95 data-[closed]:tw-opacity-0 data-[closed]:tw-duration-100 data-[closed]:tw-ease-in'
        )}
        transition
        static
        hidden={!open}
        anchor={item.rtlMirrorIcon ? 'right start' : 'left start'}
        onMouseLeave={(e) => handlePopoverMouseLeave(e)}
        onKeyDown={(e) => handlePopoverKeydown(e)}
      >
        <FocusTrap>
          <div className="tw-reset tw-min-w-60 tw-origin-left tw-rounded-lg tw-border tw-border-neutral-200 tw-bg-white tw-py-2 tw-shadow-xl tw-transition rtl:tw-origin-right">
            <header className="tw-border-b tw-border-neutral-300 tw-px-4 tw-pb-4 tw-pt-2">
              <h4 className="tw-font-extrabold">{item.text}</h4>
            </header>
            <ul className="tw-flex tw-flex-col">
              {visibleChildren()?.map((child, i) => (
                <li key={child.dgat} className={i > 0 && child?.includeSeparator ? 'tw-border-t tw-border-neutral-300' : ''}>
                  {child?.routerLink ? (
                    <NavLink
                      to={child.routerLink}
                      className={twMerge(
                        'tw-flex tw-items-center tw-px-4 tw-py-2 hover:tw-bg-neutral-100 focus:tw-bg-neutral-100 focus-visible:tw-outline-none',
                        isItemActive(child) ? 'tw-font-semibold' : ''
                      )}
                      data-dgat={child.dgat}
                      onClick={() => {
                        handleClick(child);
                      }}
                    >
                      {child.icon ? (
                        <Icon icon={child.icon} type="solid" className="tw-mr-2 tw-size-6 tw-shrink-0 rtl:tw-ml-2 rtl:tw-mr-0" />
                      ) : null}

                      <span className="tw-grow">{child.text}</span>

                      {isItemActive(child) ? (
                        <Icon
                          icon="check-circle"
                          type="solid"
                          className="tw-ml-4 tw-size-6 tw-shrink-0 tw-text-green-600 rtl:tw-ml-0 rtl:tw-mr-4"
                        />
                      ) : null}
                    </NavLink>
                  ) : child ? (
                    <a
                      href={child.href}
                      target={child.target}
                      className={twMerge(
                        'tw-flex tw-items-center tw-px-4 tw-py-2 hover:tw-bg-neutral-100 focus:tw-bg-neutral-100 focus-visible:tw-outline-none',
                        isItemActive(child) ? 'tw-font-semibold' : ''
                      )}
                      data-dgat={child.dgat}
                      onClick={() => {
                        handleClick(child);
                      }}
                    >
                      {child.icon ? (
                        <Icon icon={child.icon} type="solid" className="tw-mr-2 tw-size-6 tw-shrink-0 rtl:tw-ml-2 rtl:tw-mr-0" />
                      ) : null}

                      <span className="tw-grow">{child.text}</span>

                      {isItemActive(child) ? (
                        <Icon
                          icon="check-circle"
                          type="solid"
                          className="tw-ml-4 tw-size-6 tw-shrink-0 tw-text-green-600 rtl:tw-ml-0 rtl:tw-mr-4"
                        />
                      ) : null}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </FocusTrap>
      </PopoverPanel>
    </Popover>
  );
};
