import { MappedToLevel, SourceLevel, SourceLevelWithMappings, SourceMapping, SourceMappingWithLevelMappings } from './mappings.model';

function computeMappedToLevels(selectedLevels: SourceLevel[], source: SourceMappingWithLevelMappings): SourceMappingWithLevelMappings {
  const mappedToLevels = selectedLevels.map(
    (selectedLevel) =>
      ({
        ...selectedLevel,
        levelIds: source.levels
          .filter((sourceLevel) =>
            source.isAutoSuggested
              ? sourceLevel.autoSuggestedMappingToLevelIds?.includes(selectedLevel.id)
              : sourceLevel.mappingToLevelIds?.includes(selectedLevel.id)
          )
          .map((l) => l.id),
      }) as MappedToLevel
  );

  return { ...source, mappedToLevels };
}

export function computeMappedToLevelsForSelected(selected: SourceMapping): SourceMapping {
  const mappings = selected.mappings.map((source) => computeMappedToLevels(selected.levels, source));

  return { ...selected, mappings };
}

export function updateMappingToLevelIdsFromMappedToLevels(selected: SourceMapping): SourceMapping {
  const mappings = selected.mappings.map((source) => {
    const levels = source.levels.map((sourceLevel) => {
      const mappedToLevels =
        source.mappedToLevels?.filter((mappedToLevel) => mappedToLevel.levelIds.some((id) => id === sourceLevel.id)) || [];
      const mappingToLevelIds = mappedToLevels.map((l) => l.id);

      return { ...sourceLevel, mappingToLevelIds } satisfies SourceLevelWithMappings;
    });

    return { ...source, levels } satisfies SourceMappingWithLevelMappings;
  });

  return { ...selected, mappings } satisfies SourceMapping;
}

/**
 * Skill Scale Harmonization for use with auto-suggested mappings
 */

/* When scaleTo is longer then scaleFrom */
function rescaleMidpoint(n: number, scaleFrom: number[], scaleTo: number[]) {
  const step_size = scaleTo.length / scaleFrom.length;
  const start = (Math.max(...scaleTo) - step_size * (scaleFrom.length - 1)) / 2;

  return start + step_size * n;
}

function rescaleMidpointWrapper(n: number, scaleFrom: number[], scaleTo: number[]) {
  if (scaleTo.length < scaleFrom.length) {
    throw new Error('Invalid scaleTo length');
  }

  if (scaleTo.length && scaleFrom.length) {
    let add_back = 0;
    let take_back = 0;

    if (scaleTo[0] === 1) {
      scaleTo = scaleTo.map((x) => x - 1);
      add_back = 1;
    }

    if (scaleFrom[0] === 1) {
      scaleFrom = scaleFrom.map((x) => x - 1);
      take_back = 1;
    }

    return rescaleMidpoint(n - take_back, scaleFrom, scaleTo) + add_back;
  }

  return n;
}

/* When scaleFrom is longer than scaleTo */
function rescaleExtreme(n: number, scaleFrom: number[], scaleTo: number[]) {
  return (n * Math.max(...scaleTo)) / (scaleFrom.length - 1);
}

function rescaleExtremeWrapper(n: number, scaleFrom: number[], scaleTo: number[]) {
  let add_back = 0;
  let take_back = 0;

  if (scaleTo.length && scaleFrom.length) {
    if (scaleTo[0] === 1) {
      scaleTo = scaleTo.map((x) => x - 1);
      add_back = 1;
    }
    if (scaleFrom[0] === 1) {
      scaleFrom = scaleFrom.map((x) => x - 1);
      take_back = 1;
    }

    return rescaleExtreme(n - take_back, scaleFrom, scaleTo) + add_back;
  }

  return n;
}

function rescale(n: number, scaleFrom: number[], scaleTo: number[]) {
  scaleFrom = Array.from(scaleFrom);
  scaleTo = Array.from(scaleTo);

  if (scaleTo.length >= scaleFrom.length) {
    const result = rescaleMidpointWrapper(n, scaleFrom, scaleTo);

    return Math.round(result);
  } else {
    const result = rescaleExtremeWrapper(n, scaleFrom, scaleTo);

    return Math.round(result);
  }
}

export function autoSuggestMappings(selected: SourceMapping): SourceMapping {
  const selectedLevelValues = selected.levels.map((l) => l.value);
  const mappings = selected.mappings.map((source) => {
    // Skip the source if any of the levels already have mappingToLevelIds
    if (source.levels.some((l) => l.mappingToLevelIds.length > 0)) {
      return source;
    }

    const sourceLevelValues = source.levels.map((l) => l.value);
    const rescaledLevelValues = sourceLevelValues.map((value) => rescale(value, sourceLevelValues, selectedLevelValues));

    const levels = rescaledLevelValues.map((value, index) => {
      const sourceLevel = source.levels[index];

      // Get the selected level ID for the value
      const autoSuggestedMappingToLevelIds: string[] = [selected.levels.find((l) => l.value === value)?.id || ''];

      return { ...sourceLevel, autoSuggestedMappingToLevelIds } satisfies SourceLevelWithMappings;
    });

    return { ...source, levels, isAutoSuggested: true } satisfies SourceMappingWithLevelMappings;
  });

  return { ...selected, mappings } satisfies SourceMapping;
}
