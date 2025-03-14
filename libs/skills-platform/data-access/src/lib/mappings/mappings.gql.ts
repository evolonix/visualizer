import { Nullable } from '../_core';
import { SourceMapping } from './mappings.model';

export const SourceFragment = `  
    id: ratingSourceId
    name: ratingSourceName
`;

export const LevelFragment = `
    id: levelId
    name: levelName
    value: levelValue
`;

export const API = {
  MAPPING: {
    // targetSourceId is optionsl. If not provided, the mappings for the primary scale wil be returned
    loadMappings: (targetSourceId?: string, lang = 'en') =>
      [
        `query RatingSourceMappings {
          ratingSourceMappings(
            ${targetSourceId ? `ratingSourceId: "${targetSourceId}"` : ''}
            languageCode: "${lang}"
            ) {
              ${SourceFragment}
              isPrimary
              levels {
                ${LevelFragment}
              }
              mappings {
                ${SourceFragment}
                levels {
                  ${LevelFragment}
                  mappingToLevelIds
                }
              }
            }
        }
        `,
        (data: { ratingSourceMappings: SourceMapping }): Nullable<SourceMapping> => {
          return data?.ratingSourceMappings || null;
        },
      ] as const,
    saveMappings: (source: SourceMapping, lang = 'en') =>
      [
        `mutation {
          updateRatingSourceMappings (
            ratingSourceMapping: {
              ratingSourceId: "${source.id}",
              mappings: [
                ${source.mappings
                  .map(
                    (m) => `{
                      ratingSourceId: "${m.id}",
                      levels: [${m.levels
                        .map(
                          (l) => `{
                            levelId: "${l.id}",
                            mappingToLevelIds: [
                              ${l.mappingToLevelIds.map((id) => `"${id}"`).join(' ')}
                            ]                      
                          }`
                        )
                        .join(' ')}
                      ]
                  }`
                  )
                  .join(' ')}
              ]
            }
            languageCode: "${lang}"
          ) {
              ${SourceFragment}
              isPrimary
              levels {
                ${LevelFragment}
              }
              mappings {
                ${SourceFragment}
                levels {
                  ${LevelFragment}
                  mappingToLevelIds
                }
              }
            }
        }`,
        (data: { updateRatingSourceMappings: SourceMapping }): Nullable<SourceMapping> => {
          return data?.updateRatingSourceMappings || null;
        },
      ] as const,
  },
};
