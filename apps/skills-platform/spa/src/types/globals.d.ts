import { OrgInfoShort } from '@degreed/core-angular';

export {};

declare global {
  interface Window {
    nxSkillsPlatformBootstrap: {
      lang: string;
      organizationId: number;
      authToken: string;
      rootUrl: string;
      cdnUrl: string;
      baseHref: string;
      appFolder: string;
      analyticsEndpoint: string;
      userProfileKey: number;
      orgsToManage: OrgInfoShort[];
      hasChannel: boolean;
      hasSkillAnalytics: boolean;
      assetUrl: (relativeUrl: string) => string;
    };
  }
}
