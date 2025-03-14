/**
 * Degreed's CDN-based i18n are localization strings stored on the CDN (Azure Blob Storage) and organized as key-value pairs within JSON files.
 * The actual folder structures of those files facilitate cache busting and versioning (see README.md for more details).
 *
 *  - `resolveUrl()`: resolve the URL using the remote registry lookups
 *  - `loadJson()`: resolve the URL and load the JSON key-value pairs
 */

import { v4 as uuidv4 } from 'uuid';

export type FileKey = string;
export type Bundle = Record<string, string>;

/**
 * Private structure of the '/content/i18n/index.json' registry
 */
interface i18nRegistry {
  locales: string[]; // available locales (enables fallbacks for invalid locales)
  bundles: Record<string, FileKey>; // all areas key-values gathered into single file / locale
  areas: Record<string, FileKey>;
}

export interface i18nFetchParams {
  root: string; // url to server; not including /content/i18n
  locale: string; // full locale (en-US) or fallback look key (en-US -> en -> default)
  bundleName: string; // name of the bundle or area to fetch
}

export const initParams: i18nFetchParams = {
  locale: 'default',
  bundleName: 'web-app',
  root: 'https://degreeddev.blob.core.windows.net',
};

export const buildRegistyUrl = (root: string) => `${root}/content/i18n/index.json?cb=${uuidv4()}`;
export const buildUrl = (root: string, bundle: string, version: string, lang: string) =>
  `${root}/content/i18n/${bundle}/${version}/${lang}.json`;

// ********************************************************************************************************************
// Public API:
//  - resolveUrl()  :  Calculate the URL to latest localization data file
//  - loadJson()    :  Resolve AND laod the specified localized JSON file
// ********************************************************************************************************************

export const i18nCDN = {
  /**
   * Calculate the URL to latest localization JSON bundle file file
   * @returns string URL to the resolved, most-recently updated, requested localization data file
   */
  resolveUrl: async function (options: Partial<i18nFetchParams>): Promise<string> {
    const { root, locale, bundleName } = { ...initParams, ...options, root: options.root || initParams.root };

    /**
     * Search and validate the full locale (en-US) or fallback look key (en-US -> en -> default)
     */
    const resolveLocale = (locale: string, { locales }: i18nRegistry): string => {
      const hasLocale = (name: string) => locales.includes(name);

      if (!hasLocale(locale)) {
        // Use lowercase for locale is camel case not found
        if (hasLocale(locale.toLowerCase())) locale = locale.toLowerCase();
      }

      const [lang] = locale.split('-');
      const found = hasLocale(locale) ? locale : hasLocale(lang) ? lang : 'default';

      return found;
    };

    /**
     * Fetch the `index.json` registry
     */
    const loadRegistryAt = async (rootUrl: string): Promise<i18nRegistry> => {
      try {
        const response = await fetch(buildRegistyUrl(rootUrl));
        const registry = await response.json();

        return registry;
      } catch (error) {
        console.error('Error fetching i18n registry:', error);
        return { locales: ['en'], bundles: {}, areas: {} };
      }
    };

    /**
     * Resolve the URL to the associated localized key-value dictionary (*.json)
     *
     * Note: This is an `async` function because we have to dynamically load the remote
     *       registry to build/resolve the URL
     */
    const resolveBundleUrl = async (locale = 'default', bundleName: string): Promise<string> => {
      const hasBundle = (name?: string) => !!registry.bundles[name || bundleName];
      const makeUrlToVersion = (hashKey: string, resolvedLocale: string) => {
        const bundle = `${hasBundle(bundleName) ? 'bundles/' : ''}${bundleName}`;
        return buildUrl(root, bundle, hashKey, resolvedLocale);
      };
      const registry = await loadRegistryAt(root);

      let hashKey = hasBundle(bundleName) ? registry.bundles[bundleName] : registry.areas[bundleName];
      if (!hashKey) {
        console.warn(`Bundle or area '${bundleName}' not found. Using 'web-app' as default bundlename.`);

        // Need to fallback to ALL key-values gathered into single file / locale
        bundleName = 'web-app';
        hashKey = registry.bundles['web-app'];
      }

      return hashKey ? makeUrlToVersion(hashKey, resolveLocale(locale, registry)) : '';
    };

    return await resolveBundleUrl(locale, bundleName);
  },

  /**
   * Resolve, fetch JSON, and return localized JSON keys/value pairs
   * @param options Partial<Fetchi18nParams>  :  { root: string; locale: string; bundleName: string; }
   * @returns JSON flat, key-value pairs
   */
  loadJson: async function (options: Partial<i18nFetchParams>): Promise<Bundle> {
    // const loadAndDecode = async (url: string) => {
    //   const data = await fetch(url, { headers: { 'Content-Type': 'text/plain; charset=UTF-8' } });
    //   const buffer = await data.arrayBuffer();

    //   const decoder = new TextDecoder();
    //   const text = decoder.decode(buffer);
    //   const results = JSON.parse(text);

    //   return results;
    // };
    // const decoded = await loadAndDecode(urlToVersion);

    const urlToMostRecent = await i18nCDN.resolveUrl(options);
    const loadJSON = async (url: string): Promise<Bundle> => {
      try {
        if (url) {
          const data = await fetch(url);
          const results = await data.json();

          return results;
        }
      } catch (error) {
        console.error(`Error fetching i18n JSON from '${url}'`, error);
      }

      return {};
    };

    return await loadJSON(urlToMostRecent);
  },
};
