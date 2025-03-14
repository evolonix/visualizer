/* eslint-disable @typescript-eslint/no-explicit-any */

import { LayoutAspect, LayoutConfiguration } from '@degreed/apollo-react-cdk';

import { NavigationState, navigationToAspect } from './branding';
import { TranslateFn } from './models';
import { LxpAuthUser, LxpSupportInfo } from './models/lxp';

import { AcmOptions, LayoutFilterOptions, LxpOptions } from './layout-configuration.model';


import { Permissions_forAcmAdmin, Permissions_forAcmLearner, Permissions_forLxpAdmin, Permissions_forLxpLearner, resolveOrgInfo } from './permission.factory';
import { checkPermssionsFor } from './permission.guards';
import { LogTracker } from './tracker.utils';

const _lostKeys = new LogTracker('i18n warning');

export function updatei18n(configuration: LayoutConfiguration, translate: TranslateFn): LayoutConfiguration {
  const MAPPINGS = {
    i18n: 'text',
    headerTitleI18n: 'headerTitle',
    buttonI18n: 'buttonText',
    titleI18n: 'titleText',
  };
  const i18n = i18nWithLog(translate);
  const visitor = (node: LayoutNode, key: string) => {
    // For each node, check if it has an translation field
    switch (key) {
      case 'i18n':
      case 'headerTitleI18n':
      case 'buttonI18n':
      case 'titleI18n': {
        const field = MAPPINGS[key];
        node[field] = i18n(node[key], node[field]);
        break;
      }
    }
  };

  configuration = traverse(configuration, visitor);

  // Warn if any i18n keys are missing from the localization bundle!
  _lostKeys.report();

  return configuration;
}


/**
 * Replace all `<orgId>` tokens with url-specific orgId or default orgId
 * This can be called at app initialization or at any time the user navigates to a new org
 *
 * @param configuration T = LayoutConfiguration | LayoutAspect
 * @param user AuthUser
 */
export function updateOrgId<T = LayoutConfiguration>(
  configuration: T,
  user: LxpAuthUser | undefined,
  forceUpdate = false
): T {
  // Determine which org the user has access
  const [isOrgView, orgId] = resolveOrgInfo(user);
  if (isOrgView || forceUpdate) {
    const visitLinks = (node: LayoutNode, key: string) => {
      switch (key) {
        case 'href':
        case 'routerLink':
          {
            const text: string = node[key] || '';
            if (text?.includes('<orgId>')) {
              node[key] = text.replace('<orgId>', orgId);
            }
          }
          break;
      }
    };

    // Only do this the url starts with `orgs/:id`
    configuration = traverse(configuration, visitLinks);
  }

  return configuration;
}


/**
 * For all navigation nodes, set `visible` to true unless explicitly set to false
 */
export function updateVisibility(configuration: LayoutConfiguration | LayoutAspect): LayoutConfiguration | LayoutAspect {
  const isAspect = (configuration: LayoutConfiguration | LayoutAspect ): configuration is LayoutAspect => {
    return !(configuration as LayoutConfiguration)['admin'] && !(configuration as LayoutConfiguration)['learner'];
  }
  const visitNavigation = (node: LayoutNode) => {
    // Force explicity visibility settings
    if (node.visible !== false) node.visible = true;
  };
  
  if (isAspect(configuration)) {
    traverse(configuration.navigation, visitNavigation);
    traverse(configuration.features, visitNavigation);
  } else {
    traverse(configuration.admin, visitNavigation);
    traverse(configuration.learner, visitNavigation);
  }

  return configuration;
}


export function updateNavigationBranding(config: LayoutConfiguration, branding: NavigationState | undefined): LayoutConfiguration {
  if (branding) {
    config.admin = config.admin ? navigationToAspect(branding, config.admin) : undefined;
    config.learner = config.learner ? navigationToAspect(branding, config.learner) : undefined;
  }
  return config;
}




/**
 * Replace all `<user>` tokens with current user's vanityUrl from their viewerProfile
 * * Replace all `<orgId>` tokens with current user's defaultOrgId
 * @param configuration LayoutConfiguration
 * @param authUser AuthUser
 */
