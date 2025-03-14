import { FeatureFlags, EngageFeatureFlags } from '..';

describe('EngageFeatureFlags', () => {
  it('should enable all features by default', () => {
    const features = new EngageFeatureFlags();

    expect(features.allowRuleSelection).toEqual(true);
    expect(features.allowAutoNavigation).toEqual(true);
  });

  it('should allow all features to be disabled', () => {
    const OFF = 0;
    const features = new EngageFeatureFlags(OFF);

    expect(features.allowRuleSelection).toEqual(false);
    expect(features.allowAutoNavigation).toEqual(false);
  });

  it('should allow only Rule Selection to be enabled', () => {
    const flags = FeatureFlags.ENABLE_RULE_SELECTION;
    const features = new EngageFeatureFlags(flags);

    expect(features.allowRuleSelection).toEqual(true);
    expect(features.allowAutoNavigation).toEqual(false);
  });

  it('should allow only AutoNavigation to be enabled', () => {
    const flags = FeatureFlags.ENABLE_PAGE_TO_SELECTION;
    const features = new EngageFeatureFlags(flags);

    expect(features.allowRuleSelection).toEqual(false);
    expect(features.allowAutoNavigation).toEqual(true);
  });

  it('should allow only RuleSelection + AutoNavigation to be enabled', () => {
    const flags = FeatureFlags.ENABLE_PAGE_TO_SELECTION | FeatureFlags.ENABLE_RULE_SELECTION;
    const features = new EngageFeatureFlags(flags);

    expect(features.allowRuleSelection).toEqual(true);
    expect(features.allowAutoNavigation).toEqual(true);
  });
});
