import { Menu, MenuButton, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export interface DropdownRowItem {
  id: string;
  name: string;
}

export interface DropdownRowRenderer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (item: any, isSelected: boolean): React.ReactNode;
}

export interface DropdownProps {
  items: DropdownRowItem[];
  selectedItem?: DropdownRowItem;
  onSelected?: (item: DropdownRowItem) => void;
  renderer?: DropdownRowRenderer;
}

/**
 * Default row renderer for dropdown items
 */
function makeRowItem(item: DropdownRowItem, isSelected = false): React.ReactNode {
  return (
    <>
      {item.name}
      {isSelected ? <CheckCircleIcon className="tw-h-5 tw-w-5 tw-text-green-600" aria-hidden="true" /> : null}
    </>
  );
}

export function Dropdown({ items, selectedItem, renderer, onSelected }: DropdownProps) {
  const rowRenderer = renderer || makeRowItem;
  const isSelected = (item: DropdownRowItem) => item.id === selectedItem?.id;

  return (
    <Menu as="div" className="tw-relative tw-leading-none">
      <div>
        <MenuButton className="tw-btn-secondary-outline">
          {selectedItem?.name || 'Options'}
          <ChevronDownIcon className="-tw-mr-1 tw-h-4 tw-w-4 tw-text-neutral-400" aria-hidden="true" />
        </MenuButton>
      </div>

      <Transition
        enter="tw-transition tw-ease-out tw-duration-100"
        enterFrom="tw-transform tw-opacity-0 tw-scale-95"
        enterTo="tw-transform tw-opacity-100 tw-scale-100"
        leave="tw-transition tw-ease-in tw-duration-75"
        leaveFrom="tw-transform tw-opacity-100 tw-scale-100"
        leaveTo="tw-transform tw-opacity-0 tw-scale-95"
      >
        <Menu.Items className="tw-absolute tw-right-0 tw-z-10 tw-mt-2 tw-w-56 tw-origin-top-right tw-rounded-xl tw-bg-white tw-text-sm tw-text-neutral-800 tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none">
          <div className="tw-py-2">
            {items.map((item) => (
              <Menu.Item key={item.id}>
                {({ active }) => (
                  <button
                    onClick={() => onSelected?.(item)}
                    className={clsx(
                      item.id === selectedItem?.id ? 'tw-font-semibold' : '',
                      active ? 'tw-bg-neutral-100' : '',
                      'tw-flex tw-w-full tw-items-center tw-justify-between tw-px-4 tw-py-2 tw-text-left'
                    )}
                  >
                    {rowRenderer(item, isSelected(item))}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
