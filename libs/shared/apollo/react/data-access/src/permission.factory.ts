/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcmOptions } from './layout-configuration.model';
import { CompositeFeatureFlags, ContextService, LxpAuthUser, LxpOrgInfo } from './models';
import { GuardItem, makeGuard } from './permission.guards';

type AuthUser = LxpAuthUser;
type OrgInfo = LxpOrgInfo;
type LDFlagsService = CompositeFeatureFlags;

export interface LxpConfigOptions_Admin {
  authUser: AuthUser;
  orgInfo: OrgInfo;
  featureFlags: LDFlagsService;
  isProduction?: boolean;
}

export interface LxpConfigOptions_Learner extends LxpConfigOptions_Admin {
  isChannel: boolean;
}
export interface LxpAdminGuards {
  insights: GuardItem;
  people: GuardItem;
  catalog: GuardItem;
  skills: GuardItem;
  marketplace: GuardItem;
  automations: GuardItem;
  reporting: GuardItem;
  integrations: GuardItem;
  settings: GuardItem;
  extendedEnterprise: GuardItem;
}

export interface LxpLearnerGuards {
  features: GuardItem;
  home: GuardItem;
  featured: GuardItem;
  discover: GuardItem;
  skillCoach: GuardItem;
  assistant: GuardItem;
  opportunities: GuardItem;
  notifications: GuardItem;
  profile: GuardItem;
  help: GuardItem;
}

export interface AcmLearnerGuards {
  home: GuardItem;
  marketplace: GuardItem;
  academies: GuardItem;
  teamInsights: GuardItem;
  approvals: GuardItem;
  permissions: GuardItem;
  account: GuardItem;
  showAdminView: GuardItem;
}

export interface AcmAdminGuards {
  learning: GuardItem;
  people: GuardItem;
  licenses: GuardItem;
  incentives: GuardItem;
  approvals: GuardItem;
  reports: GuardItem;
  qa: GuardItem;
  settingsAdmin: GuardItem;
  settignsDeveloper: GuardItem;
}

/**
 * Build collection of PermissionsGuards for Admin Navigation
 */
