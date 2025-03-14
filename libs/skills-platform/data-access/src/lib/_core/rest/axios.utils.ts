import { AxiosResponse } from 'axios';
import { Nullable } from '../types';

export type RestErrorMessage = { memberNames?: string[]; errorMessage: string };
export type RestErrors = RestErrorMessage[];

export type RestResponse<T = unknown> = { data?: Nullable<T>; errors?: RestErrorMessage[] };
export type DegreedRestResponse<T = unknown> = AxiosResponse<RestResponse<T>>;

export type QueryRequest<T> = () => Promise<DegreedRestResponse<T>>;
export type QueryResponse<T> = Promise<[Nullable<T>, Nullable<RestErrors>]>;

export type Selector<T> = (data: unknown) => Nullable<T>;

// Axios checks the HTTP status code and updates a 'statusText' field for us
export const isResponseValid = <T>(response: DegreedRestResponse<T>) =>
  (response?.status === 200 || response?.statusText === 'OK') && !!response.data;

export const parseResponse = <T>(response: DegreedRestResponse<T>, selector: Selector<T>): [Nullable<T>, Nullable<RestErrors>] => {
  const data = isResponseValid(response) ? (response.data as T) || null : null;
  const errors = (response.data?.errors as RestErrors) || null;
  return [selector(data), errors];
};

/**
 * Trigger Rest call, parse response, report error (if any)
 * and return parsed results
 */
export const process = async <T>(query: QueryRequest<T>, selector: Selector<T>): QueryResponse<T> => {
  try {
    const response = await query();
    return parseResponse<T>(response, selector);
  } catch (error) {
    const errorMessage = error ? JSON.stringify(error) : '';
    return [null, [{ errorMessage }]];
  }
};
