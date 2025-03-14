import { freeze } from 'immer';
import { useCallback, useEffect, useState } from 'react';

import { LayoutAspect, LayoutBrand, LayoutConfiguration } from '@degreed/apollo-react-cdk';
import { useLocalStorage } from '@degreed/core-react';

import { BrandingState, loadBranding } from './branding';
import { useTranslations } from './i18n';
import { configureApolloWithFeatureFlags, loadLxpPermissions, useApolloLayout as shouldUseApolloFor_Skills } from './services';

import { AcmOptions, BaseOptions, LxpOptions, SkillsPlatformOptions } from './layout-configuration.model';
import {
  updateHelpMenu,
  updatei18n,
  updateNavigationBranding,
  updateUser,
  updateVisibility,
  updateWithFilters,
} from './layout-configuration.utils';

import LxpToAcmConfig from './configs/acm-lxp.json'; // Users arriving to ACM from LXP
import AcmConfig from './configs/acm.json'; // Users launching ACM
import SkillsPlatformConfig from './configs/skills-platform.json';

const APOLLO_LAYOUT_BRANDING = (orgId: number | string | undefined) => `apollo-layout-branding-${orgId || ''}`;

export interface UseApolloLayoutResponse {
  showApolloLayout: boolean;
  layoutAspect: LayoutAspect | undefined;
}

/**
 * LXP to ACM config does not contain a learner aspect.
 * Only use this configuration if the user is an LXP admin and is navigating to ACM's admin view.
 */
function loadACMConfiguration(isLxpAdmin: boolean, isAdminPath: boolean): LayoutConfiguration {
  return (isLxpAdmin && isAdminPath ? LxpToAcmConfig : AcmConfig) as LayoutConfiguration;
}

/**
 * Custom Hook to load Apollo Layout configuration for ACM
 */
export const useApolloLayout_Acm = (options: AcmOptions, lang = 'en'): UseApolloLayoutResponse => {
  const i18n = useTranslations(lang, options.translate);
  const lxpOptions = useLxpInformation(options);
  const [branding] = useLocalStorage<Partial<BrandingState> | null>(APOLLO_LAYOUT_BRANDING(options.user.companyId), null);
  const loadConfiguration = useCallback(
    () => loadACMConfiguration(options.isLxpAdmin, options.isAdminPath),
    [options.isLxpAdmin, options.isAdminPath]
  );
  const [response, setResponse] = useState<UseApolloLayoutResponse>(() => initApolloSkeleton(loadConfiguration(), options, branding));

  // When ACM options are ready, update the layout aspect
  useEffect(() => {
    if (lxpOptions?.authUser && i18n) {
      let updated = loadConfiguration();

      updated = updateVisibility(updated) as LayoutConfiguration;

      updated = updatei18n(updated, i18n.t);
      updated = updateUser(updated, lxpOptions.authUser);

      updated = updateNavigationBranding(updated, lxpOptions.branding?.navigation);
      updated = updateWithFilters(updated, { lxp: lxpOptions, acm: options });

      updated = updateHelpMenu(updated, lxpOptions.authUser?.defaultOrgId, lxpOptions.supportInfo);

      const showApolloLayout = options.isFeatureFlagOn.ACMLayout && (!options.isLxpAdmin || options.isFeatureFlagOn.LXPAdminLayout);
      const layoutAspect = options.isAdminPath ? updated?.admin : updated?.learner;

      setResponse({ layoutAspect, showApolloLayout });
    }
  }, [options, lxpOptions, i18n, loadConfiguration]);

  return response;
};

/**
 * Custom Hook to load Apollo Layout configuration for Skills Platform
 */
export const useApolloLayout_SkaaS = (lang: string, options: SkillsPlatformOptions): UseApolloLayoutResponse => {
  const i18n = useTranslations(lang, options.translate);
  const [branding] = useLocalStorage<Partial<BrandingState> | null>(APOLLO_LAYOUT_BRANDING(options.orgId), null);
  const [configuration] = useState(() => SkillsPlatformConfig);
  const lxpOptions = useLxpInformation(options); // async loading of LXP options

  const [response, setResponse] = useState<UseApolloLayoutResponse>(() => initApolloSkeleton(configuration, options, branding));

  // When Skills Platfroms options are ready, update the layout aspect
  useEffect(() => {
    if (lxpOptions?.authUser && i18n) {
      let updated = configuration as LayoutConfiguration;

      updated = updateVisibility(updated) as LayoutConfiguration;

      updated = updatei18n(updated, i18n.t);
      updated = updateUser(updated, lxpOptions.authUser);

      updated = updateNavigationBranding(updated, lxpOptions.branding?.navigation);
      updated = updateWithFilters(updated, { lxp: lxpOptions });

      updated = updateHelpMenu(updated, lxpOptions.orgInfo.organizationId, lxpOptions.supportInfo);

      const showApolloLayout = shouldUseApolloFor_Skills();
      const layoutAspect = options.isAdminPath ? updated?.admin : updated?.learner;

      setResponse({ layoutAspect, showApolloLayout });
    }
  }, [options.isAdminPath, lxpOptions, configuration, i18n]);

  return response;
};

/**
 * Async load authenticated user, org info, branding, and featureFlags from LXP endpoints
 */
export const useLxpInformation = ({ isLxpApiEnabled, featureFlags, orgId }: BaseOptions): LxpOptions | null => {
  const [cachedBranding, setOfflineBranding] = useLocalStorage<Partial<BrandingState> | null>(APOLLO_LAYOUT_BRANDING(orgId), null);
  const [options, setOptions] = useState<LxpOptions | null>(null);

  useEffect(() => {
    (async () => {
      const { authUser, supportInfo, orgInfo } = await loadLxpPermissions(orgId, isLxpApiEnabled);
      const branding = await loadBranding(authUser, orgInfo, cachedBranding, isLxpApiEnabled);

      // Initialize Apollo lookup feature flags for future access
      if (featureFlags.apollo) {
        const updateByKey = (key: string): boolean => featureFlags.apollo[key];
        configureApolloWithFeatureFlags(updateByKey);
      }

      // Publish full set of LxP options that were loaded asynchronously.
      setOptions({ authUser, orgInfo, supportInfo, featureFlags, branding });
      setOfflineBranding(branding, false);
    })();
  }, [orgId, isLxpApiEnabled, featureFlags, cachedBranding, setOfflineBranding]);

  return options;
};

/**
 * Build correct initial Layout without navigation items...
 * since those are async filtered and updated later
 */
const initApolloSkeleton = (
  configuration: LayoutConfiguration | null,
  options: SkillsPlatformOptions | AcmOptions,
  state?: Partial<BrandingState> | null
): UseApolloLayoutResponse => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const updated = configuration ? updatei18n(configuration, (val) => val) : { admin: {}, learner: {} };

  const isAdmin = options.isAdminPath || (options as AcmOptions).isLxpAdmin;
  const layoutAspect = isAdmin ? updated?.admin : updated?.learner;

  return freeze({
    layoutAspect: {
      ...layoutAspect,
      brand: {
        ...layoutAspect?.brand,
        ...(state?.navigation as LayoutBrand), // since the cache contains all data from Org Branding Views
      },
      navigation: {
        top: [], // clear until ACM options are ready
      },
    },
    showApolloLayout: true,
  });
};
