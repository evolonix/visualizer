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
      orgsToManage: unknown[];
      hasChannel: boolean;
      hasSkillAnalytics: boolean;
      assetUrl: (relativeUrl: string) => string;
    };
  }
}
