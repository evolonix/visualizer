import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';

import { Transition } from '@headlessui/react';

import { Footer } from '@degreed/apollo-react-cdk';
import { FilesViewModel, Language, Scale, useFilesStore, useScale } from '@skills/data-access';
import { HeaderBackground } from '@skills/ui-common';

import { InformationCircleIcon } from '@heroicons/react/20/solid';
import { ScaleDetailsHeader, ScaleDetailsSkeleton } from './components';

const toHtml = (value: string | undefined) => (value ? value.replace(/(?:\r\n|\r|\n)/g, '<br>') : '');

export function ScaleDetails() {
  const navigate = useNavigate();
  const { scaleId } = useParams();
  const [localizations, api, vm] = useScale(scaleId);
  const { exportLevels }: FilesViewModel = useFilesStore();
  const fallbackLanguageCode = 'en';
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>(fallbackLanguageCode);

  let scale = localizations?.[selectedLanguageCode] || null;
  // If the selected language does not have a localization, fallback to the default language
  // TODO: This should be handled by the business layer
  const fallbackScale = localizations?.[fallbackLanguageCode];
  if (scale && fallbackScale) {
    if (!scale.name) scale = { ...scale, name: fallbackScale.name };
    if (!scale.description) scale = { ...scale, description: fallbackScale.description };
  }

  const showSkeleton = !!scaleId && (vm.showSkeleton || vm.isLoading);
  const languages = vm.allSupportedLanguages.filter(({ languageCode }) => Object.keys(localizations || {}).includes(languageCode));

  const handleDelete = () => scaleId && api.deleteScale(localizations);

  const handleLanguageChange = async (language: Language) => {
    setSelectedLanguageCode(language.languageCode);
  };

  useEffect(() => {
    if (!scale && !showSkeleton) {
      navigate('/scales');
    }
  }, [scale, showSkeleton, vm, navigate]);

  return createPortal(
    <>
      {/* // Include this div to show a white background behind the modal, covering the app layout */}
      <div className="tw-fixed tw-inset-0 tw-z-50 tw-h-screen tw-bg-white"></div>
      <div className="tw-absolute tw-left-0 tw-top-0 tw-z-[60] tw-flex tw-min-h-screen tw-w-full tw-flex-col tw-bg-neutral-50">
        <ScaleDetailsHeader
          scaleId={scale?.id || ''}
          isPrimary={scale?.isPrimary}
          wasPublishedAsPrimary={scale?.wasPublishedAsPrimary}
          showSkeleton={showSkeleton}
          languages={languages}
          selectedLanguageCode={selectedLanguageCode}
          onDelete={handleDelete}
          onLanguageChange={handleLanguageChange}
          onExportLevels={exportLevels}
        />

        <main className="tw-relative tw-flex tw-flex-1 tw-flex-col">
          {showSkeleton ? <ScaleDetailsSkeleton /> : null}

          <Transition
            as="div"
            show={!showSkeleton}
            enter="tw-transition-opacity tw-delay-200 tw-duration-300"
            enterFrom="tw-opacity-0"
            enterTo="tw-opacity-100"
            leaveFrom="tw-opacity-100"
            leaveTo="tw-opacity-0"
          >
            <ScaleDetailViewer scale={scale} />
          </Transition>
        </main>

        <Footer />
      </div>
    </>,
    document.body
  );
}

// ******************************************************************************************************
// View Components
// ******************************************************************************************************

interface ScaleDetailViewerProps {
  scale: Scale | null;
}

/**
 * Scale Details to show in the Portal as full-screen viewer
 */
