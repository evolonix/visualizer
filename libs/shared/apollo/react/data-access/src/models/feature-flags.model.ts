export interface CompositeFeatureFlagKeys {
  [key: string]: string | CompositeFeatureFlagKeys;
}
export interface CompositeFeatureFlags {
  degreedSkillsOctober2024: boolean;
  lxpDegreedAssistant: boolean;
  personalizedLearning: boolean;
  sessionManagement: boolean;
  useLearnerHub: boolean;
  orgManagement: {
    segmentsUI: boolean;
    showWebhooksAdmin: boolean;
  };
  insights: {
    insightsSkillAnalytics: boolean;
  };
  teams: {
    teamSpaceEnabled: boolean;
  };
  skillCoach: {
    managerAssignments: boolean;
  };
  apollo: Record<string, boolean>;
  // apollo: {
  //   APOLLO_LAYOUT: boolean;
  //   APOLLO_LAYOUT_REFRESH: boolean;
  //   APOLLO_LAYOUT_LEARNER_V2: boolean;
  //   APOLLO_LAYOUT_LEARNER_V3: boolean;
  //   APOLLO_LAYOUT_ADMIN_V2: boolean;
  //   APOLLO_LAYOUT_ADMIN_V3: boolean;
  // }
}

export const LAYOUT_FEATURE_FLAG_KEYS: CompositeFeatureFlagKeys = {
  degreedSkillsOctober2024: 'skills-degreedskills-october2024',
  lxpDegreedAssistant: 'lxp-degreed-assistant',
  personalizedLearning: 'personalized-learning-sections-cards',
  sessionManagement: 'session_management_config_ui',
  useLearnerHub: 'new-home-learner-hub',
  orgManagement: {
    segmensUI: 'segments-ui',
    showWebhooksAdmin: 'api-enable-outbound-webhooks',
  },
  insights: {
    insightsSkillAnalytics: 'insights-skill-analytics',
  },
  teams: {
    teamSpaceEnabled: 'team-space-manager-enabled-v1-061220',
  },
  skillCoach: {
    managerAssignments: 'mpr-manager-assignments-2025-feb',
  },
  apollo: {
    APOLLO_LAYOUT: 'apollo_refresh',
    APOLLO_LAYOUT_REFRESH: 'lxp-layout-refresh',
    APOLLO_LAYOUT_LEARNER_V2: 'apollo_refresh_v2_learner',
    APOLLO_LAYOUT_LEARNER_V3: 'apollo_refresh_v3_learner',
    APOLLO_LAYOUT_ADMIN_V2: 'apollo_refresh_v2_admin', // This flag doesn't exist, and shouldn't, since we don't have an admin view of the v2 navigation
    APOLLO_LAYOUT_ADMIN_V3: 'apollo_refresh_v3_admin',
  },
};

export const initFeatureFlags = (): CompositeFeatureFlags => {
  return {
    degreedSkillsOctober2024: true, // !! Assume ON for now
    lxpDegreedAssistant: false, // !! Defaults to OFF
    personalizedLearning: true,
    sessionManagement: true,
    useLearnerHub: true,
    orgManagement: {
      segmentsUI: true,
      showWebhooksAdmin: true,
    },
    insights: {
      insightsSkillAnalytics: true,
    },
    teams: {
      teamSpaceEnabled: false, // !! Defaults to OFF
    },
    skillCoach: {
      managerAssignments: false, // !! Defaults to OFF
    },
    apollo: {
      APOLLO_LAYOUT: true,
      APOLLO_LAYOUT_REFRESH: true,
      APOLLO_LAYOUT_LEARNER_V2: true,
      APOLLO_LAYOUT_LEARNER_V3: true,
      APOLLO_LAYOUT_ADMIN_V2: true,
      APOLLO_LAYOUT_ADMIN_V3: true,
    },
  };
};

export type FeatureFlagLookup = (key: string) => boolean;

/**
 * Recursively loop through LAYOUT_FEATURE_FLAG_KEYS and return an object of CompositeFeatureFlags
 */
export const buildFeatureFlagsFrom = (keys: CompositeFeatureFlagKeys, getFlagValue: FeatureFlagLookup): CompositeFeatureFlags => {
  return Object.keys(keys).reduce((acc, key) => {
    const value = keys[key];

    acc[key] = typeof value === 'object' ? buildFeatureFlagsFrom(value, getFlagValue) : getFlagValue(value);

    return acc;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as any) as CompositeFeatureFlags;
};
