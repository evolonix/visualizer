import { ScalesViewModel, useScalesStore } from '@skills/data-access';
import { Link } from 'react-router-dom';

import { Transition } from '@headlessui/react';

import { useSource } from '@skills/data-access';
import { useEffect } from 'react';
import { MappingDetailsGrid, MappingSkeleton } from './components';

export function MappingDetails() {
  const [selected, vm] = useSource();
  const { registry: scales, selected: selectedScale, primary: primaryScale, api, ...status }: ScalesViewModel = useScalesStore();

  useEffect(() => {
    api.selectPrimaryScale(true);
  }, []);

  return (
    <>
      <Transition
        show={!vm.showSkeleton && !vm.isLoading}
        enter="tw-transition-opacity tw-duration-300"
        enterFrom="tw-opacity-0"
        enterTo="tw-opacity-100"
        leaveFrom="tw-opacity-100"
        leaveTo="tw-opacity-0"
      >
        <div className="tw-mt-8">
          <div className="tw-flex tw-items-center tw-justify-between tw-pb-12">
            <p className="tw-text-xs tw-font-light">Map skill levels from all scales to your organization’s primary scale.</p>
            <Transition
              as="div"
              show={!vm.showSkeleton && !vm.isLoading}
              enter="tw-transition-opacity tw-delay-200 tw-duration-300"
              enterFrom="tw-opacity-0"
              enterTo="tw-opacity-100"
              leaveFrom="tw-opacity-100"
              leaveTo="tw-opacity-0"
              className="tw-flex tw-items-center tw-gap-3"
            >
              <Link to="/scales/mapping/edit" className="tw-btn-secondary-outline tw-btn-medium">
                Edit Mappings
              </Link>
            </Transition>
          </div>
          <MappingDetailsGrid selected={selected} />
        </div>
      </Transition>

      {vm.isLoading || vm.showSkeleton ? (
        <div className="tw-mt-28">
          <MappingSkeleton />
        </div>
      ) : null}
    </>
  );
}