export const Permissions_forLxpAdmin = (options: LxpConfigOptions_Admin): LxpAdminGuards => {
  const { authUser, orgInfo, featureFlags } = options;
  const permissions = orgInfo.permissions;
  const settings = orgInfo.settings;

  const skillsClient = () =>
    settings.skillInventoryClient || settings.skillAnalyticsClient || authUser.isSkillAnalyticsClient || authUser.isSkillInventoryClient;
  const bulkUpload = () => ({
    permissions:
      authUser?.canBulkUpload &&
      (permissions.uploadCompletions ||
        permissions.uploadContent ||
        permissions.uploadGroups ||
        permissions.uploadOpportunities ||
        permissions.uploadRequiredLearning ||
        permissions.uploadUserUpdates ||
        permissions.uploadClientUser ||
        permissions.uploadRoles ||
        permissions.uploadSkills),
    settings: !settings.disableBulkUpload,
  });

  const insights = makeGuard('insights', [permissions.viewReports]).addChildren([
    makeGuard('learning'),
    makeGuard('skills', [permissions.viewReports], [!settings.disableRatingsInsights]),
    makeGuard('skill-trends', [permissions.viewReports], [!settings.disableRatingsInsights]),
  ]);
  const people = makeGuard('people').addChildren([
    makeGuard('users', [permissions.viewMembers], [], []),
    makeGuard('groups', [permissions.manageGroups || permissions.createAdministrativeGroups], [!skillsClient()]),
    makeGuard('segments', [permissions.manageSegments], [], [featureFlags.orgManagement.segmentsUI]),
    makeGuard('manage-attributes', [permissions.manageAttributes], [], []),
    makeGuard('permissions', [permissions.editPermissions], [], []), // @Todo -confirm with Steffan new flag:  [featureFlags.orgManagement.customRolesEnabled]
  ]);
  const catalog = makeGuard('catalog').addChildren([
    makeGuard('content', [permissions.manageContent], [], []),
    makeGuard('academies', [authUser.acmCanViewAcademyAdmin], [], []),
    makeGuard('pathways', [permissions.managePathways], [!skillsClient()], []),
    makeGuard('plans', [permissions.manageTargets], [settings.enableCareerPathing], []),
    makeGuard('skill-dev', [], [!settings.enableCareerPathing, settings.supportTargets]),
  ]);
  const skills = makeGuard('skills', [permissions.manageSkills], [settings.useInternalJobSkills]).addChildren([
    makeGuard('dashboard', [], [settings.enableSkillsPlatform], [featureFlags.degreedSkillsOctober2024]),
    makeGuard('inventory', [], [settings.enableSkillsPlatform], [featureFlags.degreedSkillsOctober2024]),
    makeGuard('scales', [permissions.manageSkillsPlatform], [settings.enableSkillsPlatform], [featureFlags.degreedSkillsOctober2024]),
    makeGuard('org-skills', [], [], [!featureFlags.degreedSkillsOctober2024]),
    makeGuard('roles', [], [], []),
    makeGuard('skill-standards', [], [settings.enableSkillStandards]),
    makeGuard('publish', [], [settings.enableSkillsPlatform], [featureFlags.degreedSkillsOctober2024]),
    makeGuard('settings', [], [], []),
  ]);
  const marketplace = makeGuard('content-marketplace', [], [settings.enableContentMarketplace], []);
  const automations = makeGuard('automations', [permissions.manageBusinessRules], [], []);
  const reporting = makeGuard('reporting', [authUser.canViewReporting], [settings.enableReportingInApp, !skillsClient()]).addChildren([
    makeGuard('reports', [authUser.canViewReporting], [settings.enableReportingInApp, !skillsClient()]),
    makeGuard('presets', [authUser.canViewReporting], [settings.enableReportingInApp]),
    makeGuard('categories', [authUser.canViewReporting], [settings.enableReportingInApp]),
    makeGuard('ftp', [permissions.manageReportingFTPScheduler]),
    makeGuard('configurations', [permissions.manageReportingTransmitterConfigurations, permissions.manageReportingInApp]),
    makeGuard('segments', [permissions.manageSegments, permissions.manageReportingInApp]),
    makeGuard(
      'analytics',
      [authUser.canManageOrganization],
      [settings.enableAdvancedSkillAnalytics],
      [featureFlags.insights.insightsSkillAnalytics]
    ),
  ]);
  const integrations = makeGuard('integrations').addChildren([
    makeGuard('connected', [permissions.manageIntegrations]),
    makeGuard('directory', [permissions.manageIntegrations]),
    makeGuard('api-keys', [permissions.manageOrgApiKeys]),
    makeGuard('file-upload', [bulkUpload().permissions], [bulkUpload().settings, !settings.isClientProvider, !skillsClient()]),
    makeGuard('file-log', [bulkUpload().permissions], [bulkUpload().settings, !settings.isClientProvider, !skillsClient()]),
    makeGuard('webhooks', [authUser.canManageOrganization], [], [featureFlags.orgManagement.showWebhooksAdmin]),
  ]);
  const settingsGuard = makeGuard('settings', [permissions.editSettings || permissions.editPermissions], [!skillsClient()]).addChildren([
    makeGuard('branding', [permissions.editSettings], [!settings.hideMasterOrgSettings]),
    makeGuard('home', [], [!settings.disableHomeAdminSettings, permissions.editSettings], [featureFlags.personalizedLearning]),
    makeGuard('help-menu', [permissions.editSettings]),
    makeGuard('communication', [permissions.editCommunications], [!settings.isClientProvider]),
    makeGuard('faq', [permissions.editSettings], [!settings.isClientProvider]),
    makeGuard('messaging', [permissions.editSettings], [!settings.disablePopupMessages]),
    makeGuard('security', [permissions.editSettings], [], [featureFlags.sessionManagement]),
  ]);
  const extendedEnterprise = makeGuard('extended Enterprise', [authUser?.hasChannel]);

  // Return custom collection of permissions guards...
  // use permissions checks on Apollo "Admin" navigation menus
  return {
    insights,
    people,
    catalog,
    skills,
    marketplace,
    automations,
    reporting,
    integrations,
    settings: settingsGuard,
    extendedEnterprise,
  };
};

/**
 * Build collection of PermissionsGuards for Learner Navigation
 */
