import { Entity } from '@degreed/rsm';
import { Localization } from '../_core';

export type FILTER_SKILL_LANGUAGES = 'ALL' | 'PUBLIC' | 'ORG';

export interface SkillLanguage {
  count: number;
  id: string; // language code
  name: string; // english name in the language of `languageCode`
  fallback: string; // name in english
}

export type SkillLanguages = Array<SkillLanguage>;

/**
 * Skill exposed to UI and view models
 */
export interface Skill extends Entity {
  name: string;
  description: string;
  isProprietary: boolean;
  associatedWithOrg: boolean;
  dateUpdated: string;
}

/**
 * SKill persisted to the BE
 */
export interface SkillLocalized extends Entity {
  isProprietary: boolean;
  associatedWithOrg: boolean;
  localizations?: Localization[];
}

/**
 * Easily publish a scoped-to-language Skill from a fully localized Skill
 * fallback to 'en' if no localization is found for the specified langugage
 *
 * @returns Skill instance
 */
export const skillForLanguage = (fullSkill: SkillLocalized, lang: string): Skill => {
  const localization = fullSkill.localizations?.find((l) => l.languageCode === lang);
  const fallback = fullSkill.localizations?.find((l) => l.languageCode === 'en'); // @todo: is english always available as the fallback?
  const dateUpdated = (source: Localization | undefined): string => {
    return String(source?.dateUpdated || source?.dateCreated); // gql provides string dates
  };

  return {
    id: fullSkill.id,
    isProprietary: fullSkill.isProprietary,
    associatedWithOrg: fullSkill.associatedWithOrg,
    name: localization?.name || fallback?.name || '',
    description: localization?.description || fallback?.description || '',
    dateUpdated: dateUpdated(localization || fallback) || '',
  };
};
