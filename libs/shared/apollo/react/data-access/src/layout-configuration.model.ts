import { TFunction } from 'i18next';

import {
  AcademiesCountVM,
  AcademyPermissionVM,
  CustomProgramPermissionVM,
  IncentivesCountVM,
  TIsFeatureFlagOn,
  UseCanShowProgramsVM,
  UserDetailsVM,
} from './models/acm';

import { BrandingState } from './branding';
import { CompositeFeatureFlags } from './models';
import { LxpAuthUser, LxpOrgInfo, LxpSupportInfo } from './models/lxp';

// *********************************************
// Apollo Layout Configuration Option types
// *********************************************

export interface BaseOptions {
  orgId?: number;
  translate?: TFunction;
  isLxpApiEnabled: boolean;
  featureFlags: CompositeFeatureFlags;
  isAdminPath: boolean;
}

export interface LxpOptions {
  authUser: LxpAuthUser;
  orgInfo: LxpOrgInfo;
  featureFlags: CompositeFeatureFlags;
  supportInfo: LxpSupportInfo;
  branding: Partial<BrandingState> | null;
}

export type SkillsPlatformOptions = BaseOptions;

export interface AcmOptions extends BaseOptions {
  isLxpAdmin: boolean;
  isFeatureFlagOn: TIsFeatureFlagOn;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  learningBudgetInfo: any;
  incentivesCount: IncentivesCountVM;
  incentivesCountIsSuccess: boolean;
  showPrograms: UseCanShowProgramsVM;
  isAcademiesOn: boolean;
  academiesCount: AcademiesCountVM;
  academiesCountIsSuccess: boolean;
  user: UserDetailsVM;
  isApprover: boolean;
  customProgramPermissions: CustomProgramPermissionVM[];
  academyPermissions: AcademyPermissionVM[];
  showResources: boolean;
  isDirectBilling: boolean;
  isProduction: boolean;
  isBeta: boolean;
}

export interface LayoutFilterOptions {
  lxp: LxpOptions;
  acm?: AcmOptions;
}
