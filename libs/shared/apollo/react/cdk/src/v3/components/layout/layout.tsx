import { twMerge, useLocalStorage } from '../../utils';
import { Footer, Header, Sidebar } from './components';
import { LayoutAspect } from './layout.model';

export interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
  configuration?: LayoutAspect; // `learner` or `admin` aspect of the LayoutConfiguration
  onSearch?: React.MouseEventHandler<unknown>;
  onAddContent?: React.MouseEventHandler<unknown>;
  onSwitchRole?: React.MouseEventHandler<unknown>;
}

const APOLLO_SIDE_BAR_EXPANDED = 'apollo-sidebar-expanded';

export const Layout = ({ children, className, configuration, onSearch, onAddContent, onSwitchRole }: LayoutProps) => {
  const [sidebarExpanded, setSidebarExpanded] = useLocalStorage<boolean>(APOLLO_SIDE_BAR_EXPANDED, true);

  return (
    <div
      style={
        {
          '--apollo-layout-background': configuration?.brand?.colors?.background || '#ffffff',
          '--apollo-layout-text': configuration?.brand?.colors?.text || 'var(--apollo-color-neutral-800)',
          '--apollo-layout-highlight': configuration?.brand?.colors?.highlight || 'var(--apollo-color-blue-800)',
          '--apollo-layout-separator': configuration?.brand?.colors?.separator || 'var(--apollo-color-neutral-200)',
        } as React.CSSProperties
      }
      className={twMerge('tw-bg-neutral-50', className)}
    >
      {/* Skip To Main Content Link */}
      <a href="#main-content" className="tw-sr-only">
        Skip to main content
      </a>

      {/* Header */}
      <Header
        brand={configuration?.brand}
        features={configuration?.features}
        navigation={configuration?.navigation}
        className={twMerge(
          'tw-reset tw-z-20 tw-transition-[margin]',
          sidebarExpanded ? 'lg:tw-ml-[200px] rtl:lg:tw-ml-0 rtl:lg:tw-mr-[200px]' : 'lg:tw-ml-20 rtl:lg:tw-ml-0 rtl:lg:tw-mr-20'
        )}
        onSearch={(e) => onSearch?.(e)}
        onAddContent={(e) => onAddContent?.(e)}
      ></Header>

      {/* Sidebar */}
      <Sidebar
        brand={configuration?.brand}
        features={configuration?.features}
        navigation={configuration?.navigation}
        sidebarExpanded={sidebarExpanded}
        className={twMerge(
          'tw-reset tw-z-20 tw-hidden tw-transition-[width] lg:tw-block',
          sidebarExpanded ? 'lg:tw-w-[200px]' : 'lg:tw-w-20'
        )}
        onToggleExpanded={() => setSidebarExpanded((sidebarExpanded) => !sidebarExpanded)}
        onSwitchRole={(e) => onSwitchRole?.(e)}
      ></Sidebar>

      {/* Main Content */}
      <main
        id="main-content"
        className={twMerge(
          'tw-box-border tw-flex tw-min-h-dvh tw-flex-col tw-pt-16 tw-transition-[margin]',
          sidebarExpanded ? 'lg:tw-ml-[200px] rtl:lg:tw-ml-0 rtl:lg:tw-mr-[200px]' : 'lg:tw-ml-20 rtl:lg:tw-ml-0 rtl:lg:tw-mr-20'
        )}
      >
        <div className="tw-relative tw-grow">{children}</div>

        {/* Footer */}
        <Footer className="tw-reset" footerBranding={configuration?.features?.footerBranding} />
      </main>
    </div>
  );
};
