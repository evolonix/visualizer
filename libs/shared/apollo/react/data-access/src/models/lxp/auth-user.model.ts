import { LxpOrgInfo } from './org-info.model';

export interface LxpAuthUser {
  viewerProfile: {
    userProfileKey: number;
    vanityUrl: string;
    isEngaged: boolean;
    picture: string;
  };
  viewerGroups: {
    group: {
      name: string;
    };
  }[];
  defaultOrgId: number;
  defaultOrgInfo: LxpOrgInfo;
  hasChannel: boolean;
  canViewReporting: boolean;
  canBulkUpload: boolean;
  orgInfo: LxpOrgInfo[];
  acmCanViewAcademyAdmin: boolean;
  canManageOrganization: boolean;

  isSkillInventoryClient: boolean;
  isSkillAnalyticsClient: boolean;
  isManager: boolean;
  hasCareerMobility: boolean;

  isPexUser: boolean;
  isPexOrg: boolean;
}
