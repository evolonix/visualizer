import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { CheckCircleIcon, ChevronDownIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { Language } from '@skills/data-access';

export interface LanguageMenuProps {
  languages: Language[];
  selectedLanguageCode?: string;
  validLanguageCodes?: string[];
  invalidLanguageCodes?: string[];
  onChange?: (languageCode: string) => void;
}

export const LanguageMenu = ({
  languages,
  selectedLanguageCode,
  validLanguageCodes,
  invalidLanguageCodes,
  onChange,
}: LanguageMenuProps) => {
  const selectedLanguage = languages.find(({ languageCode }) => languageCode === selectedLanguageCode);
  const translatedLanguages = languages
    .filter(({ languageCode }) => validLanguageCodes?.concat(invalidLanguageCodes || [])?.includes(languageCode))
    .sort((a, b) => a.name.localeCompare(b.name));
  const notTranslatedLanguages = languages
    .filter(({ languageCode }) => !translatedLanguages.map(({ languageCode }) => languageCode).includes(languageCode))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="tw-leading-none">
      <Popover>
        <PopoverButton className="tw-btn-secondary-outline">
          <span className="tw-truncate">{selectedLanguage?.name}</span>
          <ChevronDownIcon className="-tw-mr-1 tw-h-5 tw-w-5" aria-hidden="true" />
        </PopoverButton>

        <Transition
          enter="tw-transition tw-ease-out tw-duration-200"
          enterFrom="tw-opacity-0 tw-translate-y-1"
          enterTo="tw-opacity-100 tw-translate-y-0"
          leave="tw-transition tw-ease-in tw-duration-150"
          leaveFrom="tw-opacity-100 tw-translate-y-0"
          leaveTo="tw-opacity-0 tw-translate-y-1"
        >
          <PopoverPanel className="tw-absolute tw-left-0 tw-z-10 tw-mt-5 tw-flex tw-w-screen tw-max-w-max tw-px-4">
            <div className="tw-w-screen tw-max-w-7xl tw-flex-auto tw-overflow-hidden tw-rounded-lg tw-bg-white tw-p-4 tw-text-sm tw-leading-6 tw-shadow-lg tw-ring-1 tw-ring-neutral-900/5">
              <div className="tw-mt-2 tw-flex tw-max-h-80 tw-flex-col tw-flex-wrap tw-gap-2 tw-overflow-auto tw-text-sm">
                <label className="tw-py-2 tw-pl-8 tw-pr-2 tw-text-xs tw-font-extrabold tw-uppercase tw-leading-5">Translated</label>
                {translatedLanguages.map((language) => (
                  <PopoverButton
                    key={language.name}
                    className="tw-flex tw-items-center tw-gap-2 tw-p-2 hover:tw-text-blue-600"
                    onClick={() => onChange?.(language.languageCode)}
                  >
                    {invalidLanguageCodes?.includes(language.languageCode) ? (
                      <ExclamationCircleIcon className="tw-h-4 tw-w-4 tw-text-red-700" aria-hidden="true" />
                    ) : validLanguageCodes?.includes(language.languageCode) ? (
                      <CheckCircleIcon className="tw-h-4 tw-w-4 tw-text-purple-700" aria-hidden="true" />
                    ) : (
                      <span className="tw-w-4"></span>
                    )}
                    <span className="tw-truncate">{language.name}</span>
                  </PopoverButton>
                ))}
                {/* </div>

            <div className="tw-mt-2 tw-flex tw-max-h-80 tw-flex-col tw-flex-wrap tw-gap-2 tw-overflow-auto tw-text-sm"> */}
                <label className="tw-py-2 tw-pl-8 tw-pr-2 tw-text-xs tw-font-extrabold tw-uppercase tw-leading-5">Not Translated</label>
                {notTranslatedLanguages.map((language) => (
                  <PopoverButton
                    key={language.name}
                    className="tw-flex tw-items-center tw-gap-2 tw-p-2 hover:tw-text-blue-600"
                    onClick={() => onChange?.(language.languageCode)}
                  >
                    <span className="tw-w-4"></span>
                    <span className="tw-truncate">{language.name}</span>
                  </PopoverButton>
                ))}
              </div>
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  );
};