export function updateUser(configuration: LayoutConfiguration, user: LxpAuthUser): LayoutConfiguration {
  const hasProfile = !!user?.viewerProfile;
  const userName = user?.viewerProfile.vanityUrl || '';

  const visitLinks = (node: LayoutNode, key: string) => {
    switch (key) {
      case 'href':
      case 'routerLink': {
        const text: string | undefined = node[key];
        if (text?.includes('<user>') && hasProfile) node[key] = text.replace('<user>', userName);
        if (text?.includes('<orgId>')) node[key] = text.replace('<orgId>', user?.defaultOrgId.toString());
        break;
      }
    }
  };

  // @TODO - need to update the profile image
  //
  // const visitDGATs = (node: LayoutNode) => {
  //   switch (node.dgat) {
  //     case 'global.navigation.learner.sidebar.profile': { // Update Profile image
  //       let profileImage = user?.viewerProfile.picture;
  //       if (hasProfile && profileImage) {
  //         if (profileImage.startsWith('~')) {
  //           profileImage = environment.getBlobUrl(profileImage);
  //           node.image = profileImage;
  //         }
  //       }
  //       break;
  //     }
  //   }
  // };

  configuration = traverse(configuration, visitLinks);
  // configuration = traverse(configuration, visitDGATs);

  return configuration;
}


/**
 * Apply feature flags, org permissions, and user settings.
 * Note: This configuration has three aspects: ACM Admin, ACM Learner, and LXP Admin
 */
export const updateWithFilters = (configuration: LayoutConfiguration, { acm, lxp }: LayoutFilterOptions) => {
  configuration = updateLxpAdminNavigation(configuration, lxp); // Aspect comes from lxp.json, acm-lxp.json or skills-platform.json
  
  if (acm) {
    configuration = updateAcmLearnerNavigation(configuration, acm); // Aspect comes from acm.json
    configuration = updateAcmAdminNavigation(configuration, acm); // Aspect comes from acm.json
  }
  
  return configuration;
};


// *************************************************
// Private Utilities
// *************************************************

/**
 * Update the Degreed "Admin" view (instead of the Learner view) items 
 * 
 * NOTE: This is for the React SKaaS application which does NOT have a Learner view
 *       Some items require admin access based on feature flags and user permissions
 */
