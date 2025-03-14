import { EmitEvent } from '@degreed/rsm';
import { EngageFeatureFlags } from './feature-flags';

export type FeatureFlagEvent = EmitEvent<EngageFeatureFlags>;

export function useFeatures(flags?: EngageFeatureFlags): FeatureFlagEvent {
  return {
    type: '[FeatureFlags] Changed',
    data: flags || new EngageFeatureFlags(),
  };
}
