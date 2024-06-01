import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

import { twMerge } from 'tailwind-merge';
import { NavigationSubItem } from '../layout.model';
import { DynamicIcon } from './dynamic-icon';
import { NavItem } from './nav-item';

export interface NavPopoverProps {
  label: string;
  icon?: string;
  subItems: NavigationSubItem[];
  iconOnly?: boolean;
  className?: string;
}

export const NavPopover = ({
  label,
  icon,
  subItems,
  iconOnly,
  className,
}: NavPopoverProps) => {
  return (
    <Popover>
      {({ close }) => (
        <>
          <PopoverButton
            className={twMerge(
              'flex w-full items-center gap-2 py-2 pl-7 pr-1 text-left hover:bg-neutral-100',
              className,
              iconOnly ? 'pr-1' : 'pr-7',
            )}
          >
            {icon ? (
              <DynamicIcon
                icon={icon}
                type="solid"
                className="size-6 shrink-0"
                aria-hidden="true"
              />
            ) : null}
            <span className={iconOnly ? 'sr-only' : 'grow'}>{label}</span>
            <ChevronRightIcon className="size-4 shrink-0" aria-hidden="true" />
          </PopoverButton>

          <Transition
            enter="duration-200 ease-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="duration-200 ease-out"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <PopoverPanel
              anchor="right start"
              className="ml-2 min-w-48 origin-left rounded-lg bg-white py-2 shadow-xl ring-1 ring-neutral-200 transition"
            >
              <ul className="flex flex-col">
                {subItems.map((subItem) => (
                  <li key={subItem.path}>
                    <NavItem {...subItem} onClick={close} />
                  </li>
                ))}
              </ul>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
