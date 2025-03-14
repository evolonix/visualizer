import { AxiosResponse } from 'axios';
import { Nullable } from '../types';

export type GraphQLErrorMessage = { message: string };
export type GraphQLErrors = GraphQLErrorMessage[];

export type GraphQLResponse<T = unknown> = { data?: Nullable<T>; errors?: GraphQLErrorMessage[] };
export type DegreedGqlResponse<T = unknown> = AxiosResponse<GraphQLResponse<T>>;

export type QueryRequest<T> = () => Promise<DegreedGqlResponse<T>>;
export type QueryResponse<T> = Promise<[Nullable<T>, Nullable<GraphQLErrors>]>;

export type Selector<T> = (data: unknown) => Nullable<T>;

// Axios checks the HTTP status code and updates a 'statusText' field for us
export const isResponseValid = <T>(response: DegreedGqlResponse<T>) =>
  (response?.status === 200 || response?.statusText === 'OK') && !!response.data.data;

export const parseResponse = <T>(response: DegreedGqlResponse<T>, selector: Selector<T>): [Nullable<T>, Nullable<GraphQLErrors>] => {
  const data = isResponseValid(response) ? (response.data?.data as T) || null : null;
  const errors = isResponseValid(response) ? null : (response.data?.errors as GraphQLErrors) || null;
  return [selector(data), errors];
};

/**
 * Trigger GraphQL call, parse response, report error (if any)
 * and return parsed results
 */
export const post = async <T>(query: QueryRequest<T>, selector: Selector<T>): QueryResponse<T> => {
  try {
    const response = await query();
    return parseResponse<T>(response, selector);
  } catch (error) {
    const errorMessage = error ? JSON.stringify(error) : '';
    return [null, [{ message: errorMessage }]];
  }
};
