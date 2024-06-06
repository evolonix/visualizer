import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';

import { twMerge } from 'tailwind-merge';
import { LayoutTheme } from '../layout.model';

export interface ThemePopoverProps {
  themes: (LayoutTheme & { name: string })[];
  className?: string;
  onThemeChange: (theme: LayoutTheme) => void;
}

export const ThemePopover = ({
  themes,
  className,
  onThemeChange,
}: ThemePopoverProps) => {
  return (
    <Popover>
      {({ close }) => (
        <>
          <PopoverButton
            className={twMerge(
              'hidden lg:block',
              'rounded-md px-2.5 py-1.5 text-sm font-semibold text-neutral-900 ring-inset focus:outline-none',
              'hover:bg-neutral-50 hover:text-neutral-900 hover:shadow-md hover:ring-1 hover:ring-neutral-300',
              'focus:bg-neutral-50 focus:text-neutral-900 focus:shadow-md focus:ring-1 focus:ring-neutral-300',
              'active:bg-neutral-100 active:text-neutral-900 active:shadow-md active:ring-1 active:ring-neutral-300',
              className,
            )}
          >
            Theme
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
              anchor="bottom end"
              className="mt-2 min-w-48 origin-top rounded-lg bg-white py-2 shadow-xl ring-1 ring-neutral-200 transition"
            >
              <ul className="flex flex-col">
                {themes.map((theme) => (
                  <li key={theme.name}>
                    <button
                      type="button"
                      onClick={() => {
                        onThemeChange(theme);
                        close();
                      }}
                      className="flex w-full items-center gap-2 px-7 py-2 text-left hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none active:bg-neutral-200"
                    >
                      {theme.name}
                    </button>
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
