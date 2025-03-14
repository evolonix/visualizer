/* eslint-disable @typescript-eslint/no-explicit-any */
import { LxpAuthUser, LxpOrgInfo, LxpOrgSettings } from '../../models';
import { booleanFromString } from './boolean-from-string';

// **************************************************************************
// Data Types for Raw Auth (from server)
// **************************************************************************

export type RawSettings = Record<string, unknown>;
export type RawPermissions = string[];
export type RawOrgInfo = {
  organizationId: number;
  settings: RawSettings;
  permissions: RawPermissions;
};
export type RawAuthUser = {
  orgInfo: RawOrgInfo[];
  defaultOrgId: number;
  viewerProfile: any;
  isEngaged: boolean;
};

/**
 * Convert RawAuth data to LxPAthUser instance
 *
 * Transform raw org settings from string values to their natural types
 * This should eventually be done on the back end via db-provided type info
 */
export function fixupAuthUser(rawAuthUser: RawAuthUser): LxpAuthUser {
  const orgInfo: LxpOrgInfo[] = rawAuthUser.orgInfo?.map(
    (o: RawOrgInfo) =>
      ({
        ...o,
        settings: o.settings ? mapTypedOrgSettings(o.settings) : {},
        permissions: o.permissions ? mapOrgPermissions(o) : {},
      }) as LxpOrgInfo
  );
  const defaultOrgInfo = orgInfo?.find((o: LxpOrgInfo) => o.organizationId === rawAuthUser.defaultOrgId);

  return {
    ...rawAuthUser,
    viewerProfile: {
      ...rawAuthUser.viewerProfile,
      // duplicate isEngaged under viewerProfile object so we don't break the old angular component
      isEngaged: rawAuthUser.isEngaged,
    },
    orgInfo,
    // Provide default org info as dedicated property
    defaultOrgInfo,
  } as unknown as LxpAuthUser;
}

/**
 * Convert org setting values, which arrive as strings over the wire, into their appropriate data types.
 * @param settings
 * @returns LxpOrgSettings
 */
function mapTypedOrgSettings(settings: Record<any, unknown>): LxpOrgSettings {
  const target = settings as Record<string, any>;
  const remapped = Object.keys(target).reduce((acc, key) => {
    const bValue = booleanFromString(target[key]);
    return { ...acc, [key]: bValue };
  }, {});

  return {
    ...remapped,

    // These are NOT booleans
    learnInBalanceUrl: target.learnInBalanceUrl,
    opportunitiesActivityStartDate: new Date(target.opportunitiesActivityStartDate),
    academiesBannerImage: target.academiesBannerImage,
    careersFooterMessage: target.careersFooterMessage,
    clientAdobeAnalyticsId: target.clientAdobeAnalyticsId,
    clientGoogleAnalyticsId: target.clientGoogleAnalyticsId,
    clientTypeOverride: target.clientTypeOverride,
    defaultAssignmentsSort: target.defaultAssignmentsSort,
    learnInSsoUrl: target.learnInSsoUrl,
    organizationBrandColor: target.organizationBrandColor,
    organizationEndorsedPicture: target.organizationEndorsedPicture,
    minimumAggregatedLearningInsightsUserCount: target.minimumAggregatedLearningInsightsUserCount,
    profileOverviewTabDefault: target.profileOverviewTabDefault,
  } as unknown as LxpOrgSettings;
}

/**
 * LxP publishes permissions as upperCamelCase string[]
 * @returns camelCase Record<string, boolean>
 */
function mapOrgPermissions(orgInfo: { permissions: string[] }) {
  const lookup = orgInfo.permissions.reduce((acc, permission) => ({ ...acc, [toCamelCase(permission)]: true }), {});
  return lookup;
}

/**
 * Convert a string to camelCase
 * Permissions are an array of strings in upperCamelCase
 */
function toCamelCase(str: string): string {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}
