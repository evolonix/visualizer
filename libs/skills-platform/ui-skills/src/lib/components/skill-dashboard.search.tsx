/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForwardedRef, forwardRef, useEffect, useState } from 'react';

import { useDebounceCallback } from '@degreed/core-react';

import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { PlusIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export interface SkillSearchBarProps {
  value: string | undefined;
  isReady: boolean;
  totalFound: number;
  className?: string;
  onSearch: (value: string) => void;
}
export const SKillSearchBar = forwardRef(
  ({ value, isReady, totalFound, className, onSearch: search }: SkillSearchBarProps, forwardedRef: ForwardedRef<HTMLInputElement>) => {
    const [criteria, setCriteria] = useState<string>('');
    const searchWithDebounce = useDebounceCallback<string>(search);
    const showTotals = isReady && criteria === value && value !== '';

    useEffect(() => {
      setCriteria(value || '');
    }, [value]);

    const onValueChange = (value: string) => {
      setCriteria(value); // show immediately in input
      searchWithDebounce(value); // wait until user pauses then search on server
    };

    return (
      <div className={clsx('tw-flex tw-items-center tw-gap-4', className)}>
        <div className="tw-relative tw-flex tw-flex-1 tw-items-center tw-gap-4">
          <input
            type="search"
            placeholder="Search"
            ref={forwardedRef}
            value={criteria}
            onChange={(e) => onValueChange(e.target.value)}
            className={clsx(
              criteria ? 'tw-bg-[#bdf8cf]' : 'tw-bg-white tw-',
              'tw-flex tw-h-8 tw-w-full tw-max-w-[252px] tw-flex-col tw-justify-center tw-gap-2 tw-rounded-lg tw-border tw-border-neutral-200 tw-pl-9 tw-placeholder-neutral-500 sm:tw-max-w-sm'
            )}
          />
          <MagnifyingGlassIcon className="tw-absolute tw-left-3 tw-top-2 tw-h-4 tw-w-4 tw-text-neutral-500" />
          {showTotals ? <div className="tw-text-xs tw-italic">{`${totalFound} skills found`}</div> : null}
        </div>
        <button type="button" className="tw-btn-primary tw-btn-medium">
          <PlusIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
          Add Skill
        </button>
      </div>
    );
  }
);
