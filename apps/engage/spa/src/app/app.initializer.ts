import { BootstrapSettings, join } from '@degreed/core-angular';
import { freezeStores } from '@degreed/rsm';

import { environment } from '../environments/environment';

/**
 * Load bootstrap configuration from the `window.nxEngageBootstrap` object.
 * NOTE: we ONLY use 'window.nxEngageBootstrap.rootUrl' for production/staging;
 *       this allows the environment.local to point to a local API server
 */
export function initBootstrapSettings(): BootstrapSettings {
  const isProduction = environment.production;
  const rootUrl = window?.nxEngageBootstrap?.rootUrl;

  return {
    ...window?.nxEngageBootstrap,
    rootUrl,
    isProduction,
  };
}

/**
 * App Initializer that supports Angular bootstrap while configurations
 * are being loaded from the server.
 *
 * @param settings
 * @returns
 */
export function initApplication(settings: BootstrapSettings) {
  updateWebpack(settings);

  if (!settings.isProduction) {
    console.log('initAppSettings', settings);

    freezeStores();
  }

  return () => {
    // NOTE: we could also call to the server here and resolve upon completion
    // @TODO - load i18n resources, etc
    return Promise.resolve(settings);
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
declare let __webpack_public_path__: any;

/**
 * For lazy-loaded modules, we need wepack to use specific cdn paths when loading dynamic chunks
 * NOTE: normally the loader uses baseHref, but we are using a custom cdnUrl.
 */
function updateWebpack({ cdnUrl, appFolder }: BootstrapSettings) {
  /**
   * Example cdnUrl values expected for different environments:
   *    json server       = [blank string]
   *    .net server       = https://localhost:44300
   *    Staging server    = https://staging.degreedcdn.com/
   *    Production server = https://degreedcdn.com/
   *
   * Example appFolder values expected for different environments:
   *    json server       = [blank string]
   *    .net server       = /engage
   *    Staging server    = /engage
   *    Production server = /engage
   *
   * Example __webpack_public_path__ value:
   *    https://degreedcdn.com/engage/
   *
   * Append the appFolder to the cdnUrl to get the correct path for the lazy-loaded modules on the CDN.
   * NOTE: __webpack_public_path__ must end with a slash if not blank
   */
  __webpack_public_path__ = cdnUrl === '' ? '' : join(cdnUrl, appFolder, '/');
}
