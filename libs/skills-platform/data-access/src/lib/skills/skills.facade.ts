/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { readFirst, StatusState } from '@degreed/rsm';

import { SkillsDataService } from './skills.data-service';
import { Skill, skillForLanguage, SkillLocalized } from './skills.model';
import { OrderOptions, SearchOptions, SkillsAPI, SkillsDataModel, SkillsState, SkillsViewModel, toggleOrderBy } from './skills.state';
import { SkillsStore } from './skills.store';
import { sortAndMatch } from './skills.utils';

/**
 * Load Skills and cache results for similar future calls.
 *
 * Reactive Architecture:
 *       UI <-> ViewModel <-> Facade <-> Store
 *                                 |-->  DataService
 */
export class SkillsFacade {
  public vm$: Observable<SkillsViewModel>;
  public status$: Observable<StatusState>;
  public isLoading$: Observable<boolean>; // to show loading indicator while 'pending'
  public showSkeleton$: Observable<boolean>;

  constructor(
    private _store: SkillsStore,
    private _api: SkillsDataService
  ) {
    const addComputedAPI = map(this.addComputedAPI.bind(this));
    const addViewModelAPI = map(this.addViewModelAPI.bind(this));

    this.vm$ = _store.state$.pipe(addComputedAPI, addViewModelAPI);

    this.status$ = _store.status$; // surface possbile error information
    this.isLoading$ = _store.isLoading$;
    this.showSkeleton$ = _store.showSkeleton$;
  }

  // ********************************************************
  // Integrate support for Feature Flags
  // ********************************************************

  /**
   * Immutable snapshot of current state
   */
  get state(): SkillsState {
    return this._store.getState();
  }

  // ********************************************************
  // Public Methods
  // ********************************************************

  async loadAll(name = ''): Promise<boolean> {
    const trackRequest = this._store.makeTrackRequest<boolean>('loadAll');

    return trackRequest(async (): Promise<boolean> => {
      this._store.showSkeleton();
      const options = { ...this.state.searchOptions, searchBy: { name } } as SearchOptions;

      // Subscribe/read to trigger standalone process
      const [payload] = await this._api.searchSkills(name, options);
      if (payload) {
        const [list, pagination] = payload;
        this._store.updateSkills(list, { ...options, pagination }, true);
      }

      return !!payload;
    });
  }

  /**
   * Search Skills
   *
   * Use cache to skip remote load
   * Auto-save to cache; based on specified search keys
   * Also smart prefetch next page...
   */
  async searchSkills(criteria?: Partial<SearchOptions>, reset = true): Promise<boolean> {
    const trackRequest = this._store.makeTrackRequest<boolean>('searchSkills');
    const options = { ...this.state.searchOptions, ...criteria };

    const languageOptionsLoaded = this.state.allLanguages.length > 0;
    const needsFastUpdate =
      options.searchBy?.name !== criteria?.searchBy?.name || this.state.searchOptions.languageCode !== options?.languageCode;

    return trackRequest(async (): Promise<boolean> => {
      // Only reset page if reseting AFTER initial load
      // this allows deep links to specify page >
      if (reset && !this.state.showSkeleton) {
        this._store.showSkeleton();
        options.pagination = { currentPage: 1 };
      }

      // Optimistic (fast) update of search criteria or display-skill-in-language change
      if (needsFastUpdate) {
        this._store.update((state: SkillsState) => {
          const { searchBy, languageCode } = options;

          state.searchOptions.searchBy = options.searchBy;
          state.searchOptions = { ...state.searchOptions, searchBy, languageCode };

          return state;
        });
      }

      // Load languages first
      if (!languageOptionsLoaded) {
        const [languages] = await this._api.loadLanguages('ALL');
        if (languages) this._store.updateLanguages(languages);
      }

      // Load skills based on search options
      const [payload, error] = await this._api.searchSkills(options.searchBy?.name || '', options);
      if (payload) {
        const [list, pagination] = payload;

        this._store.updateSkills(list, { ...options, pagination }, reset);
        this.prefetchPage(pagination.currentPage + 1, options);
      }

      return !!payload;
    });
  }

  selectSkill(skillId: string, markAsSelected = true, excludeOthers = true) {
    this._store.markAsSelected(skillId, markAsSelected, excludeOthers);
  }

