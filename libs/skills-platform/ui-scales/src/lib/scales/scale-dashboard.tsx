import { useCallback, useEffect, useMemo, useRef } from 'react';

import { Transition } from '@headlessui/react';

import { PlusIcon } from '@heroicons/react/24/outline';
import { Scale, ScalesViewModel, alphabetically, useScalesStore } from '@skills/data-access';
import { Link } from 'react-router-dom';
import { ScaleDashboardEmpty, ScaleDashboardList, ScaleDashboardSkeleton } from './components';

export function ScaleDashboard() {
  const scalesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const { registry: scales, selected: selectedScale, primary: primaryScale, api, ...status }: ScalesViewModel = useScalesStore();
  const showSkeleton = status.showSkeleton || status.isLoading;
  const primaryFirst = (a: Scale) => (a.isPrimary ? -1 : 1);
  const bypassRef = useRef(false);
  const registry = useMemo(() => {
    return Object.entries(scales)
      .map(([, value]) => value['en'])
      .sort(alphabetically)
      .sort(primaryFirst);
  }, [scales]);

  const scaleSelected = selectedScale?.['en'];

  const onSelectScale = useCallback(
    (scale: Scale) => {
      bypassRef.current = true; // 1x skip auto-scroll
      api.selectScale(scale.id);
    },
    [api]
  );

  useEffect(() => {
    if (scaleSelected && !bypassRef.current) {
      const index = registry.findIndex((scale) => scale.id === scaleSelected.id);
      scalesRef.current[index]?.focus();
      scalesRef.current[index]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    bypassRef.current = false;
  }, [registry, scaleSelected]);

  return showSkeleton || registry.length ? (
    <div>
      <div className="tw-col-span-full tw-space-y-16 lg:tw-col-span-10 lg:tw-col-start-2 lg:tw-space-y-12 2xl:tw-col-span-8 2xl:tw-col-start-3">
        {showSkeleton ? (
          <div className="tw-flex tw-h-8 tw-animate-pulse tw-justify-between">
            <div className="tw-h-8 tw-w-72 tw-rounded-full tw-bg-neutral-200"></div>
            <div className="tw-h-8 tw-w-8 tw-rounded-lg tw-bg-neutral-200"></div>
          </div>
        ) : null}

        {showSkeleton ? <ScaleDashboardSkeleton /> : null}

        <Transition
          show={!showSkeleton}
          enter="tw-transition-opacity tw-duration-300"
          enterFrom="tw-opacity-0"
          enterTo="tw-opacity-100"
          leaveFrom="tw-opacity-100"
          leaveTo="tw-opacity-0"
          as="div"
        >
          <div className="tw-my-8">
            <div className="tw-flex tw-flex-1 tw-items-center tw-justify-end tw-gap-3">
              <Link to="./new" className="tw-btn-secondary-outline tw-btn-medium" aria-label="Create Scale">
                <PlusIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
                <p className="tw-pr-2">Add Scale</p>
              </Link>
            </div>
          </div>
          <ScaleDashboardList allScales={registry} selectedScale={scaleSelected} scalesRef={scalesRef} onSelectScale={onSelectScale} />
        </Transition>
      </div>
    </div>
  ) : (
    <ScaleDashboardEmpty />
  );
}
