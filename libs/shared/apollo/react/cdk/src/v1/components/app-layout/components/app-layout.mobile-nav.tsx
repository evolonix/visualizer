import { DisclosurePanel, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { AppLayoutFeatures, AppLayoutLogo, AppLayoutNavigation, AppLayoutProductSwitcherNavigation } from '../app-layout.model';
import { NavigationItem } from '../nav.model';
import { MobileProductSwitcher } from '../product-switcher';
import { MobileNavItem } from './mobile-nav-item';

export interface AppLayoutNavMobileNavProps {
  navigation: AppLayoutNavigation;
  productSwitcherNavigation: AppLayoutProductSwitcherNavigation;
  logos?: Array<AppLayoutLogo>;
  features?: AppLayoutFeatures;
  onSubItemSelect?: (item: NavigationItem) => void;
}

export function AppLayoutMobileNav({
  navigation,
  productSwitcherNavigation,
  logos,
  features,
  onSubItemSelect,
}: AppLayoutNavMobileNavProps) {
  const [openedMenu, setOpenedMenu] = useState<NavigationItem | undefined>();
  const smallLogo = logos?.find((logo) => logo.size === 'small');

  return (
    <>
      {/*
        Slide-over panel, show/hide based on slide-over state.

        Entering: "transform transition ease-in-out duration-700"
          From: "translate-y-full"
          To: "translate-y-0"
        Leaving: "transform transition ease-in-out duration-700"
          From: "translate-y-0"
          To: "translate-y-full"
      */}
      <Transition
        enter="transform transition ease-in-out duration-700"
        enterFrom="-translate-y-full shadow-none"
        enterTo="translate-y-0 shadow-xl"
        leave="transform transition ease-in-out duration-700"
        leaveFrom="translate-y-0 shadow-xl"
        leaveTo="-translate-y-full shadow-none"
      >
        <DisclosurePanel className="relative bg-[var(--apollo-app-layout-background)] pb-4 text-[var(--apollo-app-layout-text)] lg:hidden lg:px-6">
          <MobileProductSwitcher navigation={productSwitcherNavigation} logo={smallLogo} />

          <nav className="expanded flex flex-1 flex-col pt-2">
            <ul className="space-y-4">
              {navigation.top.map((item) => (
                <li key={item.text} className="relative">
                  <MobileNavItem
                    item={item}
                    open={openedMenu === item}
                    onClick={(item: NavigationItem) => setOpenedMenu((prev) => (prev === item ? undefined : item))}
                    onSubItemSelect={(item) => {
                      onSubItemSelect?.(item);
                      setOpenedMenu(undefined);
                    }}
                  />
                </li>
              ))}
              {navigation.bottom?.map((item) => (
                <li key={item.text} className="relative">
                  <MobileNavItem
                    item={item}
                    open={openedMenu === item}
                    onClick={(item: NavigationItem) => setOpenedMenu((prev) => (prev === item ? undefined : item))}
                    onSubItemSelect={(item) => {
                      onSubItemSelect?.(item);
                      setOpenedMenu(undefined);
                    }}
                  />
                </li>
              ))}
              {features?.addContent ? (
                <li className="text-center">
                  <button
                    type="button"
                    className="btn-secondary-filled btn-medium"
                    onClick={() => {
                      // Add Content
                    }}
                  >
                    <PlusIcon className="size-4" aria-hidden="true" />
                    <span>Add Content</span>
                  </button>
                </li>
              ) : null}
            </ul>
          </nav>
        </DisclosurePanel>
      </Transition>
    </>
  );
}
