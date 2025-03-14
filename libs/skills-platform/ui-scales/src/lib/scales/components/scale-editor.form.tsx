import { FormikErrors, useFormik } from 'formik';
import { Fragment, useCallback, useState } from 'react';

import { ChevronDownIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { Input } from '@degreed/apollo-react-cdk';
import { FileErrors, Language, LanguageRegistry, ScaleLevel, validateLevelsByCount } from '@skills/data-access';

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Template, customTemplate, templates } from '../_templates';

interface ErrorSummaryProps {
  errors: FileErrors | FormikErrors<LanguageRegistry>;
  languages: Language[];
}

const ErrorSummary = ({ errors, languages }: ErrorSummaryProps) => {
  // FileErrors
  if (errors instanceof Array) {
    return (
      <div>
        {errors.map((error, i) => (
          <p key={`file-error-${i}`}>{error.errorMessage}</p>
        ))}
      </div>
    );
  }

  // FormikErrors
  const displayErrorsForProp = (
    [, errors]: [prop: string, errors: string | string[] | FormikErrors<ScaleLevel>[] | undefined],
    index: number
  ) => {
    if (!errors) return null;

    if (typeof errors === 'string') return <p key={`form-error-${index}`}>• {errors}</p>;

    if (errors instanceof Array) {
      return errors.map((error, i) => {
        if (typeof error === 'string') return <p key={`form-error-${index}-${i}`}>• {error}</p>;

        const levelErrors = Object.entries(error).map(([, levelError]) => levelError);
        return levelErrors.map((error, j) => <p key={`file-error-${index}-level-${j}`}>• {error}</p>);
      });
    }

    return null;
  };

  return (
    <>
      {Object.entries(errors as FormikErrors<LanguageRegistry>).map(([key, scaleErrors]) => (
        <div key={`form-errors-${key}`}>
          <strong>{languages.find((l) => l.languageCode === key)?.name}</strong>
          <div>{scaleErrors ? Object.entries(scaleErrors).map((entry, i) => displayErrorsForProp(entry, i)) : null}</div>
        </div>
      ))}
    </>
  );
};

interface ValidationSummaryProps {
  className?: string;
  title: string;
  errors: FileErrors | FormikErrors<LanguageRegistry>;
  languages: Language[];
  danger?: boolean;
}

const ValidationSummary = ({ className, title, errors, languages, danger }: ValidationSummaryProps) => {
  return (
    <div className={clsx(danger ? 'tw-bg-red-100 tw-text-red-900' : 'tw-bg-yellow-100 tw-text-yellow-900', className)}>
      <div
        className={clsx(
          danger ? 'tw-border-red-700' : 'tw-border-yellow-700',
          'tw-space-y-4 tw-rounded-l-lg tw-border-l-8 tw-px-3 tw-py-4'
        )}
      >
        <div className="tw-overflow-hidden">
          <h4 className="tw-flex tw-items-center tw-gap-2 tw-font-semibold">
            {danger ? (
              <ExclamationCircleIcon className="tw-inline-block tw-h-4 tw-w-4 tw-text-red-700" aria-hidden="true" />
            ) : (
              <ExclamationTriangleIcon className="tw-inline-block tw-h-4 tw-w-4 tw-text-yellow-700" aria-hidden="true" />
            )}
            <span>{title}</span>
          </h4>
          <div className="tw-mt-2 tw-flex tw-max-h-96 tw-flex-col tw-flex-wrap tw-gap-2 tw-overflow-auto tw-text-sm">
            <ErrorSummary errors={errors} languages={languages} />
          </div>
        </div>
      </div>
    </div>
  );
};

type ScaleEditorFormProps = {
  selectedLanguageCode: string;
  supportedLanguages: Language[];
  fileErrors: FileErrors;
  attemptedToSave: boolean;
} & Pick<
  ReturnType<typeof useFormik<LanguageRegistry>>,
  'values' | 'errors' | 'touched' | 'isValid' | 'handleChange' | 'handleBlur' | 'resetForm'
>;

// Formik validation errors for Levels; nested in an array
type LevelErrors = { description?: string; name?: string }[] | undefined;

/**
 * Scale Editor Form
 */
