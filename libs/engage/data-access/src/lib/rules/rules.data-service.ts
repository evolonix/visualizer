/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { HttpClient, HttpContext } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { AUTHENTICATION_REQUIRED, BOOTSTRAP_SETTINGS, BootstrapSettings } from '@degreed/core-angular';
import { Pagination } from '@degreed/rsm';
import { EmailTemplate, LoadRuleApiResponse, LoadRulesApiResponse, Rule, SaveRuleApiResponse, ServerPagination } from '@engage/remote-api';

import { SearchActionParams } from './rules.model';
import { makeUrlGenerator, RULES_API, UrlBuilder } from './utils';

/**
 * Format (after conversion of RemoteRuleResponse)
 * expected in the SPA
 */

export interface LoadRuleResponse {
  payload: Rule;
  pagination?: Pagination;
}

export interface LoadRulesResponse {
  payload: Rule[];
  pagination: Pagination;
}

export interface SaveRuleResponse {
  pagination?: Pagination;
  rule: Rule;
}

export interface EventsResponse {
  payload: string[];
}

/**
 * Ensure the Rule 'id' is ALWAYS a string
 */
function validateRule(it: Rule) {
  return { ...it, id: it.id.toString() };
}

/**
 * RulesDataService provides REST services to the remote API server
 */
@Injectable()
export class RulesDataService {
  urlFor: Record<RULES_API, UrlBuilder>;

  /**
   * All Rules API require 'authorization' bearer tokens,
   * Setting context here informs the ApiAuthInterceptor to inject
   * the current access token into the request headers
   */
  readonly context = { context: new HttpContext().set(AUTHENTICATION_REQUIRED, true) };

  constructor(
    @Inject(BOOTSTRAP_SETTINGS) { rootUrl, organizationId }: BootstrapSettings,
    private httpClient: HttpClient
  ) {
    this.urlFor = makeUrlGenerator(rootUrl, organizationId).rules;
  }

  /**
   * Load a specific rule from the server
   */
  loadRuleById(id: string): Observable<LoadRuleResponse> {
    const url = this.urlFor.loadRuleById(id);
    const request$ = this.httpClient.get<LoadRuleApiResponse>(url, this.context);
    const convertAPIResponse = ({ payload, pagination: sPagination }: LoadRuleApiResponse): LoadRuleResponse => {
      const pagination = sPagination ? buildClientPagination(sPagination) : undefined;

      payload = validateRule(payload);

      return { payload, pagination };
    };

    return request$.pipe(map(convertAPIResponse));
  }

  /**
   * Support search for paginated list of rules
   * @see SearchRules type for format
   */
  searchRules(queryParams: SearchActionParams): Observable<LoadRulesResponse> {
    const { searchBy = '', page: currentPage = 1, pageSize: perPage = 12 } = queryParams;
    const url = this.urlFor.searchRules(searchBy, { currentPage, perPage });

    const request$ = this.httpClient.get<LoadRulesApiResponse>(url, this.context);

    // Convert Remote Response to Client Response
    const buildClientResponse = (response: LoadRulesApiResponse): LoadRulesResponse => {
      const { payload: list, pagination: serverPagination } = response;
      const pagination = buildClientPagination(serverPagination);

      return { payload: list.map(validateRule), pagination };
    };

    return request$.pipe(map(buildClientResponse));
  }

  /**
   * When a rule is saved, the server responds with a full paginated rule set
   * that contains the saved rule.
   * @returns full paginated data set
   */
  saveRule(rule: Partial<Rule>, options: Pagination): Observable<SaveRuleResponse> {
    const url = this.urlFor.saveRule(rule, options);
    const request$ = rule.id
      ? this.httpClient.put<SaveRuleApiResponse>(url, rule, this.context) // Update existing rule
      : this.httpClient.post<SaveRuleApiResponse>(url, rule, this.context); // Create new rule

    // Convert Remote Response to Client Response
    const buildClientResponse = (response: SaveRuleApiResponse): SaveRuleResponse => {
      const { payload: rule, pagination: sPagination } = response;
      if (sPagination) {
        const pagination = buildClientPagination(sPagination);
        return { rule: validateRule(rule), pagination };
      }
      return { rule: validateRule(rule) };
    };

    return request$.pipe(map(buildClientResponse));
  }

  /**
   * Delete a rule from the server
   */
  deleteRule(ruleID: string): Observable<void> {
    const url = this.urlFor.deleteRule(ruleID);
    const request$ = this.httpClient.delete<void>(url, this.context);

    return request$;
  }

  loadEmailTemplate(emailTemplateID: string): Observable<EmailTemplate> {
    const url = this.urlFor.loadEmailTemplate(emailTemplateID);
    const request$ = this.httpClient.get<EmailTemplate>(url, this.context);

    return request$;
  }

  loadEvents(): Observable<EventsResponse> {
    const url = this.urlFor.loadEvents();
    const request$ = this.httpClient.get<{ payload: string[] }>(url, this.context);

    return request$;
  }
}

/**
 * Convert from Server format to SPA format:
 * Extract list + pagination info from server response
 */
export function buildClientPagination(pagination: ServerPagination): Pagination {
  const noop = () => console.warn('Developers should override this function!');
  const start = (pagination.page - 1) * pagination.pageSize;
  const end = Math.min(start + pagination.pageSize, pagination.totalResults);

  return {
    setPageSize: noop,
    showPage: noop,
    currentPage: pagination.page,
    total: pagination.totalResults,
    numPages: pagination.pageSize ? Math.ceil(pagination.totalResults / pagination.pageSize) : 0,
    lastPage: pagination.numPages,
    perPage: pagination.pageSize,
    start,
    end,
  };
}
