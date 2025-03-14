import { useEffect, useState } from 'react';

import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { ProductItem } from './components';
import { Product, ProductSwitcherNavigationItem } from './product-switcher.model';

export interface ProductSwitcherProps {
  navigation: ProductSwitcherNavigationItem[];
  className?: string;
}

export const ProductSwitcher = ({ navigation, className }: ProductSwitcherProps) => {
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
    <Popover as="div" className={clsx('relative', className)}>
      <div>
        <PopoverButton
          className={clsx(
            'btn-tertiary btn-medium text-[var(--apollo-app-layout-highlight-text)]',
            'hover:bg-[var(--apollo-app-layout-highlight-background)] hover:text-[var(--apollo-app-layout-highlight-text)]',
            'focus:bg-[var(--apollo-app-layout-highlight-background)] focus:text-[var(--apollo-app-layout-highlight-text)] focus:outline-[var(--apollo-app-layout-highlight-text)]',
            'active:bg-[var(--apollo-app-layout-highlight-background)] active:text-[var(--apollo-app-layout-highlight-text)]'
          )}
        >
          <span className="sr-only">Open product switcher</span>
          <span className="flex items-center">
            <span>{selectedItem?.title}</span>
            <ChevronDownIcon className="ml-1 size-4" aria-hidden="true" />
          </span>
        </PopoverButton>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <PopoverPanel className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-lg bg-white pt-4 shadow-xl ring-1 ring-neutral-200 focus:outline-none">
          <div className="px-8 text-sm font-semibold uppercase text-neutral-600">Switch To</div>

          <div className="divide-y divide-neutral-300 overflow-hidden">
            {navigation.map((item) => (
              <ProductItem
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
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};
