import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { emitOnce } from '@ngneat/elf';
import {
  deleteAllEntities,
  deleteEntities,
  resetActiveIds,
  selectActiveEntities,
  selectActiveIds,
  upsertEntities,
} from '@ngneat/elf-entities';
import { deleteAllPages, selectCurrentPageEntities, setCurrentPage, setPage, updatePaginationData } from '@ngneat/elf-pagination';

import { findPage, PaginatedStore, Pagination, readFirst, updateRequestStatus } from '@degreed/rsm';
import { Rule } from '@engage/remote-api';

import { initState, RulesState } from './rules.model';

const RULES = 'rules';

export const ALLOWED_PAGESIZES = ['12', '24', '36', '48']; // options shown in the Paginator UI component

/**
 * Reactive Store for 'movies'
 */
export class RulesStore extends PaginatedStore<RulesState, Rule> {
  public rules$: Observable<Rule[]>;
  public selectedRules$: Observable<Rule[]>;
  public override state$: Observable<RulesState>;

  /**
   * Find first selected Rule + associated page number
   */
  get selectedRule(): [Rule | null, number] {
    const { pagination } = this.getState();
    const selections = readFirst<Rule[]>(this.selectedRules$);
    const rule = selections.length ? selections[0] : null;
    const page = rule ? findPage(rule.id, pagination) : 0;

    return [rule, page];
  }

  constructor() {
    super(RULES, initState);

    this.rules$ = this._store.pipe<Rule[]>(selectCurrentPageEntities());
    this.selectedRules$ = this._store.pipe(selectActiveEntities());

    this.state$ = this._store.pipe(
      map((state) => {
        const allRules = readFirst(this.rules$);
        const pagination = readFirst(this.pagination$);
        const selectedIDs = readFirst(this._store.pipe(selectActiveIds()));

        return {
          ...state,
          allRules,
          selectedIDs,
          pagination,
        };
      })
    );
  }

  /**********************************************
   * Store Methods
   **********************************************/

  /**
   * Set cache and page information for remote search
   */
  updateRules(searchBy: string, rules: Rule[], paging: Partial<Pagination>, reset = false) {
    const updateSearchBy = (state: RulesState) => ({ ...state, searchBy });

    emitOnce(() => {
      let selectedRule = null;

      if (reset) {
        // Only if reset the store (new criteria, will we 'try' to restore rule selection)
        selectedRule = this.selectedItems[0];
        this._store.update(resetActiveIds(), deleteAllEntities(), deleteAllPages());
      }

      const pagination = { ...readFirst<Pagination>(this.pagination$), ...paging };

      this._store.update(
        updateSearchBy,
        upsertEntities(rules),
        updatePaginationData(pagination),
        setPage(
          pagination.currentPage,
          rules.map((it) => it.id)
        ),
        resetActiveIds(),
        setCurrentPage(paging.currentPage),
        updateRequestStatus('success')
      );

      // Restore rule if previously selected AND found in current refresh page
      if (selectedRule && this.findItemByID(selectedRule.id)) {
        this.selectItem(selectedRule.id);
      }
    });
  }

  /**
   * Upsert rule into existing collection
   * Be sure to add the rule to the current pageset IDs; avoid duplicates
   */
  saveRule(rule: Rule, autoSelect = false): void {
    if (rule?.id) {
      const rules = readFirst<Rule[]>(this._store.pipe<Rule[]>(selectCurrentPageEntities()));
      const pagination = { ...readFirst<Pagination>(this.pagination$) };
      const uniqueIDs = [...new Set([...rules, rule].map((it) => it.id))];

      emitOnce(() => {
        this._store.update(upsertEntities([rule]), setPage(pagination.currentPage, uniqueIDs), updateRequestStatus('success'));
        if (autoSelect) {
          this.selectItem(rule.id);
        }
      });
    }
  }

  /**
   * Delete rule from existing collection
   * Be sure to remove the rule from the current pageset IDs
   * Delete in-memory from current page WITHOUT update other pages
   * this means the rules listed may be < pageSize.
   */
  deleteRule(ruleID: string): void {
    let rules = readFirst<Rule[]>(this._store.pipe<Rule[]>(selectCurrentPageEntities()));
    const pagination = { ...readFirst<Pagination>(this.pagination$) };
    rules = rules.filter((it) => it.id !== ruleID);
    const uniqueIDs = [...new Set(rules.map((it) => it.id))];

    emitOnce(() => {
      this._store.update(deleteEntities(ruleID), setPage(pagination.currentPage, uniqueIDs), updateRequestStatus('success'));
    });
  }
}
