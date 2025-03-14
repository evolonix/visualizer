import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { twJoin, twMerge, useActionKey } from '../../../utils';
import { Icon } from '../../icon';
import { LayoutBrand, LayoutFeatures, LayoutNavigation, LayoutNavigationItem } from '../layout.model';
import { findActiveItemWithTitle, isItemActive as isActive } from '../layout.utils';
import { NavDisclosure, NavItem } from './nav';

export interface HeaderProps {
  brand?: LayoutBrand;
  features?: LayoutFeatures;
  navigation?: LayoutNavigation;
  className?: string;

  onSearch: React.MouseEventHandler<unknown>;
  onAddContent: React.MouseEventHandler<unknown>;
}

export const Header = ({ brand, features, navigation, className, onSearch, onAddContent }: HeaderProps) => {
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const actionKey = useActionKey();
  const { pathname } = useLocation();

  const handleSearch = (e: React.MouseEvent) => {
    const search = features?.search || { enabled: false, visible: false };
    const enabled = search.enabled && search.visible;

    if (enabled) {
      features?.search?.trackEvent?.();
      onSearch(e);
    }
  };

  const handleAutoClose = (isOpen = false) => {
    setOpen(isOpen);
  };

  const handleAddContent = (event: React.MouseEvent) => {
    onAddContent(event);
    features?.addContent?.trackEvent?.(event);
  };

  // watchPathname: When route changes, update pathname and trigger re-renders to recalculate which item is active
  const isItemActive = useCallback((item: LayoutNavigationItem) => isActive(pathname)(item), [pathname]);

  useEffect(() => {
    const updateTitle = (url?: string) => {
      if (!navigation) return;

      url = url ?? pathname;
      const items = navigation.top.concat(navigation.bottom ?? []);
      const item = findActiveItemWithTitle(url, items);

      setTitle(item?.headerTitle || '');
    };

    /**
     * Translate Cmd-K keydown to search button clicks.
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      const search = features?.search || { enabled: false, visible: false };
      const enabled = search.enabled && search.visible;

      if (enabled && e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchButtonRef.current?.click();
      }
    };

    const activateKeydown = (active: boolean) => {
      if (active) document.addEventListener('keydown', handleKeyDown);
      else document.removeEventListener('keydown', handleKeyDown);
    };

    updateTitle();
    const search = features?.search || { enabled: false, visible: false };
    const enabled = search.enabled && (search.visible || false);

    activateKeydown(enabled);
  }, [features?.search, navigation, pathname]);

  return (
    <>
      {/* Header */}
      <header className={twMerge('tw-fixed tw-inset-x-0 tw-top-0', className)}>
        <div
          className={twJoin(
            'tw-relative tw-z-20 tw-flex tw-h-16 tw-items-center tw-gap-4 tw-px-4 tw-transition-shadow tw-duration-200 lg:tw-px-6',
            'tw-bg-[var(--apollo-layout-background,white)] tw-text-[var(--apollo-layout-text)]',
            open ? 'lg:tw-shadow-sm' : 'tw-shadow-sm'
          )}
        >
          {/* Header Navigation Button */}
          <div className="lg:tw-hidden">
            <button
              type="button"
              id="navigation-header-expand-button"
              className="tw-btn-medium tw-btn-icon tw-btn-secondary-filled"
              aria-expanded={open}
              onClick={() => handleAutoClose(!open)}
            >
              {open ? (
                <Icon icon="x-mark" type="solid" solidSize="16" className="tw-size-4" />
              ) : (
                <Icon icon="bars-3" type="solid" solidSize="16" className="tw-size-4" />
              )}
              <span className="tw-sr-only">{open ? 'Close Navigation' : 'Open Navigation'}</span>
            </button>
          </div>

          {/* Header Title */}
          <div className="tw-flex-1 tw-text-center lg:tw-pl-4 lg:tw-text-left rtl:lg:tw-pl-0 rtl:lg:tw-pr-4 rtl:lg:tw-text-right">
            <h3 className="tw-text-2xl tw-font-bold">{title}</h3>
          </div>

          {/* Search Button */}
          <div className="tw-hidden tw-flex-1 tw-justify-center lg:tw-flex">
            {features?.search?.enabled && features?.search?.visible ? (
              <button
                ref={searchButtonRef}
                type="button"
                id="navigation-header-search-button"
                className={twMerge(
                  'tw-flex tw-h-10 tw-w-80 tw-items-center tw-justify-center tw-gap-2 tw-rounded-lg tw-bg-neutral-50 tw-px-3 tw-text-left tw-text-neutral-600 tw-ring-1 tw-ring-neutral-300 rtl:tw-text-right',
                  'hover:tw-bg-neutral-100 focus-visible:tw-ring focus-visible:tw-ring-[var(--default-focus-ring)] focus:tw-bg-neutral-100 focus:tw-outline-none active:tw-bg-neutral-200',
                  '[&_*]:tw-pointer-events-none'
                )}
                onClick={(e) => handleSearch(e)}
              >
                <Icon icon="magnifying-glass" type="solid" solidSize="20" className="tw-size-4 tw-shrink-0 rtl:tw-scale-x-[-1]" />
                <span className="tw-grow">{features?.search?.text}</span>
                {actionKey ? (
                  <kbd className="tw-font-sans tw-text-xs tw-font-semibold">
                    <abbr title={actionKey[1]} className="tw-text-xs tw-no-underline">
                      {actionKey[0]}
                    </abbr>
                    K
                  </kbd>
                ) : null}
              </button>
            ) : null}
          </div>

          {/* Header Features */}
          <div className="tw-flex tw-w-8 tw-justify-end lg:tw-w-auto lg:tw-flex-1">
            {/* Admin Badge */}
            {features?.admin?.enabled && features?.admin?.visible ? (
              <div
                className={twJoin(
                  'tw-rounded-2xl tw-border tw-border-neutral-300 tw-bg-neutral-100 tw-px-2 tw-py-1 tw-text-xs tw-font-extrabold tw-uppercase tw-text-neutral-800'
                )}
              >
                {features?.admin?.text}
              </div>
            ) : null}

            {/* Add Content */}
            {features?.addContent?.enabled && features?.addContent?.visible ? (
              <button
                type="button"
                className={twJoin(
                  'tw-btn-medium tw-btn-tertiary',
                  'tw-btn-icon lg:tw-not-btn-icon',
                  'tw-text-[var(--apollo-layout-highlight)]',
                  'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight)]',
                  'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight)] focus:tw-outline-none',
                  'active:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight)]'
                )}
                data-dgat="utilityBar-fab"
                title={features?.addContent?.titleText}
                onClick={(e) => handleAddContent(e)}
              >
                <Icon icon="plus" type="solid" solidSize="16" className="tw-size-4" />
                <span className="tw-sr-only tw-whitespace-nowrap lg:tw-not-sr-only">{features?.addContent?.text}</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Header Menu */}
        <Dialog open={open} onClose={setOpen} className="tw-reset tw-relative tw-z-10">
          <DialogBackdrop
            transition
            className={twJoin(
              'tw-fixed tw-inset-x-0 tw-bottom-0 tw-top-16 tw-bg-neutral-500/75 tw-transition-opacity tw-duration-500 tw-ease-in-out data-[closed]:tw-opacity-0 lg:tw-hidden'
            )}
          ></DialogBackdrop>

          <DialogPanel
            transition
            className={twJoin(
              'tw-fixed tw-inset-x-0 tw-bottom-0 tw-top-16 tw-transform tw-overflow-y-auto tw-transition lg:tw-hidden',
              'tw-origin-top tw-duration-500 tw-ease-in-out data-[closed]:tw--translate-y-full'
            )}
          >
            <div className="tw-relative tw-origin-top tw-bg-[var(--apollo-layout-background,white)] tw-text-[var(--apollo-layout-text)] tw-shadow-lg tw-transition">
              {/* Header Navigation */}
              {navigation ? (
                <nav>
                  <ul className="tw-flex tw-flex-col tw-border-t tw-border-neutral-300 tw-pb-4 tw-pt-2">
                    {navigation.top.concat(navigation.bottom ?? []).map((item) =>
                      item.visible ? (
                        <li key={item.dgat}>
                          {/* Nav Item */}
                          {item.href || item.routerLink ? (
                            <NavItem
                              item={item}
                              active={isItemActive(item)}
                              beta={features?.beta}
                              className="tw-px-4 tw-text-base"
                              onItemSelect={() => handleAutoClose()}
                            ></NavItem>
                          ) : null}

                          {/* Nav Disclosure */}
                          {item.children?.length ? (
                            <NavDisclosure item={item} beta={features?.beta} onItemSelect={() => handleAutoClose()}></NavDisclosure>
                          ) : null}
                        </li>
                      ) : null
                    )}
                  </ul>
                </nav>
              ) : null}

              <div className="tw-border-t tw-border-neutral-300 tw-py-4 tw-text-center">
                <a href={features?.switcher?.href} className="tw-btn-medium tw-btn-tertiary" data-dgat="" title={features?.switcher?.text}>
                  <Icon icon="arrows-right-left" type="solid" solidSize="16" className="tw-size-4" />
                  <span className="tw-whitespace-nowrap">{features?.switcher?.text}</span>
                </a>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </>
  );
};
