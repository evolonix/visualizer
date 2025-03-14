import { ElfStoreState, Pagination } from '@degreed/rsm';
import { Rule, RuleEvent } from '@engage/remote-api';

/**
 * Uniquely identify Rule in *ngFor loops
 */
export const trackByID = (m: Rule) => m.id;

/**
 * This state is serializable
 */
export interface RulesState extends ElfStoreState {
  searchBy: string;
  selectedIDs: string[];
  allRules: Rule[];
  pagination: Pagination;
  events: RuleEvent[];
}

export function initState(): Partial<RulesState> {
  return {
    searchBy: '',
    selectedIDs: [],
    allRules: [],
    pagination: {} as Pagination,
    events: [],
  };
}

/**
 * Params for stream emissions that will trigger `search(searchBy, parge, pageSize)`
 */
export interface SearchActionParams {
  searchBy?: string;
  page?: number;
  pageSize?: number;
}
