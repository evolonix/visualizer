import { Selector, post } from '../_core/graphql';

import { Nullable } from '../_core';
import { AsyncResponse, DataserviceResults, GraphQLDataService, GraphQLErrors } from '../_core/graphql';
import { alphabetically } from '../utils';
import { API } from './mappings.gql';
import { SourceLevel, SourceMapping, SourceMappingWithLevelMappings } from './mappings.model';

/**
 * Sort levels in ascending value order and mappings in ascending order of whether they have mappings, then name
 *
 * Note: the full list of available 'source' levels is in `source.levels`
 */
export const sortMappings = ([source, errors]: [Nullable<SourceMapping>, Nullable<GraphQLErrors>]): DataserviceResults<SourceMapping> => {
  const ascendingByValue = (a: SourceLevel | undefined, b: SourceLevel | undefined) => (a && b ? a.value - b.value : 0);
  const hasMappings = (m: SourceMappingWithLevelMappings) => m.levels.some((l) => l.mappingToLevelIds.length);
  const ascendingByHasMappings = (a: SourceMappingWithLevelMappings, b: SourceMappingWithLevelMappings) =>
    hasMappings(a) ? -1 : hasMappings(b) ? 1 : 0;

  source?.levels.sort(ascendingByValue);
  source?.mappings.sort(alphabetically).reverse().sort(ascendingByHasMappings);
  source?.mappings.forEach((mapItem) => {
    mapItem.levels.sort(ascendingByValue);
  });

  return [source, errors];
};

/**
 * A data layer service that requests scale mappings from the SkaaS graphQL API
 */
export class MappingsDataService extends GraphQLDataService {
  // *********************************************************************
  // SourceMapping API
  // *********************************************************************

  async loadMappings(targetSourceID?: string, lang = 'en'): AsyncResponse<SourceMapping> {
    const [gql, selectorFn] = API.MAPPING.loadMappings(targetSourceID, lang);
    const query = this.buildQuery<SourceMapping>(gql);

    return await post(query, selectorFn as Selector<SourceMapping>).then(sortMappings);
  }

  /**
   * Partial save of SourceMapping:
   *
   * Only saves mappings: levels and mappingToLevelIds, and
   * returns full-loaded SourceMapping
   *
   * @param source
   * @param lang
   * @returns
   */
  async saveMappings(source: SourceMapping, lang = 'en'): AsyncResponse<SourceMapping> {
    const [gql, selectorFn] = API.MAPPING.saveMappings(source, lang);
    const query = this.buildQuery<SourceMapping>(gql);

    return await post(query, selectorFn as Selector<SourceMapping>).then(sortMappings);
  }
}
