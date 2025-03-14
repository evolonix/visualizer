import { twMerge } from '@degreed/apollo-react-cdk';
import { Scale, ScalesViewModel, useScalesStore } from '@skills/data-access';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';

import { Transition } from '@headlessui/react';

import { alphabetically, useSource } from '@skills/data-access';
import { ScaleDashboardHeader } from '../scales';

export function ScalesLayout() {
  const isMapping = useMatch('/scales/mapping');
  const isNewScale = useMatch('/scales/new');
  const navigate = useNavigate();
  const [selected, vm] = useSource();
  const { registry: scales, selected: selectedScale, primary: primaryScale, api, ...status }: ScalesViewModel = useScalesStore();
  const showSkeleton = status.showSkeleton || status.isLoading;
  const primaryFirst = (a: Scale) => (a.isPrimary ? -1 : 1);
  const scalesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const bypassRef = useRef(false);
  const registry = useMemo(() => {
    return Object.entries(scales)
      .map(([, value]) => value['en'])
      .sort(alphabetically)
      .sort(primaryFirst);
  }, [scales]);
  const scaleSelected = selectedScale?.['en'];

  const [selectedSection, handleSectionChange] = useState('details');

  const primary = primaryScale?.['en'];

  const onMarkScaleAsPrimary = useCallback(
    (scale: Scale) => {
      if (scale.id !== primary?.id) {
        api.markScaleAsPrimary(scale);
      }
    },
    [primary, api]
  );

  const handleChangeSection = (section: string) => {
    handleSectionChange(section);
    if (section === 'mapping' && selected?.id !== primary?.id) {
      api.selectPrimaryScale(true);
    }
    const newSection = section === 'details' ? 'scales' : section;
    navigate(`/${newSection}`);
  };

  useEffect(() => {
    if (!selected && !vm.showSkeleton && !vm.isLoading && !isNewScale) {
      navigate(isMapping ? '/scales/mapping' : '/scales');
    }
  }, [selected, vm.showSkeleton, vm.isLoading, navigate, isMapping, isNewScale]);

  useEffect(() => {
    if (scaleSelected && !bypassRef.current) {
      const index = registry.findIndex((scale) => scale.id === scaleSelected.id);
      scalesRef.current[index]?.focus();
      scalesRef.current[index]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    bypassRef.current = false;
  }, [registry, scaleSelected]);

  useEffect(() => {
    isMapping ? handleSectionChange('mapping') : handleSectionChange('details');
  }, [isMapping]);

  return (
    <div className="tw-grid-apollo tw-has-sidebar tw-mt-6 md:tw-mt-10">
      <div className="tw-col-span-full">
        <div>
          <div className="tw-inset-x-0 tw-flex tw-flex-wrap tw-gap-4 tw-pb-8 md:tw-flex-nowrap md:tw-justify-between">
            <div>
              <h1 className="tw-text-4xl tw-font-bold">Scales</h1>
              <p className="tw-text-xs tw-text-neutral-500">Add or manage skill scales.</p>
            </div>
            <Transition
              show={!showSkeleton}
              enter="tw-transition-opacity tw-delay-200 tw-duration-300"
              enterFrom="tw-opacity-0"
              enterTo="tw-opacity-100"
              leaveFrom="tw-opacity-100"
              leaveTo="tw-opacity-0"
            >
              <ScaleDashboardHeader allScales={registry} primary={primary} onMarkScaleAsPrimary={onMarkScaleAsPrimary} />
            </Transition>
          </div>
          {/* <div className="tw-col-span-full tw-text-left tw-flex tw-flex-col tw-mb-12 tw-gap-2 tw-self-stretch tw-rounded-lg tw-border-l-4 tw-bg-purple-100 tw-pl-3 tw-pr-4 tw-text-xs tw-text-purple-800 sm:tw-col-span-8 md:tw-col-start-2 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
            <div className="tw-flex tw-items-center tw-gap-2 tw-pt-3">
              <InformationCircleIcon className="tw-block tw-size-4" />
              <p className="tw-text-sm tw-font-light">
                Your skill proficiency scales have unpublished changes. Changes to your organization's skill proficiency scales will not be
                visible in the LXP until published.
              </p>
            </div>
            <Link to="/publish" className="tw-w-fit tw-btn-tertiary tw-btn-medium tw-btn-ghost-purple tw-mb-3 tw-ml-3">
              Publish changes
            </Link>
          </div> */}

          <Transition
            show={!showSkeleton}
            enter="tw-transition-opacity tw-duration-200"
            enterFrom="tw-opacity-0"
            enterTo="tw-opacity-100"
            leaveFrom="tw-opacity-100"
            leaveTo="tw-opacity-0"
          >
            <div className="sm:tw-col-span-8 md:tw-col-span-12 md:tw-col-start-2 lg:tw-col-start-2 xl:tw-col-span-4 xl:tw-col-start-3">
              <div className="tw-h-8 tw-items-center tw-gap-2 tw-rounded-lg tw-border tw-border-neutral-300 tw-bg-white tw-px-1 tw-py-2 md:tw-inline-flex">
                <button
                  type="button"
                  onClick={() => handleChangeSection('details')}
                  aria-pressed={selectedSection === 'details'}
                  className={twMerge(
                    'tw-inline-flex tw-h-6 tw-items-center tw-gap-3 tw-rounded-md tw-border tw-border-blue-200 tw-border-transparent tw-px-4 tw-text-sm tw-font-semibold hover:tw-border-blue-300 hover:tw-text-blue-800 focus:tw-border-blue-800 focus:tw-bg-blue-100 focus:tw-text-blue-900 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-800 disabled:tw-border-dashed disabled:tw-border-neutral-300 disabled:tw-bg-neutral-100 disabled:tw-text-neutral-600',
                    selectedSection === 'details' ? 'tw-border-blue-200 tw-bg-blue-100 tw-text-blue-900' : ''
                  )}
                >
                  Details
                </button>
                <button
                  type="button"
                  aria-pressed={selectedSection === 'mapping'}
                  onClick={() => handleChangeSection('scales/mapping')}
                  className={twMerge(
                    'tw-inline-flex tw-h-6 tw-items-center tw-gap-3 tw-rounded-md tw-border tw-border-blue-200 tw-border-transparent tw-px-4 tw-text-sm tw-font-semibold hover:tw-border-blue-300 hover:tw-text-blue-800 focus:tw-border-blue-800 focus:tw-bg-blue-100 focus:tw-text-blue-900 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-800 disabled:tw-border-dashed disabled:tw-border-neutral-300 disabled:tw-bg-neutral-100 disabled:tw-text-neutral-600',
                    selectedSection === 'mapping' ? 'tw-border-blue-200 tw-bg-blue-100 tw-text-blue-900' : ''
                  )}
                >
                  Mapping
                </button>
              </div>
            </div>
          </Transition>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
