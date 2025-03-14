import i18n from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';

import { loadAllTranslations, TranslationBundle } from './translation.service';

export type TranslateFn = (defaultValue: string, key: string, params?: Record<string, unknown>) => string;
export type UseTranslateResults = { t: TranslateFn; lang: string; translations: TranslationBundle | null };

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
 * Initialize, load, and return translations for the given language
 * NOTE: the `t()` function will return either the `defaultValue` OR he `key`  if the translation is not found
 * @param lang
 * @param enableFallback - useful for processes that need to know if the translation was found or not
 * @returns
 */
export const useTranslations = (lang = 'en', enableFallback = true): UseTranslateResults => {
  const t: TranslateFn = useCallback(
    (defaultValue: string, key: string, params?: Record<string, unknown>): string => {
      const translation = i18n.t(key, params);
      return translation !== key ? translation : enableFallback ? defaultValue : key;
    },
    [enableFallback]
  );
  const [translations, setTranslations] = useState<TranslationBundle | null>(null);

  useEffect(() => {
    initForReact(lang);
    i18n.changeLanguage(lang || 'en');

    loadAllTranslations(lang || 'en', i18n.addResources).then((t) => {
      setTranslations(t);
    });
  }, [lang]);

  return { t, lang, translations };
};
