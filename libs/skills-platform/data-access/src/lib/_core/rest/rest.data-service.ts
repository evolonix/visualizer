import axios, { AxiosRequestConfig } from 'axios';

import { NxSkillsPlatformBootstrap } from '../../_providers';
import { join } from '../../_providers/url.utils';
import { Nullable } from '../types';
import { QueryRequest, RestErrors, RestResponse } from './axios.utils';

export type DataserviceResults<T> = [Nullable<T>, Nullable<RestErrors>];
export type AsyncResponse<T> = Promise<DataserviceResults<T>>;

export const makeAsyncResults = <T>(values: DataserviceResults<T>): AsyncResponse<T> => Promise.resolve<DataserviceResults<T>>(values);

/**
 * A data layer service that requests scales from the scale rest API
 */
export abstract class RestDataService {
  constructor(protected bootstrap: NxSkillsPlatformBootstrap) {}

  protected buildQuery<T>(config: Partial<AxiosRequestConfig>): QueryRequest<T> {
    const { endpoint, authToken, xsrfToken, xsrfTokenVNext } = this.bootstrap;
    const url = join(endpoint, config.url || '');

    return () =>
      axios<RestResponse<T>>({
        ...config,
        url,
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': xsrfToken,
          'X-XSRF-TOKEN-VNEXT': xsrfTokenVNext,
          authorization: authToken ? `Bearer ${authToken}` : '',
          ...config.headers,
        },
      });
  }
}
