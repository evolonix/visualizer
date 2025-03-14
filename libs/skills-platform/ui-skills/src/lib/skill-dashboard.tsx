/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Transition } from '@headlessui/react';
import { PaginationData } from '@ngneat/elf-pagination';
import { useSkillsStore } from '@skills/data-access';

import clsx from 'clsx';
import { SKillSearchBar, SkillDashboardEmpty, SkillDashboardHeader, SkillDashboardList, SkillDashboardSkeleton } from './components';

export function SkillDashboard() {
  const [data, api] = useSkillsStore();
  const showAsEmtpy = data.isReady && !data.allSkills.length && data.searchOptions.searchBy?.name === '';

  return !showAsEmtpy ? (
    <>
      {/* TODO: Add a header skeleton */}
      <SkillDashboardHeader
        allLanguages={data.allLanguages}
        selectedLanguage={data.selectedLanguage}
        onSelectLanguage={(lang) => api.selectLanguage(lang)}
      />

      <div className="tw-grid-apollo tw-has-sidebar tw-mt-8">
        <div className="tw-col-span-full">
          {/* <!-- Table Actions (Search, Add Skill) --> */}
          <SKillSearchBar
            className={clsx(!data.isReady ? 'tw-opacity-0' : 'tw-opacity-100', 'tw-transition-opacity tw-duration-300')}
            value={data.searchOptions.searchBy?.name}
            isReady={data.isReady || false}
            onSearch={api.searchByName}
            totalFound={data.pagination?.total || 0}
          />

          {/* <!-- Skeleton View --> */}
          {!data.isReady ? <SkillDashboardSkeleton numberOfRows={data.numPages} /> : null}

          {/* <!-- Skill List --> */}
          <Transition
            show={data.isReady || false}
            enter="tw-transition-opacity tw-duration-300"
            enterFrom="tw-opacity-0"
            enterTo="tw-opacity-100"
            leaveFrom="tw-opacity-100"
            leaveTo="tw-opacity-0"
          >
            <SkillDashboardList
              allSkills={data.allSkills}
              selected={data.selected}
              selectedLanguage={data.selectedLanguage}
              sorting={data.searchOptions.order}
              pagination={data.pagination as PaginationData}
              {...api}
            />
          </Transition>
        </div>
      </div>
    </>
  ) : (
    <SkillDashboardEmpty />
  );
}
