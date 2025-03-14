import { initFeatureFlags } from '@degreed/apollo-react-data-access';

export const LAYOUT_OPTIONS = {
  featureFlags: initFeatureFlags(),
  isAdminPath: true,
  isLxpApiEnabled: import.meta.env.MODE !== 'local',
};
