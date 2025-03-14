/**
 * Degreed's Apollo Design is undercontinuous development and adoption.
 * Some features were released in July 2024, and others in October 2024.
 *
 * We use feature flags to control the rollout of these features.
 */

import { FeatureFlagLookup } from '../models';

/**
 * Register callback to easily check 1..n Apollo feature flags
 * Easy way to lookup and cache all Apollo flags...
 */
export function configureApolloWithFeatureFlags(lookup: FeatureFlagLookup) {
  let enableApolloLayout = false;

  for (const key of Object.keys(FEATURE_FLAGS) as FlagKey[]) {
    const isEnabled = lookup(FEATURE_FLAGS[key]);
    markAsEnabled(key, isEnabled);
    enableApolloLayout ||= isEnabled;
  }

  // Special flag to check if ANY version of Apollo is enabled...
  // NOTE: This assumes that ADMIN and LEARNER are always enabled together...

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useApolloLayout(enableApolloLayout);
}

// ******************************************
// Quick accessors to the Apollo flags...
// ******************************************

// NOTE: This is also a conditional mutator
export const useApolloLayout = (isEnabled?: boolean) => setEnabled('APOLLO_LAYOUT', isEnabled);

// @deprecated
export const useApolloLayout_Refresh = () => isFlagEnabled('APOLLO_LAYOUT_REFRESH');

/**
 * Should we use v2 or v3 Apollo refresh?
 */
export const useApolloLayout_Learner_V2 = () => isFlagEnabled('APOLLO_LAYOUT_LEARNER_V2') || isFlagEnabled('APOLLO_LAYOUT_REFRESH');
export const useApolloLayout_Admin_V2 = () => isFlagEnabled('APOLLO_LAYOUT_ADMIN_V2') || isFlagEnabled('APOLLO_LAYOUT_REFRESH');

export const useApolloLayout_Learner_V3 = () => isFlagEnabled('APOLLO_LAYOUT_LEARNER_V3');
export const useApolloLayout_Admin_V3 = () => isFlagEnabled('APOLLO_LAYOUT_ADMIN_V3');

// ******************************************
// Private helpers
// ******************************************

/**
 * Features flags are configured on LaunchDarkly and are associated with 'groups'.
 *
 * Note: Users join the 'groups' and then have access to the features associated with
 * the 'flags' associated with each 'groups'.
 *
 * This document details the flags, groups, and provides snapshots of the UX for Apollo Navigation
 * @see https://degreedjira.atlassian.net/wiki/spaces/CCO/pages/6051463185/Learner+Hub+Navigation+LD+flags
 *
 */
export const FEATURE_FLAGS = {
  APOLLO_LAYOUT: 'apollo_refresh', // global flag for all Apollo layout refreshes

  // July, 2024 flag
  APOLLO_LAYOUT_REFRESH: 'lxp-layout-refresh', // @deprecated ldFlagsService.lxpLayoutRefresh

  // Oct, 2024 unified flags
  APOLLO_LAYOUT_LEARNER_V2: 'apollo_refresh_v2_learner',
  APOLLO_LAYOUT_LEARNER_V3: 'apollo_refresh_v3_learner',
  APOLLO_LAYOUT_ADMIN_V2: 'apollo_refresh_v2_admin',
  APOLLO_LAYOUT_ADMIN_V3: 'apollo_refresh_v3_admin',
} as const;

type FlagKey = keyof typeof FEATURE_FLAGS;

/**
 * Internal registry of Apollo feature flags
 */
const features: Record<FlagKey, boolean> = {} as Record<FlagKey, boolean>;

function isFlagEnabled(flag: FlagKey) {
  return features[FEATURE_FLAGS[flag] as FlagKey];
}

/**
 * Save the flag value to the Window object...
 * needed for lazy loaded modules and routing
 */
function markAsEnabled(flag: FlagKey, enabled = true) {
  features[FEATURE_FLAGS[flag] as FlagKey] = enabled;
  return enabled;
}

/**
 * Smart mutator to mark ONLY if defined
 */
function setEnabled(flag: FlagKey, enabled?: boolean) {
  if (enabled !== undefined) markAsEnabled(flag, enabled);
  return isFlagEnabled(flag);
}
