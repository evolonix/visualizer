import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import { useNavigateOnEscape } from '@degreed/core-react';
import { Transition } from '@headlessui/react';
import { ArrowDownTrayIcon, ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

import { DeleteModal, Select } from '@degreed/apollo-react-cdk';
import { Language, downloadFile } from '@skills/data-access';

export interface ScaleDetailsHeaderProps {
  scaleId: string;
  isPrimary?: boolean;
  wasPublishedAsPrimary?: boolean;
  showSkeleton?: boolean;
  languages: Language[];
  selectedLanguageCode?: string;
  onDelete: () => void;
  onLanguageChange: (language: Language) => void;
  onExportLevels: (scaleId: string) => Promise<string>;
}

export function ScaleDetailsHeader({
  scaleId,
  isPrimary,
  wasPublishedAsPrimary,
  showSkeleton,
  languages,
  selectedLanguageCode,
  onDelete,
  onLanguageChange,
  onExportLevels,
}: ScaleDetailsHeaderProps) {
  const [isModalOpen, confirmDeletion] = useState(false);

  useNavigateOnEscape(`/scales`);

  const handleDelete = () => {
    onDelete();
    confirmDeletion(false);
  };

  const handleLanguageChange = useCallback(
    (value: string | string[]) => {
      onLanguageChange(languages.find((l) => l.languageCode === value) as Language);
    },
    [languages, onLanguageChange]
  );

  return (
    <div className="tw-sticky tw-top-0 tw-z-20">
      {/* <!-- Modal Header --> */}
      <div className="tw-relative tw-flex tw-h-20 tw-shrink-0 tw-items-center tw-gap-x-4 tw-bg-white tw-px-4 tw-shadow-md">
        <div className="tw-absolute tw-inset-y-0 tw-left-4 tw-flex tw-items-center">
          <Link className="tw-btn-secondary-filled tw-btn-medium tw-btn-icon" to="/scales" aria-label="Go back">
            <ChevronLeftIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
          </Link>
        </div>

        <Transition
          show={!showSkeleton}
          enter="tw-transition-opacity tw-delay-200 tw-duration-300"
          enterFrom="tw-opacity-0"
          enterTo="tw-opacity-100"
          leaveFrom="tw-opacity-100"
          leaveTo="tw-opacity-0"
        >
          <div className="tw-flex tw-flex-1 tw-items-center tw-justify-end tw-gap-x-4">
            {!isPrimary && !wasPublishedAsPrimary ? (
              <button
                type="button"
                className="tw-btn-icon tw-btn-destructive tw-btn-medium"
                onClick={() => confirmDeletion(true)}
                aria-label="Delete"
              >
                <TrashIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
              </button>
            ) : null}
            <Link className="tw-btn-primary tw-btn-medium" to={`/scales/${scaleId}/edit`}>
              Edit
            </Link>
          </div>
        </Transition>
      </div>

      <div className="tw-flex tw-items-center tw-bg-neutral-100 tw-px-4 tw-py-3">
        <Transition
          as="div"
          className="tw-flex tw-flex-1 tw-items-center"
          show={!showSkeleton}
          enter="tw-transition-opacity tw-delay-200 tw-duration-300"
          enterFrom="tw-opacity-0"
          enterTo="tw-opacity-100"
          leaveFrom="tw-opacity-100"
          leaveTo="tw-opacity-0"
        >
          <div className="tw-flex tw-flex-1 tw-items-center tw-gap-3">
            <label className="tw-text-xs tw-font-extrabold tw-uppercase">Scale Language</label>
            <Select
              className="tw-w-40"
              mode="small"
              options={languages.map(({ languageCode, name }) => ({ id: languageCode, name }))}
              value={selectedLanguageCode}
              onChange={handleLanguageChange}
            />
          </div>

          <div className="tw-hidden tw-items-center tw-gap-2 sm:tw-flex">
            <button
              type="button"
              className="tw-btn-secondary-outline"
              onClick={() => onExportLevels(scaleId).then((data) => downloadFile(data, `scale_${scaleId}_level_translations.xlsx`))}
            >
              <ArrowDownTrayIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
              <span className="tw-block tw-truncate">Export Languages</span>
            </button>
          </div>
        </Transition>
      </div>

      <DeleteModal
        title="Delete Scale Source?"
        message="Are you sure you would like to delete this scale source? All information (eg. title, descriptions, and level names) will be deleted."
        show={isModalOpen}
        onCancel={() => confirmDeletion(false)}
        onDelete={handleDelete}
      />
    </div>
  );
}
