import { autoSuggestMappings, computeMappedToLevelsForSelected, updateMappingToLevelIdsFromMappedToLevels } from '../../mappings';
import { mockSourceMapping } from '../_mock';

describe('mappings utils', () => {
  describe('computeMappedToLevelsForSelected()', () => {
    it('should compute mapped to levels for selected', () => {
      const result = computeMappedToLevelsForSelected(mockSourceMapping);
      expect(mockSourceMapping.mappings[0].mappedToLevels?.length).toBe(2);
      expect(mockSourceMapping.mappings[0].mappedToLevels && mockSourceMapping.mappings[0].mappedToLevels[1].levelIds).toEqual(['1']);

      expect(result.mappings[0].mappedToLevels?.length).toEqual(3);
      expect(result.mappings[0].mappedToLevels && result.mappings[0].mappedToLevels[1]?.levelIds).toEqual(['3']);
      expect(result.mappings[1].mappedToLevels && result.mappings[1].mappedToLevels[0]?.levelIds).toEqual(['3']);
    });

    it('should return selected on empty mappings', () => {
      const selected = { ...mockSourceMapping, mappings: [] };
      const result = computeMappedToLevelsForSelected(selected);
      expect(result).toEqual(selected);
    });

    it('should return no mappedToLevels on empty levels', () => {
      const selected = { ...mockSourceMapping, levels: [] };
      const result = computeMappedToLevelsForSelected(selected);
      expect(selected.mappings[0].mappedToLevels?.length).toEqual(2);
      expect(result.mappings[0].mappedToLevels?.length).toEqual(0);
    });

    it('should return selected on empty levels and mappings', () => {
      const selected = { ...mockSourceMapping, levels: [], mappings: [] };
      const result = computeMappedToLevelsForSelected(selected);
      expect(result).toEqual(selected);
    });
  });
  describe('updateMappingToLevelIdsFromMappedToLevels()', () => {
    it('should update mappingToLevelIds from mappedToLevels', () => {
      const result = updateMappingToLevelIdsFromMappedToLevels(mockSourceMapping);
      expect(mockSourceMapping.mappings[0].levels[0].mappingToLevelIds).toEqual(['2']);
      expect(mockSourceMapping.mappings[0].levels[0].autoSuggestedMappingToLevelIds).toEqual(['1']);

      expect(result.mappings[0].levels[0].mappingToLevelIds).toEqual(['1']);
      expect(result.mappings[0].levels[0].autoSuggestedMappingToLevelIds).toEqual(['1']);
    });

    it('should return selected on empty mappings', () => {
      const selected = { ...mockSourceMapping, mappings: [] };
      const result = updateMappingToLevelIdsFromMappedToLevels(selected);
      expect(result).toEqual(selected);
    });
  });

  describe('autoSuggestMappings()', () => {
    it('should return auto suggest mapping', () => {
      const selected = {
        ...mockSourceMapping,
        mappings: [
          {
            ...mockSourceMapping.mappings[0],
            levels: [{ ...mockSourceMapping.mappings[0].levels[0], mappingToLevelIds: [] }],
          },
          {
            ...mockSourceMapping.mappings[1],
            levels: [{ ...mockSourceMapping.mappings[1].levels[0], mappingToLevelIds: [] }],
          },
        ],
      };
      expect(selected.mappings[1].isAutoSuggested).toBeFalsy();

      const result = autoSuggestMappings(selected);
      expect(result.mappings[1].isAutoSuggested).toBeTruthy();
      expect(result.mappings[1].levels[0].autoSuggestedMappingToLevelIds).toEqual(['']);
    });

    it('should return mockSource mappings levels when already have mappingToLevelIds', () => {
      const result = autoSuggestMappings(mockSourceMapping);
      expect(result.mappings[0].levels[0].autoSuggestedMappingToLevelIds).toEqual(['1']);
    });
  });
});
