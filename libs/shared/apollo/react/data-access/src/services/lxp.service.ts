import { isUndefined } from '@ngneat/elf';
import * as LDClient from 'launchdarkly-js-client-sdk';

import {
  buildFeatureFlagsFrom,
  CompositeFeatureFlagKeys,
  CompositeFeatureFlags,
  initOrgInfo,
  LxpAuthUser,
  LxpOrgInfo,
  LxpSupportInfo,
} from '../models';

// !! In ACM and Skills Platform, LXP APIs are not available for local development.
//    Use local JSON files instead.
import localAuthenticatedUser from './data/local-authenticated-user.json';
import localFeatureFlags from './data/local-feature-flags.json';
import localSupportInfo from './data/local-support-info.json';
import { fixupAuthUser, RawAuthUser } from './utils';

export const sameOriginRequestInit: RequestInit = {
  credentials: 'same-origin',
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export interface LaunchDarklyOptions {
  licenseKey: string;
  environment: string;
  targets: Record<string, string>;
}

/**
 * Load user, orgInfo, supportInfo, and featureFlags from LXP endpoints
 */
export const loadLxpPermissions = async (orgId: number | undefined, apiEnabled = true) => {
  const authUser = await getAuthUser(apiEnabled);
  const orgInfo = resolveOrgInfo(authUser, orgId, initOrgInfo);
  const supportInfo = await getSupportInfo(orgInfo, orgInfo.organizationId, apiEnabled);

  return {
    authUser,
    orgInfo,
    supportInfo,
  } as const;
};

const getAuthUser = async (apiEnabled = true): Promise<LxpAuthUser> => {
  let rawUser = localAuthenticatedUser as unknown as RawAuthUser;

  if (apiEnabled) {
    try {
      const response = await fetch('/api/account/getauthenticateduser?dg-casing=camel', sameOriginRequestInit);
      if (response.status === 200) {
        rawUser = (await response.json()) as RawAuthUser;
      }
    } catch (error) {
      handleFetchError(error);
    }
  }

  // Use a sample JSON file for local development since we can't easily hit the needed service with valid auth cookies
  const user = fixupAuthUser(rawUser);

  // @TODO - silly hack to warn ACM
  if (user?.viewerProfile.vanityUrl === 'sampleuser') {
    console.error('Apollo Configuration: unable to load authenticated user');
  }

  return Promise.resolve(user);
};

const getSupportInfo = async (orgInfo: LxpOrgInfo, orgId: number, apiEnabled = true): Promise<LxpSupportInfo> => {
  let rawSupportInfo = localSupportInfo as LxpSupportInfo;
  if (apiEnabled) {
    // Use an actual API call to LXP's getSupportInfo
    try {
      const canViewKnowledgeCenter = orgInfo?.permissions.viewKnowledgeCenter ?? false;
      const params = new URLSearchParams({
        orgId: orgId.toString(),
        // localeId,
        includeKC: canViewKnowledgeCenter.toString(),
        'dg-casing': 'camel', // Make sure to lower camel case response properties
      });
      const response = await fetch(`/api/organizations/getsupportinfo?${params}`, sameOriginRequestInit);

      if (response.status === 200) rawSupportInfo = await response.json();
    } catch (error) {
      handleFetchError(error);
    }

    return rawSupportInfo;
  }

  // Use a sample JSON file for local development since we can't easily hit the needed service with valid auth cookies
  return localSupportInfo;
};

export const getGroupNames = (user: LxpAuthUser): string[] => {
  // null or empty, return []
  if (!user?.viewerGroups || user?.viewerGroups.length === 0) {
    return [];
  }

  return user.viewerGroups
    .filter((viewerGroup) => viewerGroup.group.name.toLowerCase().includes('pre-release'))
    .map((viewerGroup) => viewerGroup.group.name);
};

/**
 * Get Launch Darkly feature flags for LXP using the Launch Darkly client SDK
 */
export const loadFeatureFlags = async (
  authUser: LxpAuthUser,
  orgInfo: LxpOrgInfo,
  launchDarklyConfig: {
    licenseKey: string;
    contextKey: string;
    requestedFlags: CompositeFeatureFlagKeys; // @see LoadFeatureFlagCallback
  },
  apiEnabled = true
): Promise<CompositeFeatureFlags> => {
  if (apiEnabled) {
    const context: LDClient.LDContext = {
      kind: 'user',
      key: launchDarklyConfig.contextKey,
      // Custom attributes
      Org: orgInfo.organizationId || -1,
      Role: orgInfo.orgRole,
      PreReleaseGroups: getGroupNames(authUser),
    };

    return new Promise<CompositeFeatureFlags>((resolve) => {
      const client = LDClient.initialize(launchDarklyConfig.licenseKey, context);
      client
        .waitForInitialization(2)
        .then(() => {
          const getFlagValue = (flag: string) => client.variation(flag, false);
          resolve(buildFeatureFlagsFrom(launchDarklyConfig.requestedFlags, getFlagValue));
        })
        .catch((err: unknown) => {
          console.error(JSON.stringify(err));
          resolve({} as CompositeFeatureFlags);
        });
    });
  }

  return Promise.resolve(localFeatureFlags as unknown as CompositeFeatureFlags);
};

/**
 * If failed, redirect to the LXP login and set returnUrl to the current page. This will redirect them back after retrieving a renewed session cookie.
 */
const handleFetchError = (error: unknown) => {
  // Apollo code should not redirect to /account/login
  //
  // const returnUrl = `/develop/${window.location.hash}`;
  // window.location.href = `/account/login?returnUrl=${encodeURIComponent(returnUrl)}`;
};

/**
 * For the specified window.href and authenticated user, determine the orgId allowed for the user
 * @returns [boolean, string] - [isOrgView, orgId]
 */
export const resolveOrgInfo = (
  user: LxpAuthUser | undefined,
  orgId: number | undefined,
  initOrg: (orgId: number) => LxpOrgInfo
): LxpOrgInfo => {
  if (isUndefined(orgId)) {
    // match orgs/:d in the url to get the org id
    const url = window.location.href;
    const match = url ? url.match(/orgs\/(\d+)/) : null;
    const computed = match ? Number(match[1]) : user?.defaultOrgId || 1;

    orgId = computed;
  }

  const orgInfo = user?.orgInfo.find((x) => x.organizationId === orgId);

  return orgInfo || initOrg(orgId);
};
