import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { PlayIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge';
import { LayoutTheme } from '../layout.model';

export interface ThemeDisclosureProps {
  themes: (LayoutTheme & { name: string })[];
  className?: string;
  onThemeChange: (theme: LayoutTheme) => void;
}

export const ThemeDisclosure = ({
  themes,
  className,
  onThemeChange,
}: ThemeDisclosureProps) => {
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
            <PlayIcon className="size-6 -rotate-90" aria-hidden="true" />
            <span className="grow">Theme</span>
            <ChevronRightIcon
              className={clsx('size-4', open ? 'rotate-90' : '')}
              aria-hidden="true"
            />
          </DisclosureButton>

          <DisclosurePanel>
            <ul className="flex flex-col">
              {themes.map((theme) => (
                <li key={theme.name}>
                  <button
                    type="button"
                    onClick={() => {
                      onThemeChange(theme);
                    }}
                    className={twMerge(
                      'flex w-full items-center gap-2 px-12 py-2 text-left hover:bg-neutral-100',
                      className,
                    )}
                  >
                    {theme.name}
                  </button>
                </li>
              ))}
            </ul>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};
