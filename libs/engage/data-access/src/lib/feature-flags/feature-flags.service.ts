import { Injectable } from '@angular/core';
import { EventBus } from '@degreed/rsm';

import { EngageFeatureFlags, UpdateFlagOptions } from './feature-flags';
import { useFeatures } from './feature-flags.events';

/**
 * Injectable service for access current feature flags.
 * Also provides 'broadcast' messaging to announce updated feature flags.
 */
@Injectable()
export class FeatureFlagsService {
  private _features: EngageFeatureFlags = new EngageFeatureFlags();

  get flags(): EngageFeatureFlags {
    return this._features;
  }

  constructor(private dispatcher: EventBus) {
    const flags = localStorage.getItem('engage-features');
    const fromCache = new EngageFeatureFlags(flags ? parseInt(flags, 10) : undefined);

    this.updateFlags(fromCache);
  }

  /**
   * Allow consumers to subscribe to feature flag changes
   */
  subscribe(callback: (flags: EngageFeatureFlags) => void): () => void {
    return this.dispatcher.on(useFeatures().type, callback);
  }

  /**
   * Cache new feature flags and announce changes
   * @param flags
   */
  updateFlags(flags: EngageFeatureFlags | UpdateFlagOptions): void {
    this._features = flags instanceof EngageFeatureFlags ? flags : this._features.update(flags);
    localStorage.setItem('engage-features', this._features.toString());

    this.dispatcher.announce(useFeatures(this._features));
  }
}