function updateLxpAdminNavigation(configuration: LayoutConfiguration, lxp: LxpOptions) {
  const guards = Permissions_forLxpAdmin(lxp); 
  const [checkPermissions, showPermissionLog]  = checkPermssionsFor('LxP Admin');
  
  const visitDGATs = (node: LayoutNode, key: string) => {
    if (key === 'dgat') {
      switch (node.dgat) {
        // Insights (menu):
        case 'global.navigation.admin.sidebar.dashboard':                    checkPermissions( node, [guards.insights ]);                            break;
        case 'global.navigation.admin.sidebar.dashboard.learning':           checkPermissions( node, [guards.insights.child('learning') ]);          break;
        case 'global.navigation.admin.sidebar.dashboard.skills':             checkPermissions( node, [guards.insights.child('skills') ]);            break;
        case 'global.navigation.admin.sidebar.dashboard.skill-trends':       checkPermissions( node, [guards.insights.child('skill-trends') ]);       break;

        // People (menu):
        case 'global.navigation.admin.sidebar.people':                       checkPermissions( node, [guards.people] );                              break;
        case 'global.navigation.admin.sidebar.people.users':                 checkPermissions( node, [guards.people.child('users')] );               break;
        case 'global.navigation.admin.sidebar.people.groups':                checkPermissions( node, [guards.people.child('groups')] );              break;
        case 'global.navigation.admin.sidebar.people.segments':              checkPermissions( node, [guards.people.child('segments')] );            break;
        case 'global.navigation.admin.sidebar.people.user-attributes':       checkPermissions( node, [guards.people.child('manage-attributes')] );    break;
        case 'global.navigation.admin.sidebar.people.permissions':           checkPermissions( node, [guards.people.child('permissions')] );         break;
        // Catalog (menu):
        case 'global.navigation.admin.sidebar.catalog':                      checkPermissions( node, [guards.catalog] );                             break;
        case 'global.navigation.admin.sidebar.catalog.content':              checkPermissions( node, [guards.catalog.child('content')] );            break;
        case 'global.navigation.admin.sidebar.catalog.academies':            checkPermissions( node, [guards.catalog.child('academies')] );          break;  
        case 'global.navigation.admin.sidebar.catalog.pathways':             checkPermissions( node, [guards.catalog.child('pathways')] );           break;  
        case 'global.navigation.admin.sidebar.catalog.plans':                checkPermissions( node, [guards.catalog.child('plans')] );              break;  
        case 'global.navigation.admin.sidebar.catalog.skill-dev':            checkPermissions( node, [guards.catalog.child('skill-dev')] );          break;  

        // Skills (menu):
        case 'global.navigation.admin.sidebar.skills':                       checkPermissions( node, [guards.skills] );                              break;
        case 'global.navigation.admin.sidebar.skills.dashboard':             checkPermissions( node, [guards.skills.child('dashboard')] );           break;
        case 'global.navigation.admin.sidebar.skills.inventory':             checkPermissions( node, [guards.skills.child('inventory')] );           break;
        case 'global.navigation.admin.sidebar.skills.scales':                checkPermissions( node, [guards.skills.child('scales')] );              break;
        case 'global.navigation.admin.sidebar.skills.skill-list':            checkPermissions( node, [guards.skills.child('org-skills')] );          break;
        case 'global.navigation.admin.sidebar.skills.roles':                 checkPermissions( node, [guards.skills.child('roles')] );               break;
        case 'global.navigation.admin.sidebar.skills.skill-standards':       checkPermissions( node, [guards.skills.child('skill-standards')] );     break;
        case 'global.navigation.admin.sidebar.skills.publish':               checkPermissions( node, [guards.skills.child('publish')] );             break;
        case 'global.navigation.admin.sidebar.skills.settings':              checkPermissions( node, [guards.skills.child('settings')] );            break;

        // Content MarketPlace (menu):
        case 'global.navigation.admin.sidebar.content-marketplace':          checkPermissions( node, [guards.marketplace] );                         break;  

        // Automation (menu):
        case 'global.navigation.admin.sidebar.automations':                  checkPermissions( node, [guards.automations] );                         break;  

        // Reporting (menu):
        case 'global.navigation.admin.sidebar.reporting':                    checkPermissions( node, [guards.reporting] );                           break;
        case 'global.navigation.admin.sidebar.reporting.reports':            checkPermissions( node, [guards.reporting.child('reports')] );          break;
        case 'global.navigation.admin.sidebar.reporting.presets':            checkPermissions( node, [guards.reporting.child('presets')] );          break;
        case 'global.navigation.admin.sidebar.reporting.categories':         checkPermissions( node, [guards.reporting.child('categories')] );       break;
        case 'global.navigation.admin.sidebar.reporting.ftp':                checkPermissions( node, [guards.reporting.child('ftp')] );              break;
        case 'global.navigation.admin.sidebar.reporting.configurations':     checkPermissions( node, [guards.reporting.child('configurations')] );   break;
        case 'global.navigation.admin.sidebar.reporting.segments':           checkPermissions( node, [guards.reporting.child('segments')] );         break;
        case 'global.navigation.admin.sidebar.reporting.advanced-analytics': checkPermissions( node, [guards.reporting.child('analytics')] );        break;

        // Integrations (menu):
        case 'global.navigation.admin.sidebar.integrations':                 checkPermissions( node, [guards.integrations]);                          break;
        case 'global.navigation.admin.sidebar.integrations.connected':       checkPermissions( node, [guards.integrations.child('connected')]);       break;
        case 'global.navigation.admin.sidebar.integrations.directory':       checkPermissions( node, [guards.integrations.child('directory')]);       break;
        case 'global.navigation.admin.sidebar.integrations.api-keys':        checkPermissions( node, [guards.integrations.child('api-keys')]);        break;
        case 'global.navigation.admin.sidebar.integrations.file-upload':     checkPermissions( node, [guards.integrations.child('file-upload')]);     break;
        case 'global.navigation.admin.sidebar.integrations.file-log':        checkPermissions( node, [guards.integrations.child('file-log')]);        break;
        case 'global.navigation.admin.sidebar.integrations.webhooks':        checkPermissions( node, [guards.integrations.child('webhooks')]);        break;

        // Settings (menu):
        case 'global.navigation.admin.sidebar.settings':                     checkPermissions( node, [guards.settings] );                             break;
        case 'global.navigation.admin.sidebar.settings.branding':            checkPermissions( node, [guards.settings.child('branding')]);            break;
        case 'global.navigation.admin.sidebar.settings.home':                checkPermissions( node, [guards.settings.child('home')]);                break;
        case 'global.navigation.admin.sidebar.settings.help-menu':           checkPermissions( node, [guards.settings.child('help-menu')]);           break;
        case 'global.navigation.admin.sidebar.settings.communication':       checkPermissions( node, [guards.settings.child('communication')]);       break;
        case 'global.navigation.admin.sidebar.settings.faq':                 checkPermissions( node, [guards.settings.child('faq')]);                 break;
        case 'global.navigation.admin.sidebar.settings.messaging':           checkPermissions( node, [guards.settings.child('messaging')]);           break;
        case 'global.navigation.admin.sidebar.settings.security':            checkPermissions( node, [guards.settings.child('security')]);            break;

        // Extended Enterprise (menu):
        case 'global.navigation.admin.sidebar.extended-enterprise':          checkPermissions( node, [guards.extendedEnterprise] );                   break;

        // Help (menu):
        case 'global.navigation.admin.sidebar.help':                  
        case 'global.navigation.admin.sidebar.help.knowledge-center':   
        case 'global.navigation.admin.sidebar.help.privacy-policy':     
        case 'global.navigation.admin.sidebar.help.cookie-notice':      
        case 'global.navigation.admin.sidebar.help.faq':                
        case 'global.navigation.admin.sidebar.help.custom-link':        
        case 'global.navigation.admin.sidebar.help.support-phone':      
        case 'global.navigation.admin.sidebar.help.support-email':           break;  // No guards
      }
    }
  };  

  return showPermissionLog( 
    traverse(configuration, visitDGATs)
  );
}

