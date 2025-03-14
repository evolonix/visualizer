import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { LayoutConfiguration, LayoutNavigationItem, LayoutSwitcherItem } from '../layout.model';

import {
  AnalyticsGuard,
  AuthService,
  AuthUser,
  ContextService,
  LDFlagsService,
  NavigationService,
  TargetsService,
  TeamFlagsService,
  TranslateService,
  WebEnvironmentService,
} from './config.types';
import { DEGREED_CONFIGURATION } from './degreed.config';

let layout$: Observable<LayoutConfiguration>;

/**
 * Return a LayoutConfiguration object based on the user's default organization
 * NOTE: Currently we use compiled configuration files.
 *       !! This configuration should be constructed on the server
 *
 * @returns Observable<LayoutConfiguration>
 */
export const loadAppLayoutConfiguration = (
  auth: AuthService,
  translate: TranslateService,
  environment: WebEnvironmentService,
  targets: TargetsService,
  navigation: NavigationService,
  featureFlag: LDFlagsService,
  analyticsGuard: AnalyticsGuard,
  context: ContextService,
  teamFlags: TeamFlagsService
): Observable<LayoutConfiguration> => {
  const customizeLayout = (user: AuthUser | undefined): Observable<LayoutConfiguration> => {
    let config = DEGREED_CONFIGURATION;

    // Update i18n first to get any placeholder variables used in translations that need to be replaced afterward
    config = updatei18n(config, translate);
    config = updateUser(config, user, environment);
    config = updateNavigation(config, user, featureFlag, teamFlags);
    config = updateSwitcher(config, user, auth, featureFlag, analyticsGuard, context);

    return updateUrls(config, user, environment, targets, navigation, analyticsGuard);
  };

  if (!layout$) {
    layout$ = auth.authUser$.pipe(switchMap(customizeLayout));
  }

  return layout$;
};

/**
 * Replace all `<user>` tokens with current user's vanityUrl
 * Replace profile nav item image with current user's picture
 * @param configuration LayoutConfiguration
 * @param user AuthUser
 */
function updateUser(
  configuration: LayoutConfiguration,
  user: AuthUser | undefined,
  environment: WebEnvironmentService
): LayoutConfiguration {
  const userName = user?.viewerProfile.vanityUrl || '';
  const organizationId = user?.defaultOrgId || '';
  let text = JSON.stringify(configuration);
  text = text.replace(/<user>/g, userName);
  text = text.replace(/<orgId>/g, organizationId.toString());
  configuration = JSON.parse(text) as LayoutConfiguration;

  let profileImage = user?.viewerProfile.picture;
  if (profileImage) {
    if (profileImage.startsWith('~')) {
      profileImage = environment.getBlobUrl(profileImage);
    }

    const profileItem = configuration.navigation?.top.find((item) => item.text === 'Profile');
    if (profileItem) profileItem.image = profileImage;
  }

  return configuration;
}

function updateNavigation(
  configuration: LayoutConfiguration,
  user: AuthUser | undefined,
  featureFlag: LDFlagsService,
  teamFlags: TeamFlagsService
) {
  const userName = user?.viewerProfile.vanityUrl || '';
  const useLearnerHub = featureFlag.useLearnerHub;

  const homeItem = configuration.navigation?.top.find((item) => item.featureKey === 'home') || {};
  for (const subItem of homeItem.subItems || []) {
    switch (subItem.featureKey) {
      case 'home-dashboard':
        subItem.routerLink = useLearnerHub ? `/${userName}/learnerhub/home` : subItem.routerLink;
        break;
      case 'home-assignments':
        subItem.routerLink = useLearnerHub ? `/${userName}/learnerhub/assignments` : subItem.routerLink;
        break;
    }
  }

  // TODO: Not used until Q3 version of layout component when product switcher goes away?
  // const showAcademies = !!user && featureFlag.showAcademies;

  const showOpportunities = window.location.href.includes('/career/opportunities');
  const showSkillCoach =
    user?.isSkillInventoryClient || user?.isSkillAnalyticsClient
      ? user?.isManager
      : user?.isManager &&
        user?.defaultOrgInfo.settings.enableTeamSpace &&
        (user?.defaultOrgInfo.settings.skillCoachFullOrgAccess || teamFlags.teamSpaceEnabled);

  const showAssistant = featureFlag.lxpDegreedAssistant;
  const showNotifications = !!user;
  const showProfile = !!user;

  if (configuration.navigation && configuration.navigation.top) {
    const updates = configuration.navigation.top.reduce((list: LayoutNavigationItem[], item) => {
      let result: LayoutNavigationItem | null = item;
      switch (item.featureKey) {
        case 'opportunities':
          result = showOpportunities ? result : null;
          break;
        case 'skill-coach':
          result = showSkillCoach ? result : null;
          break;
        case 'assistant':
          result = showAssistant ? result : null;
          break;
        case 'notifications':
          result = showNotifications ? result : null;
          break;
        case 'profile':
          result = showProfile ? result : null;
          break;
      }

      return result ? [...list, result] : list;
    }, []);

    configuration.navigation.top = updates;
  }

  return configuration;
}

