import clsx from 'clsx';

import { PlusIcon } from '@heroicons/react/24/outline';
import { AppLayoutFeatures, AppLayoutLogo, AppLayoutNavigation } from '../app-layout.model';
import { NavItem } from './nav-item';

export interface AppLayoutSidebarProps {
  navigation: AppLayoutNavigation;
  logos?: Array<AppLayoutLogo>;
  features?: AppLayoutFeatures;
}

export function AppLayoutSidebar({ navigation, logos, features }: AppLayoutSidebarProps) {
  const smallLogo = logos?.find((logo) => logo.size === 'small');
  const wideLogo = logos?.find((logo) => logo.size === 'wide');

  return (
    <div
      className={clsx(
        'flex grow flex-col gap-y-4 overflow-y-visible pb-6',
        'bg-[var(--apollo-app-layout-background)] text-[var(--apollo-app-layout-text)]'
      )}
    >
      <div className="grid h-20 grid-cols-1 grid-rows-1 place-items-center px-6">
        {smallLogo ? (
          <img
            src={smallLogo.url}
            alt=""
            className={clsx(
              wideLogo ? 'opacity-100 transition-opacity duration-500 [.expanded_&]:invisible [.expanded_&]:opacity-0' : '',
              'col-start-1 row-start-1 size-8'
            )}
          />
        ) : null}
        {wideLogo ? (
          <img
            src={wideLogo.url}
            alt=""
            className="invisible col-start-1 row-start-1 opacity-0 transition-opacity duration-500 [.expanded_&]:visible [.expanded_&]:opacity-100"
          />
        ) : null}
      </div>
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-2">
          <li>
            <ul className="space-y-2">
              {navigation.top.map((item) => (
                <li key={item.text} className="relative">
                  <NavItem item={item} navLocation="top" />
                </li>
              ))}
            </ul>
          </li>
          <li className="relative mt-auto">
            <ul className="space-y-2">
              {features?.addContent ? (
                <li className="text-center">
                  <button
                    type="button"
                    className="btn-secondary-filled btn-medium whitespace-nowrap !p-2 !text-base [.expanded_&]:!px-4 [.expanded_&]:!text-xs"
                    onClick={() => {
                      // Add Content
                    }}
                  >
                    <PlusIcon className="size-4" aria-hidden="true" />
                    <span className="hidden [.expanded_&]:inline">Add Content</span>
                  </button>
                </li>
              ) : null}
              {navigation.bottom?.map((item) => (
                <li key={item.text} className="relative">
                  <NavItem item={item} navLocation="bottom" />
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
