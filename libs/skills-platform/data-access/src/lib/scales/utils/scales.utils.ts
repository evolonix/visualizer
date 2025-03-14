import { Nullable } from '../../_core';
import { LanguageRegistry, PublishMappingsError, Scale, ScaleLevel } from '../scales.model';

export function cloneScale(scale: Nullable<Scale>): Nullable<Scale> {
  return scale ? { ...scale, levels: scale.levels?.map(cloneScaleLevel) || [] } : null;
}

export function cloneScaleLevel(level: ScaleLevel): ScaleLevel {
  return { ...level };
}

export const sleepFor = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const sleep =
  <T = unknown>(ms: number, fn?: (val: T) => void) =>
  (val: T): Promise<T> =>
    sleepFor(ms).then(() => {
      fn?.(val);
      return val;
    });

export const validateLevelsByCount = (target?: Scale, totalLevelCount?: number): Scale => {
  // Calculate filtered levels based on totalLevelCount
  totalLevelCount ||= target?.totalLevelCount && Number.isInteger(+target.totalLevelCount) ? Number(target.totalLevelCount) : 0;

  // Either filtered levels down to the totalLevelCount
  // or append empty levels to the end of the array
  let levels = target?.levels || [];
  const isReducing = totalLevelCount <= levels.length;

  const levelsToAdd = Math.max(totalLevelCount - levels.length, 0);
  const lastLevelValue = levels.length ? levels[levels.length - 1]?.value || 0 : 0; // value of 'current' last level
  levels = isReducing ? levels.slice(0, totalLevelCount) : levels.concat(makeLevels(levelsToAdd, lastLevelValue));

  return { ...target, totalLevelCount, levels } as Scale;
};

/**
 * Create scale (for locale) if it doesn't exist.
 * Also validate scale title, description, and levels
 */
export const validateScaleForLanguage = (localizations: LanguageRegistry, languageCode: string, levelCount?: number): LanguageRegistry => {
  const target = localizations[languageCode];
  const registry = { ...localizations };
  const fallback = localizations['en'];

  let scale = registry[languageCode];
  levelCount ||= scale?.totalLevelCount || fallback.totalLevelCount;
  levelCount ||= scale?.levels?.length || fallback.levels?.length || 0;

  // If the language doesn't exist for the scale, add it and use the default language's values and empty levels
  // If the scale title or description isn't set, use the default language's values
  const isNew = !Object.keys(localizations).includes(languageCode);
  scale = validateLevelsByCount(
    isNew
      ? { ...fallback, totalLevelCount: 0, levels: [] }
      : {
          ...target,
          name: target.name.trim() || fallback.name.trim() || '',
          description: target.description?.trim() || fallback.description?.trim() || '',
        },
    isNew ? 0 : levelCount
  );

  registry[languageCode] = scale;

  return registry;
};

export const validateScaleForLanguages = (localizations: LanguageRegistry, levelCount?: number): LanguageRegistry => {
  let result = { ...localizations };

  Object.keys(localizations).forEach((languageCode) => {
    result = validateScaleForLanguage(result, languageCode, levelCount);
  });

  return result;
};

export const shouldDiscardScale = (current: Scale, languageCode: string, initialLocalizations: LanguageRegistry | null) => {
  const isTemporaryScale = !initialLocalizations?.[languageCode];
  const hasDefaultValues = current?.levels?.reduce((hasDefaultLevels, level) => {
    return hasDefaultLevels && !level.name.trim() && !level.description?.trim();
  }, true);

  return isTemporaryScale && hasDefaultValues;
}; // value of 'current' last level

function makeLevels(numLevels: number, previousValue = 0) {
  return numLevels
    ? Array(numLevels)
        .fill({})
        .map(
          (_, i) =>
            ({
              id: '',
              name: '', // always init to '' to trigger invalid state in editor
              description: '',
              value: previousValue + i + 1,
            }) satisfies ScaleLevel
        )
    : [];
}

export const asPublishErrors = (m: PublishMappingsError[]) => {
  // First, group the mappings by primaryScaleName
  const groupedByPrimaryScaleName = m.reduce(
    (acc, curr) => {
      if (!acc[curr.primaryScaleName]) {
        acc[curr.primaryScaleName] = [];
      }
      acc[curr.primaryScaleName].push(curr);
      return acc;
    },
    {} as Record<string, PublishMappingsError[]>
  );

  // Then, for each primaryScaleName, count the occurrences of each missingScaleName
  const publishErrors = groupedByPrimaryScaleName
    ? Object.entries(groupedByPrimaryScaleName).map(([primaryScaleName, mappings]) => {
        const counts = mappings.reduce(
          (acc, curr) => {
            if (!acc[curr.missingScaleName]) {
              acc[curr.missingScaleName] = 0;
            }
            acc[curr.missingScaleName]++;
            return acc;
          },
          {} as Record<string, number>
        );

        // Convert the counts to an array of error strings
        const errors = Object.entries(counts).map(([missingScaleName, count]) => `${count} levels from ${missingScaleName}`);

        return {
          subtitle: `${primaryScaleName} is missing`,
          errors: errors,
        };
      })
    : [];

  return publishErrors;
};
