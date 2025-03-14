import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Footer } from '../footer';
import { AppLayoutConfiguration } from './app-layout.model';
import { deriveColor } from './app-layout.util';
import { AppLayoutSidebar } from './components';
import { AppLayoutHeader } from './components/app-layout.header';
import { defaultConfiguration } from './default.config';
import { findActiveWithTitle } from './nav.utils';

export interface AppLayoutProps {
  configuration: AppLayoutConfiguration;
  productVersion?: string;
}

export const AppLayout = ({ configuration, productVersion }: AppLayoutProps) => {
  configuration = { ...defaultConfiguration, ...configuration };
  const { theme, logos, features, navigation, productSwitcherNavigation } = configuration as Required<AppLayoutConfiguration>;

  const { pathname } = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const item = findActiveWithTitle(pathname, navigation.top); // .concat(navigation.bottom)
    setTitle(item?.title || '');
  }, [pathname, navigation]);

  return (
    <>
      {/* Expanded: "expanded", Default: "" */}
      <div
        className={sidebarExpanded ? 'expanded' : ''}
        style={
          {
            '--apollo-app-layout-background': theme.colors.background,
            '--apollo-app-layout-text': theme.text === 'dark' ? 'var(--apollo-color-neutral-800)' : 'white',
            '--apollo-app-layout-highlight-background': deriveColor(theme.colors.highlight, '15%'),
            '--apollo-app-layout-highlight-text': theme.colors.highlight,
          } as React.CSSProperties
        }
      >
        {/* Skip To Main Content Link */}
        <a href="#main-content" className="sr-only">
          Skip to main content
        </a>

        {/* Static sidebar for desktop */}
        <div className="fixed inset-y-0 z-50 box-content hidden w-20 flex-col shadow-lg transition-[width] lg:flex [.expanded_&]:w-[200px]">
          <button
            type="button"
            className="btn-secondary-outline btn-icon absolute -right-3 top-6 shadow-lg"
            title={sidebarExpanded ? 'Collapse Menu' : 'Expand Menu'}
            aria-expanded={sidebarExpanded}
            onClick={() => setSidebarExpanded((sidebarExpanded) => !sidebarExpanded)}
          >
            <span className="sr-only [.expanded_&]:hidden">Expand sidebar</span>
            <span className="hidden [.expanded_&]:sr-only">Collapse sidebar</span>
            <ChevronRightIcon className="size-4 [.expanded_&]:rotate-180" aria-hidden="true" />
          </button>

          {/* Sidebar component, swap this element with another sidebar if you like */}
          <AppLayoutSidebar navigation={navigation} logos={logos} features={features} />
        </div>

        <div className="flex min-h-screen flex-col bg-neutral-50 transition-[padding] lg:pl-20 [.expanded_&]:lg:pl-[200px]">
          <AppLayoutHeader
            title={title}
            productSwitcherNavigation={productSwitcherNavigation}
            features={features}
            navigation={navigation}
            logos={logos}
          />

          <main id="main-content" className="relative flex flex-1 flex-col pt-16">
            <Outlet />
          </main>

          <Footer productVersion={productVersion} />
        </div>
      </div>
    </>
  );
};
