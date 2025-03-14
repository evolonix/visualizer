/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';

export type AuthUser = {
  isSkillInventoryClient: boolean;
  isSkillAnalyticsClient: boolean;
  isManager: boolean;
  hasChannel: boolean;
  defaultOrgId: string;
  defaultOrgInfo: {
    settings: {
      enableTeamSpace: boolean;
      enableSkillsPlatform: boolean;
      skillCoachFullOrgAccess: boolean;
    };
    permissions: {
      manageSkillsPlatform: boolean;
    };
    name: string;
  };
  viewerProfile: { vanityUrl: string; picture: string };
};

export type TargetsService = {
  getBrowseTarget: (organizationId: string) => Observable<{ targetId: number }>;
};
export type NavigationService = {
  getLearnInSSOUrl: (organizationId: string) => Observable<string>;
};
export type AnalyticsGuard = { analyticsUrl: string; isAuthorized: boolean };

export type AuthService = any;
export type TranslateService = any;
export type WebEnvironmentService = any;
export type LDFlagsService = any;
export type ContextService = any;
export type TeamFlagsService = any;
