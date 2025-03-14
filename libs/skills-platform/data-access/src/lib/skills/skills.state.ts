import { ElfStoreState, Pagination } from '@degreed/rsm';
import { PaginationData } from '@ngneat/elf-pagination';
import { Skill, SkillLanguages, SkillLocalized } from './skills.model';

// *********************************************************************
// Ordering and Search options
// *********************************************************************

export type OrderBy = 'ASC' | 'DESC';

export type OrderOptions = {
  name?: OrderBy;
  description?: OrderBy;
  dateCreated?: OrderBy;
  dateUpdated?: OrderBy;
  isProprietary?: OrderBy;
  associatedWithOrg?: OrderBy;
};

export type WhereOptions = {
  name: string;
  description?: string;
};
export type SearchOptions = {
  isProprietary: boolean;
  associatedWithOrg: boolean;
  languageCode: string;
  pagination: Partial<PaginationData>;
  order: OrderOptions;
  searchBy?: WhereOptions;
};

// *********************************************************************
// Store State for Skills
// *********************************************************************

export interface SkillsState extends ElfStoreState {
  allLanguages: SkillLanguages;
  allLocalizedSkills: SkillLocalized[];

  pagination?: Pagination;
  searchOptions: SearchOptions;
}

/**********************************************
 * ViewModel published to UI layers (from Facade)
 **********************************************/

export interface SkillsComputedState {
  readonly selectedLanguage: string;
  readonly selected: Skill | null;
  readonly allSkills: Skill[];
}

/**
 * This is a simple API meant for use within the
 * UI layer html templates
 */
export interface SkillsAPI {
  selectSkill: (skillId: string, isSelected?: boolean, excludeOthers?: boolean) => void;
  selectLanguage: (languageCode: string) => void;
  searchByName: (criteria: string) => Promise<boolean>;
  sortByField: (sortBy: keyof OrderOptions) => Promise<boolean>;
  showPage: (page: number) => Promise<boolean>;
}

export type SkillsDataModel = SkillsState & SkillsComputedState;
export type SkillsViewModel = SkillsDataModel & { api: SkillsAPI };

// *********************************************************************
// Utility functions for Skills
// *********************************************************************

export function initSkillsState(): Partial<SkillsState> {
  return {
    allLanguages: [],
    allLocalizedSkills: [],
    searchOptions: defaultSearchOptions(),
  };
}

export function initPagination(): PaginationData {
  return { currentPage: 1, perPage: 25, lastPage: 1, total: 0 };
}

export function defaultSearchOptions(): SearchOptions {
  return {
    languageCode: 'en',
    isProprietary: false,
    associatedWithOrg: false,
    pagination: initPagination(),
    order: { name: 'ASC' },
  };
}

export function toggleOrderBy(order?: OrderBy): OrderBy {
  return order === 'ASC' ? 'DESC' : 'ASC';
}
