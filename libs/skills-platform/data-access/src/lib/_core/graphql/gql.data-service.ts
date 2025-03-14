import axios from 'axios';

import { NxSkillsPlatformBootstrap } from '../../_providers';
import { join } from '../../_providers/url.utils';
import { Nullable } from '../types';
import { GraphQLErrors, GraphQLResponse, QueryRequest } from './axios.utils';

export type DataserviceResults<T> = [Nullable<T>, Nullable<GraphQLErrors>];
export type AsyncResponse<T> = Promise<DataserviceResults<T>>;

export const makeAsyncResults = <T>(values: DataserviceResults<T>): AsyncResponse<T> => Promise.resolve<DataserviceResults<T>>(values);

/**
 * A data layer service that requests scales from the scale graphQL API
 */
export abstract class GraphQLDataService {
  constructor(protected bootstrap: NxSkillsPlatformBootstrap) {}

  protected buildQuery<T>(query: unknown): QueryRequest<T> {
    const { endpoint, authToken, xsrfToken, xsrfTokenVNext } = this.bootstrap;
    const graphQlEndpoint = join(endpoint, 'graphql');
    const headers = {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrfToken,
      'X-XSRF-TOKEN-VNEXT': xsrfTokenVNext,
      authorization: authToken ? `Bearer ${authToken}` : '',
    };

    return () => axios.post<GraphQLResponse<T>>(graphQlEndpoint, { query }, { headers });
  }
}
