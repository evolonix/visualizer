import localTranslationsEn from './data/local-translations-en.json';
import localTranslationsFr from './data/local-translations-fr.json';

export type TranslationBundle = Record<string, string>;

type i18nAddResourcesFn = (lng: string, ns: string, resources: unknown) => void;
// type AllSettledResponse = { status: 'fulfilled'; value: unknown } | { status: 'rejected'; reason: unknown };

/**
 * Load desired lang translations first, then load all other translations in background
 * @param lang
 * @param addResources
 */
export const loadAllTranslations = async <T = TranslationBundle>(lang: string, addResources: i18nAddResourcesFn): Promise<T> => {
  const translations = (await loadTranslations(lang)) as T;

  addResources(lang, 'translation', translations);

  // Why is this batch loading needed; when an on-demand load works fine?

  // const otherLocales = LOCALES.filter((locale) => locale !== lang);
  // batchLoadTranslations(otherLocales, addResources);

  return translations;
};

// ****************************************************
// Private Utils
// ****************************************************

const sameOriginRequestInit: RequestInit = {
  credentials: 'same-origin',
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
const paramsFor = (culture: string) =>
  new URLSearchParams({
    format: 'Json',
    culture,
    'dg-casing': 'camel', // Make sure to lower camel case response properties
  });

// const LOCALES = [
//   'ar',
//   'cs',
//   'da',
//   'en',
//   'en_gb',
//   'es',
//   'es_419',
//   'fr',
//   'de',
//   'el',
//   'he',
//   'hu',
//   'id',
//   'it',
//   'ja',
//   'ko',
//   'nl',
//   'pl',
//   'pt',
//   'ro',
//   'ru',
//   'sv',
//   'th',
//   'tr',
//   'vi',
//   'zh',
// ] as const;

/**
 * Internal flag to track if the API is available
 */
let apiAvailable = true;

/**
 * Load all translations in background (silently)
 */
// const batchLoadTranslations = async (locales: string[], addResources: i18nAddResourcesFn) => {
//   const loadByLocale = async (locale: string) => {
//     const translations = await loadTranslations(locale);
//     addResources(locale, 'translation', translations);
//   };

//   if (apiAvailable) {
//     const registerResources = (list: AllSettledResponse[]) => {
//       list.forEach((result, i) => {
//         if (result.status !== 'rejected') {
//           addResources(locales[i], 'translation', result.value);
//         }
//       });
//     };

//     // If the API is not available, we will not try to fetch translations again
//     Promise.allSettled(locales.map(loadByLocale)).then(registerResources);
//   }
// };

/**
 * For local development, the API may not be available. Fail gracefully.
 */
const loadTranslations = async (culture = 'en'): Promise<unknown> => {
  let translations = culture === 'fr' ? localTranslationsFr : culture === 'en' ? localTranslationsEn : {};

  if (apiAvailable) {
    const url = '/api/translations/translate';
    const response = await fetch(`${url}?${paramsFor(culture)}`, sameOriginRequestInit);

    if (response.status === 200) {
      translations = await response.json();
    } else apiAvailable = false;
  }

  return translations;
};
