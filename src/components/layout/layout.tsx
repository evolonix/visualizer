import clsx from 'clsx';
import { ReactNode, useState } from 'react';

import { Outlet } from 'react-router-dom';
import { EventBus, inject } from '../../lib';
import { Header, Sidebar } from './components';
import { defaultConfiguration } from './default.config';
import {
  LayoutConfiguration,
  LayoutConfigurationToken,
  LayoutTheme,
} from './layout.model';

export interface LayoutProps {
  configuration?: LayoutConfiguration;
  children: ReactNode;
  onSearch?: React.MouseEventHandler<HTMLButtonElement>;
  onAdd?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Layout = ({
  configuration,
  children,
  onSearch,
  onAdd,
}: LayoutProps) => {
  const providedConfiguration = inject<LayoutConfiguration>(
    LayoutConfigurationToken,
  );

  configuration = {
    ...defaultConfiguration,
    ...providedConfiguration,
    ...configuration,
  };
  const { logos, features, navigation } = configuration;
  const [theme, setTheme] = useState<LayoutTheme | undefined>(
    configuration.theme,
  );

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const eventBus = inject<EventBus>(EventBus);

  const handleSearch: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    eventBus?.announce({ type: 'search', data: e });
    onSearch?.(e);
  };
  const handleAdd: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    eventBus?.announce({ type: 'add', data: e });
    onAdd?.(e);
  };

  return (
    <div
      style={
        {
          '--layout-background': theme?.colors.background,
          '--layout-text':
            theme?.text === 'light' ? 'white' : 'var(--tw-color-neutral-800)',
          '--layout-highlight': theme?.colors.highlight,
        } as React.CSSProperties
      }
    >
      {/* Skip To Main Content Link */}
      <a href="#main-content" className="sr-only">
        Skip to main content
      </a>

      {/* Header */}
      <Header
        logos={logos}
        features={features}
        navigation={navigation}
        className={clsx(
          'transition-[margin]',
          sidebarExpanded ? 'lg:ml-52' : 'lg:ml-20',
        )}
        onSearch={handleSearch}
        onThemeChange={setTheme}
      />

      {/* Sidebar */}
      <Sidebar
        logos={logos}
        features={features}
        navigation={navigation}
        sidebarExpanded={sidebarExpanded}
        className={clsx(
          'transition-[width]',
          sidebarExpanded ? 'lg:w-52' : 'lg:w-20',
        )}
        onToggleExpanded={() =>
          setSidebarExpanded((sidebarExpanded) => !sidebarExpanded)
        }
        onAdd={handleAdd}
      />

      {/* Main Content */}
      <main
        id="main-content"
        className={clsx(
          'flex min-h-dvh flex-col px-4 pb-4 pt-20 transition-[margin] lg:px-8',
          sidebarExpanded ? 'lg:ml-52' : 'lg:ml-20',
        )}
      >
        <section className="grow">{children ?? <Outlet />}</section>

        {/* Footer */}
        <footer className="grid h-20 place-content-center">Footer</footer>
      </main>
    </div>
  );
};