const ScaleDetailViewer = ({ scale }: ScaleDetailViewerProps) => {
  return scale ? (
    <>
      <div className="tw-grid-apollo tw-relative tw-overflow-hidden tw-py-8 sm:tw-py-10 md:tw-py-12">
        <HeaderBackground />

        {scale.wasPublishedAsPrimary ? (
          scale.isPrimary ? (
            <div className="tw-col-span-full tw-mb-8 tw-flex tw-items-center tw-gap-3 tw-overflow-hidden tw-rounded-lg tw-bg-purple-100 tw-pr-4 tw-text-purple-600 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
              <div className="tw-w-1 tw-self-stretch tw-bg-purple-600"></div>
              <InformationCircleIcon className="tw-h-4 tw-w-4" />
              <p className="tw-py-3 tw-text-xs tw-text-purple-800">
                This is your organization’s current primary scale and can not be deleted.
              </p>
            </div>
          ) : (
            <div className="tw-col-span-full tw-mb-8 tw-flex tw-items-center tw-gap-3 tw-overflow-hidden tw-rounded-lg tw-bg-neutral-100 tw-pr-4 tw-text-neutral-600 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
              <div className="tw-w-1 tw-self-stretch tw-bg-neutral-600"></div>
              <InformationCircleIcon className="tw-h-4 tw-w-4" />
              <p className="tw-py-3 tw-text-xs tw-text-neutral-800">
                This scale was published as your organization’s primary scale and can not be deleted.
              </p>
            </div>
          )
        ) : null}

        <div className="tw-z-10 tw-col-span-full tw-space-y-4 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
          <h1 className="tw-flex tw-items-center tw-gap-x-3 tw-text-4xl tw-font-bold tw-text-neutral-900">
            {/* Degreed logo to be used with default Degreed scales. TODO: Get this as a CDN asset filename from the scale. */}
            {scale.name === 'Degreed' ? (
              <svg className="tw-h-10 tw-w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.1968 11.3367L15.1947 8.01281L14.9935 7.8947C14.8258 7.82721 14.6414 7.79346 14.457 7.79346C14.2725 7.79346 14.0881 7.82721 13.9205 7.8947L13.6857 8.02968L12.7469 8.55273C12.7301 8.5696 12.7301 8.58647 12.7469 8.60334L13.1325 8.80581L15.3958 10.0544L16.7371 10.7968C16.7371 10.7968 14.7587 10.8811 12.9313 11.9441C12.596 12.1466 12.2104 12.2478 11.8247 12.2478H11.7409C11.3553 12.2478 10.9697 12.1466 10.6344 11.9441C8.8069 10.8811 6.82854 10.7968 6.82854 10.7968L11.7744 8.04655L13.5348 7.05108C13.7193 6.94984 14.3564 6.5449 15.0773 6.76424C15.3958 6.84861 15.9324 7.15231 16.3683 7.4054C16.7203 7.60787 17.1563 7.54038 17.4245 7.2198C17.5586 7.05108 17.6257 6.86548 17.6257 6.66301C17.6257 6.37618 17.4916 6.10622 17.2233 5.93749C16.6533 5.58317 15.8653 5.16136 15.2282 5.06012C13.5851 4.77329 12.5457 5.58317 11.7577 6.00498C11.1541 5.51568 9.93021 4.79016 8.30393 5.06012C7.65006 5.17823 6.87884 5.58317 6.3088 5.93749C5.87289 6.20745 5.7723 6.81486 6.10761 7.20293C6.27527 7.38852 6.50999 7.48976 6.74471 7.48976C6.8956 7.48976 7.02973 7.45601 7.16386 7.37165C7.59977 7.11857 8.13627 6.81486 8.45482 6.7305C9.30987 6.49428 10.0476 7.05108 10.0476 7.05108L2.31855 11.3367C2.11736 11.4379 2 11.6573 2 11.8766V12.9396C2 13.1589 2.11736 13.3614 2.31855 13.4795C2.51974 13.5807 2.57004 13.6482 2.57004 14.0363C2.57004 14.7112 2.11736 18.4062 6.91237 18.4062C11.2212 18.4062 10.6847 14.1713 11.7577 14.1881C12.8475 14.1713 12.3109 18.4062 16.603 18.4062C21.398 18.4062 20.9453 14.7112 20.9453 14.0363C20.9453 13.6482 20.9788 13.5976 21.18 13.4795C21.3812 13.3783 21.4986 13.1589 21.4986 12.9396V11.8766C21.5154 11.6404 21.3812 11.4379 21.1968 11.3367ZM9.14222 15.8248C8.67277 16.8202 7.85125 16.9721 6.66088 16.9215C5.7723 16.8877 4.95077 16.6009 4.53163 16.1116C3.92806 15.4198 3.99513 13.3445 4.22985 12.889C4.68252 12.0116 8.84043 12.2815 9.3937 13.3951C9.46077 13.5132 9.82961 14.3906 9.14222 15.8248ZM18.9837 16.1116C18.5646 16.584 17.7431 16.8709 16.8545 16.9215C15.6809 16.9721 14.8593 16.8202 14.3731 15.8248C13.6857 14.3906 14.0546 13.5132 14.1049 13.3951C14.6582 12.2815 18.8328 12.0116 19.2687 12.889C19.5202 13.3614 19.5873 15.4367 18.9837 16.1116Z"
                  fill="#0062E3"
                />
              </svg>
            ) : null}
            {scale.name}
          </h1>
          <div className="tw-flex tw-items-center">
            {/* <!-- Default: Hide Primary badge, Show Primary badge for primary scales --> */}
            {scale.isPrimary ? (
              <div className="tw-mr-4 tw-rounded-2xl tw-border tw-border-purple-300 tw-bg-purple-50 tw-px-2 tw-py-1 tw-text-xs tw-font-extrabold tw-uppercase tw-text-purple-800">
                Primary
              </div>
            ) : null}
            <div className="tw-text-xs tw-font-semibold tw-text-neutral-500">{scale.levels?.length || 0} Levels</div>
          </div>
          <p className="tw-text-neutral-700" dangerouslySetInnerHTML={{ __html: toHtml(scale.description || '') }}></p>
        </div>
      </div>

      <div className="tw-grid-apollo tw-flex-1 tw-pt-10 sm:tw-pt-12">
        <div className="tw-col-span-full tw-space-y-12 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
          {scale.levels?.map((level) => (
            <div key={level.id} className="tw-flex tw-flex-col tw-gap-5">
              <h2 className="tw-text-3xl tw-font-bold tw-text-neutral-900">{level.name}</h2>
              <p className="tw-text-neutral-700" dangerouslySetInnerHTML={{ __html: toHtml(level.description || '') }}></p>
            </div>
          ))}
        </div>
      </div>
    </>
  ) : null;
};
