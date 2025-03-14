export type GeneralSettings = Record<string, boolean | Date | string>;

export type LxpOrgSettings = GeneralSettings & {
  enableCareerPathing: boolean;
  supportTargets: boolean;
  useInternalJobSkills: boolean;
  enableSkillsPlatform: boolean;
  enableSkillStandards: boolean;
  enableContentMarketplace: boolean;
  enableReportingInApp: boolean;
  enableAdvancedSkillAnalytics: boolean;
  enableTeamSpace: boolean;
  skillCoachFullOrgAccess: boolean;
  disableAssignedLearning: boolean;
};

export interface LxpOrgInfo {
  organizationId: number;
  name: string;
  image: string;
  endorsedImage?: string;
  isEngaged: boolean;
  permissions: Record<string, boolean>;
  settings: LxpOrgSettings;
  orgRole: string;
  organizationBranding?: {
    brandColor: string;
    useLightText: boolean;
    organizationNameInOnboarding: boolean;
  };
  hasPex: boolean;
}

export const initOrgInfo = (orgId = 0): LxpOrgInfo => ({
  name: '',
  image: '',
  organizationId: orgId,
  isEngaged: false,
  permissions: {} as Record<string, boolean>,
  settings: {} as LxpOrgSettings,
  orgRole: '',
  hasPex: false,
});
