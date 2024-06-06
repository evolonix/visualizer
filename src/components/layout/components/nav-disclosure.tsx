import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { NavigationSubItem } from '../layout.model';
import { DynamicIcon } from '../../dynamic-icon';
import { NavItem } from './nav-item';

export interface NavDisclosureProps {
  label: string;
  icon?: string;
  subItems: NavigationSubItem[];
  close: () => void;
}

export const NavDisclosure = ({
  label,
  icon,
  subItems,
  close,
}: NavDisclosureProps) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <DisclosureButton
            className={clsx(
              'flex w-full items-center gap-2 px-4 py-2 text-left focus:outline-none',
              'hover:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] hover:text-[var(--layout-highlight,theme(colors.neutral.800))]',
              'focus:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] focus:text-[var(--layout-highlight,theme(colors.neutral.800))]',
              'active:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)] active:text-[var(--layout-highlight,theme(colors.neutral.900))]',
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
            <span className="grow">{label}</span>
            <ChevronRightIcon
              className={clsx('size-4', open ? 'rotate-90' : '')}
              aria-hidden="true"
            />
          </DisclosureButton>

          <DisclosurePanel>
            <ul className="flex flex-col">
              {subItems.map((subItem) => (
                <li key={subItem.path}>
                  <NavItem {...subItem} onClick={close} className="px-12" />
                </li>
              ))}
            </ul>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};
