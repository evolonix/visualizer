import { isUndefined } from '@ngneat/elf';

export enum FeatureFlags {
  NONE = 0,
  ENABLE_RULE_SELECTION = 1, // show rule selection
  ENABLE_PAGE_TO_SELECTION = 2, // auto-select page associated with selected rule
}

// All features are enabled by default
export const DEFAULT_FEATURES = FeatureFlags.ENABLE_PAGE_TO_SELECTION | FeatureFlags.ENABLE_RULE_SELECTION;

export interface UpdateFlagOptions {
  enableRuleSelection?: boolean;
  enableAutoNavigation?: boolean;
}

const FLAG_VALUES = {
  enableRuleSelection: FeatureFlags.ENABLE_RULE_SELECTION,
  enableAutoNavigation: FeatureFlags.ENABLE_PAGE_TO_SELECTION,
};

/**
 * Easy access/management of feature flags
 */
export class EngageFeatureFlags {
  get allowRuleSelection(): boolean {
    return (this.flags & FeatureFlags.ENABLE_RULE_SELECTION) > 0;
  }

  get allowAutoNavigation() {
    return (this.flags & FeatureFlags.ENABLE_PAGE_TO_SELECTION) > 0;
  }

  constructor(private flags = DEFAULT_FEATURES) {}

  /**
   * Partial updates of feature flags with 1..n field booleans;
   * NOTE: if a flag is not provided, it will not be updated
   */
  update(config: UpdateFlagOptions) {
    const updateBit = (key: keyof UpdateFlagOptions) => {
      if (!isUndefined(config[key])) {
        const bit = FLAG_VALUES[key];

        if (config[key]) this.flags |= bit;
        else this.flags &= ~bit;
      }
    };

    updateBit('enableRuleSelection');
    updateBit('enableAutoNavigation');

    return this;
  }

  toString() {
    return `${this.flags}`;
  }
}