/**
 * Update the navigation items based on feature flags and user permissions
 */
export function updateLxpLearnerNavigation(
  configuration: LayoutConfiguration,
  options: LxpOptions
) {
  const guards = Permissions_forLxpLearner({ ...options, isProduction: false, isChannel: false });
  const [checkPermissions, showPermissionLog] = checkPermssionsFor('LxP Learner', false);
  
  const visitDGATs = (node: LayoutNode, key: string) => {
    if (key === 'dgat') {
      switch (node.dgat) {

        // Features 
        case 'global.navigation.learner.features.search':                     break;
        case 'global.navigation.learner.features.add-content':                break;
        case 'global.navigation.learner.features.beta':                       break;
        case 'global.navigation.learner.features.footer-branding':            break;
        case 'global.navigation.learner.features.sidebar-branding':           break;
        case 'global.navigation.learner.features.show-admin-view':            checkPermissions( node, [guards.features.child('show-admin-view')] );        break;

        // Home (menu)
        case 'global.navigation.learner.sidebar.home':                        checkPermissions( node, [guards.home] );                                     break;
        case 'global.navigation.learner.sidebar.home.my-learning':            checkPermissions( node, [guards.home.child('my-learning')] );                break;
        case 'global.navigation.learner.sidebar.home.assignments':            checkPermissions( node, [guards.home.child('assignments')] );                break;
        case 'global.navigation.learner.sidebar.home.saved':                  checkPermissions( node, [guards.home.child('saved')] );                      break;
        case 'global.navigation.learner.sidebar.home.shared':                 checkPermissions( node, [guards.home.child('shared')] );                     break;
        case 'global.navigation.learner.sidebar.home.pathways':               checkPermissions( node, [guards.home.child('pathways')] );                   break;
        case 'global.navigation.learner.sidebar.home.plans':                  checkPermissions( node, [guards.home.child('plans')] );                      break;
        case 'global.navigation.learner.sidebar.home.groups':                 checkPermissions( node, [guards.home.child('groups')] );                     break;

        // Featured (menu)
        case 'global.navigation.learner.sidebar.featured':                    checkPermissions( node, [guards.featured] );                                 break;

        // Discover (menu)
        case 'global.navigation.learner.sidebar.discover':                    checkPermissions( node, [guards.discover] );                                 break;

        // Skill Coach(menu)
        case 'global.navigation.learner.sidebar.skill-coach':                 checkPermissions( node, [guards.skillCoach] );                               break;
        case 'global.navigation.learner.sidebar.skill-coach.members':         checkPermissions( node, [guards.skillCoach.child('members')] );              break;
        case 'global.navigation.learner.sidebar.skill-coach.team-skills':     checkPermissions( node, [guards.skillCoach.child('team-skills')] );          break;
        case 'global.navigation.learner.sidebar.skill-coach.assignments':     checkPermissions( node, [guards.skillCoach.child('assignments')] );          break;
        case 'global.navigation.learner.sidebar.skill-coach.learning-insights': checkPermissions( node, [guards.skillCoach.child('learning-insights')] );  break; 
        case 'global.navigation.learner.sidebar.skill-coach.skill-insights':  checkPermissions( node, [guards.skillCoach.child('skill-insights')] );       break;

        // Degreed Assistant (menu)
        case 'global.navigation.learner.sidebar.assistant':                   checkPermissions( node, [guards.assistant] );                                break;

        // Opportunities (menu)
        case 'global.navigation.learner.sidebar.opportunities':               checkPermissions( node, [guards.opportunities] );                            break;
        case 'global.navigation.learner.sidebar.opportunities.marketplace':   checkPermissions( node, [guards.opportunities.child('marketplace')] );       break;
        case 'global.navigation.learner.sidebar.opportunities.browse':        checkPermissions( node, [guards.opportunities.child('browse')] );            break;
        case 'global.navigation.learner.sidebar.opportunities.mentoring':     checkPermissions( node, [guards.opportunities.child('mentoring')] );         break;
        case 'global.navigation.learner.sidebar.opportunities.open-insights': checkPermissions( node, [guards.opportunities.child('open-insights')] );     break;
        case 'global.navigation.learner.sidebar.opportunities.engagement-insights': checkPermissions( node, [guards.opportunities.child('engagement-insights')] );   break;

        // Notifications (menu)
        case 'global.navigation.learner.sidebar.notifications':               checkPermissions( node, [guards.notifications] );                            break;

        // Profile (menu)
        case 'global.navigation.learner.sidebar.profile':                     checkPermissions( node, [guards.profile] );                                  break;
        case 'global.navigation.learner.sidebar.profile.overview':            checkPermissions( node, [guards.profile.child('overview')] );                break;
        case 'global.navigation.learner.sidebar.profile.skills':              checkPermissions( node, [guards.profile.child('skills')] );                  break;
        case 'global.navigation.learner.sidebar.profile.collection':          checkPermissions( node, [guards.profile.child('collection')] );              break;
        case 'global.navigation.learner.sidebar.profile.activity':            checkPermissions( node, [guards.profile.child('activity')] );                break;
        case 'global.navigation.learner.sidebar.profile.flex-ed':             checkPermissions( node, [guards.profile.child('flex-ed')] );                 break;
        case 'global.navigation.learner.sidebar.profile.settings':            checkPermissions( node, [guards.profile.child('settings')] );                break;
        case 'global.navigation.learner.sidebar.profile.my-plan':             checkPermissions( node, [guards.profile.child('my-plan')] );                 break;
        case 'global.navigation.learner.sidebar.profile.logout':              checkPermissions( node, [guards.profile.child('logout')] );                  break;

        // Help (menu)
        case 'global.navigation.learner.sidebar.help':                        break;
        case 'global.navigation.learner.sidebar.help.knowledge-center':       break;
        case 'global.navigation.learner.sidebar.help.privacy-policy':         break;
        case 'global.navigation.learner.sidebar.help.cookie-notice':          break;
        case 'global.navigation.learner.sidebar.help.faq':                    break;
        case 'global.navigation.learner.sidebar.help.custom-link':            break;
        case 'global.navigation.learner.sidebar.help.support-phone':          break;
        case 'global.navigation.learner.sidebar.help.support-email':          break;                          
      }
    }
  };

  const visitLinks = (node: LayoutNode, key: string) => {
    const userName = options.authUser?.viewerProfile.vanityUrl || '';
    const updateLink = (link: string) => node.routerLink = link;

    if (key === 'dgat') {
      switch (node.dgat) {
        case 'global.navigation.learner.sidebar.home.my-learning':            updateLink(`/${userName}/learnerhub/home`);                         break;
        case 'global.navigation.learner.sidebar.home.assignments':            updateLink(`/${userName}/learnerhub/assignments`);                  break;
      }
    }
  }

  return showPermissionLog(
    traverse(
      traverse(configuration, visitDGATs), 
      visitLinks
    )
  );

}


