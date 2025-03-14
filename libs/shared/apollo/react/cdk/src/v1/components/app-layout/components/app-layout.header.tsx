// import { inject } from '@degreed/core-react';
import { EventBus } from '@degreed/rsm';
import { Disclosure, DisclosureButton, Transition } from '@headlessui/react';
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useCallback, useEffect } from 'react';

import { AppLayoutFeatures, AppLayoutLogo, AppLayoutNavigation, AppLayoutProductSwitcherNavigation } from '../app-layout.model';
import { useActionKey } from '../hooks';
import { ProductSwitcher } from '../product-switcher';
import { AppLayoutMobileNav } from './app-layout.mobile-nav';

export interface AppLayoutHeaderProps {
  title: string;
  productSwitcherNavigation: AppLayoutProductSwitcherNavigation;
  features?: AppLayoutFeatures;
  navigation: AppLayoutNavigation;
  logos?: Array<AppLayoutLogo>;
}

export function AppLayoutHeader({ title, productSwitcherNavigation, features, navigation, logos }: AppLayoutHeaderProps) {
  const actionKey = useActionKey();
  // TODO: Fix error when importing inject from @degreed/core-react
  // const eventBus = inject<EventBus>(EventBus);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const eventBus = new EventBus();

  const handleSearchClick = useCallback(() => {
    eventBus.announce({ type: 'showAppSearch' });
  }, [eventBus]);

  useEffect(() => {
    if (!features?.search) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle the menu when ⌘ K or Ctrl K is pressed
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        eventBus.announce({ type: 'showAppSearch' });
      }

      // Close the menu when Escape is pressed
      if (e.key === 'Escape') {
        eventBus.announce({ type: 'closeAppSearch' });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [features?.search, eventBus]);

  return (
    <Disclosure as="header" className="fixed inset-x-0 top-0 z-40 shadow-sm transition-[left] lg:left-20 [.expanded_&]:lg:left-[200px]">
      {({ open, close }) => (
        <>
          {/*
            Background backdrop, show/hide based on slide-over state.

            Entering: "ease-in-out duration-500"
              From: "opacity-0"
              To: "opacity-100"
            Leaving: "ease-in-out duration-500"
              From: "opacity-100"
              To: "opacity-0"
          */}
          <Transition
            as="div"
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0 bg-neutral-500/75 lg:hidden"
          />

          <div className="relative z-10 flex h-16 shrink-0 items-center justify-between gap-x-4 bg-[var(--apollo-app-layout-background)] px-4 py-3 text-[var(--apollo-app-layout-text)] lg:pl-10 lg:pr-6">
            <div className="flex-1 lg:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="btn-secondary-filled btn-medium btn-icon">
                <span className="sr-only">Open main menu</span>
                {open ? <XMarkIcon className="size-4" aria-hidden="true" /> : <Bars3Icon className="size-4" aria-hidden="true" />}
              </DisclosureButton>
            </div>

            <h3 className="flex-[1] text-center text-2xl font-bold lg:text-left">{title}</h3>

            {features?.search ? (
              <div className="hidden items-center justify-center overflow-hidden lg:flex lg:flex-[2] xl:flex-[1]">
                <div className="relative flex items-center">
                  <button
                    type="button"
                    className="flex h-10 w-80 items-center gap-2 rounded-md border-0 bg-white px-3 text-left text-neutral-600 shadow-sm ring-1 ring-inset ring-neutral-300 hover:text-neutral-800 hover:ring-neutral-400 focus:text-neutral-800 focus:outline-none focus:ring-blue-800 active:text-neutral-800 active:ring-blue-800"
                    onClick={handleSearchClick}
                  >
                    <MagnifyingGlassIcon className="size-4" aria-hidden="true" />
                    <span className="flex-1">Search</span>
                    <kbd className="font-sans text-xs font-semibold">
                      <abbr title={actionKey[1] as string} className="no-underline">
                        {actionKey[0] as string}
                      </abbr>{' '}
                      K
                    </kbd>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex flex-[1] items-center justify-end">
              <ProductSwitcher navigation={productSwitcherNavigation} className="hidden lg:block" />
            </div>
          </div>

          <AppLayoutMobileNav
            navigation={navigation}
            productSwitcherNavigation={productSwitcherNavigation}
            logos={logos}
            features={features}
            onSubItemSelect={() => close()}
          />
        </>
      )}
    </Disclosure>
  );
}
