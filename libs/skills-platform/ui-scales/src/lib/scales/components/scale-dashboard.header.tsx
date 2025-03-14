import React, { ForwardedRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Menu, MenuButton, Transition } from '@headlessui/react';
import { CheckCircleIcon, ChevronDownIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import { AcknowledgeModal } from '@degreed/apollo-react-cdk';
import { Scale, alphabetically } from '@skills/data-access';

export interface ScaleDashboardHeaderProps {
  allScales: Scale[];
  primary: Scale | undefined;
  hidePublish?: boolean;
  onMarkScaleAsPrimary: (scale: Scale) => void;
}

export const ScaleDashboardHeader = React.forwardRef(
  (
    { allScales: registry, primary, hidePublish, onMarkScaleAsPrimary }: ScaleDashboardHeaderProps,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => {
    registry = [...registry].sort(alphabetically);

    const [isModalOpen, confirmSelection] = useState(false);
    const [selectedScale, setSelectedScale] = useState<Scale>();

    const handleSelectPrimary = (scale: Scale) => {
      setSelectedScale(scale);
      confirmSelection(true);
    };

    const handleConfirmSelection = () => {
      if (selectedScale) {
        onMarkScaleAsPrimary(selectedScale);
        confirmSelection(false);
      }
    };

    return (
      <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-6" ref={forwardedRef}>
        <div className="tw-leading-none">
          <Menu as="div" className="tw-relative tw-inline-block tw-text-left">
            <div className="tw-flex tw-items-center tw-gap-3">
              <label className="tw-text-xs tw-font-extrabold tw-uppercase">Primary Scale</label>
              <MenuButton className="tw-btn-secondary-outline tw-btn-medium">
                {primary ? (
                  <>
                    {primary.name} &bull; {primary.totalLevelCount} Levels
                  </>
                ) : (
                  <>Please select a primary scale</>
                )}
                <ChevronDownIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
              </MenuButton>
              {!hidePublish ? (
                <Link to="/publish" className="tw-btn-primary tw-btn-medium">
                  <RocketLaunchIcon className="tw-size-4" />
                  Publish Scales
                </Link>
              ) : null}
            </div>

            <Transition
              enter="tw-transition tw-ease-out tw-duration-100"
              enterFrom="tw-transform tw-opacity-0 tw-scale-95"
              enterTo="tw-transform tw-opacity-100 tw-scale-100"
              leave="tw-transition tw-ease-in tw-duration-75"
              leaveFrom="tw-transform tw-opacity-100 tw-scale-100"
              leaveTo="tw-transform tw-opacity-0 tw-scale-95"
            >
              <Menu.Items className="tw-absolute tw-right-0 tw-z-10 tw-mt-2 tw-w-56 tw-origin-top-right tw-divide-y tw-divide-neutral-100 tw-overflow-y-auto tw-rounded-xl tw-bg-white tw-shadow-xl tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none tw-max-h-[calc(100vh-10rem)]">
                <div className="tw-py-2">
                  {registry.map((scale) => (
                    <Menu.Item key={scale.id}>
                      {({ active }) => (
                        <button
                          type="button"
                          className={clsx(
                            active ? 'tw-bg-neutral-100 tw-text-neutral-900' : 'tw-text-neutral-700',
                            'tw-relative tw-w-full tw-px-4 tw-py-2 tw-text-sm tw-group'
                          )}
                          onClick={() => handleSelectPrimary(scale)}
                        >
                          <div className="tw-pr-10 tw-text-left">
                            <span className="tw-block tw-truncate tw-text-sm tw-font-semibold">{scale.name}</span>
                            <span className={clsx(active ? 'tw-text-neutral-700' : 'tw-text-neutral-500', 'tw-text-xs tw-font-semibold')}>
                              {scale.totalLevelCount} Levels
                            </span>
                          </div>

                          <span
                            className={clsx(
                              active ? 'tw-text-white' : 'tw-text-blue-600',
                              'tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-4'
                            )}
                          >
                            {active ? (
                              <CheckCircleIcon className="tw-h-6 tw-w-6 tw-text-blue-900" aria-hidden="true" />
                            ) : scale.isPrimary ? (
                              <CheckCircleSolidIcon className="tw-h-6 tw-w-6 tw-text-green-600" aria-hidden="true" />
                            ) : null}
                          </span>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <AcknowledgeModal
          title="Change Primary Scale?"
          warningMessage={
            primary?.totalLevelCount !== selectedScale?.totalLevelCount
              ? 'If you have and custom proficiency levels all the custom level descriptions on skills will be overwritten to the generic scale and this action can not be undone.'
              : ''
          }
          message="Changing the primary scale affects all sources, levels, and the displayed scale in Degreed LXP. Once published, a primary scale cannot be deleted."
          show={isModalOpen}
          onCancel={() => confirmSelection(false)}
          onConfirm={handleConfirmSelection}
        />
      </div>
    );
  }
);