/**
 * Update the ACM "Learner" navigation items based on feature flags and user permissions
 */
function updateAcmLearnerNavigation(configuration: LayoutConfiguration, acm: AcmOptions) {
  const guards = Permissions_forAcmLearner(acm); 
  const [checkPermissions, showPermissionLog]  = checkPermssionsFor('ACM Learner');

  const visitDGATs = (node: LayoutNode, key: string, parent?: LayoutNode) => {
    if (key === 'dgat') {
      switch (node.dgat) {
        case 'global.navigation.learner.sidebar.home':                checkPermissions( node, [guards.home]);                           break;
        case 'global.navigation.learner.sidebar.marketplace':         checkPermissions( node, [guards.marketplace]);                    break;
        case 'global.navigation.learner.sidebar.academies':           checkPermissions( node, [guards.academies]);                      break;
        case 'global.navigation.learner.sidebar.team-insights':       checkPermissions( node, [guards.teamInsights]);                   break;

        case 'global.navigation.learner.sidebar.approvals':           checkPermissions( node, [guards.approvals]);                      break;
        case 'global.navigation.learner.sidebar.approvals.programs':  checkPermissions( node, [guards.approvals.child('programs')]);  break;
        case 'global.navigation.learner.sidebar.approvals.resources': checkPermissions( node, [guards.approvals.child('resources')]); break;

        case 'global.navigation.learner.sidebar.permissions':         checkPermissions( node, [guards.permissions]);                    break;

        case 'global.navigation.learner.sidebar.account':             checkPermissions( node, [guards.account]);                        break;
        case 'global.navigation.learner.sidebar.account.settings':    checkPermissions( node, [guards.account.child('settings')]);      break;
        case 'global.navigation.learner.sidebar.account.logout':      checkPermissions( node, [guards.account.child('logout')]);        break;
        
        case 'global.navigation.learner.features.show-admin-view':    checkPermissions( node, [guards.showAdminView]);                  break;
      }
    }
  };

  return showPermissionLog( 
    traverse(configuration, visitDGATs)
  );
}

