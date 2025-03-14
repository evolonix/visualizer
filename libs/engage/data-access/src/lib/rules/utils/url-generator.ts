/**
 * Build a registry of URL generators that expose clean
 * client-side APIs correspond to remote APIs
 *
 *       rules : {
 *  GET      loadAllRules = '/rules'
 *  GET      searchRules  = '/rules/?searchBy=<xxx>
 *  POST     saveRule     = '/rules/<ruleID>'         for existing rule
 *                        = '/rules'                  for new rule
 *        }
 *
 *
 *
 */

import { Entity } from '@engage/remote-api';

export interface PaginationOptions {
  currentPage: number;
  perPage: number;
}

// Sorting, filtering, pagination keys expected by BE Server
const KEY_MAPS: Record<string, string> = {
  perPage: 'pageSize',
  currentPage: 'page',

  // convert any JSON-server query params to Degreed Rules params
  _page: 'page',
  _limit: 'pageSize',
};

/**
 * Build URL params that effect sorting, filtering, or pagination
 * @returns string
 */
const buildQueryParams = (options: Record<string, unknown>): string => {
  let params = Object.keys(options).reduce((result, key) => {
    const value = options[key];

    key = KEY_MAPS[key] || key;

    const qParam: string = value ? `&${key}=${String(value)}` : '';
    return result + qParam;
  }, '');

  if (params.startsWith('&')) {
    params = params.slice(1); // REmove the first '&'
  }

  return params;
};

// allowed API methods for RULES
export type RULES_API = 'loadAllRules' | 'loadRuleById' | 'searchRules' | 'saveRule' | 'deleteRule' | 'loadEmailTemplate' | 'loadEvents';

export type UrlBuilder = (...args: unknown[]) => string;
export type RulesUrlRegsistry = Record<RULES_API, UrlBuilder>;

export function makeUrlGenerator(rootUrl: string, organizationId: number): { rules: Record<RULES_API, UrlBuilder> } {
  const prefix = (url: string) => {
    url = url.startsWith('/') ? url.slice(1) : url;
    url = `${rootUrl}/organizations/${organizationId}/engage/${url}`;
    url = url.endsWith('?') ? url.slice(0, url.length - 1) : url; // Remove trailing '?' if no params

    return url;
  };
  return {
    rules: {
      loadAllRules: () => prefix(`/rules`),
      loadRuleById: (id: string) => prefix(`/rules/${id}`),
      searchRules: (searchBy: string, { currentPage, perPage }: PaginationOptions) => {
        const params = buildQueryParams({ currentPage, perPage, searchBy });
        const url = `/rules?${params}`;

        return prefix(url);
      },
      saveRule: ({ id }: Entity, { perPage, currentPage }: PaginationOptions) => {
        const params = buildQueryParams({ perPage, currentPage });
        let url = `/rules/${id}?${params}`;

        // if saving a NEW rule
        if (!id) {
          url = `/rules?${params}`;
        }

        return prefix(url);
      },
      deleteRule: (id: string) => prefix(`/rules/${id}`),
      loadEmailTemplate: (id: number) => prefix(`/email-templates/${id}`),
      loadEvents: () => prefix('/events'),
    } as RulesUrlRegsistry,
  };
}
