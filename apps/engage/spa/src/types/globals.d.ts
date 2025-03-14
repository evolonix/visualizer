import { OrgInfoShort } from '@degreed/core-angular';

export {};

declare global {
  interface Window {
    nxEngageBootstrap: {
      lang: string;
      organizationId: number;
      authToken: string;
      rootUrl: string;
      cdnUrl: string;
      appFolder: string;
      analyticsEndpoint: string;
      userProfileKey: number;
      orgsToManage: OrgInfoShort[];
      hasChannel: boolean;
      hasSkillAnalytics: boolean;
      configuration?: unknown;
    };
  }
}