/**
 * Update the ACM "Admin" view (instead of the Learner view) items requiring admin access based on feature flags and user permissions
 */
function updateAcmAdminNavigation(configuration: LayoutConfiguration, acm: AcmOptions) {
  const guards = Permissions_forAcmAdmin(acm); 
  const [checkPermissions, showPermissionLog]  = checkPermssionsFor('ACM Admin');

  const visitDGATs = (node: LayoutNode, key: string, parent?: LayoutNode) => {
    if (key === 'dgat') {
      switch (node.dgat) {
        case 'global.navigation.admin.sidebar.learning':              checkPermissions( node, [guards.learning]);                       break;
        case 'global.navigation.admin.sidebar.learning.marketplace':  checkPermissions( node, [guards.learning.child('marketplace')]);  break;
        case 'global.navigation.admin.sidebar.learning.academies':    checkPermissions( node, [guards.learning.child('academies')]);    break;
        
        case 'global.navigation.admin.sidebar.people':                checkPermissions( node, [guards.people]);                         break;
        case 'global.navigation.admin.sidebar.licenses':              checkPermissions( node, [guards.licenses]);                       break;
        case 'global.navigation.admin.sidebar.incentives':            checkPermissions( node, [guards.incentives]);                     break;            

        case 'global.navigation.admin.sidebar.approvals':             checkPermissions( node, [guards.approvals]);                      break;
        case 'global.navigation.admin.sidebar.approvals.programs':    checkPermissions( node, [guards.approvals.child('programs')]);    break;
        case 'global.navigation.admin.sidebar.approvals.resources':   checkPermissions( node, [guards.approvals.child('resources')]);   break;

        case 'global.navigation.admin.sidebar.reports':               checkPermissions( node, [guards.reports]);                        break;
        case 'global.navigation.admin.sidebar.admin-settings':        checkPermissions( node, [guards.settingsAdmin]);                  break;
        case 'global.navigation.admin.sidebar.qa':                    checkPermissions( node, [guards.qa]);                             break;
        case 'global.navigation.admin.sidebar.developer-admin':       checkPermissions( node, [guards.settignsDeveloper]);              break;
      }
    }
  };

  return showPermissionLog(
    traverse(configuration, visitDGATs)
  );
}


/**
 * Update the navigation items with the correct URLs
 */
