import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { twJoin, twMerge } from '../../../utils/tw-merge';
import { Icon } from '../../icon';
import { LayoutBrand, LayoutFeatures, LayoutNavigation, LayoutNavigationItem } from '../layout.model';
import { isItemActive as isActive } from '../layout.utils';
import { NavItem, NavPopover } from './nav';

export interface SidebarProps {
  brand?: LayoutBrand;
  features?: LayoutFeatures;
  navigation?: LayoutNavigation;
  sidebarExpanded: boolean;
  className?: string;
  onToggleExpanded: React.MouseEventHandler<unknown>;
  onSwitchRole: React.MouseEventHandler<unknown>;
}

export const Sidebar = ({ brand, features, navigation, sidebarExpanded, className, onToggleExpanded, onSwitchRole }: SidebarProps) => {
  const { pathname } = useLocation();

  const handleToggleExpanded = (e: React.MouseEvent) => {
    onToggleExpanded(e);
  };

  const handleBrandClick = (event: React.MouseEvent) => {
    brand?.trackEvent?.(event);
  };

  const handleSwitchView = (event: React.MouseEvent) => {
    features?.switcher?.trackEvent?.(event);
    onSwitchRole(event);
  };

  // watchPathname: When route changes, update pathname and trigger re-renders to recalculate which item is active
  const isItemActive = useCallback((item: LayoutNavigationItem) => isActive(pathname)(item), [pathname]);

  return (
    <>
      {/* Sidebar */}
      <div
        className={twMerge(
          'tw-fixed tw-inset-y-0 tw-left-0 tw-shadow-lg rtl:tw-left-auto rtl:tw-right-0',
          'tw-bg-[var(--apollo-layout-background,white)] tw-text-[var(--apollo-layout-text)]',
          className
        )}
      >
        {/* Sidebar Expand Button */}
        <div className="tw-reset">
          <button
            type="button"
            className="tw-btn-icon tw-btn-secondary-outline tw-absolute -tw-right-3 tw-top-6 tw-shadow-lg rtl:-tw-left-3 rtl:tw-right-auto"
            title={sidebarExpanded ? 'Collapse Menu' : 'Expand Menu'}
            onClick={(e) => handleToggleExpanded(e)}
          >
            <Icon
              icon="chevron-right"
              type="solid"
              solidSize="16"
              className={twMerge('tw-size-4', sidebarExpanded ? 'tw-rotate-180 rtl:tw-rotate-0' : 'rtl:tw-rotate-180')}
            />
          </button>
        </div>

        {/* Logos */}
        {brand ? (
          brand.routerLink ? (
            <Link
              to={brand.routerLink}
              data-dgat={brand.dgat}
              className="tw-grid tw-h-20 tw-place-content-center tw-overflow-hidden focus-visible:tw-outline-none"
              onClick={(e) => handleBrandClick(e)}
            >
              <Logos sidebarExpanded={sidebarExpanded} brand={brand} />
            </Link>
          ) : brand.href ? (
            <a
              href={brand.href}
              data-dgat={brand.dgat}
              className="tw-grid tw-h-20 tw-place-content-center tw-overflow-hidden focus-visible:tw-outline-none"
              onClick={(e) => handleBrandClick(e)}
            >
              <Logos sidebarExpanded={sidebarExpanded} brand={brand} />
            </a>
          ) : (
            <div
              data-dgat={brand.dgat}
              className="tw-grid tw-h-20 tw-place-content-center tw-overflow-hidden focus-visible:tw-outline-none"
            >
              <Logos sidebarExpanded={sidebarExpanded} brand={brand} />
            </div>
          )
        ) : null}

        <div
          className={twMerge(
            'tw-absolute tw-bottom-0 tw-left-0 tw-top-20 tw-overflow-x-hidden tw-transition-[width] rtl:tw-left-auto rtl:tw-right-0',
            sidebarExpanded ? 'tw-w-[200px]' : 'tw-w-20'
          )}
        >
          {/* Sidebar Navigation */}
          {navigation ? (
            <nav className="tw-flex tw-h-full tw-flex-col tw-pt-4">
              <ul className="tw-flex tw-flex-col tw-gap-2 tw-overflow-y-auto">
                {navigation.top.map((item) =>
                  item.visible ? (
                    <li key={item.dgat}>
                      {/* Nav Item */}
                      {item?.href || item?.routerLink ? (
                        <NavItem item={item} active={isItemActive(item)} iconOnly={!sidebarExpanded} beta={features?.beta}></NavItem>
                      ) : null}

                      {/* Nav Popover */}
                      {item?.children?.length ? (
                        <NavPopover item={item} active={isItemActive(item)} iconOnly={!sidebarExpanded} beta={features?.beta}></NavPopover>
                      ) : null}
                    </li>
                  ) : null
                )}
              </ul>

              <ul className="tw-flex tw-grow tw-flex-col tw-justify-end tw-gap-2">
                {features?.switcher?.enabled && features?.switcher?.visible ? (
                  <li className="tw-text-center">
                    {/* Role Switcher */}
                    {features?.switcher?.routerLink ? (
                      <Link
                        to={features?.switcher?.routerLink}
                        className={twMerge(
                          'tw-btn-medium tw-btn-tertiary tw-transition-[width]',
                          'tw-text-[var(--apollo-layout-highlight)]',
                          'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight)]',
                          'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight)] focus:tw-outline-none',
                          'active:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight)]',
                          sidebarExpanded ? '' : 'tw-btn-icon'
                        )}
                        data-dgat={features.switcher.dgat}
                        title={features.switcher.text}
                        onClick={(e) => handleSwitchView(e)}
                      >
                        <Icon icon="arrows-right-left" type="solid" solidSize="16" className="tw-size-4" />
                        <span className={sidebarExpanded ? 'tw-whitespace-nowrap' : 'tw-sr-only'}>{features.switcher.text}</span>
                      </Link>
                    ) : features?.switcher?.href ? (
                      <a
                        href={features.switcher.href}
                        className={twMerge(
                          'tw-btn-medium tw-btn-tertiary tw-transition-[width]',
                          'tw-text-[var(--apollo-layout-highlight)]',
                          'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight)]',
                          'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight)] focus:tw-outline-none',
                          'active:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight)]',
                          sidebarExpanded ? '' : 'tw-btn-icon'
                        )}
                        data-dgat={features.switcher.dgat}
                        title={features.switcher.text}
                        onClick={(e) => handleSwitchView(e)}
                      >
                        <Icon icon="arrows-right-left" type="solid" solidSize="16" className="tw-size-4" />
                        <span className={sidebarExpanded ? 'tw-whitespace-nowrap' : 'tw-sr-only'}>{features.switcher.text}</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        className={twMerge(
                          'tw-btn-medium tw-btn-tertiary tw-transition-[width]',
                          'tw-text-[var(--apollo-layout-highlight)]',
                          'hover:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] hover:tw-text-[var(--apollo-layout-highlight)]',
                          'focus:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_15%)] focus:tw-text-[var(--apollo-layout-highlight)] focus:tw-outline-none',
                          'active:tw-bg-[rgb(from_var(--apollo-layout-highlight)_r_g_b_/_30%)] active:tw-text-[var(--apollo-layout-highlight)]',
                          sidebarExpanded ? '' : 'tw-btn-icon'
                        )}
                        data-dgat={features.switcher.dgat}
                        title={features.switcher.text}
                        onClick={(e) => handleSwitchView(e)}
                      >
                        <Icon icon="arrows-right-left" type="solid" solidSize="16" className="tw-size-4" />
                        <span className={sidebarExpanded ? 'tw-whitespace-nowrap' : 'tw-sr-only'}>{features.switcher.text}</span>
                      </button>
                    )}
                  </li>
                ) : null}
                {navigation.bottom?.map((item) =>
                  item.visible ? (
                    <li key={item.dgat}>
                      {/* Nav Item */}
                      {item?.href || item?.routerLink ? (
                        <NavItem item={item} active={isItemActive(item)} iconOnly={!sidebarExpanded} beta={features?.beta}></NavItem>
                      ) : null}

                      {/* Nav Popover */}
                      {item?.children?.length ? (
                        <NavPopover item={item} active={isItemActive(item)} iconOnly={!sidebarExpanded} beta={features?.beta}></NavPopover>
                      ) : null}
                    </li>
                  ) : null
                )}
                {features?.sidebarBranding?.enabled && features?.sidebarBranding?.visible ? (
                  <li
                    className={twJoin(
                      'tw-border-t tw-border-solid tw-border-neutral-200 tw-pb-4 tw-text-center',
                      sidebarExpanded ? 'tw-mx-6' : 'tw-mx-3'
                    )}
                  >
                    <div className="tw-grid tw-place-content-center tw-text-neutral-600">
                      {sidebarExpanded ? (
                        <div className="tw-py-4">
                          <div className="tw-pt-3 tw-text-xs tw-font-semibold">{features?.sidebarBranding?.text}</div>
                          <div className="tw-flex tw-h-8 tw-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="93" height="19" viewBox="0 0 93 19" fill="none">
                              <path
                                d="M19.3286 12.8884C18.6747 13.4434 17.8698 13.7965 16.9644 13.7965C15.6566 13.847 14.7512 13.6956 14.2482 12.5857C13.4937 11.0217 13.8961 10.0631 13.9464 9.9118C14.55 8.70097 19.1777 8.39827 19.6304 9.35684C19.9322 9.86135 20.0328 12.1821 19.3286 12.8884ZM8.51391 12.5857C8.0109 13.6956 7.10548 13.847 5.79767 13.7965C4.94255 13.7965 4.08744 13.4938 3.43353 12.8884C2.77962 12.1316 2.82992 9.86135 3.08143 9.35684C3.58443 8.39827 8.1618 8.70097 8.76541 9.9118C8.86601 10.0631 9.26842 11.0217 8.51391 12.5857ZM21.7933 7.6415L15.1536 4.00904L14.9524 3.85769C14.55 3.70633 14.1476 3.70633 13.7955 3.85769L13.544 4.00904L12.4877 4.61445V4.6649L12.8901 4.8667L15.4051 6.22888L16.8638 7.03609C15.4051 7.137 13.9464 7.59105 12.6889 8.29737C12.3368 8.49917 11.8841 8.65052 11.4816 8.65052H11.381C10.9283 8.65052 10.5259 8.54962 10.1738 8.29737C8.86601 7.59105 7.45759 7.137 5.99887 7.03609L11.4313 4.00904L13.3931 2.89912C13.8961 2.54596 14.4997 2.44506 15.1033 2.59641C15.6063 2.79822 16.059 3.00002 16.5117 3.30273C16.7129 3.40363 16.9141 3.45408 17.1153 3.40363C17.3165 3.35318 17.4674 3.25228 17.6183 3.10092C17.7692 2.94957 17.8195 2.69731 17.8195 2.49551C17.8195 2.19281 17.6686 1.8901 17.3668 1.6883C16.7129 1.23424 15.9584 0.931533 15.1536 0.72973C13.3428 0.427024 12.1859 1.28469 11.3307 1.7892C10.2744 0.931534 8.86601 0.527926 7.50789 0.72973C6.70308 0.931533 5.99887 1.23424 5.29466 1.6883C4.89225 1.991 4.74135 2.54596 5.04315 2.94957C5.04315 3.00002 5.09345 3.00002 5.09345 3.05047C5.29466 3.25228 5.54616 3.35318 5.79767 3.35318C5.94857 3.35318 6.09947 3.30273 6.25037 3.20182C6.70308 2.94957 7.15579 2.69731 7.65879 2.49551C8.2624 2.34416 8.91631 2.49551 9.41932 2.84867L1.0191 7.6415C0.817895 7.74241 0.666992 7.99466 0.666992 8.24691V9.40729C0.666992 9.65954 0.817895 9.91179 1.0191 10.0127C1.2203 10.1136 1.2706 10.2145 1.2706 10.6181C1.2706 11.3749 0.767594 15.4109 6.04917 15.4109C10.7774 15.4109 10.2241 10.7695 11.381 10.7695C12.538 10.7695 11.9847 15.4109 16.7129 15.4109C21.9945 15.4109 21.4915 11.3749 21.4915 10.6181C21.4915 10.2145 21.5418 10.1136 21.743 10.0127C21.9945 9.91179 22.1454 9.65954 22.1454 9.40729V8.24691C22.1957 7.99466 22.0448 7.74241 21.7933 7.6415Z"
                                fill="currentColor"
                              />
                              <path
                                d="M48.8552 10.6182C48.9055 10.1641 49.1067 9.76049 49.4588 9.45779C49.9618 9.05418 50.5654 8.85238 51.2193 8.90283C51.8229 8.85238 52.4266 9.05418 52.8793 9.45779C53.2314 9.76049 53.4326 10.2146 53.4829 10.6686V11.2236C53.4829 11.6776 53.332 12.1317 53.0302 12.4848C52.9799 12.5353 52.9296 12.6362 52.829 12.6866C52.6278 12.8885 52.326 13.0398 52.0744 13.1407C51.7726 13.2416 51.4205 13.2921 51.0684 13.2921C50.4648 13.3425 49.8612 13.1407 49.4085 12.6866C49.3582 12.6362 49.2576 12.5857 49.2073 12.4848C48.9055 12.0812 48.7546 11.5767 48.8049 11.0722C48.8049 10.9209 48.8049 10.7695 48.8552 10.6182ZM55.4446 7.3893H53.7847C53.7344 7.3893 53.6841 7.43975 53.6338 7.4902C53.5835 7.54065 53.5835 7.59111 53.5835 7.64156V8.44877C53.2817 8.04516 52.829 7.69201 52.3763 7.4902C51.8229 7.2884 51.2696 7.1875 50.666 7.1875C49.9115 7.1875 49.2073 7.33885 48.5534 7.69201C47.9498 7.99471 47.4971 8.49922 47.145 9.10463C46.7929 9.71004 46.642 10.4164 46.642 11.1227C46.642 11.7785 46.7929 12.4344 47.0444 13.0398L47.145 13.1407C47.4468 13.6957 47.9498 14.1497 48.5031 14.5029C48.7546 14.6542 49.0564 14.7551 49.3582 14.856C49.7103 14.9569 50.0624 15.0074 50.4648 14.9569C50.8672 14.9569 51.2696 14.9065 51.672 14.856C51.8732 14.8056 52.0744 14.7047 52.2756 14.6542C52.7787 14.4524 53.2314 14.0993 53.5835 13.6957V14.9065C53.5835 15.2596 53.4829 15.6128 53.2817 15.9155C53.0805 16.2182 52.7787 16.4705 52.4265 16.6218C52.175 16.7227 51.9235 16.8236 51.672 16.8236C51.4708 16.8236 51.3199 16.8741 51.1187 16.8741C50.0121 16.8741 49.3079 16.5714 48.9558 15.9155C48.9558 15.8651 48.9055 15.8146 48.8552 15.8146H47.0947C46.9941 15.8146 46.8935 15.9155 46.8935 16.0164V16.0669C47.0947 16.8236 47.5474 17.429 48.2013 17.8831C49.1067 18.3876 50.1127 18.5894 51.169 18.539C51.9738 18.5894 52.7787 18.3876 53.5332 18.0849C53.5835 18.0849 53.5835 18.0344 53.6338 18.0344C53.9859 17.8831 54.2877 17.6813 54.5392 17.429C55.2434 16.7732 55.6458 15.8651 55.6961 14.9065C55.7464 14.6038 55.7464 14.3011 55.7464 14.0488V7.64156C55.6961 7.4902 55.5955 7.3893 55.4446 7.3893ZM90.4539 11.4758C90.4539 12.0308 90.2527 12.5857 89.8503 12.9389C89.6491 13.1407 89.3473 13.3425 89.0455 13.4434C88.7437 13.5443 88.3916 13.6452 88.0898 13.6452C87.4862 13.6957 86.8322 13.4434 86.4298 13.0398C85.9771 12.5857 85.7759 11.9299 85.8262 11.274C85.7759 10.6182 85.9771 9.9623 86.4298 9.45779C86.9328 9.00373 87.5365 8.80193 88.1904 8.85238C88.794 8.80193 89.4479 9.05418 89.8503 9.45779C90.0515 9.65959 90.2024 9.91185 90.303 10.1641C90.4036 10.4668 90.4539 10.7191 90.4539 11.0218V11.4758ZM92.3653 4.6145H90.6551C90.6048 4.6145 90.5545 4.6145 90.5042 4.66495C90.4539 4.7154 90.4539 4.76586 90.4539 4.81631V8.34787C89.7497 7.4902 88.6934 7.03615 87.5868 7.0866C86.8322 7.0866 86.128 7.23795 85.4741 7.64156C84.8705 7.99471 84.3675 8.49922 84.0657 9.10463C83.7136 9.7605 83.5627 10.5173 83.613 11.274C83.613 12.0308 83.7639 12.7371 84.0657 13.393C84.3675 13.9984 84.8202 14.4524 85.4238 14.8056C86.0274 15.1587 86.6813 15.3101 87.3855 15.3101C88.0395 15.3101 88.6431 15.2092 89.1964 14.9569C89.7497 14.7551 90.2024 14.3515 90.5042 13.8975V14.856C90.5042 15.0074 90.6048 15.1083 90.7557 15.1083H92.4156C92.5665 15.1083 92.6671 15.0074 92.6671 14.856V4.86676C92.6671 4.81631 92.6671 4.7154 92.6168 4.7154C92.5162 4.66495 92.4659 4.6145 92.3653 4.6145ZM75.6152 10.4164C75.6655 9.91185 75.917 9.45779 76.3194 9.20553C76.7721 8.85238 77.3254 8.70103 77.8787 8.70103C78.4823 8.65057 79.0356 8.80193 79.5386 9.15508C79.941 9.45779 80.1926 9.91185 80.1423 10.4164H75.6152ZM81.1483 8.19652C80.2429 7.4902 79.0859 7.0866 77.929 7.1875C77.1242 7.1875 76.3194 7.33885 75.5649 7.74246C74.911 8.09561 74.3577 8.60012 74.0056 9.25598C73.6535 9.91185 73.4523 10.6686 73.4523 11.4254C73.402 12.5353 73.8044 13.5948 74.6092 14.3515C75.5146 15.1083 76.6715 15.4614 77.8787 15.411C78.8847 15.4614 79.8907 15.2596 80.7962 14.7551C81.4501 14.3515 81.9028 13.7461 82.104 12.9894C82.1543 12.8885 82.104 12.7875 82.0034 12.7875H80.2428C80.1925 12.7875 80.0919 12.838 80.0919 12.8885C79.7901 13.4939 79.0859 13.847 78.0296 13.847C77.6272 13.847 77.1745 13.7461 76.7721 13.5948C76.42 13.4434 76.1685 13.1912 75.917 12.8885C75.7158 12.5857 75.6152 12.2326 75.6152 11.8794H82.0034C82.104 11.8794 82.1543 11.829 82.2046 11.7785C82.2549 11.7281 82.3052 11.6272 82.3052 11.5767V11.1731C82.3555 10.0632 81.9028 9.00373 81.1483 8.19652ZM65.6053 10.4164C65.6556 9.91185 65.9071 9.45779 66.3096 9.20553C66.7623 8.85238 67.3156 8.70103 67.8689 8.70103C68.4725 8.65057 69.0258 8.80193 69.5288 9.15508C69.9312 9.45779 70.1827 9.91185 70.1324 10.4164H65.6053ZM71.0881 8.19652C70.1827 7.4902 69.0258 7.0866 67.8689 7.1875C67.0641 7.1875 66.2592 7.33885 65.5047 7.74246C64.8508 8.09561 64.2975 8.60012 63.9454 9.25598C63.5933 9.91185 63.3921 10.6686 63.3921 11.4254C63.3418 12.5353 63.7442 13.5948 64.549 14.3515C65.4544 15.1083 66.6114 15.4614 67.8186 15.411C68.8246 15.4614 69.8306 15.2596 70.736 14.7551C71.3899 14.3515 71.8426 13.7461 72.0438 12.9894C72.0941 12.8885 72.0438 12.7875 71.9432 12.7875H70.1827C70.1324 12.7875 70.0318 12.838 70.0318 12.8885C69.73 13.4939 69.0258 13.847 67.9695 13.847C67.5671 13.847 67.1144 13.7461 66.712 13.5948C66.3599 13.4434 66.1083 13.1912 65.8568 12.8885C65.6556 12.5857 65.555 12.2326 65.555 11.8794H71.9432C72.0438 11.8794 72.0941 11.829 72.1444 11.7785C72.1947 11.7281 72.245 11.6272 72.245 11.5767V11.1731C72.2953 10.0632 71.8929 9.00373 71.0881 8.19652ZM62.4867 7.2884C61.3801 7.2884 60.3741 7.79291 59.6699 8.65057V7.64156C59.6699 7.59111 59.6699 7.54065 59.6196 7.4902C59.5693 7.43975 59.519 7.43975 59.4687 7.3893H57.8087C57.6578 7.3893 57.5572 7.4902 57.5572 7.64156V14.9065C57.5572 15.0578 57.6578 15.1587 57.8087 15.1587H59.519C59.6699 15.1587 59.7705 15.0578 59.7705 14.9065V11.0722C59.7705 10.5677 60.022 10.0632 60.4244 9.71004C60.9274 9.30644 61.5813 9.05418 62.2352 9.10463H62.537C62.6879 9.10463 62.8388 9.00373 62.8388 8.85238V7.54066C62.8388 7.49021 62.7885 7.3893 62.7382 7.33885C62.6879 7.2884 62.6376 7.23795 62.537 7.23795H62.4867V7.2884ZM38.6945 10.4668C38.7448 9.9623 38.9963 9.50824 39.3987 9.25598C39.8514 8.90283 40.4047 8.75147 40.958 8.75147C41.5616 8.70102 42.1149 8.85238 42.6179 9.20553C43.0203 9.50824 43.2215 9.9623 43.2215 10.4668H38.6945ZM44.2275 8.19652C43.3221 7.43975 42.2155 7.0866 41.0586 7.13705C40.2538 7.13705 39.449 7.2884 38.6945 7.69201C38.0405 8.04516 37.4872 8.54967 37.1351 9.20553C36.783 9.8614 36.5818 10.6182 36.5818 11.3749C36.5315 12.4848 36.9339 13.5443 37.7387 14.3011C38.6442 15.0578 39.8011 15.411 41.0083 15.3605C42.0143 15.411 43.0203 15.2092 43.9257 14.7047C44.5796 14.3011 45.0323 13.6957 45.2336 12.9389C45.2839 12.838 45.1832 12.7371 45.1329 12.7371H43.3724C43.3221 12.7371 43.2215 12.7876 43.2215 12.838C42.9197 13.4434 42.2155 13.7966 41.1089 13.7966C40.7065 13.7966 40.2538 13.6957 39.8514 13.5443C39.4993 13.393 39.2478 13.1407 38.9963 12.838C38.7951 12.5353 38.6945 12.1821 38.6945 11.829H45.0323C45.1329 11.829 45.1833 11.7785 45.2336 11.7281C45.2839 11.6776 45.3342 11.5767 45.3342 11.5263V11.1731C45.3845 10.0632 44.982 9.00373 44.2275 8.19652ZM33.0105 11.4758C33.0105 11.7281 32.9602 12.0308 32.8596 12.283C32.759 12.5353 32.6081 12.7875 32.4069 12.9894C32.2057 13.1912 31.9039 13.393 31.6021 13.4939C31.3003 13.5948 30.9481 13.6957 30.596 13.6957C29.9924 13.7461 29.3385 13.4939 28.9361 13.0903C28.4834 12.6362 28.2822 11.9803 28.3325 11.3749C28.2822 10.7191 28.4834 10.0632 28.9361 9.55869C29.4391 9.10463 30.0427 8.90283 30.6966 8.95328C31.3003 8.90283 31.9542 9.15509 32.3566 9.55869C32.5578 9.7605 32.7087 10.0127 32.8093 10.265C32.9099 10.5173 32.9602 10.82 32.9602 11.1227L33.0105 11.4758ZM34.9219 4.66495H33.2117C33.0608 4.66495 32.9602 4.76585 32.9602 4.91721V8.44877C32.256 7.5911 31.1493 7.13705 30.0427 7.1875C29.2882 7.1875 28.584 7.33885 27.9301 7.74246C27.3265 8.09561 26.8235 8.60012 26.5217 9.20553C25.8678 10.5677 25.8678 12.1317 26.5217 13.4939C26.8235 14.0993 27.2762 14.5533 27.8798 14.9065C28.4834 15.2596 29.1373 15.411 29.8415 15.411C30.4954 15.411 31.099 15.3101 31.6524 15.0578C32.2057 14.856 32.6584 14.4524 32.9602 13.9984V14.9569C32.9602 15.1083 33.0608 15.2092 33.2117 15.2092H34.8716C35.0225 15.2092 35.1231 15.1083 35.1231 14.9569V4.91721C35.1231 4.86676 35.0728 4.81631 35.0728 4.76585C35.0728 4.66495 34.9722 4.66495 34.9219 4.66495Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="tw-pb-5 tw-pt-8">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M35.3277 18.8945L25.3241 13.3547L24.9888 13.1578C24.7094 13.0454 24.402 12.9891 24.0946 12.9891C23.7872 12.9891 23.4799 13.0454 23.2004 13.1578L22.8092 13.3828L21.2444 14.2545C21.2165 14.2827 21.2165 14.3108 21.2444 14.3389L21.8871 14.6764L25.6594 16.7573L27.8949 17.9946C27.8949 17.9946 24.5976 18.1352 21.5518 19.9068C20.9929 20.2443 20.3503 20.413 19.7076 20.413H19.5679C18.9252 20.413 18.2825 20.2443 17.7236 19.9068C14.6778 18.1352 11.3806 17.9946 11.3806 17.9946L19.6237 13.4109L22.5578 11.7518C22.8651 11.5831 23.927 10.9082 25.1285 11.2737C25.6594 11.4143 26.5536 11.9205 27.2801 12.3423C27.8669 12.6798 28.5934 12.5673 29.0405 12.033C29.2641 11.7518 29.3758 11.4425 29.3758 11.105C29.3758 10.627 29.1523 10.177 28.7052 9.89582C27.7551 9.30529 26.4418 8.60227 25.38 8.43354C22.6416 7.95549 20.9091 9.30529 19.5958 10.0083C18.5899 9.1928 16.55 7.98361 13.8396 8.43354C12.7498 8.63039 11.4644 9.30529 10.5143 9.89582C9.78783 10.3458 9.62017 11.3581 10.179 12.0049C10.4585 12.3142 10.8497 12.4829 11.2409 12.4829C11.4923 12.4829 11.7159 12.4267 11.9394 12.2861C12.6659 11.8643 13.5601 11.3581 14.091 11.2175C15.5161 10.8238 16.7456 11.7518 16.7456 11.7518L3.86392 18.8945C3.52861 19.0632 3.33301 19.4288 3.33301 19.7943V21.566C3.33301 21.9315 3.52861 22.269 3.86392 22.4658C4.19924 22.6345 4.28307 22.747 4.28307 23.3938C4.28307 24.5186 3.52861 30.6771 11.5203 30.6771C18.7016 30.6771 17.8075 23.6188 19.5958 23.6469C21.4121 23.6188 20.5179 30.6771 27.6713 30.6771C35.663 30.6771 34.9085 24.5186 34.9085 23.3938C34.9085 22.747 34.9644 22.6627 35.2997 22.4658C35.635 22.2971 35.8307 21.9315 35.8307 21.566V19.7943C35.8586 19.4006 35.635 19.0632 35.3277 18.8945ZM15.2367 26.3746C14.4543 28.0337 13.0851 28.2868 11.1011 28.2025C9.62017 28.1462 8.25097 27.6682 7.55239 26.8527C6.54645 25.6997 6.65822 22.2408 7.04942 21.4816C7.80388 20.0193 14.7337 20.4692 15.6558 22.3252C15.7676 22.5221 16.3824 23.9843 15.2367 26.3746ZM31.6392 26.8527C30.9406 27.64 29.5714 28.1181 28.0905 28.2025C26.1344 28.2868 24.7652 28.0337 23.9549 26.3746C22.8092 23.9843 23.424 22.5221 23.5078 22.3252C24.4299 20.4692 31.3877 20.0193 32.1142 21.4816C32.5334 22.269 32.6452 25.7278 31.6392 26.8527Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </li>
                ) : null}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </>
  );
};

const Logos = ({ sidebarExpanded, brand }: { sidebarExpanded: boolean; brand: LayoutBrand }) => {
  return (
    <>
      {sidebarExpanded ? (
        <img src={brand.logo.url} alt={brand.logo.altText} className="tw-h-full tw-max-h-8 tw-max-w-[152px]" />
      ) : (
        <img src={brand.mark.url} alt={brand.mark.altText} className="tw-h-full tw-max-h-8 tw-max-w-8" />
      )}
      <span className="tw-sr-only">{brand.logo.altText}</span>
    </>
  );
};
