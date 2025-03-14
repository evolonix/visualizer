/* eslint-disable @typescript-eslint/no-empty-interface */

import { EntityRestResponse, Entity, ServerPagination } from '../_responses';
import { Rule } from './rule-model';

export interface PaginatedRestResponse<T extends Entity | Entity[]> extends EntityRestResponse<T> {
  pagination: ServerPagination;
}

/**
 * ******************************************
 * Remote API response for Rules
 * ******************************************
 */

/**
 * Load a paginated set of rules matching specified criteria
 * NOTE: criteria is specified in request: pageSize | page | sort | sortDirection | filter | searchBy
 */
export interface LoadRulesApiResponse extends PaginatedRestResponse<Rule[]> {}

/**
 * Load a rule
 */
export interface LoadRuleApiResponse extends EntityRestResponse<Rule> {
  pagination?: ServerPagination;
}

/**
 * Save a new or updated rule.
 *
 * NOTE: Always return pagination information for clients that need associated pageset info.
 *       The client is reponsible for subsequent calls to loadRules(); if needed
 *       Even if only 1 page is present, still return the Pagination information
 */
export interface SaveRuleApiResponse extends PaginatedRestResponse<Rule> {}
