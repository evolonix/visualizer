import { PaginationData } from '@ngneat/elf-pagination';

import { Localization } from '../_core';
import { GqlPaginationResponse, PAGING } from '../_core/graphql';

import { PaginatedResponse } from '../_core/graphql/gql.model';
import { FILTER_SKILL_LANGUAGES, SkillLanguages, SkillLocalized } from './skills.model';
import { OrderOptions, SearchOptions, WhereOptions, initPagination } from './skills.state';

// Escape backslashes and double quotes for graphql
const escape = (value?: string) => value?.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');

export interface GqlSkillListData {
  allSkills: {
    items: SkillLocalized[];
  } & GqlPaginationResponse;
}

export interface GqlSkillLanguageListData {
  availableSkillLanguages: SkillLanguages & GqlPaginationResponse;
}

const FRAGMENTS = {
  QUERY_LOCALIZATIONS: `
    localizations: localizedStrings {
      languageCode: languageCodeString
      name
      description
      dateCreated
    }
  `,
  withLocalizations: (localizations: Localization[]) => `
    localizedStrings: [${localizations
      .map(
        ({ languageCode, name, description }) => `
          {
            languageCode: "${languageCode}"
            name: "${escape(name)}"
            description: "${escape(description)}"
          }
        `
      )
      .join(' ')}]
  `,
  withOrderBy: (options: OrderOptions) => {
    const whenHas = (key: keyof OrderOptions) => {
      return options[key] ? `${key}: ${options[key]}` : '';
    };

    return Object.keys(options)
      ? `
      order: {
          localizedString: {
            ${whenHas('name')}
            ${whenHas('description')}            
            ${whenHas('dateCreated')}
            ${whenHas('dateUpdated')}
          }
          ${whenHas('dateCreated')}
          ${whenHas('dateUpdated')}
          ${whenHas('isProprietary')}
        }
    `
      : '';
  },
  withPagination: (paging: Partial<PaginationData>) => {
    const { take, skip } = PAGING.toServer(paging);
    return ` take: ${take}, skip: ${skip} `;
  },
  withName: (options: Partial<WhereOptions>) => {
    return `
      where: {
        localizedStrings: {
          some: {
            or: [
              {
                name: {
                  contains: "${escape(options.name)}"
                }
              }
              ${
                options.description
                  ? `{
                      description: {
                        contains: "${escape(options.description)}"
                      }
                    }`
                  : ''
              }
            ]
          }
        }
      }
    `;
  },
};

export const SKILLS_API = {
  SKILL: {
    /**
     * Load 'all' Skills (with all localizations)
     * may specify target page to loadAll for a page of results only
     */
    loadAll: (options?: Partial<PaginationData>) => {
      const paging = { ...initPagination(), ...options };

      return [
        `
          query {
            allSkills(
              ${FRAGMENTS.withPagination(paging)}              
              ) {
              totalCount
              pageInfo {
                hasNextPage,
                hasPreviousPage,
              }
              items {
                id: skillId,
                isProprietary,
                dateUpdated,
                ${FRAGMENTS.QUERY_LOCALIZATIONS}
              }
            }
          }
        `,
        (data?: GqlSkillListData): PaginatedResponse<SkillLocalized[]> => {
          if (!data?.allSkills) return [[], initPagination()];

          const list = data?.allSkills.items || [];
          const pagination = PAGING.toClient({ ...data.allSkills, ...paging });

          return [list, pagination];
        },
      ] as const;
    },
    searchBy: (name: string, options?: SearchOptions) => {
      const description = options?.searchBy?.description || name;
      return [
        `
          query {
            allSkills(
              languageCode: "${options?.languageCode || 'en'}"
              ${FRAGMENTS.withPagination(options?.pagination || {})}
              ${FRAGMENTS.withOrderBy(options?.order || {})}
              ${FRAGMENTS.withName({ name, description })}
              ) {
                totalCount
                pageInfo {
                  hasNextPage,
                  hasPreviousPage,
                }
                items {
                  id: skillId,
                  isProprietary,
                  dateUpdated,
                  ${FRAGMENTS.QUERY_LOCALIZATIONS}
                }
              }
            }
        `,
        (data?: GqlSkillListData): PaginatedResponse<SkillLocalized[]> => {
          if (!data?.allSkills) return [[], initPagination()];

          const list = data?.allSkills.items || [];
          const paging = (options?.pagination || {}) as PaginationData;
          const pagination = PAGING.toClient({ ...data?.allSkills, ...paging });

          return [list, pagination];
        },
      ] as const;
    },
  },
  LANGUAGES: {
    /**
     * Load 'all' Skill languages
     *
     * Filter by Public, Org, or All
     * Default to All
     */
    loadAll: (filterBy: FILTER_SKILL_LANGUAGES = 'ALL') => {
      return [
        `query {
            availableSkillLanguages(
              filterOption: ${filterBy} 
              ) {
                  count            
                  id: code              
                  name: displayName
                  fallback: name
              }
            }
        `,
        (data?: GqlSkillLanguageListData): SkillLanguages => {
          return data?.availableSkillLanguages || [];
        },
      ] as const;
    },
  },
};