  /**
   * Set sort order for Skills, toggle direction if sort field is the same
   */
  async sortSkills(sortBy: keyof OrderOptions): Promise<boolean> {
    const toggleSortDirection = (options: SearchOptions) => {
      let current = { ...options.order };
      if (!current[sortBy]) current = {}; // clear previous sort if current is a different field
      current[sortBy] = toggleOrderBy(current[sortBy]);

      return { ...options, order: current };
    };
    let result = true;
    const updated = toggleSortDirection(this.state.searchOptions);
    const paging = this.state.pagination!;
    const allInMemory = paging.total <= paging.perPage;

    if (allInMemory) {
      // If all data is already loaded then just sort...
      this._store.update((state: SkillsState) => {
        state.searchOptions = updated;
      });
    } else {
      result = await this.searchSkills(updated);
    }

    return result;
  }

  // *******************************************************
  // Pagination Methods
  //
  // Note: these are async/await methods to allow the
  //       immediate triggering of the request and allows
  //       caller to monitor success.
  // *******************************************************

  /**
   * Show Skills at page #... load if not in cache already
   * Always try to prefetch next page from 'selected'
   */
  async showPage(page = 1): Promise<boolean> {
    const inRange = this._store.pageInRange(page);

    if (inRange) {
      const { searchOptions } = this.state;
      const language = searchOptions.languageCode || 'en';
      const fromCache = this._store.hasPageForLanguage(language, page);

      if (fromCache) {
        this._store.selectPage(page);

        // Should silently auto load next page?
        if (!this._store.hasPage(page + 1)) {
          this.prefetchPage(page + 1, searchOptions);
        }
      } else {
        // Since we are deliberately navigating to a page,
        // and we need MORE server-side data, will we not reset the store
        const pagination = { currentPage: page };
        return await this.searchSkills({ pagination }, false);
      }
    }

    return inRange;
  }

  async selectLanguage(lang = 'en'): Promise<boolean> {
    if (this.state.searchOptions.languageCode === lang) return true;

    const fastUpdate = this._store.hasPageForLanguage(lang, 1);
    if (fastUpdate) {
      this._store.update((state: SkillsState) => {
        state.searchOptions.languageCode = lang;
        return state;
      });
      this.showPage(1);
    } else {
      await this.searchSkills({ languageCode: lang, pagination: { currentPage: 1 } }, false);
    }

    return true;
  }

  // *******************************************************
  // Private Methods
  // *******************************************************

  /**
   * Background prefetch for super-fast page navigation rendering
   * NOTE: do not update status for background prefetching
   */
  private async prefetchPage(page: number, options: Partial<SearchOptions>) {
    const languageCode = options.languageCode || this.state.searchOptions.languageCode || 'en';
    if (this._store.pageInRange(page) && !this._store.hasPageForLanguage(languageCode, page)) {
      const name = options.searchBy?.name || '';
      const searchWith = { ...options, pagination: { currentPage: page }, languageCode } as SearchOptions;

      const [payload, error] = await this._api.searchSkills(name, searchWith);
      if (payload) {
        const [list] = payload;
        this._store.addPage(list, page, false);
      }

      return !!error;
    }

    return true;
  }

  /**
   * Convert SkillLocalized[] to Skill[] for UI consumption
   */
  private addComputedAPI(state: SkillsState): SkillsDataModel {
    const { searchOptions, allLocalizedSkills } = state;
    const selectedSkills = readFirst<SkillLocalized[]>(this._store.selectedSkills$) || [];
    const selectedLanguage = searchOptions.languageCode || 'en';

    const first = (list: Skill[]) => (list.length ? list[0] : null);
    const toSkills = (list: SkillLocalized[]) => list.map((it) => skillForLanguage(it, selectedLanguage));

    const selected = first(toSkills(selectedSkills));
    const allSkills = sortAndMatch(toSkills(allLocalizedSkills), state.searchOptions);

    return { ...state, allSkills, selected, selectedLanguage };
  }

  private api = {
    searchByName: (partial: string) => this.searchSkills({ searchBy: { name: partial, description: partial } }),
    sortByField: this.sortSkills.bind(this),
    showPage: this.showPage.bind(this),
    selectLanguage: this.selectLanguage.bind(this),
    selectSkill: this.selectSkill.bind(this),
  } satisfies SkillsAPI;

  /**
   * Inject the Facade combineLatest proxy API into view model
   */
  private addViewModelAPI(state: SkillsDataModel): SkillsViewModel {
    return {
      ...state,
      api: this.api,
    } satisfies SkillsViewModel;
  }
}
