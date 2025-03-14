import { AppLayoutConfiguration } from '@degreed/apollo-react-cdk-v1';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import allianzConfigJson from '../data/v1/allianz.config.json?raw';
import degreedConfigJson from '../data/v1/degreed.config.json?raw';
import skillsPlatformConfigJson from '../data/v1/skills-platform.config.json?raw';
import starbucksConfigJson from '../data/v1/starbucks.config.json?raw';
import wellsFargoConfigJson from '../data/v1/wells-fargo.config.json?raw';

export const skillsPlatformConfig = JSON.parse(skillsPlatformConfigJson) as AppLayoutConfiguration;
export const degreedConfig = JSON.parse(degreedConfigJson) as AppLayoutConfiguration;
export const starbucksConfig = JSON.parse(starbucksConfigJson) as AppLayoutConfiguration;
export const wellsFargoConfig = JSON.parse(wellsFargoConfigJson) as AppLayoutConfiguration;
export const allianzConfig = JSON.parse(allianzConfigJson) as AppLayoutConfiguration;

const items = [
  { text: 'Degreed', config: degreedConfig },
  { text: 'Skills Platform', config: skillsPlatformConfig },
  { text: 'Starbucks', config: starbucksConfig },
  { text: 'Wells Fargo', config: wellsFargoConfig },
  { text: 'Allianz', config: allianzConfig },
];

export const AppConfigSwitcher = ({
  config,
  onChange,
}: {
  config: AppLayoutConfiguration;
  onChange: (config: AppLayoutConfiguration) => void;
}) => {
  return (
    <Popover
      className={({ open }) =>
        clsx(
          open ? 'translate-x-0' : 'translate-x-[calc(100%-28px)]',
          'transition duration-500 ease-in-out',
          'fixed bottom-12 right-0 min-w-7 rounded-l-xl bg-white text-neutral-800 shadow-xl ring-1 ring-neutral-200'
        )
      }
    >
      {({ open }) => (
        <>
          <div className="tw-absolute tw-inset-y-0 tw-left-0">
            <PopoverButton
              className="tw-flex tw-h-full tw-items-center tw-rounded-l-xl tw-border-r tw-border-neutral-300 tw-px-1 hover:tw-bg-neutral-100 focus:tw-bg-neutral-100 focus:tw-outline-none"
              title={open ? 'Collapse config switcher' : 'Expand config switcher'}
            >
              <span className="tw-sr-only">{open ? 'Collapse theme switcher' : 'Expand theme switcher'}</span>
              <ChevronRightIcon className={clsx(open ? '' : 'tw-rotate-180 tw-transform', 'tw-h-5 tw-w-5')} />
            </PopoverButton>
          </div>

          <PopoverPanel className="tw-ml-[var(--button-width)]" static>
            <div className="tw-max-w-60 tw-overflow-hidden">
              <div className="tw-py-2">
                <h4 className="tw-mb-2 tw-px-4 tw-py-2 tw-font-extrabold">Choose a theme</h4>
                <ul className="tw-border-t tw-border-neutral-300">
                  {items.map((item) => (
                    <li key={item.text}>
                      <button
                        type="button"
                        className={clsx(
                          config === item.config ? 'tw-font-semibold' : '',
                          'tw-flex tw-w-full tw-items-center tw-justify-between tw-px-4 tw-py-2 tw-text-left hover:tw-bg-neutral-100 focus:tw-bg-neutral-100 focus:tw-outline-none'
                        )}
                        onClick={() => onChange(item.config)}
                      >
                        {item.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
};
