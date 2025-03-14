import { Transition } from '@headlessui/react';

import { SimpleConfirmModal, SimpleToast } from '@degreed/apollo-react-cdk';
import { inject } from '@degreed/core-react';

import { ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

import clsx from 'clsx';

import { NxBootstrapToken, NxSkillsPlatformBootstrap, PublishError, usePublishScales } from '@skills/data-access';

import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Publish() {
  const { assetUrl } = inject<NxSkillsPlatformBootstrap>(NxBootstrapToken);
  const [vm, isPublished] = usePublishScales();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <div className="tw-grid-apollo tw-has-sidebar tw-mt-6 md:tw-mt-10">
      {!vm.isLoading && vm.errors.length ? (
        <ValidationSummary
          className="tw-col-span-full tw-rounded-lg sm:tw-col-span-6 sm:tw-col-start-2 lg:tw-col-start-4"
          title="Update scale source mappings"
          errors={vm.errors}
          danger
        />
      ) : null}
      {!vm.isLoading && vm.warnings.length ? (
        <ValidationSummary
          className="tw-col-span-full tw-rounded-lg sm:tw-col-span-6 sm:tw-col-start-2 lg:tw-col-start-4"
          title="Update scale source mappings"
          errors={vm.warnings}
        />
      ) : null}

      <div className="tw-col-span-full tw-flex tw-flex-col tw-items-center tw-text-center sm:tw-col-span-4 sm:tw-col-start-3 md:tw-mt-16 lg:tw-col-start-5">
        <img src={assetUrl(isPublished ? 'scale-published.svg' : '14_Glasses_Balloons.png')} alt="Scale publish" />
        <h3 className="tw-mb-6 tw-mt-9 tw-text-2xl tw-font-bold">
          {isPublished ? 'Changes Published!' : 'Ready to publish your changes?'}
        </h3>
        {vm.isLoading ? (
          // Show button skeleton when loading
          <div className="tw-h-10 tw-w-full tw-animate-pulse tw-rounded-full tw-bg-neutral-200"></div>
        ) : (
          <button
            className="tw-btn-primary tw-btn-medium tw-h-10 tw-w-full"
            onClick={() => setShowConfirmModal(true)}
            disabled={vm.isPublishing || vm.errors.length > 0 || isPublished}
          >
            <RocketLaunchIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
            Publish to Degreed LXP
          </button>
        )}

        <div className="tw-relative tw-w-full">
          {vm.lastPublished ? (
            <Transition
              as="div"
              show={!vm.isLoading && !vm.isPublishing}
              enter="tw-transition-opacity tw-duration-300"
              enterFrom="tw-opacity-0"
              enterTo="tw-opacity-100"
              leave="tw-transition-opacity tw-duration-200"
              leaveFrom="tw-opacity-100"
              leaveTo="tw-opacity-0"
              className="tw-absolute tw-inset-x-0 tw-top-0 tw-mt-2 tw-text-xs"
            >
              <span className="tw-font-semibold">Last Published:</span>{' '}
              {Intl.DateTimeFormat('en', {
                dateStyle: 'long',
                timeStyle: 'short',
              }).format(new Date(vm.lastPublished))}
            </Transition>
          ) : null}

          <Transition
            as="div"
            show={!vm.isLoading && vm.isPublishing}
            enter="tw-transition-opacity tw-duration-300"
            enterFrom="tw-opacity-0"
            enterTo="tw-opacity-100"
            leave="tw-transition-opacity tw-duration-200"
            leaveFrom="tw-opacity-100"
            leaveTo="tw-opacity-0"
            className="tw-absolute tw-inset-x-0 tw-top-0 tw-mt-2 tw-flex tw-items-center tw-justify-center tw-text-xs"
          >
            <>
              <CheckCircleIcon className="tw-mr-1 tw-h-4 tw-w-4 tw-text-green-500" aria-hidden="true" />
              Publishing...
            </>
          </Transition>
        </div>
      </div>

      {/* Success Toast */}
      <SimpleToast title="Published successfully!" type="success" show={vm.showSuccessToast} onClose={vm.closeToast}>
        All edits are now live on the Degreed LXP.{' '}
        <a href="/me" className="tw-font-semibold tw-text-blue-800">
          Go to Degreed
        </a>
      </SimpleToast>

      {/* Error Toast */}
      <SimpleToast title="Something went wrong!" type="error" show={vm.showErrorToast} onClose={vm.closeToast}>
        Try to publish again. If the problem persists, please contact{' '}
        <a href="/me" className="tw-font-semibold tw-text-blue-800">
          Degreed Support
        </a>
        .
      </SimpleToast>

      <SimpleConfirmModal
        show={showConfirmModal}
        title="Confirm publish"
        confirmButtonText="Publish"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          vm.publish();
        }}
      >
        <div className="tw-col-span-full tw-my-4 tw-flex tw-items-center tw-gap-3 tw-overflow-hidden tw-rounded-lg tw-bg-yellow-100 tw-pr-4 tw-text-yellow-600 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
          <div className="tw-w-1 tw-self-stretch tw-bg-yellow-600"></div>
          <ExclamationTriangleIcon className="tw-h-4 tw-w-9" />
          <p className="tw-py-3 tw-text-xs tw-text-yellow-800">
            Once published, the number of levels in a primary scale cannot be edited and a primary scale cannot be deleted.
          </p>
        </div>

        <div className="tw-col-span-full tw-my-4 tw-flex tw-items-center tw-gap-3 tw-overflow-hidden tw-rounded-lg tw-bg-yellow-100 tw-pr-4 tw-text-yellow-600 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
          <div className="tw-w-1 tw-self-stretch tw-bg-yellow-600"></div>
          <ExclamationTriangleIcon className="tw-h-4 tw-w-9" />
          <p className="tw-py-3 tw-text-xs tw-text-yellow-800">
            If you have and custom proficiency levels all the custom level descriptions on skills will be overwritten to the generic scale
            and this action can not be undone.
          </p>
        </div>

        <p className="tw-text-neutral-900">
          You are about to publish the following to all learners in your organization's Degreed instance.
        </p>
        <ul className="tw-ml-2 tw-mt-4 tw-list-inside tw-list-disc">
          <li>Chosen primary scale</li>
          <li>Edits to any scales</li>
          <li>Changes to any scale mappings</li>
        </ul>
      </SimpleConfirmModal>
    </div>
  );
}