export const Permissions_forLxpLearner = (options: LxpConfigOptions_Learner): LxpLearnerGuards => {
  const { authUser, orgInfo, featureFlags, isChannel } = options;
  const settings = orgInfo.settings;

  const isSkillClient = authUser?.isSkillInventoryClient || authUser?.isSkillAnalyticsClient;
  const isSkillsTeam = settings.enableTeamSpace && (settings.skillCoachFullOrgAccess || featureFlags.teams.teamSpaceEnabled);
  const canManageSkills = authUser?.canManageOrganization && isSkillClient && orgInfo.orgRole === 'Admin';
  const canManageLearnerOrg = authUser?.canManageOrganization && !isSkillClient;
  const canSwitchToAdmin = authUser?.canViewReporting || canManageLearnerOrg || canManageSkills;

  const features = makeGuard('features').addChildren([
    makeGuard('search'),
    makeGuard('add-content'),
    makeGuard('beta'),
    makeGuard('footer-branding'),
    makeGuard('sidebar-branding'),
    makeGuard('show-admin-view', [canSwitchToAdmin, !isChannel]),
  ]);
  const home = makeGuard('home').addChildren([
    makeGuard('my-learning', [], [], [featureFlags.useLearnerHub]),
    makeGuard('assignments', [], [!settings.disableAssignedLearning], [featureFlags.useLearnerHub]),
    makeGuard('saved'),
    makeGuard('shared'),
    makeGuard('pathways'),
    makeGuard('plans'),
    makeGuard('groups'),
  ]);
  const featured = makeGuard('featured');
  const discover = makeGuard('discover');
  const skillCoach = makeGuard('skill-coach', [authUser?.isManager, isSkillClient || isSkillsTeam]).addChildren([
    makeGuard('members'),
    makeGuard('team-skills'),
    makeGuard('assignments', [], [], [featureFlags.skillCoach.managerAssignments]),
    makeGuard('learning-insights'),
    makeGuard('skill-insights'),
  ]);
  const assistant = makeGuard('maestro', [], [], [featureFlags.lxpDegreedAssistant]);
  const opportunities = makeGuard('opportunities', [!!orgInfo.organizationId, authUser?.hasCareerMobility]).addChildren([
    makeGuard('marketplace'),
    makeGuard('browse'),
    makeGuard('mentoring'),
    makeGuard('open-insights'),
    makeGuard('engagement-insights'),
  ]);
  const notifications = makeGuard('notifications', [!!authUser]);
  const profile = makeGuard('profile', [!!authUser]).addChildren([
    makeGuard('overview'),
    makeGuard('skills'),
    makeGuard('collection'),
    makeGuard('activity'),
    makeGuard('flex-ed', [(authUser?.isPexUser && authUser?.isPexOrg) || orgInfo.hasPex]),
    makeGuard('settings'),
    makeGuard('my-plan', [], [settings.enableContentMarketplace]),
    makeGuard('logout'),
  ]);
  const help = makeGuard('help');

  // Return custom collection of permissions guards...
  // use permissions checks on Apollo "Learner" navigation menus
  return {
    features,
    home,
    featured,
    discover,
    skillCoach,
    assistant,
    opportunities,
    notifications,
    profile,
    help,
  };
};

/**
 * For ACM Learner, build collection of PermissionsGuards
 */
export const Permissions_forAcmLearner = (acm: AcmOptions): AcmLearnerGuards => {
  const canApprovePrograms = () => {
    return (acm.isApprover && !!programIncentivesAvailableToUsersWithManagerApprovalCount) || !!academiesWithCurrentUserAsAssignedApprover;
  };
  const canShowPermissions = () => {
    return !!(acm.customProgramPermissions?.length || (acm.academyPermissions?.length && acm.isFeatureFlagOn.Academies));
  };
  const {
    programIncentivesAvailableToUsersWithManagerApprovalCount,
    academiesWithCurrentUserAsAssignedApprover,
    resourcesAvailableToUsersWithManagerApprovalCount,
  } = acm.incentivesCount || {};

  const home = makeGuard('home');
  const marketplace = makeGuard('marketplace', [acm.incentivesCountIsSuccess, acm.showPrograms.any]);
  const academies = makeGuard(
    'academies',
    [acm.isAcademiesOn],
    [acm.academiesCountIsSuccess, !!acm.academiesCount?.publishedAcademiesAvailableToUserCount]
  );
  const teamInsights = makeGuard('teamInsights', [acm.user?.isManager], [], [acm.isFeatureFlagOn.TeamInsights]);
  const approvals = makeGuard('approvals').addChildren([
    makeGuard('programs', [], [canApprovePrograms()]),
    makeGuard('resources', [], [acm.isApprover, !!resourcesAvailableToUsersWithManagerApprovalCount]),
  ]);
  const permissions = makeGuard('permissions', [canShowPermissions()]);
  const account = makeGuard('account').addChildren([makeGuard('settings'), makeGuard('logout')]);
  const showAdminView = makeGuard('showAdminView', [acm.user?.isAdmin]);

  return {
    home,
    marketplace,
    academies,
    teamInsights,
    approvals,
    permissions,
    account,
    showAdminView,
  };
};

