import { useCallback, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, CheckCircleIcon, ChevronLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useFormik } from 'formik';

import { Language, LanguageRegistry, createImportFileEventListener, downloadFile } from '@skills/data-access';

import { LanguageMenu } from './language-menu';

type ScaleEditorFormProps = Pick<
  ReturnType<typeof useFormik<LanguageRegistry>>,
  'isSubmitting' | 'values' | 'errors' | 'setFieldTouched' | 'setFieldError'
>;

export type ScaleEditorHeaderProps = ScaleEditorFormProps & {
  showSkeleton?: boolean;
  supportedLanguages: Language[];
  selectedLanguageCode?: string;
  onLanguageChange: (language: Language) => void;
  onImportLanguage: (data: FormData) => void;
  onDownloadTemplate: () => Promise<string>;
  onExportLevels: (scaleId: string) => Promise<string>;
};

export function ScaleEditorHeader({
  showSkeleton,
  supportedLanguages,
  selectedLanguageCode,
  isSubmitting,
  values,
  errors,
  onLanguageChange,
  onImportLanguage,
  onDownloadTemplate,
  onExportLevels,
  setFieldTouched,
  setFieldError,
}: ScaleEditorHeaderProps) {
  const { scaleId } = useParams();
  const fileImportRef = useRef<HTMLInputElement>(null);
  const invalidLanguageCodes = Object.keys(errors);
  const validLanguageCodes = Object.keys(values || {}).filter((languageCode) => !invalidLanguageCodes.includes(languageCode));
  const backToUrl = scaleId ? `/scales/${scaleId}` : '/scales';

  const handleImportFile = useCallback(() => {
    // Validate that level amount is provided
    const languageCode = selectedLanguageCode || 'en';
    // Check the default language, since it should always be present
    if (!values?.['en']?.totalLevelCount) {
      setFieldTouched(`[${languageCode}].totalLevelCount`, true, false);
      setFieldError(`[${languageCode}].totalLevelCount`, 'Level amount is required to import languages');

      return;
    }

    fileImportRef.current?.click();
  }, [selectedLanguageCode, values, setFieldError, setFieldTouched]);

  const handleLanguageChange = useCallback(
    (value: string | string[]) => {
      onLanguageChange(supportedLanguages.find((l) => l.languageCode === value) as Language);
    },
    [supportedLanguages, onLanguageChange]
  );

  useEffect(() => {
    const fileImport = fileImportRef.current || undefined;

    return createImportFileEventListener({ fileImport, onImportLanguage });
  }, [onImportLanguage]);

  return (
    <div className="tw-sticky tw-top-0 tw-z-20">
      {/* <!-- Modal Header --> */}
      <div className="tw-relative tw-flex tw-h-20 tw-shrink-0 tw-items-center tw-gap-x-4 tw-bg-white tw-px-4 tw-shadow-md">
        <div className="tw-absolute tw-inset-y-0 tw-left-4 tw-flex tw-items-center">
          <Link className="tw-btn-secondary-filled tw-btn-medium tw-btn-icon" to={backToUrl} aria-label="Go back">
            <ChevronLeftIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="tw-flex tw-flex-1 tw-items-center tw-justify-center">
          <p className="tw-font-semibold">{scaleId ? 'Edit' : 'Create'} Scale</p>
        </div>

        <Transition
          show={!showSkeleton}
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
              <button type="submit" className="tw-btn-primary tw-btn-medium" disabled={isSubmitting}>
                Save
              </button>
            </div>
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
            <LanguageMenu
              languages={supportedLanguages}
              selectedLanguageCode={selectedLanguageCode}
              validLanguageCodes={validLanguageCodes}
              invalidLanguageCodes={invalidLanguageCodes}
              onChange={handleLanguageChange}
            />
          </div>

          <div className="tw-hidden sm:tw-flex sm:tw-items-center sm:tw-gap-4">
            <div className="tw-hidden tw-leading-none md:tw-block">
              <input
                ref={fileImportRef}
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="tw-hidden"
              />
              <button type="button" className="tw-btn-secondary-outline" onClick={handleImportFile}>
                <ArrowUpTrayIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
                <span>Import Languages</span>
              </button>
            </div>

            <div className="tw-leading-none">
              <Menu as="div" className="tw-relative tw-inline-block tw-text-left">
                <div className="tw-flex tw-items-center">
                  <MenuButton className="tw-btn-secondary-outline">
                    <span>Download Files</span>
                    <ChevronDownIcon className="-tw-mr-1 tw-h-5 tw-w-5" aria-hidden="true" />
                  </MenuButton>
                </div>

                <Transition
                  enter="tw-transition tw-ease-out tw-duration-100"
                  enterFrom="tw-transform tw-opacity-0 tw-scale-95"
                  enterTo="tw-transform tw-opacity-100 tw-scale-100"
                  leave="tw-transition tw-ease-in tw-duration-75"
                  leaveFrom="tw-transform tw-opacity-100 tw-scale-100"
                  leaveTo="tw-transform tw-opacity-0 tw-scale-95"
                >
                  <MenuItems className="tw-absolute tw-right-0 tw-z-10 tw-mt-2 tw-w-56 tw-origin-top-right tw-divide-y tw-divide-neutral-100 tw-overflow-hidden tw-rounded-xl tw-bg-white tw-shadow-xl tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none">
                    <div className="tw-py-2">
                      <MenuItem>
                        {({ active }) => (
                          <button
                            type="button"
                            className={clsx(
                              active ? 'tw-bg-neutral-100 tw-text-neutral-900' : 'tw-text-neutral-700',
                              'tw-group tw-relative tw-flex tw-w-full tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-left tw-text-xs tw-font-semibold'
                            )}
                            onClick={() =>
                              onDownloadTemplate().then((data) => downloadFile(data, 'scale_level_translations_template.xlsx'))
                            }
                          >
                            <DocumentArrowDownIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
                            <span className="tw-block tw-truncate">Download Template</span>
                          </button>
                        )}
                      </MenuItem>
                      {scaleId ? (
                        <MenuItem>
                          {({ active }) => (
                            <button
                              type="button"
                              className={clsx(
                                active ? 'tw-bg-neutral-100 tw-text-neutral-900' : 'tw-text-neutral-700',
                                'tw-group tw-relative tw-flex tw-w-full tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-left tw-text-xs tw-font-semibold'
                              )}
                              onClick={() =>
                                onExportLevels(scaleId).then((data) => downloadFile(data, `scale_${scaleId}_level_translations.xlsx`))
                              }
                            >
                              <ArrowDownTrayIcon className="tw-h-4 tw-w-4" aria-hidden="true" />
                              <span className="tw-block tw-truncate">Export Languages</span>
                            </button>
                          )}
                        </MenuItem>
                      ) : null}
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
