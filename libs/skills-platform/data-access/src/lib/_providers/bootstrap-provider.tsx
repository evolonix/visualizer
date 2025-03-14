import { createContext, useState } from 'react';

import { InjectionToken } from '@degreed/core-react';

import { join } from './url.utils';
import { getXsrfTokenValue } from './xsrf.tokens';

export interface NxSkillsPlatformBootstrap {
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

  // Dynamically added properties (for now)
  xsrfToken: string;
  xsrfTokenVNext: string;
  endpoint: string;
  assetUrl: (relativeUrl: string) => string;
}

export const NxBootstrapToken = new InjectionToken('NxSkillsPlatformBootstrap');

export const buildNxBootstrap = (): NxSkillsPlatformBootstrap => {
  const data = (window?.nxSkillsPlatformBootstrap || {}) as NxSkillsPlatformBootstrap;

  addIfMissing(data, 'xsrfToken', getXsrfTokenValue(window.location.hostname, false));
  addIfMissing(data, 'xsrfTokenVNext', getXsrfTokenValue(window.location.hostname, true));
  addIfMissing(data, 'endpoint', data.rootUrl);
  addIfMissing(data, 'assetUrl', (relativeUrl: string): string => {
    const { cdnUrl, appFolder } = data;
    return join(cdnUrl, appFolder, relativeUrl);
  });

  return data;
};

export const BootstrapContext = createContext<NxSkillsPlatformBootstrap>({} as NxSkillsPlatformBootstrap);

export const BootstrapProvider = ({ children }: { children?: React.ReactNode }) => {
  const [bootstrap] = useState<NxSkillsPlatformBootstrap>(buildNxBootstrap());

  return <BootstrapContext.Provider value={bootstrap}>{children}</BootstrapContext.Provider>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addIfMissing(target: NxSkillsPlatformBootstrap, key: keyof NxSkillsPlatformBootstrap, value: any) {
  if (!target[key]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (target as any)[key] = value;
  }
}
