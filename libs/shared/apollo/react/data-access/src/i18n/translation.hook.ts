import i18n, { TFunction } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';

import { loadAllTranslations, TranslationBundle } from './translation.service';

export type TranslateFn = (defaultValue: string, key: string, params?: Record<string, unknown>) => string;
export type UseTranslateResults = { t: TranslateFn; lang: string; translations: TranslationBundle } | null;

let initialized = false;
/**
 * 1x Initialization of i18next for React
 */
const initForReact = (lang: string) => {
  if (initialized) return;

  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      lng: lang, // if you're using a language detector, do not define the lng option
      fallbackLng: 'en',

      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    });

  initialized = true;
};

/**
 * Build a cached translation view model
 */
export const useTranslations = (lang = 'en', translate?: TFunction, enableFallback = false): UseTranslateResults => {
  const [vm, setTranslationsVM] = useState<UseTranslateResults>(null);
  const translateFn = useCallback<TranslateFn>(
    (defaultValue: string, key: string, params?: Record<string, unknown>): string => {
      /**
       * Note: Apollo expects a translate function with a default value as the first parameter.
       * If the application provides a translate function (and initializes its own translation services),
       * this function expects the key as the first parameter.
       * We want to wrap the translate function to support a default value as the first parameter.
       */

      const translation = translate ? translate(key, params) : i18n.t(key, params);
      return translation !== key ? translation : enableFallback ? defaultValue : key;
    },
    [translate, enableFallback]
  );

  useEffect(() => {
    init18nFeatures(lang, translate).then((translations) => {
      setTranslationsVM({ lang, t: translateFn, translations });
    });
  }, [translate, lang, translateFn]);

  return vm;
};

/**
 * If the translate function is not provided, we will auto-initialize i18next for Apollo translations.
 * Only re-initialize if we are building our own translate function
 */
async function init18nFeatures(lang: string, translate: TFunction | undefined): Promise<TranslationBundle> {
  if (translate) return {} as TranslationBundle;

  initForReact(lang); // Only re-initialize if we are building our own translate function
  i18n.changeLanguage(lang || 'en');

  return loadAllTranslations(lang || 'en', i18n.addResources);
}
