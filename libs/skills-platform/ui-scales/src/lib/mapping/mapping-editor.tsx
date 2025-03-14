import { Transition } from '@headlessui/react';
import { ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';

import {
  Scale,
  ScalesViewModel,
  SourceMapping,
  alphabetically,
  sleep,
  usePublishScales,
  useScalesStore,
  useSource,
} from '@skills/data-access';

import { ScaleDashboardHeader } from '../scales';
import { MappingEditorGrid, MappingSkeleton } from './components';

export function MappingEditor() {
  const navigate = useNavigate();
  const [selected, vm] = useSource();
  const [publishVm] = usePublishScales();
  const { registry: scales, primary: primaryScale, api }: ScalesViewModel = useScalesStore();
  const primaryFirst = (a: Scale) => (a.isPrimary ? -1 : 1);
  const primary = primaryScale?.['en'];
  const registry = useMemo(() => {
    return Object.entries(scales)
      .map(([, value]) => value['en'])
      .sort(alphabetically)
      .sort(primaryFirst);
  }, [scales]);

  useEffect(() => {
    if (!selected && !vm.showSkeleton && !vm.isLoading) {
      navigate('/scales');
    }
  }, [selected, vm.showSkeleton, vm.isLoading, navigate]);

  const { values, isSubmitting, handleChange, handleBlur, handleSubmit, setValues } = useFormik<SourceMapping>({
    initialValues: selected as SourceMapping,
    onSubmit: (values: SourceMapping) => {
      if (values) {
        // Wait to allow the "saved" indicator to show for a bit...
        // only auto-navigate on success
        const autoNavigate = sleep(450, (saved) => !!saved && navigate(`/scales/mapping`));

        vm.api.saveSource(values).then(autoNavigate);
      }
    },
  });

  useEffect(() => {
    if (selected) {
      setValues(selected, false);
    }
  }, [selected, setValues]);

  const handleAutoMap = useCallback(async () => {
    if (values) {
      // Create suggested mappings
      const updated = await vm.api.autoMapSource(values);
      setValues(updated, false);
    }
  }, [values, vm, setValues]);

  const onMarkScaleAsPrimary = useCallback(
    (scale: Scale) => {
      if (scale.id !== primary?.id) {
        api.markScaleAsPrimary(scale);
      }
    },
    [primary, api]
  );

  const autoMapButtonDisabled = values?.mappings.every((m) => m.mappedToLevels?.some((l) => l.levelIds.length)) || false;
  const hasMappingErrors = !!publishVm.validation?.errors.mappings.length;

  return createPortal(
    <>
      <div className="tw-fixed tw-inset-0 tw-z-50 tw-h-screen tw-bg-white"></div>
      <div className="tw-absolute tw-left-0 tw-top-0 tw-z-[60] tw-flex tw-min-h-screen tw-w-full tw-flex-col tw-bg-neutral-50">
        <div className="tw-relative tw-flex tw-h-20 tw-shrink-0 tw-items-center tw-gap-x-4 tw-bg-white tw-px-4 tw-shadow-md">
          <div className="tw-absolute tw-inset-y-0 tw-left-4 tw-flex tw-items-center">
            <Link to="/scales/mapping" className="tw-btn-secondary-filled tw-btn-medium">
              Cancel
            </Link>
          </div>

          <div className="tw-flex tw-flex-1 tw-items-center tw-justify-center">
            <p className="tw-font-semibold"> Map Scales</p>
          </div>

          <Transition
            show={!vm.showSkeleton}
            enter="tw-transition-opacity tw-delay-200 tw-duration-300"
            enterFrom="tw-opacity-0"
            enterTo="tw-opacity-100"
            leaveFrom="tw-opacity-100"
            leaveTo="tw-opacity-0"
          >
            <div className="tw-absolute tw-inset-y-0 tw-right-4 tw-flex tw-items-center tw-gap-x-4">
              <Transition
                show={isSubmitting}
                enter="tw-transition-opacity tw-duration-300"
                enterFrom="tw-opacity-0"
                enterTo="tw-opacity-100"
                leave="tw-transition-opacity tw-duration-200"
                leaveFrom="tw-opacity-100"
                leaveTo="tw-opacity-0"
              >
                <div className="tw-flex tw-items-center tw-gap-x-1 tw-text-xs">
                  <CheckCircleIcon className="tw-h-4 tw-w-4 tw-text-green-500" aria-hidden="true" />
                  Saving...
                </div>
              </Transition>
              <div className="tw-flex tw-items-center tw-gap-2">
                <button onClick={(e) => handleSubmit()} type="submit" className="tw-btn-primary tw-btn-medium" disabled={isSubmitting}>
                  Save
                </button>
              </div>
            </div>
          </Transition>
        </div>
        <div className="tw-flex tw-justify-center">
          <div className="tw-w-9/12 tw-flex tw-flex-col tw-gap-y-8">
            <div className="tw-col-span-full">
              <div className=" tw-inset-x-0 tw-flex tw-justify-end tw-mt-10">
                <Transition
                  show={!vm.showSkeleton}
                  enter="tw-transition-opacity tw-delay-200 tw-duration-300"
                  enterFrom="tw-opacity-0"
                  enterTo="tw-opacity-100"
                  leaveFrom="tw-opacity-100"
                  leaveTo="tw-opacity-0"
                >
                  <ScaleDashboardHeader
                    hidePublish={true}
                    allScales={registry}
                    primary={primary}
                    onMarkScaleAsPrimary={onMarkScaleAsPrimary}
                  />
                </Transition>
                <button
                  type="button"
                  className="tw-btn-secondary-outline tw-btn-medium tw-ml-3"
                  disabled={autoMapButtonDisabled}
                  onClick={() => handleAutoMap()}
                >
                  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="tw-h-4 tw-w-4">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.5714 0C12.8336 0 13.0622 0.178456 13.1258 0.432837L13.323 1.22176C13.5022 1.93833 14.0617 2.49783 14.7782 2.67697L15.5672 2.8742C15.8215 2.9378 16 3.16636 16 3.42857C16 3.69078 15.8215 3.91934 15.5672 3.98294L14.7782 4.18017C14.0617 4.35931 13.5022 4.91881 13.323 5.63538L13.1258 6.42431C13.0622 6.67869 12.8336 6.85714 12.5714 6.85714C12.3092 6.85714 12.0807 6.67869 12.0171 6.42431L11.8198 5.63538C11.6407 4.91881 11.0812 4.35931 10.3646 4.18017L9.57569 3.98294C9.32131 3.91934 9.14286 3.69078 9.14286 3.42857C9.14286 3.16636 9.32131 2.9378 9.57569 2.8742L10.3646 2.67697C11.0812 2.49783 11.6407 1.93833 11.8198 1.22176L12.0171 0.432837C12.0807 0.178456 12.3092 0 12.5714 0ZM12.5714 2.35898C12.3074 2.79704 11.9399 3.16451 11.5018 3.42857C11.9399 3.69263 12.3074 4.0601 12.5714 4.49817C12.8355 4.0601 13.203 3.69263 13.641 3.42857C13.203 3.16451 12.8355 2.79704 12.5714 2.35898ZM5.71429 2.28571C5.96942 2.28571 6.19364 2.45484 6.26373 2.70016L6.88331 4.86869C7.1545 5.81785 7.89644 6.55979 8.8456 6.83098L11.0141 7.45056C11.2594 7.52065 11.4286 7.74487 11.4286 8C11.4286 8.25513 11.2594 8.47935 11.0141 8.54944L8.8456 9.16902C7.89644 9.44021 7.1545 10.1822 6.88331 11.1313L6.26373 13.2998C6.19364 13.5452 5.96942 13.7143 5.71429 13.7143C5.45915 13.7143 5.23493 13.5452 5.16484 13.2998L4.54526 11.1313C4.27408 10.1821 3.53214 9.44021 2.58297 9.16902L0.414445 8.54944C0.16913 8.47935 0 8.25513 0 8C0 7.74487 0.16913 7.52065 0.414445 7.45056L2.58297 6.83098C3.53214 6.55979 4.27408 5.81785 4.54527 4.86868L5.16484 2.70016C5.23493 2.45484 5.45915 2.28571 5.71429 2.28571ZM5.71429 4.93717L5.64415 5.18265C5.26448 6.51148 4.22577 7.5502 2.89694 7.92986L2.65146 8L2.89694 8.07014C4.22577 8.4498 5.26448 9.48852 5.64415 10.8173L5.71429 11.0628L5.78442 10.8173C6.16409 9.48852 7.2028 8.4498 8.53163 8.07014L8.77711 8L8.53164 7.92986C7.2028 7.5502 6.16409 6.51148 5.78442 5.18265L5.71429 4.93717ZM11.4286 10.2857C11.6745 10.2857 11.8929 10.4431 11.9707 10.6764L12.2711 11.5776C12.3848 11.9188 12.6526 12.1866 12.9939 12.3004L13.895 12.6008C14.1283 12.6785 14.2857 12.8969 14.2857 13.1429C14.2857 13.3888 14.1283 13.6072 13.895 13.685L12.9939 13.9853C12.6526 14.0991 12.3848 14.3669 12.2711 14.7081L11.9707 15.6093C11.8929 15.8426 11.6745 16 11.4286 16C11.1826 16 10.9642 15.8426 10.8865 15.6093L10.5861 14.7081C10.4723 14.3669 10.2045 14.0991 9.86329 13.9853L8.96216 13.685C8.72882 13.6072 8.57143 13.3888 8.57143 13.1429C8.57143 12.8969 8.72882 12.6785 8.96216 12.6008L9.86328 12.3004C10.2045 12.1866 10.4723 11.9188 10.5861 11.5776L10.8865 10.6764C10.9642 10.4431 11.1826 10.2857 11.4286 10.2857ZM11.4286 12.446C11.2498 12.7261 11.0118 12.964 10.7317 13.1429C11.0118 13.3217 11.2498 13.5596 11.4286 13.8397C11.6074 13.5596 11.8453 13.3217 12.1254 13.1429C11.8453 12.964 11.6074 12.7261 11.4286 12.446Z"
                      fill="currentColor"
                    />
                  </svg>
                  Auto-Map
                </button>
              </div>
            </div>
            {!vm.isLoading && hasMappingErrors ? (
              <ValidationSummary
                className="tw-col-span-full tw-mb-4 tw-rounded-lg"
                error="These scales were published as primary scales and must be sequentially mapped to the current primary scale."
                danger
              />
            ) : null}

            <div className="tw-col-span-full">
              <form noValidate onSubmit={handleSubmit}>
                <div id="container" className="tw-relative tw-overflow-x-auto">
                  <div className="tw-sticky tw-inset-x-0 tw-flex tw-flex-wrap tw-gap-4 tw-pb-8 md:tw-flex-nowrap md:tw-justify-between">
                    <div>
                      <h3 className="tw-text-2xl tw-font-bold">Source Mapping</h3>
                      <p className="tw-text-xs tw-text-neutral-500">
                        Map skill levels from all scale sources to your organization's primary scale.
                      </p>
                    </div>
                  </div>

                  <Transition
                    show={vm.showSkeleton || vm.isLoading || isSubmitting}
                    enterFrom="tw-opacity-0"
                    enterTo="tw-opacity-100"
                    leave="tw-transition-opacity tw-duration-200"
                    leaveFrom="tw-opacity-100"
                    leaveTo="tw-opacity-0"
                  >
                    <MappingSkeleton />
                  </Transition>
                  <Transition
                    show={!vm.showSkeleton && !vm.isLoading && !isSubmitting}
                    enter="tw-transition-opacity tw-delay-200 tw-duration-300"
                    enterFrom="tw-opacity-0"
                    enterTo="tw-opacity-100"
                    leaveFrom="tw-opacity-100"
                    leaveTo="tw-opacity-0"
                  >
                    <MappingEditorGrid
                      values={values}
                      publishValidation={publishVm.validation}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                    />
                  </Transition>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

interface ValidationSummaryProps {
  className?: string;
  error: string;
  danger?: boolean;
}

const ValidationSummary = ({ className, error, danger }: ValidationSummaryProps) => {
  return (
    <div className={clsx(danger ? 'tw-bg-danger-100 tw-text-danger-800' : 'tw-bg-warning-100 tw-text-warning-800', className)}>
      <div
        className={clsx(
          danger ? 'tw-border-danger-600' : 'tw-border-warning-600',
          'tw-space-y-4 tw-rounded-l-lg tw-border-l-8 tw-px-3 tw-py-4'
        )}
      >
        <div>
          <div className={clsx(danger ? 'tw-text-danger-800' : 'tw-text-warning-800', 'tw-flex tw-items-center tw-gap-2 tw-text-xs')}>
            {danger ? (
              <ExclamationCircleIcon className="tw-text-danger-600 tw-inline-block tw-h-4 tw-w-4" aria-hidden="true" />
            ) : (
              <ExclamationTriangleIcon className="tw-text-warning-600 tw-inline-block tw-h-4 tw-w-4" aria-hidden="true" />
            )}
            <span>{error}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
