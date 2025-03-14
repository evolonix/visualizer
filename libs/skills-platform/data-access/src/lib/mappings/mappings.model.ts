/**
 * Primary interface for the scale mappings
 */

import { NamedEntity } from '@degreed/rsm';

export interface SourceLevel extends NamedEntity {
  value: number;
}

export interface MappedToLevel extends SourceLevel {
  levelIds: string[];
}

export interface SourceLevelWithMappings extends SourceLevel {
  mappingToLevelIds: string[];
  autoSuggestedMappingToLevelIds?: string[];
}

export interface SourceMappingWithLevelMappings extends NamedEntity {
  levels: SourceLevelWithMappings[];
  mappedToLevels?: MappedToLevel[];
  isAutoSuggested?: boolean;
}

export interface SourceMapping extends NamedEntity {
  isPrimary?: boolean;
  levels: SourceLevel[];
  mappings: SourceMappingWithLevelMappings[];
}
