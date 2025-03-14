import { Observable, pipe, UnaryFunction } from 'rxjs';
import { tap } from 'rxjs/operators';

import { compareState, readFirst } from '@degreed/rsm';

import { PaginationData } from '@ngneat/elf-pagination';
import { SkillsFacade } from './skills.facade';
import { OrderOptions, SearchOptions, SkillsViewModel } from './skills.state';

export interface KnownSkillsParams {
  lang: string;
  searchBy: string; // 'name' | 'description'
  orderBy: string; // 'name' | 'description' | 'updated | 'isProprietary'
  direction: string; // 'asc' | 'desc'
  page: number; // 1-based
  selected: string; // partial GUID
}

export function orderToQueryParams(order: OrderOptions): { orderBy: string; direction: string } {
  const key = Object.keys(order).length ? Object.keys(order)[0] : null;

  return key
    ? {
        orderBy: key,
        direction: String(order[key as keyof OrderOptions]).toLowerCase() || 'asc',
      }
    : { orderBy: 'name', direction: 'asc' };
}

export function cleanParams(source: KnownSkillsParams): Partial<KnownSkillsParams> {
  Object.keys(source).forEach((it) => {
    const key = it as keyof KnownSkillsParams;
    if (!source[key as keyof KnownSkillsParams]) delete source[key];
  });

  return source;
}

/**
 * The UrlSync for Skills enables bi-directional synchronization between
 * url query params and Skills 'state'.
 *
 * The UrlSync class decouples
 *   - UI components from URL synchronization details
 *   - SkillsFacade from Router details
 */
export class SkillsUrlSync {
  public isEnabled = true;
  /**
   * Create a 'rxjs' operator to tap RulesViewModel emissions and update the
   * url query params.
   */
  public updateUrl: UnaryFunction<Observable<SkillsViewModel>, Observable<SkillsViewModel>>;

  constructor(private facade: SkillsFacade) {
    // Build operator that taps a SkillsViewModel stream
    this.updateUrl = pipe(tap(this.updateUrlFrom.bind(this)));
  }

  /**
   * updateState()
   *
   * This is a 'bookmark' feature that will use the current url query params and update Facade/Store state
   * Note: if the URL does not (a) have query params or (b) has different ones,
   */
  public async updateState(): Promise<void> {
    if (!this.isEnabled) return;

    const { searchParams } = new URL(document.location.href);
    const params = this.shouldSearchAgain(searchParams);

    // If query params, check if different from current state
    if (params) {
      const options: SearchOptions = this.buildSearchOptions(params);
      const done = await this.facade.searchSkills(options);
      if (done && params.selected) {
        this.facade.selectSkill(params.selected);
      }
    }

    // If no query params AND not ready, load all
    if (!params && this.facade.state.showSkeleton) {
      this.facade.loadAll();
    }
  }

  /**
   * Always keep the URL sync'ed with current State values
   * This translate specific State properties to params that
   * will be displayed on the URL.
   */
  private updateUrlFrom(state: SkillsViewModel) {
    if (!state.isReady) return;
    if (!this.isEnabled) return;

    const url = new URL(window.location.href);
    const queryParams = this.buildQueryParams(state);
    const params: string[] = Object.keys(queryParams);

    if (params.length) {
      params.forEach((it) => {
        const key = it as keyof KnownSkillsParams;
        url.searchParams.set(key, queryParams[key] as string);
      });
      if (params.indexOf('searchBy') < 0) {
        url.searchParams.delete('searchBy');
      }
      if (params.indexOf('selected') < 0) {
        url.searchParams.delete('selected');
      }

      window.history.replaceState({}, '', url);
    }
  }

  // ********************************************************
  // Private Methods
  // ********************************************************

  /**
   * Convert url query params to SearchOptions
   */
  private buildSearchOptions(params: KnownSkillsParams): SearchOptions {
    const { searchBy: name, orderBy, direction, page } = params;
    const order: OrderOptions = { [orderBy]: direction.toUpperCase() };
    const pagination = { currentPage: page } as PaginationData;
    const searchBy = { name };

    return { searchBy, order, pagination, isProprietary: false, associatedWithOrg: false, languageCode: params.lang };
  }

  /**
   * Convert RulesState to specific paramters we wish to expose/publish on URL
   * NOTE: this Synchronizer manages 'which' params to publish on URL
   */
  private buildQueryParams({ selectedLanguage: lang, searchOptions, selected, pagination }: SkillsViewModel): Partial<KnownSkillsParams> {
    // Build 'selected' param with 1st 8-chars of selected rule.id
    const shortUUID = selected ? selected.id.substr(0, 8) : '';
    const page = pagination?.currentPage || 1;
    const orderParams = orderToQueryParams(searchOptions.order);

    return cleanParams({
      lang,
      page,
      searchBy: searchOptions.searchBy?.name || '',
      selected: shortUUID,
      ...orderParams,
    } satisfies KnownSkillsParams);
  }

  private fromSearchParams(searchParams: URLSearchParams): KnownSkillsParams {
    const keys = ['lang', 'searchBy', 'orderBy', 'direction', 'page', 'selected'];
    const fromUrl = keys.reduce((params, key: string) => {
      let value: string | number | null = searchParams.get(key);
      if (value) {
        if (key === 'page') {
          value = parseInt(value, 10);
        }
        if (key === 'direction') {
          value = String(value).toUpperCase();
        }
      }

      return value ? { ...params, [key]: value } : params;
    }, {});

    return fromUrl as KnownSkillsParams;
  }
  /**
   * transform route params to equivalent state criteria. If current state does not match,
   * this trigger actions and possible reload movies...
   */
  private shouldSearchAgain(incoming: URLSearchParams): KnownSkillsParams | null {
    const fromUrl = this.fromSearchParams(incoming);
    const numFromUrl = Object.keys(incoming).length;

    const vm = readFirst<SkillsViewModel>(this.facade.vm$);
    const current = this.buildQueryParams(vm);

    // If the url has queryParams, use those keys to compare
    // otherwise use the current state keys
    const keysToCompare = Object.keys(numFromUrl ? fromUrl : current);

    return compareState<KnownSkillsParams>(fromUrl, current, keysToCompare);
  }
}
