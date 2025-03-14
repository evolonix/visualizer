import { Localization } from '../_core';
import { Skill, SkillLocalized } from './skills.model';
import { OrderOptions, SearchOptions } from './skills.state';

export const sortSkills = (order: OrderOptions) => (a: Skill, b: Skill) => {
  const fields = Object.keys(order) as (keyof OrderOptions)[];

  let result = 0;

  fields.forEach((field: keyof OrderOptions) => {
    const value = order[field];
    const key = field as keyof Skill;
    const isBoolean = key === 'isProprietary' || key === 'associatedWithOrg';
    const bCompare = (a: boolean, b: boolean) => (a ? 1 : 0) - (b ? 1 : 0);
    const sCompare = (a: string, b: string) => String(a).localeCompare(String(b));

    if (value) {
      if (value === 'DESC') result = isBoolean ? bCompare(b[key], a[key]) : sCompare(b[key], a[key]);
      if (value === 'ASC') result = isBoolean ? bCompare(a[key], b[key]) : sCompare(a[key], b[key]);
    }
  });

  return result;
};

export const buildMatchIndictor = (matcher: RegExp | null) => (skill: Skill) => {
  const addSpan = (match: string) => `<span class='match'>${match}</span>`;
  const matchIn = (s: string) => (matcher ? s.replace(matcher, addSpan).replace(/(?:\r\n|\r|\n)/g, '<br/>') : s);

  return {
    ...skill,
    name: matchIn(skill.name),
    description: matchIn(skill.description),
  };
};

export function sortAndMatch(skills: Skill[], searchOptions: SearchOptions): Skill[] {
  const matcher = searchOptions.searchBy?.name ? new RegExp(searchOptions.searchBy?.name || '', 'gi') : null;
  const addMatchIndictor = buildMatchIndictor(matcher);
  const sortByOrder = sortSkills(searchOptions.order);

  return skills.sort(sortByOrder).map(addMatchIndictor);
}

/**
 * The server initially returns only the primary localization.
 * Others can be subseuqently loaded. This checks if a language skill
 * has already been loaded.
 *
 */
export function hasLanguage(skills: SkillLocalized, lang: string) {
  return skills.localizations?.some((l) => l.languageCode === lang) || false;
}

/**
 * Skills initially only load the 'english' (default) localization.
 * When another lang has been loaded for that Skill, we must merge the localization arrays.
 *
 * Note: Incoming localizations are the master... and we merge existing into the `master` if not present
 */
export function mergeLocalizations(existing: SkillLocalized[], incoming: SkillLocalized[]): SkillLocalized[] {
  const matchByLang = (e: Localization) => (i: Localization) => e.languageCode === i.languageCode;
  const merge = (existing?: Localization[], incoming?: Localization[]): Localization[] => {
    if (existing) {
      existing.forEach((e) => {
        const existingLocalization = incoming?.find(matchByLang(e));
        if (!existingLocalization) {
          incoming = [...(incoming || []), e];
        }
      });
    }
    return incoming || [];
  };

  // For each skillLocalized, merge the existing 'localization' arrays into the incoming list
  // If the localization exists in both sources, then 'incoming' overrides.
  existing.forEach((e) => {
    const found = incoming.find((i) => i.id === e.id);
    if (found) {
      found.localizations = merge(e.localizations || [], found.localizations);
    }
  });

  return incoming;
}
