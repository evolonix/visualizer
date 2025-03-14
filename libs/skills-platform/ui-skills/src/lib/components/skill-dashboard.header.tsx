/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ForwardedRef, useMemo } from 'react';

import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

import { Dropdown } from '@degreed/apollo-react-cdk';
import { SkillLanguage, SkillLanguages } from '@skills/data-access';
import clsx from 'clsx';

export interface SkillDashboardHeaderProps {
  source?: any | undefined;
  allLanguages: SkillLanguages;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  onSourceChange?: (skill: any) => void;
}

export const SkillDashboardHeader = React.forwardRef(
  (
    { allLanguages, selectedLanguage, onSelectLanguage, onSourceChange }: SkillDashboardHeaderProps,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => {
    const selectedItem = useMemo(
      () =>
        allLanguages.reduce((acc, item) => {
          return item.id === selectedLanguage ? item : acc;
        }, allLanguages[0]),
      [allLanguages, selectedLanguage]
    );
    const makeLanguageRowItem = useMemo(() => {
      const showCount = !allLanguages.every((item) => item.count === allLanguages[0].count);
      return (item: SkillLanguage) => {
        return (
          <>
            {showCount ? (
              <div className="tw-inline-flex tw-w-full tw-">
                <span className="tw-w-[100px]">{item.name}</span>
                <span className={clsx(item.id !== 'tw-en' ? '' : '')}>({item.count})</span>
              </div>
            ) : (
              item.name
            )}
            {item.id === selectedItem?.id ? <CheckCircleIcon className="tw-h-5 tw-w-5 tw-text-green-600" aria-hidden="true" /> : null}
          </>
        );
      };
    }, [selectedItem, allLanguages]);

    return (
      // <!-- Toolbar (Catalog Source, Language, Download) -->
      <div className="tw-bg-neutral-100" ref={forwardedRef}>
        <div className="tw-grid-apollo tw-has-sidebar">
          <div className="tw-col-span-full tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3 tw-py-4">
            <div className="tw-flex tw-items-center tw-gap-3">
              <label className="tw-text-xs tw-font-extrabold tw-uppercase">Catalog Source</label>
              <Dropdown items={[{ id: 'degreed', name: 'Degreed' }]} selectedItem={{ id: 'degreed', name: 'Degreed' }} />
            </div>

            <div className="tw-flex tw-items-center tw-gap-3">
              {allLanguages.length ? (
                <Dropdown
                  items={allLanguages}
                  selectedItem={selectedItem}
                  onSelected={(item) => onSelectLanguage(item.id)}
                  renderer={makeLanguageRowItem}
                />
              ) : null}

              <button type="button" className="tw-btn-secondary-outline tw-hidden sm:tw-inline-flex">
                Download
                <ArrowDownTrayIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
