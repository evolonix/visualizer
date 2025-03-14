import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { compareState, delayAtLeast, readFirst } from '@degreed/rsm';
import { Rule } from '@engage/remote-api';
import { getActiveEntities } from '@ngneat/elf-entities';

import { Observable, pipe, UnaryFunction } from 'rxjs';
import { tap } from 'rxjs/operators';

import { EngageFeatureFlags, FeatureFlagsService } from './../feature-flags';

import { ALLOWED_PAGESIZES, RulesFacade, RulesState, RulesStore, RulesViewModel } from './';

interface KnownParams {
  searchBy: string;
  pageSize: number;
  page: number;
  selected: string;
}

/**
 * Which params are 'expected' to be on the URL?
 * NOTE: OPTIONAL_PARAMS = ['selected', 'flags'];
 */
const URL_PARAMS = ['searchBy', 'pageSize', 'page'];

/**
 * The UrlSync for Rules enables bi-directional synchronization between
 * url query params and Rules 'state'.
 *
 * The UrlSync class decouples
 *   - UI components from URL synchronization details
 *   - RulesFacade from Router details
 */
@Injectable()
export class RulesUrlSync {
  /**
   * Create a 'rxjs' operator to tap RulesViewModel emissions and update the
   * url query params.
   */
  public updateUrl: UnaryFunction<Observable<RulesViewModel>, Observable<RulesViewModel>>;

  constructor(
    private features: FeatureFlagsService,
    private facade: RulesFacade,
    private store: RulesStore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.listenOnFeatureFlags();

    /**
     * When resetting the store data, delay store 'updates' to allow show skeleton UI
     *
     * NOTE: We keep the `delay()` out of the facade to keep the state changes synchronous
     *       and avoid flush() requirements during testing
     *
     * @TODO: Use a 500ms fade animation to skeleton hide and this interceptor will no longer be needed.
     */
    facade.storeResetHook = delayAtLeast(450);

    // Build operator that taps a RulesViewModel stream
    this.updateUrl = pipe(tap(this.updateUrlFrom.bind(this)));
  }

  /**
   * Whenever feature flags change, then update the URL
   */
  private listenOnFeatureFlags() {
    this.features.subscribe(() => {
      // coercion as RulesViewModel for query params
      this.updateUrlFrom(this.facade.state as RulesViewModel);
    });
  }

  /**
   * Capture URL configuration for featureFlags and override the current
   */
  private updateFeatureFlags() {
    const flags = this.route.snapshot.queryParams['flags'];
    if (flags) {
      this.features.updateFlags(new EngageFeatureFlags(parseInt(flags, 10)));
    }
  }

  /**
   * updateState()
   *
   * This is a 'bookmark' feature that will use the current url query params and
   * update the RulesState to match.
   * Note: if the URL does not (a) have query params or (b) has different ones,
   * then auto-config default values in the RulesState
   */
  public updateState() {
    this.updateFeatureFlags();

    const incoming = validateUrlParams(this.route.snapshot.queryParams);
    const params = this.shouldSearchAgain(incoming);
    if (params) {
      const search$ = this.facade.searchRules(params);

      const autoSelect = () => {
        if (params.selected) {
          this.facade.selectRule(params.selected);
        }
      };
      readFirst(search$.pipe(tap(autoSelect)));
    }
  }

  /**
   * Always keep the URL sync'ed with current Rules State values
   * This translate specific Rules State properties to params that
   * will be displayed on the URL.
   */
  private updateUrlFrom(state: RulesViewModel) {
    const queryParams = this.buildQueryParams(state);
    if (queryParams) {
      this.router.navigate([], {
        queryParams,
        relativeTo: this.route,
        replaceUrl: true,
      });
    }
  }

  // ***************************************************************
  // Router Integration
  // ***************************************************************

  /**
   * Convert RulesState to specific paramters we wish to expose/publish on URL
   * NOTE: this Synchronizer manages 'which' params to publish on URL
   */
  private buildQueryParams({ pagination, searchBy }: RulesState): Params | null {
    const { currentPage: page, perPage: pageSize } = pagination;

    // Build 'selected' param with 1st 8-chars of selected rule.id
    const selections = this.store.useQuery<Rule[]>(getActiveEntities());
    const selected = selections.length ? selections[0].id.substring(0, 8) : null;
    const { allowRuleSelection } = this.features.flags;
    const showRule = selected && allowRuleSelection;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryParams = { searchBy, pageSize, page, selected } as any;

    // prettier-ignore
    if (page > 0) {
        if (!searchBy) delete queryParams.searchBy;
        if (!pageSize)  delete queryParams.pageSize;
        if (!showRule) delete queryParams.selected;
        if (page < 1)  delete queryParams.page;
  
        return queryParams;
      }
    return null;
  }

  /**
   * transform route params to equivalent state criteria. If current state does not match,
   * this trigger actions and possible reload movies...
   */
  private shouldSearchAgain(incoming: Partial<KnownParams>): KnownParams | null {
    const { pagination, searchBy, requestStatus } = this.store.getState();
    const isReady = requestStatus?.value !== 'initializing';
    const defaults = { searchBy, page: 1, pageSize: 12 } as KnownParams;

    const current = { searchBy, pageSize: pagination.perPage, page: pagination.currentPage };
    const updated = compareState<KnownParams>(incoming, current, URL_PARAMS);

    return updated || (!isReady ? defaults : null);
  }
}

/**
 * Convert query param strings to validate Param types/values
 * @param params Hashmap of strings
 * @returns KnownParams
 */
function validateUrlParams(params: Params): Partial<KnownParams> {
  const { searchBy, page, pageSize, selected } = params;
  const validSize = pageSize ? ALLOWED_PAGESIZES.indexOf(pageSize) > -1 : false;

  const state = {
    searchBy,
    selected,
    // Convert to numbers...
    page: page ? parseInt(page, 10) : undefined,
    pageSize: validSize ? parseInt(pageSize, 10) : undefined,
  } as Partial<KnownParams>;

  // Delete keys so `compareState()` calls will skip the 'deleted' key
  // eg not be considered for comparison logic
  if (!page) delete state.page;
  if (!pageSize) delete state.pageSize;
  if (!searchBy) delete state.searchBy;
  if (!selected) delete state.selected;

  return state;
}
