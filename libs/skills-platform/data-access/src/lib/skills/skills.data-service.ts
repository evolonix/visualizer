import { PaginationData } from '@ngneat/elf-pagination';
import { FILTER_SKILL_LANGUAGES, SkillLanguages, SkillLocalized } from './skills.model';

import { AsyncResponse, GraphQLDataService, Selector, post } from '../_core/graphql';
import { PaginatedResponse } from '../_core/graphql/gql.model';

import { SKILLS_API } from './skills.gql';
import { SearchOptions } from './skills.state';

export type ErrorInfo = { [key: string]: unknown };
export type SkillsWithPagination = PaginatedResponse<SkillLocalized[]>;

/**
 * A data layer service that requests Skills from the Skill-GraphQL API
 *
 */
export class SkillsDataService extends GraphQLDataService {
  // *********************************************************************
  // Skill API
  // *********************************************************************

  async loadSkills(paging: PaginationData): AsyncResponse<SkillsWithPagination> {
    const [gql, selectorFn] = SKILLS_API.SKILL.loadAll(paging);
    const query = this.buildQuery<SkillsWithPagination>(gql);
    const [response, errors] = await post(query, selectorFn as Selector<SkillsWithPagination>);

    return [response, errors];
  }

  async searchSkills(criteria: string, options: SearchOptions): AsyncResponse<SkillsWithPagination> {
    const [gql, selectorFn] = SKILLS_API.SKILL.searchBy(criteria, options);
    const query = this.buildQuery<SkillsWithPagination>(gql);
    const [response, errors] = await post(query, selectorFn as Selector<SkillsWithPagination>);

    reportIfError('searchSkills', { errors, criteria, options });
    return [response, errors];
  }

  async loadLanguages(filterBy: FILTER_SKILL_LANGUAGES): AsyncResponse<SkillLanguages> {
    const [gql, selectorFn] = SKILLS_API.LANGUAGES.loadAll(filterBy);
    const query = this.buildQuery<SkillLanguages>(gql);
    const [response, errors] = await post(query, selectorFn as Selector<SkillLanguages>);

    reportIfError('loadSkillLanguages', { errors, filterBy });
    return [response, errors];
  }
}

/**
 * Utility to report errors to console (without interrupting flow)
 */
function reportIfError(methodName: string, info: ErrorInfo) {
  if (info.errors) {
    console.error(`SkillsDataService::${methodName}`, info);
  }
}
