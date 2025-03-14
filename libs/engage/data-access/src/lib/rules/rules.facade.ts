/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Injectable } from '@angular/core';

import { select } from '@ngneat/elf';
import { produce } from 'immer';
import { forkJoin, lastValueFrom, Observable, of, pipe, UnaryFunction } from 'rxjs';
import { map, pluck, switchMap, tap } from 'rxjs/operators';

import { AnalyticsService } from '@degreed/core-angular';
import { Pagination, readFirst, StatusState } from '@degreed/rsm';
import { EmailTemplate, Rule, RuleEvent } from '@engage/remote-api';

import { EngageFeatureFlags } from './../feature-flags';
import { RuleActions } from './rules.analytics';
import { LoadRulesResponse, RulesDataService, SaveRuleResponse } from './rules.data-service';
import { RulesState, SearchActionParams } from './rules.model';
import { RulesStore } from './rules.store';
import { loadEmailTemplates, makeEventDisplay } from './utils';

const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 12,
};

/**********************************************
 * ViewModel published to UI layers (from Facade)
 **********************************************/

/**
 * This is a simple API meant for use within the
 * UI layer html templates
 */
export interface RuleAPI {
  selectRule: (ruleID: string) => void;
  deleteRule: (ruleID: string) => void;
}

export type RulesViewModel = RulesState & RuleAPI;

// When reseting the store, this hook allows externals actions before the store data is updated
// Default == Identity hook (no-op)
export type StoreResetHook<T> = UnaryFunction<Observable<T>, Observable<T>>;
const DEFAULT_HOOK: StoreResetHook<LoadRulesResponse> = pipe(tap(() => {}));

/**
 * Load rules and cache results for similar future calls.
 *
 * Reactive Architecture:
 *       UI <-> ViewModel <-> Facade <-> Store
 *                                 |-->  DataService
 */
@Injectable()
export class RulesFacade {
  public vm$: Observable<RulesViewModel>;
  public status$: Observable<StatusState>;
  public events$: Observable<RuleEvent[]>;
  public isLoading$: Observable<boolean>; // to show loading indicator while 'pending'
  public showSkeleton$: Observable<boolean>;

  public selectedRules$: Observable<Rule[]>;

  public storeResetHook = DEFAULT_HOOK;

  constructor(
    private analytics: AnalyticsService,
    private _store: RulesStore,
    private _api: RulesDataService
  ) {
    this.vm$ = _store.state$.pipe(map(this.addViewModelAPI.bind(this)));
    this.selectedRules$ = _store.selectedRules$;
    this.events$ = _store.state$.pipe(select((state) => state.events));

    this.status$ = _store.status$; // surface possbile error information
    this.isLoading$ = _store.isLoading$;
    this.showSkeleton$ = _store.showSkeleton$;

    // On facade intialization, we want the events that drive the dropdown to be loaded for use.  Since these values are not subject to change often, this only needs to occur once
    this.loadEventLookups();
  }

  // ********************************************************
  // Integrate support for Feature Flags
  // ********************************************************

  /**
   * Configuration of features flags for RulesFacade
   */
  private features = new EngageFeatureFlags();

  /**
   * Immutable snapshot of current state
   */
  get state(): RulesState {
    return this._store.getState();
  }

  // ********************************************************
  // Public Methods
  // ********************************************************

  loadRules(searchBy = '', page = DEFAULT_PAGINATION.PAGE, pageSize = DEFAULT_PAGINATION.PAGE_SIZE): Observable<RulesViewModel> {
    // Subscribe/read to trigger standalone process
    readFirst(this.searchRules({ searchBy, page, pageSize }));
    return this.vm$;
  }

  /**
   * Search rules
   *
   * Use cache to skip remote load
   * Auto-save to cache; based on specified search keys
   * Also smart prefetch next page...
   */
  searchRules({
    searchBy = '',
    page = DEFAULT_PAGINATION.PAGE,
    pageSize = DEFAULT_PAGINATION.PAGE_SIZE,
  }: SearchActionParams): Observable<boolean> {
    return new Observable((subscriber) => {
      const [reset, hideSkeletonDelay] = this.shouldResetStore(searchBy, pageSize);
      if (reset) {
        this._store.showSkeleton();
      }

      this._api
        .searchRules({ searchBy, page, pageSize })
        .pipe(hideSkeletonDelay, this._store.trackLoadStatus())
        .subscribe({
          next: (response: LoadRulesResponse) => {
            const { payload: list, pagination } = response;

            this._store.updateRules(searchBy, list, pagination, reset);
            this.prefetchPage(searchBy, page + 1, pageSize);

            const queryParams = { searchBy, page, pageSize };
            this.analytics.report(RuleActions.rulesSearched(queryParams));

            subscriber.next(true);
            subscriber.complete();
          },
          error: (val) => subscriber.error(val),
        });
    });
  }

