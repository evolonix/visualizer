import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { twMerge } from 'tailwind-merge';
import { NavigationSubItem } from '../layout.model';
import { DynamicIcon } from './dynamic-icon';
import { NavItem } from './nav-item';

export interface NavDisclosureProps {
  label: string;
  icon?: string;
  subItems: NavigationSubItem[];
  className?: string;
  close: () => void;
}

export const NavDisclosure = ({
  label,
  icon,
  subItems,
  className,
  close,
}: NavDisclosureProps) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <DisclosureButton
            className={twMerge(
              'flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-neutral-100',
              className,
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
                  <NavItem
                    {...subItem}
                    onClick={close}
                    className={twMerge('px-12', className)}
                  />
                </li>
              ))}
            </ul>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};
