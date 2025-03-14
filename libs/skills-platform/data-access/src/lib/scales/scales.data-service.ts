import { LocalizedScale } from '../_core';
import { AsyncResponse, GraphQLDataService, Selector, post } from '../_core/graphql';

import { API, PublishResponse } from './scales.gql';
import { Language, LanguageRegistry, ScaleRegistry } from './scales.model';
import { transformFromLocalizedScale, transformToLocalizedScale } from './utils/localized.utils';

/**
 * A data layer service that requests scales from the scale graphQL API
 */
export class ScalesDataService extends GraphQLDataService {
  // *********************************************************************
  // Scale API
  // *********************************************************************

  async loadAllScales(includeLevels = false): AsyncResponse<ScaleRegistry> {
    const [gql, selectorFn] = API.SCALE.loadAll(includeLevels);
    const query = this.buildQuery<LocalizedScale[]>(gql);

    const [localizedScales, errors] = await post(query, selectorFn as Selector<LocalizedScale[]>);

    const registry = {} as ScaleRegistry;
    localizedScales?.forEach((localizedScale) => {
      const localizations = transformFromLocalizedScale(localizedScale);
      registry[localizedScale.id] = localizations;
    });

    return [registry, errors];
  }

  async loadScaleById(id: string, includeLevels = false): AsyncResponse<LanguageRegistry> {
    const [gql, selectorFn] = API.SCALE.loadById(id, includeLevels);
    const query = this.buildQuery<LocalizedScale>(gql);

    const [localizedScale, errors] = await post(query, selectorFn as Selector<LocalizedScale>);

    if (!localizedScale) return [null, errors];

    const localizations = transformFromLocalizedScale(localizedScale);

    return [localizations, errors];
  }

  /**
   * Save a new or existings scale
   */
  async saveScale(localizations: LanguageRegistry): AsyncResponse<LanguageRegistry> {
    const localizedScale = transformToLocalizedScale(localizations);

    const [gql, selectorFn] = API.SCALE.save(localizedScale);
    const query = this.buildQuery<LocalizedScale>(gql);
    const [saved, errors] = await post(query, selectorFn as Selector<LocalizedScale>);

    return [!saved ? null : transformFromLocalizedScale(saved), errors];
  }

  async loadPrimaryScale(): AsyncResponse<LanguageRegistry> {
    const [gql, selectorFn] = API.SCALE.loadPrimary();
    const query = this.buildQuery<LocalizedScale>(gql);

    const [localizedScale, errors] = await post(query, selectorFn as Selector<LocalizedScale>);

    if (!localizedScale) return [null, errors];

    const localizations = transformFromLocalizedScale(localizedScale);

    return [localizations, errors];
  }

  /**
   * These return boolean answers
   */

  async setAsPrimaryScale(id: string): AsyncResponse<string> {
    const [gql, selectorFn] = API.SCALE.setAsPrimary(id);
    const query = this.buildQuery<string>(gql);
    const [result, errors] = await post(query, selectorFn as Selector<string>);

    return [result || '', errors];
  }

  async deleteScale(id: string): AsyncResponse<boolean> {
    const [gql, selectorFn] = API.SCALE.delete(id);
    const query = this.buildQuery<string>(gql);
    const [result, errors] = await post(query, selectorFn as Selector<string>);

    return [!!result, errors];
  }

  /**
   * Check if the current primary scale and its mappings are publishable
   */
  async checkPublishable(): AsyncResponse<PublishResponse> {
    const [gql, selectorFn] = API.SCALE.checkPublishable();
    const query = this.buildQuery<PublishResponse>(gql);
    const [result, errors] = await post(query, selectorFn as Selector<PublishResponse>);

    return [result, errors];
  }

  /**
   * Publish changes to the current primary scale and its mappings
   */
  async publish(languageCode?: string): AsyncResponse<PublishResponse> {
    const [gql, selectorFn] = API.SCALE.publish(languageCode);
    const query = this.buildQuery<PublishResponse>(gql);
    const [result, errors] = await post(query, selectorFn as Selector<PublishResponse>);

    return [result, errors];
  }

  // *********************************************************************
  // Localization API
  // *********************************************************************

  async loadAllSupportedLanguages(): AsyncResponse<Language[]> {
    const [gql, selectorFn] = API.LANGUAGE.loadAllSupportedLanguages();
    const query = this.buildQuery<Language[]>(gql);

    return await post(query, selectorFn as Selector<Language[]>);
  }
}
