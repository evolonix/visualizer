import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';

import { Transition } from '@headlessui/react';
import { FormikErrors, useFormik } from 'formik';
import * as Yup from 'yup';

import { useNavigateOnEscape } from '@degreed/core-react';
import {
  FileErrors,
  FilesViewModel,
  Language,
  LanguageRegistry,
  Nullable,
  Scale,
  ScaleLevel,
  shouldDiscardScale,
  sleep,
  useFilesStore,
  useScale,
  validateScaleForLanguage,
  validateScaleForLanguages,
} from '@skills/data-access';

import { Footer } from '@degreed/apollo-react-cdk';
import { ScaleEditorForm, ScaleEditorHeader, ScaleEditorSkeleton } from './components';

/**
 * Scale Editor with portal + skeleton logic
 * Routing for two (2) urls are supported: `/scales/new`, `/scales/:scaleId/edit`
 */
export function ScaleEditor() {
  const navigate = useNavigate();
  const { scaleId } = useParams();
  const [localizations, api, vm] = useScale(scaleId || 'new');
  const { downloadTemplate, validateLevels: validateWithServer, exportLevels }: FilesViewModel = useFilesStore();
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>('en');
  const [fileErrors, setFileErrors] = useState<FileErrors>([]);

  const isExisting = !!scaleId;
  const showSkeleton = isExisting && vm.showSkeleton;

  // List the properties in order of appearance in the form for the validation summary to display in the correct order
  // Custom required validation is done in the "validate" function, instead of here
  // This is used mainly for type safety and character limits
  const validationSchema = Yup.object<LanguageRegistry>().shape({
    [selectedLanguageCode]: Yup.object<Scale>().shape({
      name: Yup.string().max(300, 'Scale title has a max of 300 characters'),
      description: Yup.string().max(900, 'Scale description has a max of 900 characters'),
      totalLevelCount: Yup.number().typeError('Level amount must be a numerical value'),
      levels: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().max(300, 'Level title has a max of 300 characters'),
          description: Yup.string().max(900, 'Level description has a max of 900 characters'),
        })
      ),
    }),
  });

  const {
    values,
    errors,
    touched,
    dirty,
    isSubmitting,
    isValid,
    submitCount,
    handleSubmit,
    handleChange,
    handleBlur,
    setValues,
    setErrors,
    resetForm,
    setFieldTouched,
    setFieldError,
  } = useFormik<LanguageRegistry>({
    initialValues: localizations as LanguageRegistry,
    validationSchema,
    validate: (values: LanguageRegistry) => {
      // Validate properties in order of appearance in the form for the validation summary to display in the correct order
      const errors = {} as FormikErrors<LanguageRegistry>;

      if (!isSubmitting) {
        // Scale title validation
        // Only flag the default language with errors for the scale title
        if (!values['en']?.name) {
          errors['en'] = { ...errors['en'], name: 'Scale title is required' };
        }

        // Scale totalLevelCount validation
        // Always check the default language for the scale totalLevelCount
        if (levelCount && !values['en']?.totalLevelCount) {
          errors['en'] = { ...errors['en'], totalLevelCount: 'Level amount is required' };
        }

        // Levels validation
        Object.entries(values).forEach(([languageCode, scale]) => {
          const levelErrors = [] as FormikErrors<ScaleLevel>[];

          if (!levelCount) errors[languageCode] = { ...errors[languageCode], totalLevelCount: 'Level amount is required' };

          for (let i = 0; i < levelCount; i++) {
            const level = scale.levels[i];
            if (!level?.name) levelErrors[i] = { ...levelErrors[i], name: `Level ${level?.value || i + 1} title is required` };
          }

          if (levelErrors.length) errors[languageCode] = { ...errors[languageCode], levels: levelErrors };
        });
      }

      return errors;
    },
    onSubmit: (values: LanguageRegistry) => {
      const navigateToUrl = isExisting ? `/scales/${scaleId}` : '/scales';

      // Wait to allow the "saved" indicator to show for a bit...
      // only auto-navigate on success
      const autoNavigate = sleep<Nullable<LanguageRegistry>>(450, (saved) => !!saved && navigate(navigateToUrl));

      api.saveScale(validateScaleForLanguages(values, levelCount), true).then(autoNavigate);
    },
  });
  const levelCount = values?.[selectedLanguageCode]?.totalLevelCount || values?.['en']?.totalLevelCount || 0;

  useNavigateOnEscape(`/scales${scaleId ? `/${scaleId}` : ''}`, dirty);

  const addScaleForLanguage = async (languageCode: string) => {
    const localizations = validateScaleForLanguage(values, languageCode, levelCount);

    await setValues(localizations, true);
  };

  const removeScaleForLanguage = async (languageCode: string) => {
    if (Object.keys(values).includes(languageCode)) {
      delete errors[languageCode];
      await setErrors(errors);

      delete values[languageCode];
      await setValues(values, true);
    }
  };

  // If switching to a new language, then auto-remove current scale if it is pristine
  const switchScaleToLanguage = async (languageCode: string) => {
    const currentLanguage = selectedLanguageCode;
    if (shouldDiscardScale(values[currentLanguage], currentLanguage, localizations)) {
      await removeScaleForLanguage(currentLanguage);
    }

    await addScaleForLanguage(languageCode);
  };

  const handleLanguageChange = async (language: Language) => {
    const currentLanguage = language.languageCode;

    setSelectedLanguageCode(currentLanguage);
    switchScaleToLanguage(currentLanguage);
  };

  const handleImportLanguage = async (data: FormData) => {
    const [localizations, fileErrors] = await validateWithServer(data, values);

    setValues(localizations, true);
    setFileErrors(fileErrors);
  };

  useEffect(() => {
    if (localizations?.['en']?.id) {
      setValues(localizations, false);
    }
  }, [localizations, setValues]);

  return createPortal(
    <>
      {/* // Include this div to show a white background behind the modal, covering the app layout */}
      <div className="tw-fixed tw-inset-0 tw-z-50 tw-h-screen tw-bg-white"></div>
      <div className="tw-absolute tw-left-0 tw-top-0 tw-z-[60] tw-flex tw-min-h-screen tw-w-full tw-flex-col tw-bg-neutral-50">
        <form noValidate onSubmit={handleSubmit}>
          <ScaleEditorHeader
            showSkeleton={showSkeleton}
            supportedLanguages={vm.allSupportedLanguages}
            selectedLanguageCode={selectedLanguageCode}
            isSubmitting={isSubmitting}
            values={values}
            errors={errors}
            setFieldTouched={setFieldTouched}
            setFieldError={setFieldError}
            onLanguageChange={handleLanguageChange}
            onImportLanguage={handleImportLanguage}
            onDownloadTemplate={downloadTemplate}
            onExportLevels={exportLevels}
          />

          <main className="tw-relative tw-flex tw-flex-1 tw-flex-col">
            {showSkeleton ? <ScaleEditorSkeleton /> : null}

            <Transition
              show={!showSkeleton}
              enter="tw-transition-opacity tw-delay-200 tw-duration-300"
              enterFrom="tw-opacity-0"
              enterTo="tw-opacity-100"
              leaveFrom="tw-opacity-100"
              leaveTo="tw-opacity-0"
              as="div"
            >
              <ScaleEditorForm
                selectedLanguageCode={selectedLanguageCode}
                supportedLanguages={vm.allSupportedLanguages}
                values={values}
                errors={errors}
                fileErrors={fileErrors}
                touched={touched}
                isValid={isValid}
                attemptedToSave={submitCount > 0}
                handleChange={handleChange}
                handleBlur={handleBlur}
                resetForm={resetForm}
              />
            </Transition>
          </main>

          <Footer />
        </form>
      </div>
    </>,
    document.body
  );
}