function updateSwitcher(
  configuration: LayoutConfiguration,
  user: AuthUser | undefined,
  auth: AuthService,
  featureFlag: LDFlagsService,
  analyticsGuard: AnalyticsGuard,
  context: ContextService
) {
  const showAnalytics = analyticsGuard.isAuthorized;
  const showLearnIn = featureFlag.showLearnInProductSwitcher;
  const showExtendedEnterprise = user?.hasChannel;
  const showManageOrg =
    (auth.userCanManageLearnerOrg || auth.userCanViewReporting || auth.userCanManageSkillInventory || auth.userCanManageSkillAnalytics) &&
    !context.isChannel();
  const showDegreedSkills = user?.defaultOrgInfo?.settings.enableSkillsPlatform && user?.defaultOrgInfo?.permissions.manageSkillsPlatform;

  if (configuration.switcherNavigation && configuration.switcherNavigation.items) {
    const updates = configuration.switcherNavigation.items.reduce((list: LayoutSwitcherItem[], item) => {
      let result: LayoutSwitcherItem | null = item;
      switch (item.productKey) {
        case 'lxp':
          item.subItems = (item.subItems || []).reduce((subList: LayoutNavigationItem[], subItem) => {
            let result: LayoutNavigationItem | null = subItem;
            switch (subItem.featureKey) {
              case 'manage-lxp':
                result = showManageOrg ? result : null;
                break;
              case 'extended-enterprise':
                result = showExtendedEnterprise ? result : null;
                break;
              case 'advanced-analytics':
                result = showAnalytics ? result : null;
                break;
            }
            return result ? [...subList, result] : subList;
          }, []);
          break;
        case 'academies':
          result = showLearnIn ? result : null;
          break;
        case 'skills-platform':
          result = showDegreedSkills ? result : null;
          break;
      }

      return result ? [...list, result] : list;
    }, []);

    configuration.switcherNavigation.items = updates;
  }

  return configuration;
}

/**
 * Update the navigation items with the correct URLs
 */
function updateUrls(
  configuration: LayoutConfiguration,
  user: AuthUser | undefined,
  environment: WebEnvironmentService,
  targets: TargetsService,
  navigation: NavigationService,
  analyticsGuard: AnalyticsGuard
): Observable<LayoutConfiguration> {
  const organizationId = user?.defaultOrgId || '1';
  const toLayoutConfig = ([featuredPlanId, learnInSSOUrl]: [number, string]) => {
    let text = JSON.stringify(configuration);
    text = text.replace(/<featuredPlanId>/g, featuredPlanId.toString());
    text = text.replace(/<helpDeskUrl>/g, environment.getZendeskUrl(''));
    text = text.replace(/<analyticsUrl>/g, analyticsGuard.analyticsUrl);
    text = text.replace(/<learnInSSOUrl>/g, learnInSSOUrl);
    // This replacement relies on i18n being updated beforehand
    text = text.replace(/{{orgName}}/g, user?.defaultOrgInfo?.name || 'LXP');

    return JSON.parse(text) as LayoutConfiguration;
  };
  const featureID$ = targets.getBrowseTarget(organizationId).pipe(
    map((target) => target.targetId),
    tap((targetId) => {
      const showFeatured = targetId && !user?.isSkillAnalyticsClient && !user?.isSkillInventoryClient;
      if (!showFeatured && configuration.navigation?.top) {
        configuration.navigation.top = configuration.navigation.top.filter((item) => item.featureKey !== 'featured');
      }
    })
  );
  const learnInSSOUrl$ = navigation.getLearnInSSOUrl(organizationId);

  return combineLatest([featureID$, learnInSSOUrl$]).pipe(map(toLayoutConfig));
}

/**
 * For any `i18n` field, replace the associated field with translated value
 * @returns LayoutConfiguration
 */
function updatei18n(configuration: LayoutConfiguration, translate: TranslateService): LayoutConfiguration {
  const MAPPINGS = {
    i18n: 'text',
    headerTitleI18n: 'headerTitle',
    buttonI18n: 'buttonText',
  };
  const i18n = i18nWithLog(translate);

  // Depth-first node tree scanning
  // For each node, check if it has an translation field
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traverse = (node: Record<string, any>) => {
    for (const key in node) {
      if (typeof node[key] === 'object') {
        traverse(node[key]);
      } else {
        switch (key) {
          case 'i18n':
          case 'headerTitleI18n':
          case 'buttonI18n':
            // eslint-disable-next-line no-case-declarations
            const field = MAPPINGS[key];
            node[field] = i18n(node[key], node[field]);
            break;
        }
      }
    }
    return node;
  };

  return traverse(configuration);
}

/**
 * Translation util that logs missing translations
 */
const i18nWithLog = (translate: TranslateService) => (key: string, fallback: string) => {
  let value = key ? translate.instant(key) : fallback;
  if (value === key || value === '') {
    console.error(`i18n: ${key} ==> ${value}, fallback: ${fallback}`);
    value = fallback;
  }

  return value || fallback;
};
