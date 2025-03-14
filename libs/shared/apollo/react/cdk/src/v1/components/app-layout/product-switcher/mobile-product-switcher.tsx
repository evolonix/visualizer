import { useEffect, useState } from 'react';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { AppLayoutLogo } from '../app-layout.model';
import { MobileProductItem } from './components';
import { Product, ProductSwitcherNavigationItem } from './product-switcher.model';

export interface MobileProductSwitcherProps {
  navigation: ProductSwitcherNavigationItem[];
  logo?: AppLayoutLogo;
  className?: string;
}

export const MobileProductSwitcher = ({ navigation, logo, className }: MobileProductSwitcherProps) => {
  const selectedItem = navigation.find((item) => item.selected);
  const [openedProduct, setOpenedProduct] = useState<Product | undefined>(selectedItem?.product);

  useEffect(() => {
    if (selectedItem) {
      setOpenedProduct(selectedItem.product);
    }
  }, [selectedItem]);

  // If there is only one product with one child, don't render the product switcher
  if (navigation.length <= 1 && navigation[0].subItems && navigation[0].subItems.length <= 1) return null;

  const collapsible = navigation.length > 1;

  return (
    <Disclosure as="div" className="overflow-hidden">
      {({ open }) => (
        <>
          <div>
            <DisclosureButton
              className={clsx(
                'font-semibold',
                'text-[var(--apollo-app-layout-text)] hover:text-[var(--apollo-app-layout-highlight-text)] focus:text-[var(--apollo-app-layout-highlight-text)]',
                'hover:bg-[var(--apollo-app-layout-highlight-background)] focus:bg-[var(--apollo-app-layout-highlight-background)]',
                'group flex w-full items-center gap-2 overflow-hidden py-2 pl-5 pr-4 transition-[padding] focus:outline-none',
                'text-left'
              )}
            >
              {logo ? <img src={logo.url} alt="" className="size-6 shrink-0" /> : null}
              <span className="flex-1 overflow-hidden whitespace-nowrap">{selectedItem?.title}</span>
              <ChevronRightIcon className={clsx(open ? 'rotate-90' : '', 'size-3 shrink-0')} aria-hidden="true" />
            </DisclosureButton>
          </div>

          <DisclosurePanel as="div">
            <div className="overflow-hidden">
              {navigation.map((item) => (
                <MobileProductItem
                  key={item.text}
                  item={item}
                  open={openedProduct === item.product}
                  collapsible={collapsible}
                  onClick={(item: ProductSwitcherNavigationItem) =>
                    setOpenedProduct((prev) => (prev === item.product ? undefined : item.product))
                  }
                />
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};
