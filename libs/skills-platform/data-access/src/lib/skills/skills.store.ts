import { PaginatedStore, Pagination, readFirst, updateRequestStatus } from '@degreed/rsm';
import { deleteAllEntities, resetActiveIds, selectActiveEntities, selectActiveIds, upsertEntities } from '@ngneat/elf-entities';
import { deleteAllPages, selectCurrentPageEntities, setCurrentPage, setPage, updatePaginationData } from '@ngneat/elf-pagination';
import { Observable, map } from 'rxjs';

import { emitOnce } from '@ngneat/elf';
import { SkillLanguages, SkillLocalized } from './skills.model';
import { SearchOptions, SkillsState, initSkillsState } from './skills.state';
import { hasLanguage, mergeLocalizations } from './skills.utils';

const STORE_NAME = 'skaas-skills';

export class SkillsStore extends PaginatedStore<SkillsState, SkillLocalized> {
  public skills$: Observable<SkillLocalized[]>;
  public selectedSkills$: Observable<SkillLocalized[]>;

  public override state$: Observable<SkillsState>;

  constructor() {
    super(STORE_NAME, initSkillsState);

    this.skills$ = this._store.pipe<SkillLocalized[]>(selectCurrentPageEntities());
    this.selectedSkills$ = this._store.pipe(selectActiveEntities());

    this.state$ = this._store.pipe(
      map((state) => {
        const allLocalizedSkills = readFirst(this.skills$);
        const pagination = readFirst(this.pagination$);
        const selectedIDs = readFirst(this._store.pipe(selectActiveIds()));

        return {
          ...state,
          allLocalizedSkills,
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
  updateSkills(skills: SkillLocalized[], options: Partial<SearchOptions>, reset = false) {
    const updateSearch = (state: SkillsState) => {
      state.searchOptions = { ...state.searchOptions, ...options };
      return state;
    };

    emitOnce(() => {
      let selectedRule = null;

      if (reset) {
        // Only if reset the store (new criteria, will we 'try' to restore rule selection)
        selectedRule = this.selectedItems[0];
        this._store.update(resetActiveIds(), deleteAllEntities(), deleteAllPages());
      }

      const pagination = { ...readFirst<Pagination>(this.pagination$), ...options.pagination };

      skills = mergeLocalizations(this.getPagedEntities(pagination.currentPage), skills);

      this._store.update(
        updateSearch,
        upsertEntities(skills),
        updatePaginationData(pagination),
        setPage(
          pagination.currentPage,
          skills.map((it) => it.id)
        ),
        resetActiveIds(),
        setCurrentPage(pagination.currentPage),
        updateRequestStatus('success')
      );

      // Restore rule if previously selected AND found in current refresh page
      if (selectedRule && this.findItemByID(selectedRule.id)) {
        this.selectItem(selectedRule.id);
      }
    });
  }

  updateLanguages(languages: SkillLanguages) {
    this._store.update((state) => {
      state.allLanguages = languages;
      return state;
    });
  }

  selectLanguage(selectedLanguage: string) {
    const state = this._store.getValue() as SkillsState;
    const currrentLang = state.searchOptions.languageCode;
    if (selectedLanguage !== currrentLang) {
      this._store.update((state) => {
        state.searchOptions.languageCode = selectedLanguage;
        return state;
      });
    }
  }

  /**
   * Check to see if the current page (or all pages)
   * have skills loaded for the specified language.
   *
   */
  hasPageForLanguage(lang: string, page?: number): boolean {
    const scanIfLoaded = (allSkills: SkillLocalized[]) =>
      allSkills.reduce<boolean>((acc, it) => {
        return acc || hasLanguage(it, lang);
      }, false);

    return scanIfLoaded(this.getPagedEntities(page));
  }
}
