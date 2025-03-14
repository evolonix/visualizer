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
      {isSelected ? <CheckCircleIcon className="h-5 w-5 text-green-600" aria-hidden="true" /> : null}
    </>
  );
}

export function Dropdown({ items, selectedItem, renderer, onSelected }: DropdownProps) {
  const rowRenderer = renderer || makeRowItem;
  const isSelected = (item: DropdownRowItem) => item.id === selectedItem?.id;

  return (
    <Menu as="div" className="relative leading-none">
      <div>
        <MenuButton className="btn-secondary-outline">
          {selectedItem?.name || 'Options'}
          <ChevronDownIcon className="-mr-1 h-4 w-4 text-neutral-400" aria-hidden="true" />
        </MenuButton>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white text-sm text-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-2">
            {items.map((item) => (
              <Menu.Item key={item.id}>
                {({ active }) => (
                  <button
                    onClick={() => onSelected?.(item)}
                    className={clsx(
                      item.id === selectedItem?.id ? 'font-semibold' : '',
                      active ? 'bg-neutral-100' : '',
                      'flex w-full items-center justify-between px-4 py-2 text-left'
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