  /**
   * Load a rule from memory.
   *
   * If the rule is not in memory, load from server but do NOT add to store
   * If the outcome templates are missing then load them BEFORE you
   * return the rule.
   *
   * Why?
   *    - Cannot add the rule to store since we do not know
   *    - which page 'contains' the rule
   */
  loadRule(ruleID: string): Observable<Rule> {
    const rule = this._store.findItemByID<Rule>(ruleID);
    const [needsTemplates] = rule ? loadEmailTemplates(rule, this._api, false) : [false];

    // prettier-ignore
    const request$ = rule ? of(rule) : this._api.loadRuleById(ruleID).pipe(
        this._store.trackLoadStatus(), 
        pluck('payload'),
      );
    const loadTemplates = (rule: Rule) => this.loadRuleTemplates(rule);
    const saveToStore = (rule: Rule) => needsTemplates && this._store.saveRule(rule);

    return request$.pipe(switchMap(loadTemplates), tap(saveToStore));
  }

  /**
   * Save existing or add new rule and return the Rule (from the server) or null.
   * Note: If consumers are interested in the fail error, they can subscribe to the store's status$
   */
  async saveRule(rule: Partial<Rule>): Promise<Rule | null> {
    return lastValueFrom(
      new Observable((observer) => {
        const onUpdateStore = ({ rule, pagination }: SaveRuleResponse) => {
          const page = pagination?.currentPage ?? DEFAULT_PAGINATION.PAGE;
          const pageSize = pagination?.perPage ?? DEFAULT_PAGINATION.PAGE_SIZE;
          const [samePage, sameSize, params] = this.hasSearchParamsChanged({ page, pageSize });
          const { allowAutoNavigation, allowRuleSelection } = this.features;

          if ((!samePage || !sameSize) && allowAutoNavigation) {
            // Should we reset entire in-memory cache and reload specified page?
            const reloading$ = this.searchRules(params).pipe(
              tap(() => {
                if (allowRuleSelection) this._store.selectItem(rule.id);
              }),
              map(() => rule as Rule)
            );

            // Do not 'autoSelect()' since 'searchRules()' already sets the correct page
            return reloading$;
          } else {
            // Just add the rule into the current pageset
            this._store.saveRule(rule, allowRuleSelection);
            return this.autoSelectAfter<Rule>(of(rule));
          }
        };
        const pagination = readFirst<Pagination>(this._store.pagination$);
        const saveOnServer$ = this._api.saveRule(rule, pagination).pipe(this._store.trackLoadStatus(), switchMap(onUpdateStore));

        const isNewRule = rule.id ? false : true;

        saveOnServer$.subscribe({
          next: (rule) => {
            this.analytics.report(RuleActions.ruleSaved(rule, isNewRule));

            observer.next(rule);
            observer.complete();
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error: (error: any) => {
            {
              console.error(`Failed to save rule: ${JSON.stringify(error)}`);
            }
            observer.next(null);
            observer.complete();
          },
        });
      })
    );
  }

  /**
   * Delete existing rule from the server.
   * Note: If consumers are interested in the fail error, they can subscribe to the store's status$
   * We are using `new Observable()` instead of `map()` operator becuase the `store.delete()`
   * is a true side effect and not a stream value transformation.
   */
  async deleteRule(ruleID: string): Promise<void> {
    return lastValueFrom(
      new Observable((observer) => {
        const saveOnServer$ = this._api.deleteRule(ruleID).pipe(this._store.trackLoadStatus());

        saveOnServer$.subscribe({
          next: () => {
            const rule = this._store.findItemByID<Rule>(ruleID)!;

            // Just add the rule into the current pageset
            this._store.deleteRule(ruleID);
            this.analytics.report(RuleActions.ruleDeleted(rule));

            observer.next();
            observer.complete();
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error: (error: any) => {
            {
              console.error(`Failed to save rule: ${JSON.stringify(error)}`);
            }
            observer.next();
            observer.complete();
          },
        });
      })
    );
  }

  /**
   * Select (in-memory only) the specified rule (and deselect any others)
   * @param ruleID String that is a full or partial rule GUID
   */
  async selectRule(partialID: string, clearOthers = true): Promise<Rule | undefined> {
    const { allowRuleSelection } = this.features;
    const rule = allowRuleSelection ? this._store.findItemByID<Rule>(partialID) : undefined;

    if (allowRuleSelection && rule) {
      this._store.selectItem(rule.id, clearOthers);
    }

    return Promise.resolve(rule);
  }

  // *******************************************************
  // Pagination Methods
  //
  // Note: these are async/await methods to allow the
  //       immediate triggering of the request and allows
  //       caller to monitor success.
  // *******************************************************

  /**
   * Show rules at page #... load if not in cache already
   * Always try to prefetch next page from 'selected'
   */
  async showPage(page = 1): Promise<boolean> {
    const inRange = this._store.pageInRange(page);
    let request$ = of(inRange ? true : false);

    if (inRange) {
      const fromCache = this._store.selectPage(page);
      const {
        searchBy,
        pagination: { perPage: pageSize },
      } = this._store.getState();

      // Should silently auto load next page?
      if (fromCache) {
        if (!this._store.hasPage(page + 1)) {
          this.prefetchPage(searchBy, page + 1, pageSize);
        }
      } else {
        // Since we are deliberately navigating to a page, we will NOT use 'autoSelectAfter()';
        // which could change the destination page.
        request$ = this.searchRules({ searchBy, page, pageSize });
      }
    }

    // For async/await + immediate subscribe()
    return lastValueFrom(request$);
  }

  /**
   * On pageSize changes, simply reload from page 1 with all new data.
   * Note: this is a naive, brute-force solution...
   */
  async setPageSize(pageSize: number): Promise<boolean> {
    let request$ = of(true);
    const {
      searchBy,
      pagination: { perPage: current, currentPage: page },
    } = this._store.getState();
    if (pageSize !== current) {
      this._store.showSkeleton(); // full reset of pages

      const search$ = this.searchRules({ searchBy, page, pageSize });
      request$ = this.autoSelectAfter<boolean>(search$);
    }

    // For async/await + immediate subscribe()
    return lastValueFrom(request$);
  }

  // *******************************************************
  // Private Methods
  // *******************************************************

  /**
   * Scan Rule for missing outcome templates.
   * If missing load all missing template and update the
   * rule's outcomes with the loaded templates.
   *
   * NOTE: the rule is immutable and must be updated with immer::produce()
   */
  private loadRuleTemplates(rule: Rule): Observable<Rule> {
    const [shouldLoad, templatesToLoad] = loadEmailTemplates(rule, this._api);

    return new Observable((subscriber) => {
      const onRequestsDone = (templates: EmailTemplate[]) => {
        // Use immer::produce() to update the immuatable rule's outcomes with the email templates
        rule = produce(rule, (draft: Rule) => {
          templates.forEach((t) => {
            // For each server template , update the rule's outcomes
            draft.outcomes = draft.outcomes.map((outcome) => {
              const matches = outcome.emailTemplate?.id === t.id;
              return matches ? { ...outcome, emailTemplate: t } : outcome;
            });
          });
        });

        subscriber.next(rule);
        subscriber.complete();
      };

      // If any outcomes are missing emailTemplates, load them
      if (shouldLoad) {
        forkJoin(templatesToLoad).subscribe({
          next: onRequestsDone,
          error: (val) => subscriber.error(val),
        });
      } else {
        subscriber.next(rule);
        subscriber.complete();
      }
    });
  }

  private autoSelectAfter<T>(action$: Observable<T>): Observable<T> {
    if (!this.features.allowAutoNavigation) return action$;

    const autoSelectRule = () => {
      // Restore selection if possible and select corresponding page
      const selectedIds = this._store.selectedIDs;
      this._store.selectPageWithItem(selectedIds[0]);
    };

    return action$.pipe(tap(autoSelectRule));
  }

  /**
   * If pageSize OR searchBy changes, then clear store and
   * reload data as needed.
   * @returns boolean
   */
  shouldResetStore(searchBy = '', pageSize = 10): [boolean, StoreResetHook<LoadRulesResponse>] {
    const { pagination, ...state } = this._store.getState();
    const previousPageSize = pagination.perPage;
    const reset = pageSize != previousPageSize || state.searchBy !== searchBy;

    return [reset, reset ? this.storeResetHook : DEFAULT_HOOK];
  }

  /**
   * Background prefetch for super-fast page navigation rendering
   * NOTE: do not update status for background prefetching
   */
  private prefetchPage(searchBy: string, page: number, pageSize: number) {
    if (this._store.pageInRange(page) && !this._store.hasPage(page)) {
      const request$ = this._api.searchRules({ searchBy, page, pageSize });
      request$.subscribe(({ payload: list }: LoadRulesResponse) => {
        this._store.addPage(list, page, false);
      });
    }
  }

  /**
   * Inject the Facade combineLatest proxy API into view model
   */
  private addViewModelAPI(state: RulesState): RulesViewModel {
    // Override default showPage with custom functionality to prefetch next page
    state.pagination.showPage = this.showPage.bind(this);
    state.pagination.setPageSize = this.setPageSize.bind(this);

    // Override default showPage with custom functionality to prefetch next page
    state.pagination.showPage = this.showPage.bind(this);
    state.pagination.setPageSize = this.setPageSize.bind(this);

    return {
      ...state,
      selectRule: this.selectRule.bind(this),
      deleteRule: this.deleteRule.bind(this),
    };
  }

  /**
   * Check if the search params specified are DIFFERENT than those in the in-memory store
   * if so, we must refresh the store.
   */
  private hasSearchParamsChanged(params: SearchActionParams): [boolean, boolean, SearchActionParams] {
    const { pagination: p, ...s } = readFirst<RulesViewModel>(this.vm$);

    params.searchBy ||= s.searchBy;
    params.page ||= p.currentPage;
    params.pageSize ||= p.perPage;

    // Note: that currentPage is not considered a change that will reforce a store reset!
    const sameSize = params.pageSize === p.perPage;
    const samePage = params.page === p.currentPage;

    return [samePage, sameSize, params];
  }

  /**
   * One time lookup of events during facade intiailization
   */
  private loadEventLookups() {
    return this._api
      .loadEvents()
      .pipe(
        map(({ payload: events }) => {
          return events.map(makeEventDisplay);
        })
      )
      .subscribe((events) => {
        this._store.update((state) => ({ ...state, events }));
      });
  }
}
