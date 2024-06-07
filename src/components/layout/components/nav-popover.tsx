import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';

import clsx from 'clsx';
import { DynamicIcon } from '../../dynamic-icon';
import { NavigationSubItem } from '../layout.model';
import { NavItem } from './nav-item';

export interface NavPopoverProps {
  label: string;
  icon?: string;
  subItems: NavigationSubItem[];
  iconOnly?: boolean;
}

export const NavPopover = ({
  label,
  icon,
  subItems,
  iconOnly,
}: NavPopoverProps) => {
  return (
    <Popover>
      {({ close }) => (
        <>
          <PopoverButton
            className={clsx(
              'flex w-full items-center gap-2 py-2 pl-7 pr-1 text-left focus:outline-none',
              'hover:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] hover:text-[var(--layout-highlight,theme(colors.neutral.800))]',
              'focus:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] focus:text-[var(--layout-highlight,theme(colors.neutral.800))]',
              'active:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)] active:text-[var(--layout-highlight,theme(colors.neutral.900))]',
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
            <DynamicIcon
              icon="chevron-right"
              type="solid"
              solidSize={16}
              className="size-4 shrink-0"
            />
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
