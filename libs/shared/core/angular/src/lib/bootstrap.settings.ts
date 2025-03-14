import { HttpContextToken } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { join } from './utils/url.utils';

export interface OrgInfoShort {
  name: string;
  orgId: number;
}

export interface BootstrapSettings {
  authToken: string;
  lang: string;
  rootUrl: string;
  cdnUrl: string;
  appFolder: string;
  analyticsEndpoint: string;
  organizationId: number;
  orgsToManage: OrgInfoShort[];
  hasChannel: boolean;
  userProfileKey: number;
  hasSkillAnalytics: boolean;
  isProduction?: boolean;
  productVersion?: string;
  configuration?: unknown; // @see Apollo Layout Configuration
}

/**
 * Injectable version of 'rootUrl' configured in external environment.ts
 * Allows libraries to inject settings specified in the ENVIRONMENT
 */
export const BOOTSTRAP_SETTINGS = new InjectionToken<BootstrapSettings>('apiSettings');

/**
 * Used by the AuthInterceptor to determine if authentication
 * is required for the outgoing HTTP request. If required, the access token
 * is injected into the HTTP Headers
 *
 * Note: This context is actually assigned in the RulesDataService
 */
export const AUTHENTICATION_REQUIRED = new HttpContextToken<boolean>(() => false);

@Injectable()
export class BootstrapSettingsService {
  constructor(@Inject(BOOTSTRAP_SETTINGS) public settings: BootstrapSettings) {}

  /**
   * Return the URL to the asset with the provided path on the CDN
   *
   * @param path Asset path
   * @returns URL to the asset
   */
  assetUrl(relativeUrl: string): string {
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
     * Example relativeUrl values:
     *    2_Cat_Curious.png
     *    images/logo.png
     *
     * Example return values:
     *    https://degreedcdn.com/engage/assets/2_Cat_Curious.png
     *    https://degreedcdn.com/engage/assets/images/logo.png
     */
    const { cdnUrl, appFolder } = this.settings;
    return join(cdnUrl, appFolder, 'assets', relativeUrl);
  }
}