export const ScaleEditorForm = ({
  selectedLanguageCode,
  supportedLanguages,
  fileErrors,
  attemptedToSave,
  values,
  errors,
  isValid,
  handleChange,
  handleBlur,
  resetForm,
}: ScaleEditorFormProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(customTemplate);

  // For the current language, get the total level count and enforce the levels to match
  const levelCount = values?.[selectedLanguageCode]?.totalLevelCount || values?.['en'].totalLevelCount;
  const selectedScale = validateLevelsByCount(values?.[selectedLanguageCode] || values?.['en'], levelCount);
  const levels = selectedScale?.levels || [];

  const handleTemplateChange = useCallback(
    (template: Template) => {
      const [, localizations] = template;

      setSelectedTemplate(template);
      resetForm({ values: localizations });
    },
    [resetForm]
  );

  const handleTotalLevelCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to number if possible, otherwise keep string for proper validation
    const value = Number.isInteger(+e.target.value) ? Number(e.target.value) : e.target.value;

    /**
     * Only fire 'levelCount' change for all Scale languages
     *
     * Note: We do not adjust all 'levels', etc here because we want Formik to validate and
     *       show value errors (if any). On submission we will sync all languages to have
     *       the same level count and equivalent changes
     */
    for (const languageCode in values) {
      handleChange({ ...e, target: { ...e.target, name: `[${languageCode}].totalLevelCount`, value } });
    }
  };

  return values ? (
    <div className="tw-grid-apollo tw-bg-neutral-50 tw-pt-10 sm:tw-pt-12">
      {selectedScale?.isPrimary ? (
        <div className="tw-col-span-full tw-mb-8 tw-flex tw-items-center tw-gap-3 tw-overflow-hidden tw-rounded-lg tw-bg-purple-100 tw-pr-4 tw-text-purple-600 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
          <div className="tw-w-1 tw-self-stretch tw-bg-purple-600"></div>
          <InformationCircleIcon className="tw-h-4 tw-w-4" />
          <p className="tw-py-3 tw-text-xs tw-text-purple-800">This is your organization’s current primary scale.</p>
        </div>
      ) : null}

      {/* Display imported file errors */}
      {fileErrors.length ? (
        <ValidationSummary
          className="tw-col-span-full tw-mb-3 tw-rounded-lg md:tw-col-span-6 md:tw-col-start-2 lg:tw-col-span-10 xl:tw-col-span-8 xl:tw-col-start-3"
          title="Imported File Errors"
          errors={fileErrors}
          languages={supportedLanguages}
        />
      ) : null}

      {/* Display form errors */}
      {attemptedToSave && !isValid ? (
        <ValidationSummary
          className="tw-col-span-full tw-mb-3 tw-rounded-lg md:tw-col-span-6 md:tw-col-start-2 lg:tw-col-span-10 xl:tw-col-span-8 xl:tw-col-start-3"
          title="Form Errors"
          errors={errors}
          languages={supportedLanguages}
          danger
        />
      ) : null}

      {!selectedScale?.id ? (
        <div className="tw-col-span-full tw-mb-4 md:tw-col-span-6 md:tw-col-start-2 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
          <div className="tw-flex tw-items-center tw-gap-3 md:tw-flex-col md:tw-items-start">
            <label className="tw-text-xs tw-font-extrabold tw-uppercase md:tw-text-base md:tw-font-bold">Templates</label>
            <div className="tw-hidden tw-h-8 tw-items-center tw-gap-2 tw-rounded-lg tw-border tw-border-neutral-300 tw-bg-white tw-px-1 tw-py-2 md:tw-inline-flex">
              {templates.map((template) => {
                const [label] = template;
                const [selected] = selectedTemplate;

                return (
                  <button
                    key={label}
                    type="button"
                    className={clsx(
                      'tw-inline-flex tw-h-6 tw-items-center tw-gap-3 tw-rounded-md tw-border tw-border-transparent tw-px-4 tw-text-sm tw-font-semibold hover:tw-border-blue-300 hover:tw-text-blue-800 focus:tw-border-blue-800 focus:tw-bg-blue-100 focus:tw-text-blue-900 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-800 disabled:tw-border-dashed disabled:tw-border-neutral-300 disabled:tw-bg-neutral-100 disabled:tw-text-neutral-600',
                      label === selected ? 'tw-border-blue-200 tw-bg-blue-100 tw-text-blue-900' : ''
                    )}
                    onClick={() => handleTemplateChange(template)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="tw-leading-none md:tw-hidden">
              <Menu as="div" className="tw-relative tw-inline-block tw-text-left">
                <div className="tw-flex tw-items-center">
                  <MenuButton className="tw-btn-secondary-outline">
                    <span>{selectedTemplate[0]}</span>
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
                  <MenuItems className="tw-absolute tw-left-0 tw-z-10 tw-mt-2 tw-w-56 tw-origin-top-left tw-divide-y tw-divide-neutral-100 tw-overflow-hidden tw-rounded-xl tw-bg-white tw-shadow-xl tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none">
                    <div className="tw-py-2">
                      {templates.map((template) => {
                        const [label] = template;

                        return (
                          <MenuItem key={label}>
                            {({ active }) => (
                              <button
                                type="button"
                                className={clsx(
                                  active ? 'tw-bg-neutral-100 tw-text-neutral-900' : 'tw-text-neutral-700',
                                  'tw-relative tw-flex tw-w-full tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-left tw-text-xs tw-font-semibold tw-group'
                                )}
                                onClick={() => handleTemplateChange(template)}
                              >
                                <span className="tw-block tw-truncate">{label}</span>
                              </button>
                            )}
                          </MenuItem>
                        );
                      })}
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      ) : null}

      {/* Scale Title */}
      <div className="tw-col-span-full sm:tw-col-span-7 md:tw-col-span-5 md:tw-col-start-2 lg:tw-col-span-8 lg:tw-col-start-2 xl:tw-col-span-6 xl:tw-col-start-3">
        <Input
          id={`[${selectedLanguageCode}].name`}
          labelText="Scale Title"
          placeholder="Levels of Mastery"
          color="purple"
          mode="large"
          required
          value={selectedScale?.name || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          errorText={errors[selectedLanguageCode]?.name ? errors[selectedLanguageCode]?.name : undefined}
          maxLength={300}
        />
      </div>

      {/* Scale Description */}
      <div className="tw-col-span-full md:tw-col-span-7 md:tw-col-start-2 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
        <Input
          id={`[${selectedLanguageCode}].description`}
          rows={3}
          labelText="Scale Description"
          placeholder="This scale describes the levels of mastery for the skill"
          color="purple"
          value={selectedScale?.description || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          errorText={errors[selectedLanguageCode]?.description ? errors[selectedLanguageCode]?.description : undefined}
          maxLength={900}
        />
      </div>

      {/* <!-- How many levels --> */}
      <div className="tw-col-span-full sm:tw-col-span-7 md:tw-col-span-5 md:tw-col-start-2 lg:tw-col-span-8 lg:tw-col-start-2 xl:tw-col-span-6 xl:tw-col-start-3">
        <Input
          id={`[${selectedLanguageCode}].totalLevelCount`}
          labelText="Level Amount"
          placeholder="4"
          color="purple"
          mode="large"
          required
          value={selectedScale?.totalLevelCount || ''}
          onChange={handleTotalLevelCountChange}
          onBlur={handleBlur}
          errorText={errors[selectedLanguageCode]?.totalLevelCount ? errors[selectedLanguageCode]?.totalLevelCount : undefined}
          disabled={selectedScale?.wasPublishedAsPrimary}
          helperText={
            selectedScale?.wasPublishedAsPrimary ? 'The number of levels in a primary source cannot be edited once published.' : ''
          }
        />
      </div>

      {/* Level Information */}
      {levels?.length
        ? levels?.map((level, index) => (
            <Fragment key={index}>
              {/* Level Title */}
              <div className="tw-col-span-1 tw-col-start-1 tw-mt-4 tw-hidden tw-h-9 tw-truncate tw-pb-3 tw-pt-1 tw-text-right tw-text-3xl tw-font-bold tw-text-neutral-500 md:tw-block xl:tw-col-start-2">{`${
                index + 1
              }`}</div>
              <div className="tw-col-span-full sm:tw-col-span-7 md:tw-col-span-5 md:tw-col-start-2 lg:tw-col-span-8 lg:tw-col-start-2 xl:tw-col-span-6 xl:tw-col-start-3">
                <Input
                  id={`[${selectedLanguageCode}].levels.${index}.name`}
                  labelText="Level Title"
                  placeholder="Beginner"
                  color="purple"
                  mode="large"
                  required
                  value={level?.name || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorText={
                    (errors[selectedLanguageCode]?.levels as LevelErrors)?.[index]?.name
                      ? (errors[selectedLanguageCode]?.levels as LevelErrors)?.[index]?.name
                      : undefined
                  }
                  maxLength={300}
                />
              </div>

              {/* Level Description */}
              <div className="tw-col-span-full md:tw-col-span-7 md:tw-col-start-2 lg:tw-col-span-10 lg:tw-col-start-2 xl:tw-col-span-8 xl:tw-col-start-3">
                <Input
                  id={`[${selectedLanguageCode}].levels.${index}.description`}
                  rows={3}
                  labelText="Level Description"
                  placeholder="This level describes the beginner level of mastery for the skill"
                  color="purple"
                  value={level?.description || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorText={
                    (errors[selectedLanguageCode]?.levels as LevelErrors)?.[index]?.description
                      ? (errors[selectedLanguageCode]?.levels as LevelErrors)?.[index]?.description
                      : undefined
                  }
                  maxLength={900}
                />
              </div>
            </Fragment>
          ))
        : null}
    </div>
  ) : null;
};