export function updateUrls(
  configuration: LayoutConfiguration,
  user: LxpAuthUser,
  featuredPlanId: number,
  learnInSSOUrl: string,
  analyticsUrl: string
) {
  const showFeatured =
    !!(featuredPlanId &&
    !user?.isSkillAnalyticsClient &&
    !user?.isSkillInventoryClient);

  const visitor = (node: LayoutNode, key: string) => {
    const showNode = (isVisible: boolean | undefined) => node.visible = !!isVisible;

    const text = () => node[key];
    if (key === 'dgat') {
      switch (node.dgat) {
        case 'global.navigation.learner.sidebar.featured':
          showNode(showFeatured);
          break;
      }
    } else {
      switch (key) {
        // This 'text' replacement relies on i18n being updated beforehand
        case 'text':
          node[key] = text().replace(
            '{{orgName}}',
            user?.defaultOrgInfo?.name || 'LXP'
          );
          break;
        case 'routerLink':
        case 'href':
          node[key] = text()
            .replace('<analyticsUrl>', analyticsUrl)
            .replace('<learnInSSOUrl>', learnInSSOUrl)
            .replace( '<featuredPlanId>', featuredPlanId.toString());
          break;
      }
    }
  };

  return traverse(configuration, visitor);
}
/**
 * config = updateHelpMenu(config, organizationId, helpMenu)
 * Update the help menu items based on the organization's support info
 */
export function updateHelpMenu(configuration: LayoutConfiguration, organizationId: number | null, supportInfo: Partial<LxpSupportInfo>) {
  if (!organizationId) supportInfo = { phone: '800.311.7061' };

  const visitDGATs = (node: LayoutNode, key: string, parent?: LayoutNode) => {
    
    const updateByKey = (field: string, value: any, allowEmpty = false) => {
      const isVisible = (value || allowEmpty);

      node.visible = isVisible;
      if (isVisible) node[field] = value || '';
    };
    if (key === 'dgat') {
      switch (node.dgat) {
        case 'global.navigation.admin.sidebar.help.knowledge-center':
        case 'global.navigation.learner.sidebar.help.knowledge-center':
          updateByKey('href', supportInfo?.helpLink);
          break;
        case 'global.navigation.admin.sidebar.help.faq':
        case 'global.navigation.learner.sidebar.help.faq':
          updateByKey('href', supportInfo?.faq);
          break;
        case 'global.navigation.admin.sidebar.help.cookie-notice':
        case 'global.navigation.learner.sidebar.help.cookie-notice':
          node.visible = supportInfo?.showCookieLink;
          break;
        case 'global.navigation.admin.sidebar.help.custom-link':
        case 'global.navigation.learner.sidebar.help.custom-link':
          updateByKey('text', supportInfo?.customText);
          updateByKey('href', supportInfo?.customLink);
          break;
        case 'global.navigation.admin.sidebar.help.support-phone':
        case 'global.navigation.learner.sidebar.help.support-phone':
          updateByKey('text', supportInfo?.phone);
          updateByKey('href', supportInfo?.phone ? `tel:${supportInfo.phone}` : '');
          break;
        case 'global.navigation.admin.sidebar.help.support-email':
        case 'global.navigation.learner.sidebar.help.support-email': 
          {
            const hasEmail = supportInfo?.email && !supportInfo?.email.includes('@degreed.com');
            updateByKey('text', hasEmail ? supportInfo.email : '');
            updateByKey('href', hasEmail ? `mailto:${supportInfo.email}` : '');
          }
          break;
      }
    }
  };

  return traverse(configuration, visitDGATs);
}

/**
 * Translation util that logs missing translations
 * Keys can be comma-separated to try multiple keys until a valid translation is found
 * Note: Left-most key is the most recent... right-most key is the fallback
 */
const i18nWithLog =
  (translate: TranslateFn) =>
  (key: string, fallback: string, params?: Record<string, unknown>) => {
    const allKeys = key.replace(/\s+/g, '').split(','); // This will remove all whitespace

    // Find "most recent" translation
    let value = '';
    let selectedKey = '';

    for (let i = 0; i < allKeys.length; i++) {
      if (!value && allKeys[i]) {
        selectedKey = allKeys[i];
        value = translate(fallback, selectedKey, params) || '';

        // If ngx/translate returns the key, it means the translation is missing
        if (value === selectedKey) value = '';
      }

      if ( !value ) _lostKeys.track(selectedKey, fallback);  
    }

    return value || fallback;
  };



// *************************************************
// Tree Utils
// *************************************************

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LayoutNode = Record<string, any>;
type Visitor = (node: LayoutNode, key: string, parent?: LayoutNode) => void;

// Depth-first node tree scanning
const traverse = (node: any, visit: Visitor, parent?: LayoutNode) => {
  for (const key in node) {
    if (typeof node[key] === 'object') {
      visit(node, key, parent);
      traverse(node[key], visit, node);
    } else {
      visit(node, key, parent);
    }
  }
  return node;
};