/**
 * For ACM Admin, build collection of PermissionsGuards
 */
export const Permissions_forAcmAdmin = (acm: AcmOptions): AcmAdminGuards => {
  const {
    programIncentivesAvailableToUsersWithManagerApprovalCount,
    academiesWithCurrentUserAsAssignedApprover,
    resourcesAvailableToUsersWithManagerApprovalCount,
  } = acm.incentivesCount || {};
  const isVirtualCard = acm.learningBudgetInfo?.[0]?.incentiveType === 'Prepayment';
  const canApprovePrograms = () => {
    return (acm.isApprover && !!programIncentivesAvailableToUsersWithManagerApprovalCount) || !!academiesWithCurrentUserAsAssignedApprover;
  };

  const learning = makeGuard('learning').addChildren([
    makeGuard('marketplace'),
    makeGuard('academies', [], [], [acm.isFeatureFlagOn.Academies]),
  ]);
  const people = makeGuard('people');
  const licenses = makeGuard('licenses', [], [], [acm.isFeatureFlagOn.Licenses]);
  const incentives = makeGuard('incentives', [], [], [acm.isFeatureFlagOn.Incentives]);
  const approvals = makeGuard('approvals').addChildren([
    makeGuard('programs', [], [canApprovePrograms()]),
    makeGuard('resources', [], [acm.isApprover, !!resourcesAvailableToUsersWithManagerApprovalCount]),
  ]);
  const reports = makeGuard('reports');
  const qa = makeGuard('qa', [!acm.isProduction, !acm.isBeta]);
  const settingsAdmin = makeGuard('admin-settings', [isVirtualCard], [], [!acm.isFeatureFlagOn.HideAdminSettings]);
  const settignsDeveloper = makeGuard('developer-admin', [!acm.isProduction, !acm.isBeta]);

  return {
    learning,
    people,
    licenses,
    incentives,
    approvals,
    reports,
    qa,
    settingsAdmin,
    settignsDeveloper,
  };
};

/**
 * Build a collection of PermissionGuards for the OrgsView components/routing
 */
export class PermissionFactory {
  private get orgInfo(): OrgInfo {
    const [, , orgInfo] = resolveOrgInfo(this.authUser);
    return orgInfo;
  }
  constructor(
    private authUser: AuthUser,
    private featureFlags: LDFlagsService,
    private contextService: ContextService
  ) {}

  // Permissions for Learner
  forLxpAdmin(): LxpAdminGuards {
    return Permissions_forLxpAdmin({
      orgInfo: this.orgInfo,
      authUser: this.authUser,
      featureFlags: this.featureFlags,
      isProduction: false,
    });
  }

  // Permissions for Learner
  forLxpLearner(): LxpLearnerGuards {
    return Permissions_forLxpLearner({
      orgInfo: this.orgInfo,
      authUser: this.authUser,
      featureFlags: this.featureFlags,
      isProduction: false,
      isChannel: this.contextService.isChannel(),
    });
  }
}

/**
 * For the specified window.href and authenticated user, determine the orgId allowed for the user
 * @returns [boolean, string] - [isOrgView, orgId]
 */
export const resolveOrgInfo = (user: AuthUser | undefined): [boolean, string, OrgInfo] => {
  const EMPTY_ORG = { permissions: {} as any, settings: {} as any } as OrgInfo;

  // match orgs/:d in the url to get the org id
  const url = window.location.href;
  const match = url ? url.match(/orgs\/(\d+)/) : null;
  const urlId = match ? Number(match[1]) : user?.defaultOrgId || 1;

  const results = user?.orgInfo.find((x) => x.organizationId === urlId);
  const orgId = results?.organizationId || user?.defaultOrgId || 1;

  const orgInfo = user?.orgInfo.find((x) => x.organizationId === orgId) || EMPTY_ORG;

  return [!!match, orgId.toString(), orgInfo];
};
