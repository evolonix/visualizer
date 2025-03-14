import produce from 'immer';
import { LocalizedScale } from '../../_core/types';
import { LanguageRegistry, Scale } from '../scales.model';

export function transformFromLocalizedScale(localizedScale: LocalizedScale): LanguageRegistry {
  // Get all localizations (only look at levels, not scale)
  const allLocalizations = localizedScale.levels.map(({ localizations }) => localizations).flat();
  // Include default language code if no localizations exist
  const allLanguageCodes = new Set(allLocalizations.length ? allLocalizations.map(({ languageCode }) => languageCode) : ['en']);

  // Group scales by languageCode
  return Array.from(allLanguageCodes).reduce((acc, languageCode) => {
    const { localizations, levels: localizedLevels, ...scale } = localizedScale;
    const localization = localizations.find((l) => l.languageCode === languageCode) || {
      languageCode,
      name: '',
      dateCreated: new Date(),
    };

    const levels = localizedLevels.map(({ localizations, ...level }) => ({
      ...level,
      ...(localizations.find((l) => l.languageCode === languageCode) || {
        languageCode,
        name: '',
        dateCreated: new Date(),
      }),
    }));

    const totalLevelCount = scale.totalLevelCount || levels.length;

    return {
      ...acc,
      [languageCode]: { ...scale, ...localization, totalLevelCount, levels } satisfies Scale,
    };
  }, {} as LanguageRegistry);
}

/**
 * Validate the levels of a scale to ensure they have the required properties
 * Switching from one scale language to another can cause levels to not be fully populated
 */
const validateLevels = (localizations: LanguageRegistry) => {
  // Using immer's produce() to update immutable data
  return produce(localizations, (draft) => {
    Object.values(draft).forEach(({ levels }) =>
      levels.forEach((l, i) => {
        if (!l.id) l.id = '';
        if (!l.name) l.name = '';
        if (!l.description) l.description = '';
        if (!l.value) l.value = i + 1;
      })
    );
  });
};

export function transformToLocalizedScale(localizations: LanguageRegistry): LocalizedScale {
  localizations = validateLevels(localizations);

  // Convert scale to localized scale
  const localizedScale = Object.entries(localizations).reduce((acc, [languageCode, scale]) => {
    const { languageCode: _, name, description, levels: scaleLevels, dateCreated, ...rest } = scale;

    acc.localizations = acc.localizations || [];
    acc.localizations.push({ languageCode, name, description, dateCreated: dateCreated || new Date() });

    const levels =
      acc.levels ||
      scaleLevels.map(({ id, value, valueString }) => ({
        id,
        value,
        valueString,
        localizations: [],
      }));

    const totalLevelCount = acc.totalLevelCount || rest.totalLevelCount || levels.length;

    return { ...acc, ...rest, totalLevelCount, levels };
  }, {} as LocalizedScale);

  Object.entries(localizations).forEach(([languageCode, scale]) => {
    const { levels } = scale;
    levels.forEach(({ value, name, description, dateCreated }) => {
      const localizedLevel = localizedScale.levels.find((l) => l.value === value);
      localizedLevel?.localizations.push({ languageCode, name, description, dateCreated: dateCreated || new Date() });
    });
  });

  return localizedScale;
}