interface ErrorSummaryProps {
  publishError: PublishError;
  danger?: boolean;
}

const ErrorSummary = ({ publishError, danger }: ErrorSummaryProps) => {
  return (
    <>
      <div className={clsx(danger ? 'tw-text-red-900' : 'tw-text-yellow-900', 'tw-text-xs tw-font-semibold')}>{publishError.subtitle}</div>
      <ul className="tw-ml-2 tw-list-inside tw-list-disc">
        {publishError.errors.map((error, i) => (
          <li key={`error-${i}`}>{error}</li>
        ))}
      </ul>
    </>
  );
};

interface ValidationSummaryProps {
  className?: string;
  title: string;
  errors: PublishError[];
  danger?: boolean;
}

const ValidationSummary = ({ className, title, errors, danger }: ValidationSummaryProps) => {
  return (
    <div className={clsx(danger ? 'tw-bg-red-100 tw-text-red-800' : 'tw-bg-yellow-100 tw-text-yellow-800', className)}>
      <div
        className={clsx(
          danger ? 'tw-border-red-600' : 'tw-border-yellow-600',
          'tw-space-y-4 tw-rounded-l-lg tw-border-l-8 tw-px-3 tw-py-4'
        )}
      >
        <div>
          <div
            className={clsx(
              danger ? 'tw-text-red-900' : 'tw-text-yellow-900',
              'tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold'
            )}
          >
            {danger ? (
              <ExclamationCircleIcon className="tw-inline-block tw-h-4 tw-w-4 tw-text-red-600" aria-hidden="true" />
            ) : (
              <ExclamationTriangleIcon className="tw-inline-block tw-h-4 tw-w-4 tw-text-yellow-600" aria-hidden="true" />
            )}
            <span>{title}</span>
          </div>
          {errors.map((publishError) => (
            <div key={publishError.subtitle} className="tw-mt-2 tw-flex tw-max-h-96 tw-flex-col tw-flex-wrap tw-overflow-auto tw-text-sm">
              <ErrorSummary publishError={publishError} danger={danger} />
            </div>
          ))}
          {danger ? (
            <Link to="/scales/mapping" className="tw-btn-tertiary-error tw-mt-2">
              Edit mappings
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};
