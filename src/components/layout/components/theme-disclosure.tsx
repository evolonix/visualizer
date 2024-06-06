import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { PlayIcon } from '@heroicons/react/24/solid';
import { LayoutLogos, LayoutTheme } from '../layout.model';

export interface ThemeDisclosureProps {
  themes: (LayoutTheme & { name: string })[];
  logos?: LayoutLogos;
  onThemeChange: (theme: LayoutTheme) => void;
}

export const ThemeDisclosure = ({
  themes,
  logos,
  onThemeChange,
}: ThemeDisclosureProps) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <DisclosureButton
            className={clsx(
              'flex w-full items-center gap-2 px-4 py-2 text-left text-[var(--layout-text,theme(colors.neutral.800))] focus:outline-none',
              'hover:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] hover:text-[var(--layout-highlight,theme(colors.neutral.800))]',
              'focus:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] focus:text-[var(--layout-highlight,theme(colors.neutral.800))]',
              'active:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)] active:text-[var(--layout-highlight,theme(colors.neutral.900))]',
            )}
          >
            {/* Logos */}
            {logos ? (
              <img
                src={logos.small.url}
                alt=""
                className="h-6 w-6 rounded-lg"
              />
            ) : null}
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
                    className={clsx(
                      'flex w-full items-center gap-2 px-12 py-2 text-left',
                      'hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none active:bg-neutral-200',
                      '[&_*]:pointer-events-none',
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
